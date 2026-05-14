import { useState, useRef, useEffect } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { pickRandom } from '../utils/random'
import styles from './RandomPick.module.css'

type Phase = 'setup' | 'picking' | 'result'

const REVEAL_DELAY_MS = 600
const FLIP_INTERVAL_MS = 300
const LOSER_EXTRA_DELAY_MS = 200
const RESULT_SCREEN_DELAY_MS = 3500

function shuffled<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function RandomPick() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [loser, setLoser] = useState('')
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const [loserIdx, setLoserIdx] = useState(-1)
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout)
    }
  }, [])

  function pick() {
    timeoutRefs.current.forEach(clearTimeout)
    timeoutRefs.current = []

    const picked = pickRandom(participants)
    const pickedIdx = participants.indexOf(picked)
    setLoser(picked)
    setLoserIdx(pickedIdx)
    setPhase('picking')
    setRevealedIndices(new Set())

    const nonLoserIndices = shuffled(
      participants.map((_, i) => i).filter(i => i !== pickedIdx)
    )
    const flipOrder = [...nonLoserIndices, pickedIdx]

    flipOrder.forEach((idx, position) => {
      const isLoser = idx === pickedIdx
      const delay =
        REVEAL_DELAY_MS +
        position * FLIP_INTERVAL_MS +
        (isLoser ? LOSER_EXTRA_DELAY_MS : 0)

      const t = setTimeout(() => {
        setRevealedIndices(prev => new Set(prev).add(idx))
      }, delay)
      timeoutRefs.current.push(t)
    })

    const resultDelay = REVEAL_DELAY_MS + flipOrder.length * FLIP_INTERVAL_MS + LOSER_EXTRA_DELAY_MS + RESULT_SCREEN_DELAY_MS
    const resultT = setTimeout(() => {
      setPhase('result')
    }, resultDelay)
    timeoutRefs.current.push(resultT)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setRevealedIndices(new Set())
    setLoserIdx(-1)
  }

  return (
    <div className={styles.page}>
      <GameHeader title="랜덤 뽑기" emoji="🎲" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={pick} disabled={participants.length < 2} label="뽑기!" />
        </div>
      )}

      {(phase === 'picking' || phase === 'result') && (
        <div className={styles.cards}>
          {participants.map((name, i) => {
            const isRevealed = revealedIndices.has(i)
            const isLoser = i === loserIdx
            const cardBackClass = isRevealed
              ? isLoser
                ? `${styles.cardBack} ${styles.cardBackLoser}`
                : `${styles.cardBack} ${styles.cardBackSafe}`
              : styles.cardBack
            return (
              <div
                key={name}
                className={`${styles.card} ${isRevealed ? styles.flipped : ''}`}
              >
                <div className={styles.cardInner}>
                  <div className={styles.cardFront}>?</div>
                  <div className={cardBackClass}>
                    <span className={styles.cardEmoji}>{isLoser ? '☕' : '✅'}</span>
                    {name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
