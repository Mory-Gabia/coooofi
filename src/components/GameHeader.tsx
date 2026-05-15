// src/components/GameHeader.tsx
import { useNavigate } from 'react-router-dom'
import styles from './GameHeader.module.css'

interface Props {
  title: string
  emoji: string
}

export function GameHeader({ title, emoji }: Props) {
  const navigate = useNavigate()
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <button
          className={styles.backBtn}
          onClick={() => navigate('/lobby')}
          aria-label="로비로"
        >
          ←
        </button>
        <div className={styles.titleGroup}>
          <span className={styles.emoji} aria-hidden="true">{emoji}</span>
          <span className={styles.title}>{title}</span>
        </div>
        <span className={styles.spacer} />
        <span className={styles.brand}>☕ 커피 내기</span>
      </div>
    </header>
  )
}
