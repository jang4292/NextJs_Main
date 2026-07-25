import { GameSwitcher } from "./GameSwitcher";

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GameSwitcher />
      {children}
    </>
  );
}
