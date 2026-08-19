"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "../styles/typingRain.module.css";

interface PauseOverlayProps {
  visible: boolean;
  onResume: () => void;
}

export function PauseOverlay({ visible, onResume }: PauseOverlayProps) {
  if (!visible) return null;

  return (
    <div className={styles.pauseOverlay} role="dialog" aria-label="일시정지">
      <div className="rounded-lg border border-white/30 bg-neutral-950/80 p-5 text-center text-white shadow-lg">
        <h2 className="text-2xl font-bold">일시정지</h2>
        <Button type="button" onClick={onResume} className="mt-4 min-h-11">
          <Play aria-hidden="true" />
          계속하기
        </Button>
      </div>
    </div>
  );
}
