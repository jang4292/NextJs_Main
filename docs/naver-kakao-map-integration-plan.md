# 네이버 · 카카오 지도 통합 계획

## 목표와 범위

`/tools/map`에 장소를 검색하고 지도에서 결과를 확인할 수 있는 **Map Explorer**
도구를 추가한다. 사용자는 네이버 지도와 카카오 지도 중 하나를 선택하여 동일한
검색 결과와 선택 장소를 볼 수 있다.

초기 릴리스 범위는 다음과 같다.

- 키워드 또는 주소 검색
- 검색 결과 목록, 선택 결과 마커, 지도 이동
- 네이버 지도와 카카오 지도 간 제공자 전환
- 선택 장소의 이름, 주소, 전화번호, 외부 길찾기 링크
- 스크립트 로드 실패, API 오류, 결과 없음에 대한 복구 가능한 UI

현재 위치 탐색, 즐겨찾기 저장, 경로 자체 렌더링, 로그인 기반 개인화, 두 지도 SDK의
동시 렌더링은 범위에서 제외한다. 길찾기는 각 제공자의 외부 길찾기 페이지로 연결한다.

## 구현 결정

| 항목         | 결정                                                                         | 근거                                                                                                            |
| ------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 공개 경로    | `/tools/map`                                                                 | 기존 도구 허브와 일관되고, `app/`를 얇은 라우트 계층으로 유지할 수 있다.                                        |
| 지도 렌더링  | 선택된 제공자의 브라우저 SDK만 동적으로 로드                                 | SDK는 DOM과 `window`를 요구하므로 서버 렌더링에서 분리하며, 두 지도를 동시에 로드하지 않는다.                   |
| 장소 검색    | `GET /api/maps/search?provider=&query=` 서버 프록시                          | REST 비밀 키를 브라우저에 노출하지 않고, 제공자별 응답 차이를 서버 경계에서 정규화한다.                         |
| 공통 모델    | `MapPlace`, `MapProvider`, `MapViewport`                                     | UI가 공급자 SDK 타입을 직접 참조하지 않아 전환과 테스트가 단순해진다.                                           |
| 지도 공개 키 | `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`, `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`           | JavaScript 지도 SDK에 필요한 공개 식별자만 클라이언트에 제공한다.                                               |
| 검색 비밀 키 | `NAVER_SEARCH_CLIENT_ID`, `NAVER_SEARCH_CLIENT_SECRET`, `KAKAO_REST_API_KEY` | 서버 전용 환경 변수로 보관하고 API 응답이나 로그에 포함하지 않는다.                                             |
| 보안 정책    | `next.config.ts` CSP에 실제 SDK, 타일, API 도메인을 최소 허용                | 현 `script-src`, `img-src`, `connect-src` 기본 차단 정책에서 지도 SDK와 타일 요청은 명시적으로 허용되어야 한다. |

## 필요한 값 발급 및 설정 가이드

### 1) 네이버 지도 공개 키: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`

- 발급 위치: 네이버 클라우드 플랫폼 > `Application` > `Maps` 또는 `네이버 지도 API` 관련 애플리케이션
- 확인 방법: 애플리케이션 상세 화면에서 JavaScript 지도 SDK용 Client ID 값을 확인한다.
- 사용 시점: 브라우저에서 네이버 지도 JavaScript SDK를 로드할 때 필요하다.
- 보안 주의: 브라우저에 노출되는 공개 값이므로, Secret 값과 같은 방식으로 보관하지 않는다.
- 개발 환경 등록: 로컬 호스트와 Preview URL을 네이버 개발자 콘솔의 웹 서비스 URL 허용 목록에 추가한다.

### 2) 카카오 지도 공개 키: `NEXT_PUBLIC_KAKAO_MAP_APP_KEY`

