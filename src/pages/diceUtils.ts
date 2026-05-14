export interface DiceResult {
  name: string
  value: number
}

export function rollDice(participants: string[]): DiceResult[] {
  return participants.map(name => ({
    name,
    value: Math.floor(Math.random() * 6) + 1,
  }))
}

export function findLoser(results: DiceResult[]): string[] {
  const minValue = Math.min(...results.map(r => r.value))
  return results.filter(r => r.value === minValue).map(r => r.name)
}
