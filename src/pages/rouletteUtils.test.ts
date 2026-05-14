import { getWinnerIndex } from './rouletteUtils'

describe('getWinnerIndex', () => {
  it('rotation 0이면 index 0을 반환한다', () => {
    expect(getWinnerIndex(0, 4)).toBe(0)
  })

  it('rotation 360이면 rotation 0과 같다', () => {
    expect(getWinnerIndex(360, 4)).toBe(getWinnerIndex(0, 4))
  })

  it('반환값은 항상 0 이상 count 미만이다', () => {
    for (let i = 0; i < 100; i++) {
      const result = getWinnerIndex(Math.random() * 3600, 5)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(5)
    }
  })

  it('4명일 때 rotation 90이면 index 3이다', () => {
    // sliceAngle=90, rotation=90 → (360-90)/90 = 3
    expect(getWinnerIndex(90, 4)).toBe(3)
  })
})