- 발급 위치: Kakao Developers > `내 애플리케이션` > 해당 앱 > `앱 키`
- 확인 방법: `JavaScript 키` 값을 복사한다.
- 사용 시점: 브라우저에서 카카오 지도 SDK를 동적으로 로드할 때 사용된다.
- 보안 주의: 공개 키로 취급되므로 서버 비밀 키와 구분해서 관리한다.
- 개발 환경 등록: 운영/미리보기/localhost 기준으로 허용 웹사이트 목록에 등록한다.

### 3) 네이버 검색 비밀 키: `NAVER_SEARCH_CLIENT_ID`, `NAVER_SEARCH_CLIENT_SECRET`

- 발급 위치: 네이버 클라우드 플랫폼 > `Search API` 또는 `Local Search` 애플리케이션
- 확인 방법: `Client ID`, `Client Secret` 값을 각각 발급받아 저장한다.
- 사용 시점: 서버의 `GET /api/maps/search`에서 Naver Local Search API 호출에 사용한다.
- 보안 주의: 서버 전용 환경 변수로 보관하고, 브라우저 번들, 응답 본문, 로그, 에러 메시지에 포함하지 않는다.
- 운영 기준: 키 탈취 위험을 줄이기 위해 읽기 권한만 필요한 서비스 계정으로 분리하는 것이 좋다.

### 4) 카카오 검색 비밀 키: `KAKAO_REST_API_KEY`

- 발급 위치: Kakao Developers > `내 애플리케이션` > `앱 키` > `REST API 키`
- 확인 방법: REST API 키 값을 복사한다.
- 사용 시점: 서버 측에서 카카오 로컬 키워드 검색 API를 호출할 때 사용된다.
- 보안 주의: API 키는 서버에서만 사용하고 브라우저에 노출하지 않는다.
- 운영 기준: 검색 엔드포인트가 무단 호출되지 않도록 서버 측 rate limit과 IP 단위 제한을 적용한다.

### 5) 허용 웹 서비스 URL

- 운영, Preview, localhost의 웹 서비스 URL을 각 제공자 콘솔의 허용 목록에 꼭 등록해야 한다.
- 예시:
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
  - `https://your-preview-url.vercel.app`
  - `https://your-production-domain.com`
- 주의: 실제 도메인과 환경 별 URL이 다르면 SDK 로드가 실패할 수 있으므로, 배포 환경마다 목록을 점검해야 한다.

### 6) 환경 파일 저장 위치

- 공개 키: `.env.local` 또는 배포 환경 변수에 넣되, 브라우저 번들에 포함될 수 있는 값임을 인지한다.
- 비밀 키: 서버 전용 환경 변수로 관리하고 `.env.local` 외부에 저장한다.
- 권장 방식:
  - 브라우저용 공개 키: `NEXT_PUBLIC_*`
  - 서버용 비밀 키: `*_API_KEY`, `*_SECRET` 형태
- 저장소에는 Secrets 또는 환경 변수 관리 시스템을 사용하고, 로컬 파일은 `.env.example`처럼 템플릿 수준에서만 관리한다.

## 값별 역할 요약

| 키 | 공개 여부 | 사용 위치 | 역할 | 주의 사항 |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | 공개 | 브라우저 | 네이버 지도 JavaScript SDK 초기화 | 절대 secret 값으로 취급하지 않는다. |
| `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` | 공개 | 브라우저 | 카카오 지도 JavaScript SDK 초기화 | 웹 사이트 허용 목록 등록 필요 |
| `NAVER_SEARCH_CLIENT_ID` | 비공개 | 서버 | 네이버 Local Search API 인증 | 로그/응답에 노출 금지 |
| `NAVER_SEARCH_CLIENT_SECRET` | 비공개 | 서버 | 네이버 Local Search API 인증 | 값 유출 시 즉시 재발급 필요 |
| `KAKAO_REST_API_KEY` | 비공개 | 서버 | 카카오 검색 API 인증 | 서버만 사용, 브라우저 포함 금지 |

## 보안 및 운영 기준

