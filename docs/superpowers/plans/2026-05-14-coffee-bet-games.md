# 커피 내기 앱 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 5가지 게임(사다리타기, 룰렛, 랜덤 뽑기, 숫자 업다운, 주사위)으로 커피 낼 사람을 결정하는 모바일 웹 앱을 만든다.

**Architecture:** React Router v6으로 각 게임이 독립 페이지(`/ladder`, `/roulette` 등)를 갖는 SPA. 공통 훅(`useParticipants`)과 4개 공용 컴포넌트로 중복을 최소화한다. 세션 기반으로 데이터 저장 없음.

**Tech Stack:** React 18, TypeScript, Vite, React Router v6, CSS Modules, Vitest, React Testing Library

---

## 파일 구조

```
src/
├── components/
│   ├── GameHeader.tsx + GameHeader.module.css
│   ├── ParticipantInput.tsx + ParticipantInput.module.css
│   ├── StartButton.tsx + StartButton.module.css
│   └── ResultScreen.tsx + ResultScreen.module.css + ResultScreen.test.tsx
├── pages/
│   ├── Home.tsx + Home.module.css
│   ├── Ladder.tsx + Ladder.module.css + ladderUtils.ts + ladderUtils.test.ts
│   ├── Roulette.tsx + Roulette.module.css + rouletteUtils.ts + rouletteUtils.test.ts
│   ├── RandomPick.tsx + RandomPick.module.css
│   ├── NumberGame.tsx + NumberGame.module.css + numberGameUtils.ts + numberGameUtils.test.ts
│   └── Dice.tsx + Dice.module.css + diceUtils.ts + diceUtils.test.ts
├── hooks/
│   ├── useParticipants.ts
│   └── useParticipants.test.ts
├── utils/
│   ├── random.ts
│   └── random.test.ts
├── styles/
│   └── global.css
├── App.tsx
└── main.tsx
```

---

### Task 1: 프로젝트 초기 설정

**Files:**
- Create: `vite.config.ts` (수정)
- Create: `src/setupTests.ts`

- [ ] **Step 1: 프로젝트 디렉토리에서 Vite 프로젝트 생성**

```bash
cd /Users/mory/Documents/work/bet-games
npm create vite@latest . -- --template react-ts
```

기존 파일 덮어쓰기 여부 물으면 `y` 로 응답.

- [ ] **Step 2: 의존성 설치**

```bash
npm install react-router-dom
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

- [ ] **Step 3: vite.config.ts 교체**

```ts
// vite.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
})
```

- [ ] **Step 4: tsconfig.app.json 에 vitest 타입 추가**

`tsconfig.app.json` 의 `compilerOptions` 에 `"types": ["vitest/globals"]` 추가:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

기존 `compilerOptions` 에 `types` 배열이 이미 있으면 `"vitest/globals"` 만 배열에 추가한다.

- [ ] **Step 5: src/setupTests.ts 생성**

```ts
// src/setupTests.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 6: 동작 확인**

```bash
npm run dev
```

`http://localhost:5173` 에 Vite 기본 화면이 보이면 성공. 확인 후 종료(Ctrl+C).

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "chore: Vite + React + TypeScript 프로젝트 초기 설정"
```

---

### Task 2: 글로벌 스타일 및 디자인 토큰

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/main.tsx`

- [ ] **Step 1: 불필요한 기본 파일 삭제**

```bash
rm -f src/index.css src/App.css src/App.tsx
```

- [ ] **Step 2: src/styles/global.css 생성**

```css
/* src/styles/global.css */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-bg: #f5f5f5;
  --color-header: #111111;
  --color-header-text: #ffffff;
  --color-accent: #ff3b30;
  --color-card: #ffffff;
  --color-icon-box: #111111;
  --color-text-secondary: #999999;
  --color-shadow: rgba(0, 0, 0, 0.08);
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --border-radius-card: 12px;
  --max-width: 480px;
}

body {
  font-family: var(--font-family);
  background: var(--color-bg);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

#root {
  max-width: var(--max-width);
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: src/main.tsx 교체**

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "chore: 글로벌 스타일 및 디자인 토큰 설정"
```

---

### Task 3: 유틸리티 함수

**Files:**
- Create: `src/utils/random.ts`
- Create: `src/utils/random.test.ts`

- [ ] **Step 1: 테스트 파일 작성 (RED)**

```ts
// src/utils/random.test.ts
import { pickRandom, shuffle, randomInt } from './random'

describe('pickRandom', () => {
  it('배열에서 하나를 반환한다', () => {
    const arr = ['a', 'b', 'c']
    expect(arr).toContain(pickRandom(arr))
  })

  it('1개짜리 배열이면 그 값을 반환한다', () => {
    expect(pickRandom(['only'])).toBe('only')
  })
})

describe('shuffle', () => {
  it('원본 배열을 변경하지 않는다', () => {
    const arr = [1, 2, 3, 4, 5]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })

  it('같은 요소들을 포함한다', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle(arr).sort()).toEqual([1, 2, 3, 4, 5])
  })
})

describe('randomInt', () => {
  it('min 이상 max 이하의 정수를 반환한다', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(1, 6)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
      expect(Number.isInteger(result)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: 테스트 실행 — FAIL 확인**

```bash
npx vitest run src/utils/random.test.ts
```

Expected: 파일 없음 오류로 FAIL

- [ ] **Step 3: src/utils/random.ts 구현**

```ts
// src/utils/random.ts
export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
```

- [ ] **Step 4: 테스트 PASS 확인**

```bash
npx vitest run src/utils/random.test.ts
```

Expected: 3개 PASS

- [ ] **Step 5: 커밋**

```bash
git add src/utils/
git commit -m "feat: 랜덤 유틸리티 함수 추가"
```

---

### Task 4: useParticipants 훅

**Files:**
- Create: `src/hooks/useParticipants.ts`
- Create: `src/hooks/useParticipants.test.ts`

- [ ] **Step 1: 테스트 작성 (RED)**

```ts
// src/hooks/useParticipants.test.ts
import { renderHook, act } from '@testing-library/react'
import { useParticipants } from './useParticipants'

