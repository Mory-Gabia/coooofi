import { useState, useRef, useEffect } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { generateLadder, tracePath } from './ladderUtils'
import type { LadderData } from './ladderUtils'
import { randomInt } from '../utils/random'
import styles from './Ladder.module.css'

type Phase = 'setup' | 'playing' | 'result'

const LADDER_HEIGHT = 320
const COL_WIDTH = 64

function buildPathPoints(ladder: LadderData, loserCol: number, rowGap: number): string {
  const points: Array<{ x: number; y: number }> = []
  let col = loserCol

  points.push({ x: 20 + col * COL_WIDTH, y: 0 })

  for (let row = 0; row < ladder.rows; row++) {
    const y = (row + 1) * rowGap
    const hasRight = ladder.rungs.some(r => r.row === row && r.col === col)
    const hasLeft = ladder.rungs.some(r => r.row === row && r.col === col - 1)

    if (hasRight) {
      points.push({ x: 20 + col * COL_WIDTH, y })
      col += 1
      points.push({ x: 20 + col * COL_WIDTH, y })
    } else if (hasLeft) {
      points.push({ x: 20 + col * COL_WIDTH, y })
      col -= 1
      points.push({ x: 20 + col * COL_WIDTH, y })
    } else {
      points.push({ x: 20 + col * COL_WIDTH, y })
    }
  }

  points.push({ x: 20 + col * COL_WIDTH, y: LADDER_HEIGHT })

  return points.map(p => `${p.x},${p.y}`).join(' ')
}

export function Ladder() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [ladder, setLadder] = useState<LadderData | null>(null)
  const [loser, setLoser] = useState('')
  const [animatingCol, setAnimatingCol] = useState(-1)
  const [coffeeCol, setCoffeeCol] = useState(-1)
  const [loserCol, setLoserCol] = useState(-1)
  const [showPath, setShowPath] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function startGame() {
    const newLadder = generateLadder(participants.length)
    const coffeeResult = randomInt(0, participants.length - 1)
    const resultMap = participants.map((_, i) => tracePath(newLadder, i))
    const loserIdx = resultMap.indexOf(coffeeResult)

    setLadder(newLadder)
    setCoffeeCol(coffeeResult)
    setLoser(participants[loserIdx])
    setLoserCol(loserIdx)
    setShowPath(false)
    setPhase('playing')

    let col = 0
    intervalRef.current = setInterval(() => {
      setAnimatingCol(col)
      col++
      if (col >= participants.length) {
        clearInterval(intervalRef.current!)
        intervalRef.current = null
        setShowPath(true)
        timeoutRef.current = setTimeout(() => setPhase('result'), 2100)
      }
    }, 700)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setLadder(null)
    setAnimatingCol(-1)
    setLoserCol(-1)
    setShowPath(false)
  }

  const svgWidth = ladder ? ladder.cols * COL_WIDTH + 40 : 300
  const rowGap = LADDER_HEIGHT / ((ladder?.rows ?? 8) + 1)

  return (
    <div className={styles.page}>
      <GameHeader title="사다리타기" emoji="🪜" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={startGame} disabled={!participants.length || participants.length < 2} label="사다리 시작!" />
        </div>
      )}

      {phase !== 'setup' && ladder && (
        <div className={styles.ladderWrap}>
          <div className={styles.nameRow} style={{ width: svgWidth }}>
            {participants.map((name, i) => (
              <span
                key={name}
                className={`${styles.nameTag} ${animatingCol === i ? styles.activeTag : ''}`}
                style={{ left: 20 + i * COL_WIDTH }}
              >
                {name}
              </span>
            ))}
          </div>

          <svg width={svgWidth} height={LADDER_HEIGHT} className={styles.svg}>
            {Array.from({ length: ladder.cols }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={20 + i * COL_WIDTH} y1={0}
                x2={20 + i * COL_WIDTH} y2={LADDER_HEIGHT}
                stroke="#ddd"
                strokeWidth={2}
              />
            ))}
            {ladder.rungs.map((rung, idx) => (
              <line
                key={`h${idx}`}
                x1={20 + rung.col * COL_WIDTH} y1={(rung.row + 1) * rowGap}
                x2={20 + (rung.col + 1) * COL_WIDTH} y2={(rung.row + 1) * rowGap}
                stroke="#aaa" strokeWidth={2}
              />
            ))}
            {showPath && loserCol >= 0 && (
              <polyline
                points={buildPathPoints(ladder, loserCol, rowGap)}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.pathLine}
              />
            )}
          </svg>

          <div className={styles.resultRow} style={{ width: svgWidth }}>
            {participants.map((_, i) => {
              const isCoffee = coffeeCol === tracePath(ladder, i)
              return (
                <span
                  key={i}
                  className={`${styles.resultTag} ${isCoffee ? styles.coffeeTag : styles.safeTag}`}
                  style={{ left: 20 + i * COL_WIDTH }}
                >
                  {isCoffee ? '☕' : '✓'}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
