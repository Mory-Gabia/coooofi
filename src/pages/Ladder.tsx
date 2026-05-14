import { useState } from 'react'
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

export function Ladder() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [ladder, setLadder] = useState<LadderData | null>(null)
  const [loser, setLoser] = useState('')
  const [animatingCol, setAnimatingCol] = useState(-1)
  const [coffeeCol, setCoffeeCol] = useState(-1)

  function startGame() {
    const newLadder = generateLadder(participants.length)
    const coffeeResult = randomInt(0, participants.length - 1)
    const resultMap = participants.map((_, i) => tracePath(newLadder, i))
    const loserIdx = resultMap.indexOf(coffeeResult)

    setLadder(newLadder)
    setCoffeeCol(coffeeResult)
    setLoser(participants[loserIdx])
    setPhase('playing')

    let col = 0
    const interval = setInterval(() => {
      setAnimatingCol(col)
      col++
      if (col >= participants.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('result'), 800)
      }
    }, 700)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setLadder(null)
    setAnimatingCol(-1)
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
                stroke={animatingCol === i ? 'var(--color-accent)' : '#333'}
                strokeWidth={animatingCol === i ? 3 : 2}
              />
            ))}
            {ladder.rungs.map((rung, idx) => (
              <line
                key={`h${idx}`}
                x1={20 + rung.col * COL_WIDTH} y1={(rung.row + 1) * rowGap}
                x2={20 + (rung.col + 1) * COL_WIDTH} y2={(rung.row + 1) * rowGap}
                stroke="#333" strokeWidth={2}
              />
            ))}
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
