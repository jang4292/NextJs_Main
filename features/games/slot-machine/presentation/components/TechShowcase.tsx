export function TechShowcase() {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-bold text-neutral-950">Portfolio Notes</h2>
      <div className="mt-3 grid gap-4 text-sm leading-relaxed text-neutral-700 md:grid-cols-2">
        <article>
          <h3 className="font-semibold text-neutral-950">Architecture</h3>
          <p className="mt-1">
            슬롯 규칙은 순수 TypeScript 도메인으로 분리하고, React 훅은 타이머와
            입력 흐름만 조율합니다. 이 구조는 브라우저 UI와 규칙 엔진을 분리해
            향후 Cocos Creator 버전으로 옮기기 쉽습니다.
          </p>
        </article>
        <article>
          <h3 className="font-semibold text-neutral-950">State Flow</h3>
          <p className="mt-1">
            게임 상태는 ready, spinning, stopping, result, game-over 판별
            유니온으로 관리합니다. 스핀 결과는 시작 시 확정되고 릴 정지
            애니메이션은 결과 공개 타이밍만 담당합니다.
          </p>
        </article>
        <article>
          <h3 className="font-semibold text-neutral-950">Testing</h3>
          <p className="mt-1">
            난수는 인터페이스로 주입해 fake random source로 배당, 릴 정지, 잔액
            변경을 재현 가능하게 검증합니다. UI 테스트는 버튼 상태와 게임 오버
            복구 흐름을 확인합니다.
          </p>
        </article>
        <article>
          <h3 className="font-semibold text-neutral-950">Next Steps</h3>
          <p className="mt-1">
            이번 MVP에는 저장, 사운드, 자동 스핀, 다중 페이라인, 보너스 게임을
            넣지 않았습니다. 후속 버전에서는 연출과 학습용 통계를 별도 옵션으로
            확장할 수 있습니다.
          </p>
        </article>
      </div>
    </section>
  );
}
