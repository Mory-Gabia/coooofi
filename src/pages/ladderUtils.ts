export interface LadderData {
  cols: number
  rows: number
  rungs: Array<{ row: number; col: number }>
}

export function generateLadder(participantCount: number, rows = 8): LadderData {
  const rungs: Array<{ row: number; col: number }> = []

  for (let row = 0; row < rows; row++) {
    let col = 0
    while (col < participantCount - 1) {
      if (Math.random() > 0.5) {
        rungs.push({ row, col })
        col += 2
      } else {
        col++
      }
    }
  }

  return { cols: participantCount, rows, rungs }
}

export function tracePath(ladder: LadderData, startCol: number): number {
  let col = startCol

  for (let row = 0; row < ladder.rows; row++) {
    const hasRight = ladder.rungs.some(r => r.row === row && r.col === col)
    const hasLeft  = ladder.rungs.some(r => r.row === row && r.col === col - 1)

    if (hasRight) col += 1
    else if (hasLeft) col -= 1
  }

  return col
}
