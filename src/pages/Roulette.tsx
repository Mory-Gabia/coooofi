import { useState, useRef, useEffect } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { WHEEL_COLORS, slicePath, getWinnerIndex } from './rouletteUtils'
import styles from './Roulette.module.css'

type Phase = 'setup' | 'spinning' | 'result'

const CX = 150, CY = 150, R = 130
const SPIN_DURATION_MS = 4000

export function Roulette() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [rotation, setRotation] = useState(0)
  const [loser, setLoser] = useState('')
  const accumulatedRotation = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  function spin() {
    setPhase('spinning')
    const extra = 1800 + Math.random() * 1800
    accumulatedRotation.current += extra
    const finalRotation = accumulatedRotation.current
    setRotation(finalRotation)

    timeoutRef.current = setTimeout(() => {
      const winnerIdx = getWinnerIndex(finalRotation % 360, participants.length)
      setLoser(participants[winnerIdx])
      setPhase('result')
    }, SPIN_DURATION_MS)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setRotation(0)
    accumulatedRotation.current = 0
  }

  const sliceAngle = 360 / (participants.length || 1)

  return (
    <div className={styles.page}>
      <GameHeader title="룰렛" emoji="🎡" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={spin} disabled={participants.length < 2} label="돌리기!" />
        </div>
      )}

      {phase !== 'setup' && participants.length > 0 && (
        <div className={`${styles.wheelWrap} ${phase === 'result' ? styles.wheelWrapResult : ''}`}>
          <div className={styles.pointer}>
            <svg width="24" height="20" viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
              <filter id="pointerShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.4)" />
              </filter>
              <polygon points="12,20 0,0 24,0" fill="#ff3b30" filter="url(#pointerShadow)" />
            </svg>
          </div>
          <svg
            className={styles.wheel}
            width={300}
            height={300}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: phase === 'spinning' ? `transform ${SPIN_DURATION_MS / 1000}s cubic-bezier(0.17,0.67,0.12,1)` : 'none',
            }}
          >
            {participants.map((name, i) => {
              const startDeg = i * sliceAngle
              const endDeg = startDeg + sliceAngle
              const midDeg = startDeg + sliceAngle / 2
              const midRad = ((midDeg - 90) * Math.PI) / 180
              const tx = CX + R * 0.65 * Math.cos(midRad)
              const ty = CY + R * 0.65 * Math.sin(midRad)
              return (
                <g key={`participant-${i}`}>
                  <path
                    d={slicePath(CX, CY, R, startDeg, endDeg)}
                    fill={WHEEL_COLORS[i % WHEEL_COLORS.length]}
                    stroke="white"
                    strokeWidth={2}
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontWeight="700"
                    fill="white"
                    transform={`rotate(${midDeg}, ${tx}, ${ty})`}
                  >
                    {name}
                  </text>
                </g>
              )
            })}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="white" strokeWidth={3} />
            <circle cx={CX} cy={CY} r={18} fill="white" />
          </svg>
          {phase === 'spinning' && (
            <p className={styles.spinningLabel}>🎡 돌아가는 중...</p>
          )}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
