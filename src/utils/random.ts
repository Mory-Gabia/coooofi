export function pickRandom<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('pickRandom: array must not be empty')
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function randomInt(min: number, max: number): number {
  if (min > max) throw new Error(`randomInt: min (${min}) must be <= max (${max})`)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