- 공개 키는 브라우저에서 사용되므로 프런트엔드 코드에 직접 하드코딩하지 않고 환경 변수로 유지한다.
- 비밀 키는 서버 프록시 `app/api/maps/search/route.ts` 내부에서만 사용한다.
- 검색 결과의 원본 응답, Authorization 헤더, 환경 변수 값을 응답 본문이나 에러 로그에 기록하지 않는다.
- `next.config.ts`의 CSP를 최소 허용 범위로 설계해 지도 SDK, 타일, API 호출이 필요한 도메인만 열어 둔다.
- 실제 운영 배포 전에 Naver/Kakao 개발자 콘솔에서 웹 서비스 URL을 검수하고, 차단되지 않는지 확인한다.

## 차후 작업 방향

### 1) 운영 안정성 강화

- SDK 로드 실패 시 재시도 정책과 사용자 안내 메시지 개선
- 네이버/카카오 각각의 검색 실패 코드 분석 및 대응 메시지 세분화
- rate limit, fallback, retry-after 헤더를 운영 환경에 맞게 튜닝
- 대시보드나 로그에서 지도 검색 실패율과 응답 상태를 운영 모니터링에 반영

### 2) UX 경험 개선

- 검색어와 provider 상태를 URL 쿼리로 동기화해 공유 링크 대응
- 검색 결과 선택 시 지도 애니메이션과 스크롤 위치 정렬
- 결과 목록에서 키보드 탐색, 접근성 이름, ARIA 상태 개선
- provider 변경 시 이전 지도 인스턴스 정리와 불필요한 렌더링 방지

### 3) 기능 확장

- 현재 위치 기반 주변 검색 기능 추가
- 즐겨찾기/최근 검색어 저장
- 길찾기 링크를 provider별 맞춤 페이지에 연결
- 매장/업종 필터, 검색 범위, 정렬 기준 옵션 추가
- 지도 도심/타일 데이터 캐시와 정적 지도 배치 검토

### 4) 법적/비즈니스 준비

- 제공자 약관, 로고 사용 조건, 저작권 표기 요구사항 검토
- 과금 한도 확인 및 알림 정책 수립
- 개발/스테이징/운영 구간별 키 분리와 회수 절차 문서화
- 운영 데이터 수집 정책과 사용자 동의 문구를 정비

## 권장 실행 순서

1. 네이버/Kakao 애플리케이션과 위협 도메인 허용 목록을 등록한다.
2. 로컬 `.env.local`에 공개 키와 서버 키를 채운다.
3. `npm run ci` 기준으로 현재 구현이 정상 동작하는지 확인한다.
4. 운영 도메인에서 실제 검색과 SDK 로드를 점검한다.
5. 이후 기능 확장 항목을 순차적으로 구현한다.

## 기능 요구사항 매핑

- `MAP-02`, `MAP-03`, `MAP-04`는 기본 검색 화면과 선택 결과 반영을 의미한다.
- `MAP-05`는 비밀 키 보호와 오류 은닉 정책을 의미한다.
- `MAP-07`는 CSP와 허용 URL 등록을 의미한다.
- `MAP-08`는 접근성 및 키보드 지원을 의미한다.

이 문서는 실제 운영 배포 전, “어떤 키를 어디서 발급받고 어떤 역할을 하는지”를 바로 점검할 수 있도록 정리한 운영용 가이드이다.

## 기능 요구사항

| ID     | 요구사항                                                                                                |
| ------ | ------------------------------------------------------------------------------------------------------- |
| MAP-01 | 사용자는 도구 허브에서 `/tools/map`으로 이동할 수 있다.                                                 |
| MAP-02 | 사용자는 최소 2자 이상의 키워드 또는 주소를 입력해 장소를 검색할 수 있다.                               |
| MAP-03 | 사용자는 네이버 또는 카카오를 선택해 동일한 정규화 장소 결과를 해당 지도에서 볼 수 있다.                |
| MAP-04 | 결과를 선택하면 지도 중심과 단일 마커가 선택 장소로 갱신되고 상세 정보가 표시된다.                      |
| MAP-05 | 검색 API 키, 비밀 키, 제공자 원본 오류는 클라이언트나 로그에 노출되지 않는다.                           |
| MAP-06 | SDK 또는 검색 실패, 빈 결과, 잘못된 요청에서 사용자가 다시 시도할 수 있는 명확한 상태를 제공한다.       |
| MAP-07 | 지도 사용에 필요한 외부 도메인만 CSP에서 허용하고 기존 CSP 보호 수준을 유지한다.                        |
| MAP-08 | 키보드로 제공자와 검색 결과를 조작할 수 있으며 지도 컨테이너와 결과 상태에 접근 가능한 이름을 제공한다. |

