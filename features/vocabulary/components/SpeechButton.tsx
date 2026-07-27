import { Volume2 } from "lucide-react";
import { speakEnglish } from "@/features/vocabulary/services/speech.service";

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
      onClick={() => speakEnglish(text)}
      className="inline-flex items-center gap-2 rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
    >
      <Volume2 aria-hidden="true" size={16} />
      {label}
    </button>
  );
}
