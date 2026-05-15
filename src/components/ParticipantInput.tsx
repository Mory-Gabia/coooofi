// src/components/ParticipantInput.tsx
import styles from './ParticipantInput.module.css'

interface Props {
  participants: string[]
  input: string
  onInputChange: (val: string) => void
  onAdd: () => void
  onRemove: (name: string) => void
}

export function ParticipantInput({
  participants,
  input,
  onInputChange,
  onAdd,
  onRemove,
}: Props) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) onAdd()
  }

  return (
    <div className={styles.container}>
      <p className={styles.label}>
        <span>참가자</span>
        <span className={styles.count}>
          {participants.length > 0 ? `${participants.length}명` : '최소 2명'}
        </span>
      </p>
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
        <button
          className={styles.addBtn}
          onClick={onAdd}
          disabled={!input.trim()}
        >
          추가
        </button>
      </div>
      {participants.length > 0 ? (
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
      ) : (
        <p className={styles.empty}>아직 참가자가 없어요. 위에서 추가해 주세요.</p>
      )}
    </div>
  )
}