## 구현 단계

### 1. 환경 변수와 공급자 계약

1. `.env.example`에 네이버·카카오의 공개 지도 키와 서버 검색 키를 설명과 함께 추가한다.
2. `lib/env.ts`에 지도 공급자별 설정을 반환하는 서버 전용 접근자를 추가한다. 공개 키를 제외한 값을 클라이언트 컴포넌트에서 import하지 않는다.
3. `features/maps/domain/types.ts`에 `MapProvider`, `MapPlace`, `MapCoordinates`, `MapSearchResult`를 정의한다. 좌표는 WGS84 경위도 숫자로 통일한다.
4. `features/maps/application/validateMapSearch.ts`에 공백 정리, 최소 길이, 최대 길이, 허용 제공자 검증을 둔다.

### 2. 서버 검색 경계

1. `features/maps/infrastructure/naverPlaceSearch.ts`와 `kakaoPlaceSearch.ts`를 만든다. 각 모듈은 공급자 REST 응답을 `MapPlace[]`로 변환하고 HTTP 상태·타임아웃을 내부에서 처리한다.
2. `features/maps/application/searchPlaces.ts`에서 제공자를 선택하고 외부 오류를 안정적인 애플리케이션 오류 코드로 변환한다.
3. `app/api/maps/search/route.ts`에 요청 검증, `no-store` 응답, 동일 클라이언트 IP 기준의 제한을 추가한다. 기존 `lib/rateLimit.ts` 패턴을 재사용한다.
4. 원본 API 응답, Authorization 헤더, 환경 변수 값은 응답 및 오류 로그에 절대 기록하지 않는다.

### 3. 지도 SDK 어댑터와 클라이언트 화면

1. `features/maps/presentation/sdk/types.ts`에 지도 생성, 중심 이동, 마커 갱신, 정리 함수로 구성된 공통 어댑터 계약을 정의한다.
2. `features/maps/presentation/sdk/loadScript.ts`에서 URL별 단일 Promise 캐시를 구현한다. 중복 스크립트 삽입, 실패 후 영구 대기, 컴포넌트 해제 후 상태 갱신을 방지한다.
3. `NaverMapAdapter.ts`와 `KakaoMapAdapter.ts`가 SDK별 `window` 타입 접근을 내부에 한정하고, 생성한 지도·마커 리소스를 `destroy`에서 해제하게 한다.
4. `features/maps/presentation/MapExplorer.tsx`에 제공자 선택, 검색 폼, 결과 목록, 상태 영역, 선택 장소 상세, 지도 캔버스를 구성한다. SDK가 없는 SSR 단계에는 고정 높이의 로딩 상태를 표시한다.
5. 결과 선택은 URL에 검색어·제공자만 반영하고, 상세 장소 데이터나 비밀 정보는 URL에 넣지 않는다.

### 4. 라우트, 카탈로그, CSP

1. `app/(site)/tools/map/page.tsx`는 metadata, 공통 레이아웃, `MapExplorer` 조합만 담당한다.
2. `features/tools/catalog.ts`의 `ToolCatalogItem` 식별자와 카탈로그에 `map`을 추가해 도구 허브 및 홈의 기존 카탈로그 렌더링에 노출한다.
3. `next.config.ts`의 `script-src`, `connect-src`, `img-src`에 네이버·카카오의 문서상 필수 SDK/타일/검색 도메인만 추가한다. 와일드카드와 `https:` 전체 허용은 사용하지 않는다.
4. 실제 배포 도메인을 양쪽 개발자 콘솔의 웹 서비스 URL 허용 목록에 등록한다. localhost와 Preview URL도 별도로 등록한다.

