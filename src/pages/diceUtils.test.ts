import { rollDice, findLoser } from './diceUtils'

describe('rollDice', () => {
  it('참가자마다 1~6 사이 정수를 할당한다', () => {
    const results = rollDice(['민수', '지수', '철수'])
    expect(results).toHaveLength(3)
    results.forEach(r => {
      expect(r.value).toBeGreaterThanOrEqual(1)
      expect(r.value).toBeLessThanOrEqual(6)
      expect(Number.isInteger(r.value)).toBe(true)
    })
  })

  it('이름을 그대로 유지한다', () => {
    const names = ['민수', '지수']
    expect(rollDice(names).map(r => r.name)).toEqual(names)
  })
})

describe('findLoser', () => {
  it('가장 낮은 숫자의 참가자를 반환한다', () => {
    const results = [{ name: '민수', value: 3 }, { name: '지수', value: 5 }, { name: '철수', value: 1 }]
    expect(findLoser(results)).toEqual(['철수'])
  })

  it('동점 시 여러 명을 반환한다', () => {
    const results = [{ name: '민수', value: 2 }, { name: '지수', value: 2 }, { name: '철수', value: 5 }]
    const loser = findLoser(results)
    expect(loser).toHaveLength(2)
    expect(loser).toContain('민수')
    expect(loser).toContain('지수')
  })
})
