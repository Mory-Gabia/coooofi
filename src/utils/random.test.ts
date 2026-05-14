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
