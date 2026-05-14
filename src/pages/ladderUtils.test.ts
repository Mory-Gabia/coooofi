import { generateLadder, tracePath } from './ladderUtils'

describe('generateLadder', () => {
  it('참가자 수에 맞는 cols를 반환한다', () => {
    expect(generateLadder(4).cols).toBe(4)
  })

  it('같은 행에 인접한 가로선이 없다', () => {
    for (let trial = 0; trial < 30; trial++) {
      const ladder = generateLadder(6)
      for (let row = 0; row < ladder.rows; row++) {
        const cols = ladder.rungs
          .filter(r => r.row === row)
          .map(r => r.col)
          .sort((a, b) => a - b)
        for (let i = 0; i < cols.length - 1; i++) {
          expect(cols[i + 1] - cols[i]).toBeGreaterThan(1)
        }
      }
    }
  })
})

describe('tracePath', () => {
  it('가로선을 만나면 오른쪽으로 이동한다', () => {
    const ladder = { cols: 3, rows: 1, rungs: [{ row: 0, col: 0 }] }
    expect(tracePath(ladder, 0)).toBe(1)
  })

  it('왼쪽 가로선을 만나면 왼쪽으로 이동한다', () => {
    const ladder = { cols: 3, rows: 1, rungs: [{ row: 0, col: 0 }] }
    expect(tracePath(ladder, 1)).toBe(0)
  })

  it('가로선이 없으면 같은 열을 반환한다', () => {
    const ladder = { cols: 3, rows: 3, rungs: [] }
    expect(tracePath(ladder, 2)).toBe(2)
  })
})
