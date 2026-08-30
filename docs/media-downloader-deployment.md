# Media Downloader 배포 아키텍처

이 문서는 미디어 다운로더를 로컬 Node.js 환경에서 실행하는 현재 구조와,
Next.js를 Vercel에 배포하면서 실제 미디어 처리를 별도 NestJS/EC2 서버로
이전하는 방법을 정리합니다.

## 결론

로컬 Mac에 `yt-dlp`, FFmpeg, FFprobe를 설치해도 Vercel 환경에는 설치되지
않습니다. 로컬 설치는 개발 환경의 오류를 해결할 뿐이며, Vercel 배포까지
지원하려면 미디어 처리 실행 환경을 분리해야 합니다.

권장 구조는 다음과 같습니다.

```text
사용자 브라우저
    |
    v
Next.js on Vercel
- UI
- URL 입력 및 포맷 선택
- 인증 및 요청 전달
- 분석 결과와 다운로드 상태 표시
    |
    v
NestJS API on EC2
- URL 분석
- yt-dlp 실행
- FFmpeg / FFprobe 실행
- 다운로드 작업 관리
    |
    v
S3 등 Object Storage
- 결과 파일 저장
- 만료되는 Signed URL 발급
```

Next.js가 직접 `yt-dlp`와 FFmpeg를 실행하지 않고, EC2의 NestJS 서버가
실행하도록 만드는 것이 핵심입니다.

## 현재 구조

현재 로컬 개발 구조에서는 Next.js API Route가 미디어 도구를 직접 실행합니다.

```text
Next.js UI
    -> POST /api/media/analyze
    -> Next.js API Route
    -> yt-dlp --version
    -> yt-dlp --dump-single-json
    -> 분석 결과 반환
```

다운로드는 다음 도구를 사용합니다.

```text
yt-dlp
    -> 영상 또는 오디오 다운로드
FFmpeg / FFprobe
    -> 병합, 리먹스, 오디오 추출, MP3 변환
```

관련 구현 위치:

- `features/media-downloader/application/`: URL 검증, 포맷 매핑, 오류 코드
- `features/media-downloader/infrastructure/mediaEnvironment.ts`: 실행 파일 경로와 readiness 검사
- `features/media-downloader/infrastructure/processRunner.ts`: Node `spawn` 실행
- `features/media-downloader/infrastructure/youtubeExtractor.ts`: 분석 실행
- `features/media-downloader/infrastructure/mediaDownloader.ts`: 다운로드 실행
- `app/api/media/analyze/route.ts`: 분석 API Route
- `app/api/media/download/route.ts`: 다운로드 API Route

## 로컬 개발 환경

macOS에서는 다음 명령으로 로컬 도구를 설치합니다.

```bash
brew install yt-dlp ffmpeg
```

설치 후 세 도구가 모두 실행되는지 확인합니다.

```bash
yt-dlp --version
ffmpeg -version
ffprobe -version
```

현재 프로젝트는 기본적으로 다음 명령명을 사용합니다.

```env
YTDLP_PATH=yt-dlp
FFMPEG_PATH=ffmpeg
FFPROBE_PATH=ffprobe
```

VS Code에서 실행한 Next.js 프로세스의 `PATH`가 터미널과 다르면 절대 경로를
`.env.local`에 지정할 수 있습니다.

```bash
which yt-dlp
which ffmpeg
which ffprobe
```

예시:

```env
YTDLP_PATH=/opt/homebrew/bin/yt-dlp
FFMPEG_PATH=/opt/homebrew/bin/ffmpeg
FFPROBE_PATH=/opt/homebrew/bin/ffprobe
```

`.env.local`은 기기별 설정이므로 저장소에 커밋하지 않습니다.

## Vercel에 로컬 설치만으로 해결되지 않는 이유

Mac의 Homebrew로 설치한 실행 파일은 해당 Mac에만 존재합니다. Vercel은
별도의 Linux 실행 환경을 사용하므로 다음 조건을 보장하지 않습니다.

- 로컬 Homebrew 바이너리의 존재
- 로컬 셸과 동일한 `PATH`
- `.env.local`의 절대 경로
- 장시간 실행되는 미디어 프로세스
- 대용량 결과 파일을 위한 영속 디스크

현재 다운로드 구현은 결과 파일을 임시 디렉터리에 만들고 메모리로 읽어
응답합니다. 이 방식은 로컬 MVP에는 적합하지만, Vercel 서버리스 함수의
실행 시간, 메모리, 응답 크기, 임시 파일 정책과는 맞지 않을 수 있습니다.