### 5. 테스트와 운영 검증

1. `validateMapSearch.test.ts`, `searchPlaces.test.ts`에서 입력 검증, 공급자 선택, 정상화, 오류 은닉을 단위 테스트한다.
2. `app/api/maps/search/route.test.ts`에서 잘못된 제공자, 빈 검색어, upstream 실패, 성공 응답, rate limit을 테스트한다.
3. SDK 로더와 `MapExplorer` 테스트에서 로딩·실패·결과 선택·제공자 전환·키보드 동작을 확인한다. SDK 전역 객체는 테스트 더블로 대체한다.
4. 로컬에서 실제 키로 네이버와 카카오 각각 검색, 지도 표시, 마커 이동, 외부 길찾기를 수동 확인한다.
5. `npm run lint`, `npm run typecheck`, 관련 Vitest 테스트, 마지막으로 `npm run ci`를 실행한다.

## 작업 순서

- [ ] T001 [MAP-01] `features/tools/catalog.ts`의 도구 타입과 카탈로그에 Map Explorer를 추가한다.
- [ ] T002 [MAP-05] `.env.example`, `lib/env.ts`에 지도 공개·서버 키 구성을 추가한다.
- [ ] T003 [MAP-02] [MAP-03] `features/maps/domain/types.ts`, `features/maps/application/validateMapSearch.ts`에 공통 계약과 검색 검증을 구현한다.
- [ ] T004 [MAP-02] [MAP-03] `features/maps/infrastructure/`에 네이버·카카오 검색 어댑터와 정규화 로직을 구현한다.
- [ ] T005 [MAP-02] [MAP-05] [MAP-06] `app/api/maps/search/route.ts`에 검증된 검색 프록시와 안정적 오류 응답을 구현한다.
- [ ] T006 [MAP-03] [MAP-04] `features/maps/presentation/sdk/`에 SDK 로더와 지도 어댑터를 구현한다.
- [ ] T007 [MAP-02] [MAP-03] [MAP-04] [MAP-06] [MAP-08] `features/maps/presentation/MapExplorer.tsx`와 스타일을 구현한다.
- [ ] T008 [MAP-01] `app/(site)/tools/map/page.tsx`를 추가하고 기존 공용 레이아웃 컴포넌트를 적용한다.
- [ ] T009 [MAP-07] `next.config.ts`에 제공자별 최소 CSP 출처를 추가하고 개발자 콘솔의 허용 URL을 등록한다.
- [ ] T010 [MAP-02] [MAP-03] [MAP-04] [MAP-05] [MAP-06] [MAP-08] 단위·라우트·컴포넌트 테스트와 실제 제공자 수동 검증을 수행한다.

## 완료 기준

- 지도 키가 없는 환경에서는 빌드가 깨지지 않고, 지도 도구는 구성 안내와 함께 안전하게 비활성 상태를 보인다.
- 구성된 각 제공자에서 검색, 결과 선택, 마커 이동, 외부 길찾기가 동작한다.
- 검색 비밀 키가 브라우저 번들, 응답 본문, 오류 메시지, 저장소에 포함되지 않는다.
- CSP는 지도 동작에 필요한 최소 도메인만 추가한 상태에서 기존 앱 기능을 유지한다.
- `npm run ci`가 성공한다.

## 구현 전 확인할 운영 값

구현을 시작하기 전에 서비스 소유자가 다음을 제공하거나 결정해야 한다.

1. 네이버 Cloud Platform과 Kakao Developers 애플리케이션 및 각 API 활성화 여부
2. 운영, Preview, localhost의 허용 웹 서비스 URL 목록
3. 서비스의 기본 제공자와 제공자 전환 UI 노출 여부
4. 검색 대상이 일반 장소인지, 특정 업종·매장 데이터인지
5. 지도 사용량 한도, 과금 알림, 제공자 약관·로고·저작권 표기 요구사항
