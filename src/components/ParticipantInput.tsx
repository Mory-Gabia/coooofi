// src/components/ParticipantInput.tsx
import styles from './ParticipantInput.module.css'

interface Props {
  participants: string[]
  input: string
  onInputChange: (val: string) => void
  onAdd: () => void
  onRemove: (name: string) => void
}

export function ParticipantInput({ participants, input, onInputChange, onAdd, onRemove }: Props) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') onAdd()
  }

  return (
    <div className={styles.container}>
      <p className={styles.label}>참가자 이름을 입력하세요</p>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="이름 입력 후 엔터"
          maxLength={10}
        />
        <button className={styles.addBtn} onClick={onAdd} disabled={!input.trim()}>
          추가
        </button>
      </div>
      {participants.length > 0 && (
        <div className={styles.tags}>
          {participants.map(name => (
            <span key={name} className={styles.tag}>
              {name}
              <button
                className={styles.removeBtn}
                onClick={() => onRemove(name)}
                aria-label={`${name} 제거`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
