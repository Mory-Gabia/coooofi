// src/components/ResultScreen.tsx
import styles from './ResultScreen.module.css'

interface Props {
  loser: string | string[]
  onRetry: () => void
}

export function ResultScreen({ loser, onRetry }: Props) {
  const names = Array.isArray(loser) ? loser : [loser]
  const displayName = names.join(', ')

  return (
    <div className={styles.container}>
      <div className={styles.coffeeEmoji}>☕</div>
      <p className={styles.announcement}>
        <span className={styles.name}>{displayName}</span>
        이(가) 커피 쏩니다!
      </p>
      <p className={styles.sub}>오늘의 커피는 {displayName} 담당</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        다시하기
      </button>
    </div>
  )
}
