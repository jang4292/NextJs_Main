import styles from "../styles/bullsAndCows.module.css";

export function RuleCard() {
  return (
    <section className={styles.panel} aria-label="게임 규칙">
      <div className={styles.panelHeader}>
        <h2>규칙</h2>
        <span>3자리 · 10회</span>
      </div>
      <ul className={styles.ruleList}>
        <li>서로 다른 세 자리 숫자를 맞힙니다.</li>
        <li>0은 첫 자리를 제외하고 사용할 수 있어요.</li>
        <li>숫자와 위치가 모두 같으면 Strike입니다.</li>
        <li>숫자는 맞고 위치가 다르면 Ball입니다.</li>
        <li>겹치는 숫자가 하나도 없으면 Out입니다.</li>
      </ul>
    </section>
  );
}
