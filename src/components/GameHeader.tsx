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
      <button className={styles.backBtn} onClick={() => navigate('/')} aria-label="홈으로">
        ←
      </button>
      <span className={styles.title}>{emoji} {title}</span>
    </header>
  )
}
