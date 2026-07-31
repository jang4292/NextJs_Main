export function GameInstructions() {
  return (
    <section className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="text-base font-bold text-neutral-950">How to Play</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-neutral-700">
        <li>10, 20, 50, 100 크레딧 중 현재 베팅을 선택합니다.</li>
        <li>SPIN을 누르면 베팅이 먼저 차감되고 릴이 순서대로 멈춥니다.</li>
        <li>
          가운데 줄의 3개 심볼이 모두 같으면 베팅에 배당을 곱해 지급합니다.
        </li>
        <li>잔액이 10 크레딧보다 적어지면 NEW GAME으로 다시 시작합니다.</li>
      </ol>
    </section>
  );
}
