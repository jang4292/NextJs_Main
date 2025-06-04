export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function upgradeShuffleArray<T>(array: T[]): T[] {
  const arr = [...array]; // 원본 배열을 복사하여 새로운 배열 생성
  const length = arr.length;
  
  // 더 나은 난수 생성을 위해 crypto.randomBytes 사용
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (Math.pow(2, 32) - 1) * (i + 1));
    
    // 배열 요소를 교환
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}