describe('useParticipants', () => {
  it('초기 상태는 빈 배열이고 isReady가 false다', () => {
    const { result } = renderHook(() => useParticipants())
    expect(result.current.participants).toEqual([])
    expect(result.current.isReady).toBe(false)
  })

  it('참가자를 추가하면 input이 초기화된다', () => {
    const { result } = renderHook(() => useParticipants())
    act(() => { result.current.setInput('민수') })
    act(() => { result.current.addParticipant() })
    expect(result.current.participants).toEqual(['민수'])
    expect(result.current.input).toBe('')
  })

  it('2명 이상이면 isReady가 true다', () => {
    const { result } = renderHook(() => useParticipants())
    act(() => { result.current.setInput('민수') })
    act(() => { result.current.addParticipant() })
    act(() => { result.current.setInput('지수') })
    act(() => { result.current.addParticipant() })
    expect(result.current.isReady).toBe(true)
  })

  it('중복 이름은 추가되지 않는다', () => {
    const { result } = renderHook(() => useParticipants())
    act(() => { result.current.setInput('민수') })
    act(() => { result.current.addParticipant() })
    act(() => { result.current.setInput('민수') })
    act(() => { result.current.addParticipant() })
    expect(result.current.participants).toHaveLength(1)
  })

  it('참가자를 제거할 수 있다', () => {
    const { result } = renderHook(() => useParticipants())
    act(() => { result.current.setInput('민수') })
    act(() => { result.current.addParticipant() })
    act(() => { result.current.removeParticipant('민수') })
    expect(result.current.participants).toEqual([])
  })

  it('reset 시 모두 초기화된다', () => {
    const { result } = renderHook(() => useParticipants())
    act(() => { result.current.setInput('민수') })
    act(() => { result.current.addParticipant() })
    act(() => { result.current.reset() })
    expect(result.current.participants).toEqual([])
    expect(result.current.input).toBe('')
  })
})
```

- [ ] **Step 2: 테스트 FAIL 확인**

```bash
npx vitest run src/hooks/useParticipants.test.ts
```

- [ ] **Step 3: src/hooks/useParticipants.ts 구현**

```ts
// src/hooks/useParticipants.ts
import { useState } from 'react'

export function useParticipants(minCount = 2) {
  const [participants, setParticipants] = useState<string[]>([])
  const [input, setInput] = useState('')

  function addParticipant() {
    const trimmed = input.trim()
    if (!trimmed || participants.includes(trimmed)) return
    setParticipants(prev => [...prev, trimmed])
    setInput('')
  }

  function removeParticipant(name: string) {
    setParticipants(prev => prev.filter(p => p !== name))
  }

  function reset() {
    setParticipants([])
    setInput('')
  }

  return {
    participants,
    input,
    setInput,
    addParticipant,
    removeParticipant,
    reset,
    isReady: participants.length >= minCount,
  }
}
```

- [ ] **Step 4: 테스트 PASS 확인**

```bash
npx vitest run src/hooks/useParticipants.test.ts
```

Expected: 6개 PASS

- [ ] **Step 5: 커밋**

```bash
git add src/hooks/
git commit -m "feat: useParticipants 훅 추가"
```

---

### Task 5: 공통 컴포넌트

**Files:**
- Create: `src/components/GameHeader.tsx`, `GameHeader.module.css`
- Create: `src/components/ParticipantInput.tsx`, `ParticipantInput.module.css`
- Create: `src/components/StartButton.tsx`, `StartButton.module.css`
- Create: `src/components/ResultScreen.tsx`, `ResultScreen.module.css`, `ResultScreen.test.tsx`

- [ ] **Step 1: GameHeader 컴포넌트**

```tsx
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
```

```css
/* src/components/GameHeader.module.css */
.header {
  background: var(--color-header);
  color: var(--color-header-text);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.backBtn {
  background: none;
  border: none;
  color: var(--color-header-text);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
}

.backBtn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.title {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.5px;
}
```

- [ ] **Step 2: ParticipantInput 컴포넌트**

```tsx
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
```

```css
/* src/components/ParticipantInput.module.css */
.container {
  padding: 16px;
  background: var(--color-card);
  border-radius: var(--border-radius-card);
  box-shadow: 0 1px 3px var(--color-shadow);
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin-bottom: 10px;
}

.inputRow {
  display: flex;
  gap: 8px;
}

.input {
  flex: 1;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 15px;
  font-family: var(--font-family);
  outline: none;
  transition: border-color 0.15s;
}

.input:focus {
  border-color: var(--color-accent);
}

.addBtn {
  background: var(--color-icon-box);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.addBtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #f0f0f0;
  border-radius: 20px;
  padding: 5px 10px 5px 12px;
  font-size: 13px;
  font-weight: 600;
}

.removeBtn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  line-height: 1;
  padding: 0 2px;
}
```

- [ ] **Step 3: StartButton 컴포넌트**

```tsx
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
```

```css
/* src/components/StartButton.module.css */
.btn {
  width: 100%;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 18px;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  font-family: var(--font-family);
}

