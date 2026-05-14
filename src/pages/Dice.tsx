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

const DICE_FACES: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
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
          {participants.map(name => {
            const result = results.find(r => r.name === name)
            const isLoser = loser.includes(name)
            const isRolling = phase === 'rolling'

            return (
              <div key={name} className={`${styles.diceCard} ${isLoser && !isRolling ? styles.loserCard : ''}`}>
                <span className={`${styles.diceFace} ${isRolling ? styles.shaking : ''}`}>
                  {isRolling ? '🎲' : (result ? DICE_FACES[result.value] : '?')}
                </span>
                <span className={styles.diceName}>{name}</span>
                {!isRolling && result && (
                  <span className={styles.diceValue}>{result.value}점</span>
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
