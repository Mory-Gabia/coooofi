export interface NumberChoice {
  name: string
  number: number
}

export function findLoser(choices: NumberChoice[], target: number): string[] {
  const minDist = Math.min(...choices.map(c => Math.abs(c.number - target)))
  return choices.filter(c => Math.abs(c.number - target) === minDist).map(c => c.name)
}
