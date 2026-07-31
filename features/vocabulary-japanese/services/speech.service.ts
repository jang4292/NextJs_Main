export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window
  );
}

export function speakJapanese(text: string): boolean {
  if (!isSpeechSynthesisSupported() || !text.trim()) {
    return false;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ja-JP";

  window.speechSynthesis.speak(utterance);

  return true;
}
