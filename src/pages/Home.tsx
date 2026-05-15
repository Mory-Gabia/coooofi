import { useNavigate } from 'react-router-dom'
import styles from './Home.module.css'

const GAMES = [
  { path: '/ladder',      emoji: '🪜', title: '사다리타기',  desc: '선을 따라 운명 결정',     accent: 'plum'  as const, time: '15초' },
  { path: '/roulette',    emoji: '🎡', title: '룰렛',        desc: '빙글빙글 돌려보자',        accent: 'coral' as const, time: '8초'  },
  { path: '/random-pick', emoji: '🎴', title: '랜덤 뽑기',   desc: '카드 한 장씩 뒤집어보자',   accent: 'gold'  as const, time: '5초'  },
  { path: '/number-game', emoji: '🔢', title: '숫자 업다운', desc: '정답에 가까운 사람이 짐',  accent: 'mint'  as const, time: '60초' },
  { path: '/dice',        emoji: '🎲', title: '주사위',      desc: '최저 숫자가 커피 쏘기',     accent: 'blue'  as const, time: '10초' },
]

const ACCENT_TOKEN: Record<typeof GAMES[number]['accent'], string> = {
  plum:  'var(--color-plum)',
  coral: 'var(--color-coral)',
  gold:  'var(--color-gold)',
  mint:  'var(--color-mint)',
  blue:  'var(--color-blue)',
}

export function Home() {
  const navigate = useNavigate()
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.brandRow}
          onClick={() => navigate('/')}
          aria-label="랜딩 페이지로"
        >
          <span className={styles.brandMark} aria-hidden="true">☕</span>
          <span className={styles.brandWord}>커피 내기</span>
        </button>
        <h1 className={styles.title}>오늘 누가 쏠래?</h1>
        <p className={styles.subtitle}>
          5가지 미니게임으로 부담 없이 결정하세요. 가입도, 결제도 없어요.
        </p>
        <div className={styles.statRow}>
          <span className={styles.stat}><strong>5</strong> 게임</span>
          <span className={styles.statDot} />
          <span className={styles.stat}><strong>2–12</strong> 명</span>
          <span className={styles.statDot} />
          <span className={styles.stat}><strong>~10초</strong> 평균</span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>게임 고르기</h2>
          <span className={styles.sectionHint}>아무거나 골라도 결과는 공평해요</span>
        </div>

        <div className={styles.grid}>
          {GAMES.map(game => (
            <button
              key={game.path}
              className={styles.gameCard}
              onClick={() => navigate(game.path)}
              aria-label={`${game.title} 게임으로 이동`}
              style={{ ['--card-accent' as string]: ACCENT_TOKEN[game.accent] }}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBox} aria-hidden="true">{game.emoji}</div>
                <span className={styles.timeChip}>~{game.time}</span>
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardTitle}>{game.title}</span>
                <span className={styles.cardDesc}>{game.desc}</span>
              </div>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <footer className={styles.footer}>
          <p>한 잔의 커피, 즐거운 결정.</p>
        </footer>
      </main>
    </div>
  )
}