.btn:active {
  transform: scale(0.98);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
```

- [ ] **Step 4: ResultScreen 테스트 작성 (RED)**

```tsx
// src/components/ResultScreen.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ResultScreen } from './ResultScreen'

describe('ResultScreen', () => {
  it('단일 패자 이름과 메시지를 표시한다', () => {
    render(<ResultScreen loser="민수" onRetry={() => {}} />)
    expect(screen.getByText('민수')).toBeInTheDocument()
    expect(screen.getByText(/커피 쏩니다/)).toBeInTheDocument()
  })

  it('여러 패자를 쉼표로 표시한다', () => {
    render(<ResultScreen loser={['민수', '지수']} onRetry={() => {}} />)
    expect(screen.getByText('민수, 지수')).toBeInTheDocument()
  })

  it('다시하기 버튼 클릭 시 onRetry 호출', () => {
    const onRetry = vi.fn()
    render(<ResultScreen loser="민수" onRetry={onRetry} />)
    fireEvent.click(screen.getByText('다시하기'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 5: 테스트 FAIL 확인**

```bash
npx vitest run src/components/ResultScreen.test.tsx
```

- [ ] **Step 6: ResultScreen 구현**

```tsx
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
```

```css
/* src/components/ResultScreen.module.css */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 16px;
}

.coffeeEmoji {
  font-size: 72px;
  animation: pop 0.4s ease;
}

@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.announcement {
  font-size: 22px;
  font-weight: 900;
  letter-spacing: -1px;
  text-align: center;
  line-height: 1.4;
}

.name {
  color: var(--color-accent);
  font-size: 36px;
  display: block;
  margin-bottom: 4px;
}

.sub {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.retryBtn {
  margin-top: 16px;
  background: var(--color-icon-box);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-family);
}
```

- [ ] **Step 7: 테스트 PASS 확인**

```bash
npx vitest run src/components/ResultScreen.test.tsx
```

Expected: 3개 PASS

- [ ] **Step 8: 커밋**

```bash
git add src/components/
git commit -m "feat: 공통 컴포넌트 추가 (GameHeader, ParticipantInput, StartButton, ResultScreen)"
```

---

### Task 6: App 라우터 + 홈 페이지

**Files:**
- Create: `src/App.tsx`
- Create: `src/pages/Home.tsx`, `src/pages/Home.module.css`
- Create: 각 게임 페이지 플레이스홀더

- [ ] **Step 1: 각 게임 페이지 플레이스홀더 생성**

```tsx
// src/pages/Ladder.tsx
export function Ladder() { return <div>사다리타기 (준비 중)</div> }

// src/pages/Roulette.tsx
export function Roulette() { return <div>룰렛 (준비 중)</div> }

// src/pages/RandomPick.tsx
export function RandomPick() { return <div>랜덤 뽑기 (준비 중)</div> }

// src/pages/NumberGame.tsx
export function NumberGame() { return <div>숫자 게임 (준비 중)</div> }

// src/pages/Dice.tsx
export function Dice() { return <div>주사위 (준비 중)</div> }
```

각 파일을 `src/pages/` 에 개별 파일로 만든다.

- [ ] **Step 2: App.tsx 라우터 설정**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { Ladder } from './pages/Ladder'
import { Roulette } from './pages/Roulette'
import { RandomPick } from './pages/RandomPick'
import { NumberGame } from './pages/NumberGame'
import { Dice } from './pages/Dice'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ladder" element={<Ladder />} />
        <Route path="/roulette" element={<Roulette />} />
        <Route path="/random-pick" element={<RandomPick />} />
        <Route path="/number-game" element={<NumberGame />} />
        <Route path="/dice" element={<Dice />} />
      </Routes>
    </BrowserRouter>
  )
}
```

- [ ] **Step 3: Home 페이지 구현**

```tsx
// src/pages/Home.tsx
import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const GAMES = [
  { path: '/ladder',      emoji: '🪜', title: '사다리타기',  desc: '선을 따라 운명 결정' },
  { path: '/roulette',    emoji: '🎡', title: '룰렛',        desc: '빙글빙글 돌려보자' },
  { path: '/random-pick', emoji: '🎲', title: '랜덤 뽑기',   desc: '제비뽑기로 결정' },
  { path: '/number-game', emoji: '🔢', title: '숫자 업다운', desc: '정답에 가까운 사람이 짐' },
  { path: '/dice',        emoji: '🎯', title: '주사위',      desc: '최저 숫자가 커피 쏘기' },
]

export function Home() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.coffeeIcon}>☕</div>
        <h1 className={styles.title}>커피 내기</h1>
        <p className={styles.subtitle}>누가 쏠지 정해보자!</p>
      </header>
      <main className={styles.main}>
        {GAMES.map(game => (
          <button key={game.path} className={styles.gameCard} onClick={() => navigate(game.path)}>
            <div className={styles.iconBox}>{game.emoji}</div>
            <div className={styles.cardInfo}>
              <span className={styles.cardTitle}>{game.title}</span>
              <span className={styles.cardDesc}>{game.desc}</span>
            </div>
            <span className={styles.arrow}>›</span>
          </button>
        ))}
      </main>
    </div>
  )
}
```

```css
/* src/pages/Home.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: var(--color-header);
  padding: 28px 20px 32px;
  text-align: left;
}

.coffeeIcon {
  font-size: 32px;
  margin-bottom: 8px;
}

.title {
  font-size: 32px;
  font-weight: 900;
  color: var(--color-header-text);
  letter-spacing: -1.5px;
  line-height: 1.1;
}

.subtitle {
  font-size: 12px;
  color: var(--color-accent);
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-top: 8px;
}

.main {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gameCard {
  width: 100%;
  background: var(--color-card);
  border: none;
  border-radius: var(--border-radius-card);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 3px var(--color-shadow);
  cursor: pointer;
  text-align: left;
  transition: transform 0.1s;
  font-family: var(--font-family);
}

.gameCard:active {
  transform: scale(0.98);
}

.iconBox {
  background: var(--color-icon-box);
  border-radius: 10px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.cardInfo {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cardTitle {
  font-weight: 800;
  font-size: 15px;
  color: #111;
}

.cardDesc {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.arrow {
  color: var(--color-accent);
  font-size: 22px;
  font-weight: 700;
}
```

- [ ] **Step 4: 동작 확인**

```bash
npm run dev
```

`http://localhost:5173` 에서 홈 화면이 보이고 각 게임 카드를 클릭하면 해당 URL로 이동하는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/
git commit -m "feat: 홈 페이지 및 라우터 설정"
```

---

### Task 7: 사다리타기

**Files:**
- Create: `src/pages/ladderUtils.ts`, `src/pages/ladderUtils.test.ts`
- Modify: `src/pages/Ladder.tsx`, Create `src/pages/Ladder.module.css`

- [ ] **Step 1: ladderUtils 테스트 작성 (RED)**

```ts
// src/pages/ladderUtils.test.ts
import { generateLadder, tracePath } from './ladderUtils'

describe('generateLadder', () => {
  it('참가자 수에 맞는 cols를 반환한다', () => {
    expect(generateLadder(4).cols).toBe(4)
  })

  it('같은 행에 인접한 가로선이 없다', () => {
    for (let trial = 0; trial < 30; trial++) {
      const ladder = generateLadder(6)
      for (let row = 0; row < ladder.rows; row++) {
        const cols = ladder.rungs
          .filter(r => r.row === row)
          .map(r => r.col)
          .sort((a, b) => a - b)
        for (let i = 0; i < cols.length - 1; i++) {
          expect(cols[i + 1] - cols[i]).toBeGreaterThan(1)
        }
      }
    }
  })
})

describe('tracePath', () => {
  it('가로선을 만나면 오른쪽으로 이동한다', () => {
    const ladder = { cols: 3, rows: 1, rungs: [{ row: 0, col: 0 }] }
    expect(tracePath(ladder, 0)).toBe(1)
  })

  it('왼쪽 가로선을 만나면 왼쪽으로 이동한다', () => {
    const ladder = { cols: 3, rows: 1, rungs: [{ row: 0, col: 0 }] }
    expect(tracePath(ladder, 1)).toBe(0)
  })

  it('가로선이 없으면 같은 열을 반환한다', () => {
    const ladder = { cols: 3, rows: 3, rungs: [] }
    expect(tracePath(ladder, 2)).toBe(2)
  })
})
```

- [ ] **Step 2: 테스트 FAIL 확인**

```bash
npx vitest run src/pages/ladderUtils.test.ts
```

- [ ] **Step 3: ladderUtils.ts 구현**

```ts
// src/pages/ladderUtils.ts
export interface LadderData {
  cols: number
  rows: number
  rungs: Array<{ row: number; col: number }>
}

export function generateLadder(participantCount: number, rows = 8): LadderData {
  const rungs: Array<{ row: number; col: number }> = []

  for (let row = 0; row < rows; row++) {
    let col = 0
    while (col < participantCount - 1) {
      if (Math.random() > 0.5) {
        rungs.push({ row, col })
        col += 2
      } else {
        col++
      }
    }
  }

  return { cols: participantCount, rows, rungs }
}

export function tracePath(ladder: LadderData, startCol: number): number {
  let col = startCol

  for (let row = 0; row < ladder.rows; row++) {
    const hasRight = ladder.rungs.some(r => r.row === row && r.col === col)
    const hasLeft  = ladder.rungs.some(r => r.row === row && r.col === col - 1)

    if (hasRight) col += 1
    else if (hasLeft) col -= 1
  }

  return col
}
```

- [ ] **Step 4: 테스트 PASS 확인**

```bash
npx vitest run src/pages/ladderUtils.test.ts
```

- [ ] **Step 5: Ladder.tsx 구현**

```tsx
// src/pages/Ladder.tsx
import { useState } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { generateLadder, tracePath, LadderData } from './ladderUtils'
import { randomInt } from '../utils/random'
import styles from './Ladder.module.css'

type Phase = 'setup' | 'playing' | 'result'

const LADDER_HEIGHT = 320
const COL_WIDTH = 64

export function Ladder() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [ladder, setLadder] = useState<LadderData | null>(null)
  const [loser, setLoser] = useState('')
  const [animatingCol, setAnimatingCol] = useState(-1)
  const [coffeeCol, setCoffeeCol] = useState(-1)

  function startGame() {
    const newLadder = generateLadder(participants.length)
    const coffeeResult = randomInt(0, participants.length - 1)
    const resultMap = participants.map((_, i) => tracePath(newLadder, i))
    const loserIdx = resultMap.indexOf(coffeeResult)

    setLadder(newLadder)
    setCoffeeCol(coffeeResult)
    setLoser(participants[loserIdx])
    setPhase('playing')

    let col = 0
    const interval = setInterval(() => {
      setAnimatingCol(col)
      col++
      if (col >= participants.length) {
        clearInterval(interval)
        setTimeout(() => setPhase('result'), 800)
      }
    }, 700)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setLadder(null)
    setAnimatingCol(-1)
  }

  const svgWidth = ladder ? ladder.cols * COL_WIDTH + 40 : 300
  const rowGap = LADDER_HEIGHT / ((ladder?.rows ?? 8) + 1)

  return (
    <div className={styles.page}>
      <GameHeader title="사다리타기" emoji="🪜" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={startGame} disabled={!participants.length || participants.length < 2} label="사다리 시작!" />
        </div>
      )}

      {phase !== 'setup' && ladder && (
        <div className={styles.ladderWrap}>
          <div className={styles.nameRow} style={{ width: svgWidth }}>
            {participants.map((name, i) => (
              <span
                key={name}
                className={`${styles.nameTag} ${animatingCol === i ? styles.activeTag : ''}`}
                style={{ left: 20 + i * COL_WIDTH }}
              >
                {name}
              </span>
            ))}
          </div>

          <svg width={svgWidth} height={LADDER_HEIGHT} className={styles.svg}>
            {Array.from({ length: ladder.cols }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={20 + i * COL_WIDTH} y1={0}
                x2={20 + i * COL_WIDTH} y2={LADDER_HEIGHT}
                stroke={animatingCol === i ? 'var(--color-accent)' : '#333'}
                strokeWidth={animatingCol === i ? 3 : 2}
              />
            ))}
            {ladder.rungs.map((rung, idx) => (
              <line
                key={`h${idx}`}
                x1={20 + rung.col * COL_WIDTH} y1={(rung.row + 1) * rowGap}
                x2={20 + (rung.col + 1) * COL_WIDTH} y2={(rung.row + 1) * rowGap}
                stroke="#333" strokeWidth={2}
              />
            ))}
          </svg>

          <div className={styles.resultRow} style={{ width: svgWidth }}>
            {participants.map((_, i) => {
              const isCoffee = coffeeCol === tracePath(ladder, i)
              return (
                <span
                  key={i}
                  className={`${styles.resultTag} ${isCoffee ? styles.coffeeTag : styles.safeTag}`}
                  style={{ left: 20 + i * COL_WIDTH }}
                >
                  {isCoffee ? '☕' : '✓'}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
```

```css
/* src/pages/Ladder.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ladderWrap {
  overflow-x: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nameRow, .resultRow {
  position: relative;
  height: 36px;
  flex-shrink: 0;
}

.nameTag, .resultTag {
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  transition: color 0.2s;
}

.activeTag {
  color: var(--color-accent);
}

.coffeeTag {
  font-size: 20px;
}

.safeTag {
  color: #22c55e;
  font-size: 16px;
}

.svg {
  display: block;
  flex-shrink: 0;
}
```

- [ ] **Step 6: 동작 확인**

`http://localhost:5173/ladder` — 이름 2개 이상 추가 → 시작 → 사다리 애니메이션 → 결과 확인.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/Ladder.tsx src/pages/Ladder.module.css src/pages/ladderUtils.ts src/pages/ladderUtils.test.ts
git commit -m "feat: 사다리타기 게임 구현"
```

---

### Task 8: 룰렛

**Files:**
- Create: `src/pages/rouletteUtils.ts`, `src/pages/rouletteUtils.test.ts`
- Modify: `src/pages/Roulette.tsx`, Create `src/pages/Roulette.module.css`

- [ ] **Step 1: rouletteUtils 테스트 작성 (RED)**

```ts
// src/pages/rouletteUtils.test.ts
import { getWinnerIndex } from './rouletteUtils'

describe('getWinnerIndex', () => {
  it('rotation 0이면 index 0을 반환한다', () => {
    expect(getWinnerIndex(0, 4)).toBe(0)
  })

  it('rotation 360이면 rotation 0과 같다', () => {
    expect(getWinnerIndex(360, 4)).toBe(getWinnerIndex(0, 4))
  })

  it('반환값은 항상 0 이상 count 미만이다', () => {
    for (let i = 0; i < 100; i++) {
      const result = getWinnerIndex(Math.random() * 3600, 5)
      expect(result).toBeGreaterThanOrEqual(0)
      expect(result).toBeLessThan(5)
    }
  })

  it('4명일 때 rotation 90이면 index 3이다', () => {
    // sliceAngle=90, rotation=90 → (360-90)/90 = 3
    expect(getWinnerIndex(90, 4)).toBe(3)
  })
})
```

- [ ] **Step 2: 테스트 FAIL 확인**

```bash
npx vitest run src/pages/rouletteUtils.test.ts
```

- [ ] **Step 3: rouletteUtils.ts 구현**

```ts
// src/pages/rouletteUtils.ts
export const WHEEL_COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff',
  '#ff6bd6', '#ff9a3c', '#a06ef5', '#4ecdc4',
]

// 휠이 rotation만큼 시계 방향으로 돌았을 때 포인터(상단)에 위치한 슬라이스 인덱스를 반환한다.
// 슬라이스 0은 초기 상단(0도)에서 시작한다.
export function getWinnerIndex(rotation: number, count: number): number {
  const sliceAngle = 360 / count
  const normalized = ((rotation % 360) + 360) % 360
  const pointerAngle = (360 - normalized) % 360
  return Math.floor(pointerAngle / sliceAngle) % count
}

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export function slicePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg)
  const end = polarToCartesian(cx, cy, r, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return `M${cx},${cy} L${start.x},${start.y} A${r},${r} 0 ${largeArc},1 ${end.x},${end.y} Z`
}
```

- [ ] **Step 4: 테스트 PASS 확인**

```bash
npx vitest run src/pages/rouletteUtils.test.ts
```

- [ ] **Step 5: Roulette.tsx 구현**

```tsx
// src/pages/Roulette.tsx
import { useState, useRef } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { WHEEL_COLORS, slicePath, getWinnerIndex } from './rouletteUtils'
import styles from './Roulette.module.css'

type Phase = 'setup' | 'spinning' | 'result'

const CX = 150, CY = 150, R = 130

export function Roulette() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [rotation, setRotation] = useState(0)
  const [loser, setLoser] = useState('')
  const accumulatedRotation = useRef(0)

  function spin() {
    setPhase('spinning')
    const extra = 1800 + Math.random() * 1800
    accumulatedRotation.current += extra
    const finalRotation = accumulatedRotation.current
    setRotation(finalRotation)

    setTimeout(() => {
      const winnerIdx = getWinnerIndex(finalRotation % 360, participants.length)
      setLoser(participants[winnerIdx])
      setPhase('result')
    }, 4000)
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
        <div className={styles.wheelWrap}>
          <div className={styles.pointer}>▼</div>
          <svg
            width={300}
            height={300}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: phase === 'spinning' ? 'transform 4s cubic-bezier(0.17,0.67,0.12,1)' : 'none',
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
                <g key={name}>
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
          </svg>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
```

```css
/* src/pages/Roulette.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wheelWrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  gap: 0;
}

.pointer {
  font-size: 28px;
  color: var(--color-accent);
  line-height: 1;
  z-index: 1;
}
```

- [ ] **Step 6: 동작 확인**

`http://localhost:5173/roulette` — 이름 추가 → 돌리기 → 스핀 애니메이션 → 결과 확인.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/Roulette.tsx src/pages/Roulette.module.css src/pages/rouletteUtils.ts src/pages/rouletteUtils.test.ts
git commit -m "feat: 룰렛 게임 구현"
```

---

### Task 9: 랜덤 뽑기

**Files:**
- Modify: `src/pages/RandomPick.tsx`, Create `src/pages/RandomPick.module.css`

- [ ] **Step 1: RandomPick.tsx 구현**

```tsx
// src/pages/RandomPick.tsx
import { useState } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { pickRandom } from '../utils/random'
import styles from './RandomPick.module.css'

type Phase = 'setup' | 'picking' | 'result'

export function RandomPick() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [loser, setLoser] = useState('')
  const [revealedIdx, setRevealedIdx] = useState(-1)

  function pick() {
    const picked = pickRandom(participants)
    setLoser(picked)
    setPhase('picking')

    setTimeout(() => {
      setRevealedIdx(participants.indexOf(picked))
    }, 600)

    setTimeout(() => {
      setPhase('result')
    }, 2200)
  }

  function handleRetry() {
    reset()
    setPhase('setup')
    setRevealedIdx(-1)
  }

  return (
    <div className={styles.page}>
      <GameHeader title="랜덤 뽑기" emoji="🎲" />

      {phase === 'setup' && (
        <div className={styles.content}>
          <ParticipantInput
            participants={participants}
            input={input}
            onInputChange={setInput}
            onAdd={addParticipant}
            onRemove={removeParticipant}
          />
          <StartButton onClick={pick} disabled={participants.length < 2} label="뽑기!" />
        </div>
      )}

      {(phase === 'picking' || phase === 'result') && (
        <div className={styles.cards}>
          {participants.map((name, i) => (
            <div key={name} className={`${styles.card} ${revealedIdx === i ? styles.flipped : ''}`}>
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>?</div>
                <div className={styles.cardBack}>{name}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
```

```css
/* src/pages/RandomPick.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px 16px;
  justify-content: center;
}

.card {
  width: 80px;
  height: 110px;
  perspective: 600px;
}

.cardInner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}

.card.flipped .cardInner {
  transform: rotateY(180deg);
}

.cardFront, .cardBack {
  position: absolute;
  inset: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.cardFront {
  background: var(--color-icon-box);
  color: white;
  font-size: 28px;
}

.cardBack {
  background: var(--color-accent);
  color: white;
  font-size: 13px;
  transform: rotateY(180deg);
  padding: 8px;
  text-align: center;
  word-break: break-all;
}
```

- [ ] **Step 2: 동작 확인**

`http://localhost:5173/random-pick` — 이름 추가 → 뽑기 → 카드 뒤집기 → 결과 확인.

- [ ] **Step 3: 커밋**

```bash
git add src/pages/RandomPick.tsx src/pages/RandomPick.module.css
git commit -m "feat: 랜덤 뽑기 게임 구현"
```

---

### Task 10: 숫자 업다운

**Files:**
- Create: `src/pages/numberGameUtils.ts`, `src/pages/numberGameUtils.test.ts`
- Modify: `src/pages/NumberGame.tsx`, Create `src/pages/NumberGame.module.css`

- [ ] **Step 1: numberGameUtils 테스트 작성 (RED)**

```ts
// src/pages/numberGameUtils.test.ts
import { findLoser } from './numberGameUtils'

describe('findLoser', () => {
  it('정답에 가장 가까운 사람을 반환한다', () => {
    const choices = [{ name: '민수', number: 30 }, { name: '지수', number: 70 }]
    expect(findLoser(choices, 40)).toEqual(['민수'])
    expect(findLoser(choices, 60)).toEqual(['지수'])
  })

  it('동점 시 여러 명을 반환한다', () => {
    const choices = [{ name: '민수', number: 40 }, { name: '지수', number: 60 }]
    const result = findLoser(choices, 50)
    expect(result).toHaveLength(2)
    expect(result).toContain('민수')
    expect(result).toContain('지수')
  })

  it('정답과 정확히 일치하면 그 사람이 패자다', () => {
    const choices = [{ name: '민수', number: 50 }, { name: '지수', number: 80 }]
    expect(findLoser(choices, 50)).toEqual(['민수'])
  })
})
```

- [ ] **Step 2: 테스트 FAIL 확인**

```bash
npx vitest run src/pages/numberGameUtils.test.ts
```

- [ ] **Step 3: numberGameUtils.ts 구현**

```ts
// src/pages/numberGameUtils.ts
export interface NumberChoice {
  name: string
  number: number
}

export function findLoser(choices: NumberChoice[], target: number): string[] {
  const minDist = Math.min(...choices.map(c => Math.abs(c.number - target)))
  return choices.filter(c => Math.abs(c.number - target) === minDist).map(c => c.name)
}
```

- [ ] **Step 4: 테스트 PASS 확인**

```bash
npx vitest run src/pages/numberGameUtils.test.ts
```

- [ ] **Step 5: NumberGame.tsx 구현**

```tsx
// src/pages/NumberGame.tsx
import { useState } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { randomInt } from '../utils/random'
import { NumberChoice, findLoser } from './numberGameUtils'
import styles from './NumberGame.module.css'

type Phase = 'setup' | 'choosing' | 'reveal' | 'result'

export function NumberGame() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [choices, setChoices] = useState<NumberChoice[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [numberInput, setNumberInput] = useState('')
  const [target, setTarget] = useState(0)
  const [loser, setLoser] = useState<string[]>([])

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
      setTimeout(() => setPhase('result'), 3000)
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
            {choices.map(c => (
              <div
                key={c.name}
                className={`${styles.choiceRow} ${loser.includes(c.name) ? styles.loserRow : ''}`}
              >
                <span className={styles.choiceName}>{c.name}</span>
                <span className={styles.choiceNum}>{c.number}</span>
                <span className={styles.choiceDiff}>±{Math.abs(c.number - target)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <ResultScreen loser={loser.length === 1 ? loser[0] : loser} onRetry={handleRetry} />
      )}
    </div>
  )
}
```

```css
/* src/pages/NumberGame.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.promptCard {
  background: var(--color-card);
  border-radius: var(--border-radius-card);
  padding: 28px 20px;
  box-shadow: 0 1px 3px var(--color-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
}

.promptName {
  font-size: 26px;
  font-weight: 900;
  color: var(--color-accent);
}

.promptHint {
  font-size: 14px;
  color: #333;
}

.promptWarn {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.numberInput {
  margin-top: 14px;
  width: 130px;
  text-align: center;
  border: 3px solid var(--color-icon-box);
  border-radius: 10px;
  padding: 12px;
  font-size: 32px;
  font-weight: 900;
  font-family: var(--font-family);
  outline: none;
}

.numberInput:focus {
  border-color: var(--color-accent);
}

.reveal {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.targetBox {
  background: var(--color-icon-box);
  color: white;
  border-radius: var(--border-radius-card);
  padding: 16px;
  text-align: center;
}

.targetLabel {
  font-size: 13px;
  font-weight: 600;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.targetNum {
  font-size: 52px;
  font-weight: 900;
  color: var(--color-accent);
  margin-top: 4px;
}

.choiceList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choiceRow {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--color-card);
  border-radius: var(--border-radius-card);
  padding: 12px 16px;
  box-shadow: 0 1px 3px var(--color-shadow);
  border: 2px solid transparent;
}

.loserRow {
  border-color: var(--color-accent);
  background: #fff5f5;
}

.choiceName { flex: 1; font-weight: 700; }
.choiceNum  { font-size: 22px; font-weight: 900; }
.choiceDiff { font-size: 12px; color: var(--color-text-secondary); min-width: 32px; text-align: right; }
```

- [ ] **Step 6: 동작 확인**

`http://localhost:5173/number-game` — 이름 추가 → 각자 숫자 입력 → 공개 → 결과 확인.

- [ ] **Step 7: 커밋**

```bash
git add src/pages/NumberGame.tsx src/pages/NumberGame.module.css src/pages/numberGameUtils.ts src/pages/numberGameUtils.test.ts
git commit -m "feat: 숫자 업다운 게임 구현"
```

---

### Task 11: 주사위

**Files:**
- Create: `src/pages/diceUtils.ts`, `src/pages/diceUtils.test.ts`
- Modify: `src/pages/Dice.tsx`, Create `src/pages/Dice.module.css`

- [ ] **Step 1: diceUtils 테스트 작성 (RED)**

```ts
// src/pages/diceUtils.test.ts
import { rollDice, findLoser } from './diceUtils'

describe('rollDice', () => {
  it('참가자마다 1~6 사이 정수를 할당한다', () => {
    const results = rollDice(['민수', '지수', '철수'])
    expect(results).toHaveLength(3)
    results.forEach(r => {
      expect(r.value).toBeGreaterThanOrEqual(1)
      expect(r.value).toBeLessThanOrEqual(6)
      expect(Number.isInteger(r.value)).toBe(true)
    })
  })

  it('이름을 그대로 유지한다', () => {
    const names = ['민수', '지수']
    expect(rollDice(names).map(r => r.name)).toEqual(names)
  })
})

describe('findLoser', () => {
  it('가장 낮은 숫자의 참가자를 반환한다', () => {
    const results = [{ name: '민수', value: 3 }, { name: '지수', value: 5 }, { name: '철수', value: 1 }]
    expect(findLoser(results)).toEqual(['철수'])
  })

  it('동점 시 여러 명을 반환한다', () => {
    const results = [{ name: '민수', value: 2 }, { name: '지수', value: 2 }, { name: '철수', value: 5 }]
    const loser = findLoser(results)
    expect(loser).toHaveLength(2)
    expect(loser).toContain('민수')
    expect(loser).toContain('지수')
  })
})
```

- [ ] **Step 2: 테스트 FAIL 확인**

```bash
npx vitest run src/pages/diceUtils.test.ts
```

- [ ] **Step 3: diceUtils.ts 구현**

```ts
// src/pages/diceUtils.ts
export interface DiceResult {
  name: string
  value: number
}

export function rollDice(participants: string[]): DiceResult[] {
  return participants.map(name => ({
    name,
    value: Math.floor(Math.random() * 6) + 1,
  }))
}

export function findLoser(results: DiceResult[]): string[] {
  const minValue = Math.min(...results.map(r => r.value))
  return results.filter(r => r.value === minValue).map(r => r.name)
}
```

- [ ] **Step 4: 테스트 PASS 확인**

```bash
npx vitest run src/pages/diceUtils.test.ts
```

- [ ] **Step 5: Dice.tsx 구현**

```tsx
// src/pages/Dice.tsx
import { useState } from 'react'
import { GameHeader } from '../components/GameHeader'
import { ParticipantInput } from '../components/ParticipantInput'
import { StartButton } from '../components/StartButton'
import { ResultScreen } from '../components/ResultScreen'
import { useParticipants } from '../hooks/useParticipants'
import { rollDice, findLoser, DiceResult } from './diceUtils'
import styles from './Dice.module.css'

type Phase = 'setup' | 'rolling' | 'result'

const DICE_FACES: Record<number, string> = {
  1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅',
}

export function Dice() {
  const { participants, input, setInput, addParticipant, removeParticipant, reset } = useParticipants()
  const [phase, setPhase] = useState<Phase>('setup')
  const [results, setResults] = useState<DiceResult[]>([])
  const [loser, setLoser] = useState<string[]>([])

  function rollAll() {
    setPhase('rolling')
    setTimeout(() => {
      const rolled = rollDice(participants)
      setResults(rolled)
      setLoser(findLoser(rolled))
      setTimeout(() => setPhase('result'), 1000)
    }, 1500)
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
                  {isRolling ? '🎲' : DICE_FACES[result!.value]}
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
```

```css
/* src/pages/Dice.module.css */
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.diceGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  padding: 20px 16px;
}

.diceCard {
  background: var(--color-card);
  border-radius: var(--border-radius-card);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 3px var(--color-shadow);
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.loserCard {
  border-color: var(--color-accent);
  background: #fff5f5;
}

.diceFace {
  font-size: 42px;
  line-height: 1;
}

.shaking {
  animation: shake 0.25s infinite;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25%       { transform: rotate(-12deg); }
  75%       { transform: rotate(12deg); }
}

.diceName  { font-size: 13px; font-weight: 700; }
.diceValue { font-size: 12px; color: var(--color-text-secondary); }
```

- [ ] **Step 6: 동작 확인**

`http://localhost:5173/dice` — 이름 추가 → 굴리기 → 주사위 흔들림 애니메이션 → 결과 확인.

- [ ] **Step 7: 전체 테스트 실행**

```bash
npx vitest run
```

Expected: 전체 PASS (utils 3, useParticipants 6, ResultScreen 3, ladderUtils 4, rouletteUtils 4, numberGameUtils 3, diceUtils 4 = 27개 이상)

- [ ] **Step 8: 최종 커밋**

```bash
git add src/pages/Dice.tsx src/pages/Dice.module.css src/pages/diceUtils.ts src/pages/diceUtils.test.ts
git commit -m "feat: 주사위 게임 구현"
git add -A
git commit -m "chore: 최종 정리 및 빌드 확인"
```

```bash
npm run build
```

Expected: `dist/` 생성, 에러 없음.
