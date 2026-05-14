import { useState, useRef, useEffect } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { randomInt } from '../utils/random'
import type { NumberChoice } from './numberGameUtils'
import { findLoser } from './numberGameUtils'
import styles from './NumberGame.module.css'

type Phase = 'setup' | 'choosing' | 'reveal' | 'result'

const REVEAL_DURATION_MS = 3000

export function NumberGame() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [choices, setChoices] = useState<NumberChoice[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [numberInput, setNumberInput] = useState('')
  const [target, setTarget] = useState(0)
  const [loser, setLoser] = useState<string[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function startChoosing() {
    setChoices([])
    setCurrentIdx(0)
    setNumberInput('')
    setPhase('choosing')
  }

  function submitNumber() {
    const num = parseInt(numberInput)
    if (isNaN(num) || num < 1 || num > 100) return

    const updated: NumberChoice[] = [...choices, { name: participants[currentIdx], number: num }]
    setChoices(updated)
    setNumberInput('')

    if (currentIdx + 1 < participants.length) {
      setCurrentIdx(prev => prev + 1)
    } else {
      const t = randomInt(1, 100)
      setTarget(t)
      setLoser(findLoser(updated, t))
      setPhase('reveal')
      timeoutRef.current = setTimeout(() => setPhase('result'), REVEAL_DURATION_MS)
    }
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setChoices([])
    setCurrentIdx(0)
  }

  const isValidNumber = !isNaN(parseInt(numberInput)) && parseInt(numberInput) >= 1 && parseInt(numberInput) <= 100

  return (
    <div className={styles.page}>
      <GameHeader title="숫자 업다운" emoji="🔢" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={startChoosing} disabled={participants.length < 2} label="게임 시작!" />
        </div>
      )}

      {phase === 'choosing' && (
        <div className={styles.content}>
          <div className={styles.promptCard}>
            <p className={styles.promptName}>{participants[currentIdx]}</p>
            <p className={styles.promptHint}>1~100 사이 숫자를 선택하세요</p>
            <p className={styles.promptWarn}>(다른 사람은 보지 마세요!)</p>
            <input
              className={styles.numberInput}
              type="number"
              min={1}
              max={100}
              value={numberInput}
              onChange={e => setNumberInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitNumber() }}
              placeholder="숫자"
              autoFocus
            />
          </div>
          <StartButton
            onClick={submitNumber}
            disabled={!isValidNumber}
            label={currentIdx + 1 < participants.length
              ? `다음 (${currentIdx + 1}/${participants.length})`
              : '공개!'}
          />
        </div>
      )}

      {(phase === 'reveal' || phase === 'result') && (
        <div className={styles.reveal}>
          <div className={styles.targetBox}>
            <p className={styles.targetLabel}>정답</p>
            <p className={styles.targetNum}>{target}</p>
          </div>
          <div className={styles.choiceList}>
            {[...choices]
              .sort((a, b) => Math.abs(a.number - target) - Math.abs(b.number - target))
              .map((c, idx) => {
                const dist = Math.abs(c.number - target)
                const barWidth = Math.max(0, 100 - dist)
                const rankBadge = idx === 0 ? '☕' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : String(idx + 1)
                const rowClass = [
                  styles.choiceRow,
                  idx === 0 ? styles.loserRow : '',
                  idx === 1 ? styles.secondRow : '',
                  idx === 2 ? styles.thirdRow : '',
                  styles.revealRow,
                ].filter(Boolean).join(' ')
                return (
                  <div
                    key={c.name}
                    className={rowClass}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <span className={styles.rankBadge}>{rankBadge}</span>
                    <span className={styles.choiceName}>{c.name}</span>
                    <span className={styles.choiceNum}>{c.number}</span>
                    <span className={styles.choiceDiff}>±{dist}</span>
                    <div className={styles.distBar}>
                      <div
                        className={styles.distBarFill}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser.length === 1 ? loser[0] : loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
