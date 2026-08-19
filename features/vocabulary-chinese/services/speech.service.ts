interface SpeakChineseOptions {
  rate?: number;
}

export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

export function cancelChineseSpeech(): void {
  if (!isSpeechSynthesisSupported()) {
    return;
  }

  window.speechSynthesis.cancel();
}

export function speakChinese(
  text: string,
  options: SpeakChineseOptions = {},
): boolean {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = options.rate ?? 0.8;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);

  return true;
}
