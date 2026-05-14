import { pickRandom, shuffle, randomInt } from './random'

describe('pickRandom', () => {
  it('배열에서 하나를 반환한다', () => {
    const arr = ['a', 'b', 'c']
    expect(arr).toContain(pickRandom(arr))
  })

  it('1개짜리 배열이면 그 값을 반환한다', () => {
    expect(pickRandom(['only'])).toBe('only')
  })
})

describe('pickRandom - edge cases', () => {
  it('빈 배열에서 에러를 던진다', () => {
    expect(() => pickRandom([])).toThrow('array must not be empty')
  })
})

describe('shuffle', () => {
  it('원본 배열을 변경하지 않는다', () => {
    const arr = [1, 2, 3, 4, 5]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })

  it('같은 요소들을 포함한다', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr).sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('randomInt', () => {
  it('min 이상 max 이하의 정수를 반환한다', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 6)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
      expect(Number.isInteger(result)).toBe(true)
    }
  })
})

describe('randomInt - edge cases', () => {
  it('min === max 이면 min을 반환한다', () => {
    expect(randomInt(5, 5)).toBe(5)
  })

  it('min > max 이면 에러를 던진다', () => {
    expect(() => randomInt(6, 1)).toThrow('min')
  })

  it('음수 범위도 올바르게 동작한다', () => {
    for (let i = 0; i < 50; i++) {
      const result = randomInt(-10, -1)
      expect(result).toBeGreaterThanOrEqual(-10)
      expect(result).toBeLessThanOrEqual(-1)
    }
  })
})