따라서 Vercel에 바이너리를 억지로 포함하는 것보다 실제 미디어 처리를
컨테이너 또는 VM 기반 워커로 분리하는 편이 안정적입니다.

## NestJS와 EC2를 사용하는 전환 구조

NestJS를 EC2에 배포하는 경우 책임을 다음처럼 분리합니다.

```text
Vercel / Next.js
- 화면과 사용자 상호작용
- 인증 및 권한 확인
- NestJS API 호출
- 분석 결과 표시
- 다운로드 작업 상태 표시

EC2 / NestJS
- 미디어 URL 검증
- yt-dlp 실행
- FFmpeg / FFprobe 실행
- 임시 작업 디렉터리 관리
- 결과 파일 저장 또는 Object Storage 업로드
- 작업 상태와 오류 반환
```

NestJS가 반드시 필요한 것은 아닙니다. Express, Fastify, 별도 Worker 등도
가능하지만, 현재 별도 API 서버를 TypeScript로 구성하려는 경우 NestJS가
모듈, 가드, DTO, 예외 필터를 제공하므로 관리하기 좋습니다.

## API 전환 방식

### 권장: Next.js API가 프록시

브라우저가 Next.js API를 호출하고, Next.js API가 내부적으로 NestJS를
호출하는 방식입니다.

```text
Browser
    -> Vercel Next.js /api/media/analyze
    -> EC2 NestJS /media/analyze
```

장점:

- EC2 API 주소를 브라우저에 직접 노출하지 않음
- 인증 토큰을 서버 간 요청에만 사용할 수 있음
- 기존 UI API 계약을 유지하기 쉬움
- CORS 설정 범위를 줄일 수 있음

Next.js 서버 환경 변수 예시:

```env
MEDIA_API_URL=https://api.example.com
MEDIA_API_TOKEN=server-to-server-secret
```

`MEDIA_API_TOKEN`은 브라우저에 노출되는 `NEXT_PUBLIC_` 변수로 만들지
않습니다.

### 대안: 브라우저가 NestJS를 직접 호출

```text
Browser
    -> https://api.example.com/media/analyze
```

이 방식은 CORS, 사용자 인증, rate limit, API 주소 노출을 직접 관리해야
하므로 초기 전환 방식으로는 권장하지 않습니다.

## API 계약

기존 UI 계약을 유지하면 프론트엔드 변경을 최소화할 수 있습니다.

### 분석

```http
POST /media/analyze
Content-Type: application/json
Authorization: Bearer <server-token>
```

```json
{
  "url": "https://www.youtube.com/watch?v=..."
}
```

성공 응답은 기존 `MediaInfo`를 유지합니다.

```json
{
  "platform": "youtube",
  "originalUrl": "https://www.youtube.com/watch?v=...",
  "title": "Example video",
  "durationSeconds": 120,
  "formats": []
}
```

### 다운로드 작업

작은 파일만 처리하는 초기 버전은 동기 응답도 가능하지만, 운영 환경에서는
작업 ID 기반 비동기 방식을 권장합니다.

```http
POST /media/jobs
```

```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "type": "video",
  "formatId": "video-mp4-720"
}
```

```json
{
  "jobId": "media-job-123",
  "status": "queued"
}
```

상태 조회:

```http
GET /media/jobs/:jobId
```

완료 응답:

```json
{
  "jobId": "media-job-123",
  "status": "completed",
  "downloadUrl": "https://storage.example.com/signed-url"
}
```

권장 상태:

```text
queued -> processing -> completed
                       -> failed
```

## EC2 실행 환경

Ubuntu 기반 EC2에서는 예시로 다음 도구를 설치합니다.

```bash
sudo apt update
sudo apt install -y ffmpeg python3 python3-pip
python3 -m pip install --user yt-dlp
```

실제 설치 경로를 확인합니다.

```bash
which yt-dlp
which ffmpeg
which ffprobe
```

NestJS 실행 환경에는 실제 경로를 전달합니다.

```env
YTDLP_PATH=/home/ubuntu/.local/bin/yt-dlp
FFMPEG_PATH=/usr/bin/ffmpeg
FFPROBE_PATH=/usr/bin/ffprobe
```

더 재현 가능한 운영 환경이 필요하면 EC2에 직접 설치하는 대신 Docker
이미지를 사용합니다.

```dockerfile
FROM node:22-bookworm-slim

RUN apt-get update \\
  && apt-get install -y --no-install-recommends ffmpeg python3 python3-pip \\
  && python3 -m pip install --break-system-packages --no-cache-dir yt-dlp \\
  && rm -rf /var/lib/apt/lists/*
```

