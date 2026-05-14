import { useState, useRef, useEffect } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { pickRandom } from '../utils/random'
import styles from './RandomPick.module.css'

type Phase = 'setup' | 'picking' | 'result'

export function RandomPick() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [loser, setLoser] = useState('')
  const [revealedIdx, setRevealedIdx] = useState(-1)
  const timeout1Ref = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeout2Ref = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeout1Ref.current) clearTimeout(timeout1Ref.current)
      if (timeout2Ref.current) clearTimeout(timeout2Ref.current)
    }
  }, [])

  function pick() {
    const picked = pickRandom(participants)
    setLoser(picked)
    setPhase('picking')

    timeout1Ref.current = setTimeout(() => {
      setRevealedIdx(participants.indexOf(picked))
    }, 600)

    timeout2Ref.current = setTimeout(() => {
      setPhase('result')
    }, 2200)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setRevealedIdx(-1)
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
          {participants.map((name, i) => (
            <div key={`card-${i}`} className={`${styles.card} ${revealedIdx === i ? styles.flipped : ''}`}>
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>{name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
