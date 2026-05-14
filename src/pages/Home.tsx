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
          <button key={game.path} className={styles.gameCard} onClick={() => navigate(game.path)} aria-label={`${game.title} 게임으로 이동`}>
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
