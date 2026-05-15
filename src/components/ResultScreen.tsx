// src/components/ResultScreen.tsx
import { useState } from 'react'
import styles from './ResultScreen.module.css'

interface Props {
  loser: string | string[]
  onRetry: () => void
}

const QUIPS = [
  '오늘 한 잔 부탁드려요!',
  '커피 셔틀 당첨 🙌',
  '인원수 만큼 따뜻하게 부탁해요',
  '센스 있게 골라봐요 ☕',
  '걱정 마요, 다음엔 다른 사람!',
  '결과는 공평했답니다',
]

export function ResultScreen({ loser, onRetry }: Props) {
  const names = Array.isArray(loser) ? loser : [loser]
  const displayName = names.join(', ')
  const [quip] = useState(() => QUIPS[Math.floor(Math.random() * QUIPS.length)])

  return (
    <div className={styles.container}>
      <div className={styles.confetti} aria-hidden="true">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className={styles.particle} />
        ))}
      </div>

      <div className={styles.badge}>
        <span aria-hidden="true">☕</span>
        오늘의 결과
      </div>

      <div className={styles.coffeeEmoji} aria-hidden="true">☕</div>

      <p className={styles.announcement}>
        <span className={styles.name}>{displayName}</span>
        <span className={styles.tail}>이(가) 커피 쏩니다!</span>
      </p>

      <p className={styles.quip}>{quip}</p>

      <button className={styles.retryBtn} onClick={onRetry}>
        다시하기
      </button>
    </div>
  )
}
