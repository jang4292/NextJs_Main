import { Volume2 } from "lucide-react";
import { speakJapanese } from "@/features/vocabulary-japanese/services/speech.service";

interface SpeechButtonProps {
  label: string;
  text: string;
  disabled: boolean;
}

export function SpeechButton({ label, text, disabled }: SpeechButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => speakJapanese(text)}
      className="inline-flex items-center gap-2 rounded-md border border-emerald-700 px-3 py-2 text-sm font-medium text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-transparent"
    >
      <Volume2 aria-hidden="true" size={16} />
      {label}
    </button>
  );
}
