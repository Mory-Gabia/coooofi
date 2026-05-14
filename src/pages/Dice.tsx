import { useState, useRef, useEffect } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import type { DiceResult } from './diceUtils'
import { rollDice, findLoser } from './diceUtils'
import styles from './Dice.module.css'

type Phase = 'setup' | 'rolling' | 'result'

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[30, 30]],
  2: [[42, 18], [18, 42]],
  3: [[42, 18], [30, 30], [18, 42]],
  4: [[18, 18], [42, 18], [18, 42], [42, 42]],
  5: [[18, 18], [42, 18], [30, 30], [18, 42], [42, 42]],
  6: [[18, 15], [18, 30], [18, 45], [42, 15], [42, 30], [42, 45]],
}

function DiceFace({ value }: { value: number }) {
  const dots = DOT_POSITIONS[value] ?? []
  return (
    <svg viewBox="0 0 60 60" width="60" height="60" className={styles.diceSvg}>
      <rect x="2" y="2" width="56" height="56" rx="10" ry="10" fill="white" stroke="#e0e0e0" strokeWidth="1.5" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="var(--color-accent)" />
      ))}
    </svg>
  )
}

function getRanks(results: DiceResult[]): Record<string, number> {
  const sorted = [...results].sort((a, b) => b.value - a.value)
  const ranks: Record<string, number> = {}
  sorted.forEach((r, i) => {
    ranks[r.name] = i + 1
  })
  return ranks
}

const ROLL_ANIMATION_MS = 1500
const RESULT_DELAY_MS = 1000

export function Dice() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [results, setResults] = useState<DiceResult[]>([])
  const [loser, setLoser] = useState<string[]>([])
  const timeout1Ref = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeout2Ref = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeout1Ref.current) clearTimeout(timeout1Ref.current)
      if (timeout2Ref.current) clearTimeout(timeout2Ref.current)
    }
  }, [])

  function rollAll() {
    if (timeout1Ref.current) clearTimeout(timeout1Ref.current)
    if (timeout2Ref.current) clearTimeout(timeout2Ref.current)

    setPhase('rolling')
    timeout1Ref.current = setTimeout(() => {
      const rolled = rollDice(participants)
      setResults(rolled)
      setLoser(findLoser(rolled))
      timeout2Ref.current = setTimeout(() => setPhase('result'), RESULT_DELAY_MS)
    }, ROLL_ANIMATION_MS)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setResults([])
  }

  const ranks = phase === 'result' ? getRanks(results) : {}

  return (
    <div className={styles.page}>
      <GameHeader title="주사위" emoji="🎯" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={rollAll} disabled={participants.length < 2} label="굴리기!" />
        </div>
      )}

      {(phase === 'rolling' || phase === 'result') && (
        <div className={styles.diceGrid}>
          {participants.map((name, i) => {
            const result = results.find(r => r.name === name)
            const isLoser = loser.includes(name)
            const isRolling = phase === 'rolling'
            const rank = ranks[name]

            return (
              <div
                key={name}
                className={`${styles.diceCard} ${isLoser && !isRolling ? styles.loserCard : ''} ${!isRolling ? styles.bounceIn : ''}`}
                style={!isRolling ? { animationDelay: `${i * 80}ms` } : undefined}
              >
                {isRolling ? (
                  <span className={styles.rollingEmoji}>🎲</span>
                ) : result ? (
                  <DiceFace value={result.value} />
                ) : (
                  <span className={styles.dicePlaceholder}>?</span>
                )}
                <span className={styles.diceName}>{name}</span>
                {!isRolling && result && (
                  <span className={styles.diceValue}>
                    {result.value}점 {rank != null ? `· ${rank}위` : ''}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser.length === 1 ? loser[0] : loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
