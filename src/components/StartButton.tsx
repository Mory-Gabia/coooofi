// src/components/StartButton.tsx
import styles from './StartButton.module.css'

interface Props {
  onClick: () => void
  disabled?: boolean
  label?: string
}

export function StartButton({ onClick, disabled = false, label = '시작하기' }: Props) {
  return (
    <button className={styles.btn} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