운영 배포에서는 Node.js 애플리케이션과 실행 도구의 버전을 고정하고,
이미지를 빌드할 때 다음 검사를 수행합니다.

```bash
yt-dlp --version
ffmpeg -version
ffprobe -version
```

## 저장과 다운로드 반환

### 초기 단계: EC2 임시 파일

```text
NestJS
  -> /tmp 작업 디렉터리 생성
  -> yt-dlp / FFmpeg 실행
  -> 파일 응답
  -> finally에서 임시 파일 삭제
```

작업이 단순하고 파일 크기가 작을 때만 사용합니다. EC2 디스크 용량과
동시 작업 수를 제한해야 합니다.

### 권장 단계: Object Storage와 Signed URL

```text
1. Next.js가 NestJS에 다운로드 작업 생성
2. NestJS가 작업 ID 반환
3. NestJS가 yt-dlp와 FFmpeg 실행
4. 결과 파일을 S3에 업로드
5. 상태를 completed로 변경
6. 만료 시간이 있는 Signed URL 발급
7. 브라우저가 S3에서 직접 다운로드
```

이 구조에서는 대용량 파일을 Vercel이나 NestJS가 계속 중계하지 않아도
됩니다. Signed URL에는 짧은 만료 시간을 적용하고, 완료된 파일의 보존
기간도 별도로 관리합니다.

## 단계별 마이그레이션

### 1단계: 로컬 기능 정상화

- Mac에 `yt-dlp`, FFmpeg, FFprobe 설치
- 세 도구의 version 명령 확인
- `.env.local`에 필요하면 절대 경로 지정
- 현재 Next.js UI와 API 동작 확인

### 2단계: NestJS API 구축

- `analyze` 엔드포인트 구현
- URL 검증과 포맷 매핑 구현
- `yt-dlp` 실행 어댑터 구현
- FFmpeg/FFprobe readiness 검사 구현
- 오류 코드와 응답 형식 표준화
- 임시 파일 정리와 실행 시간 제한 구현

### 3단계: EC2 배포

- Docker 또는 systemd/PM2로 NestJS 실행
- HTTPS 적용
- 보안 그룹과 reverse proxy 설정
- 도구 실행 경로를 환경 변수로 고정
- 서버 간 인증 토큰 적용
- 로그, 디스크, CPU, 메모리 모니터링

### 4단계: Next.js 연결 전환

- `MEDIA_API_URL` 설정
- 기존 Next.js API Route를 NestJS 프록시로 변경
- 로컬 직접 실행 코드는 개발용 fallback으로 유지할지 결정
- 성공, 도구 오류, URL 오류, timeout 응답을 통합 테스트

### 5단계: 비동기 다운로드 도입

- 다운로드 요청과 상태 조회 API 분리
- S3 등 Object Storage 연결
- 완료된 파일의 Signed URL 발급
- 필요할 때 Redis/BullMQ와 별도 Worker 추가

## 보안과 운영 체크리스트

- HTTPS URL만 허용
- 지원 플랫폼과 호스트 allowlist 유지
- playlist, private video, DRM, login 우회 기능 금지
- 사용자 입력을 shell 문자열로 결합하지 않고 `spawn` 인자로 전달
- NestJS API에 인증과 rate limit 적용
- Next.js와 NestJS 간 CORS 범위 최소화
- `MEDIA_API_TOKEN`을 클라이언트 번들에 노출하지 않음
- 동시 다운로드 수와 영상 길이 제한
- 작업별 timeout 및 최대 출력 크기 제한
- 임시 파일을 `finally`에서 삭제
- 결과 파일 자동 만료 및 정리
- raw stderr와 서버 경로를 사용자 응답에 포함하지 않음
- EC2 디스크, CPU, 메모리, 프로세스 상태 모니터링
- yt-dlp와 FFmpeg 버전 업데이트 절차 마련

## 최종 권장 구조

```text
Next.js on Vercel
  -> Next.js media API proxy
  -> NestJS on EC2
  -> yt-dlp / FFmpeg / FFprobe
  -> S3 Object Storage
  -> Signed Download URL
```

분석은 초기에는 동기 응답으로 유지해도 되지만, 다운로드는 작업 ID 기반
비동기 처리로 전환하는 것이 좋습니다. 이렇게 하면 UI 계약은 유지하면서도
Vercel의 서버리스 실행 제한과 대용량 파일 처리 문제를 피할 수 있습니다.

## 관련 문서

- [Media Downloader 기능 명세](./media-downloader.md)
- [프로젝트 아키텍처](./ARCHITECTURE.md)
- [테스트와 로컬 CI](./TESTING.md)
