import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Landing.module.css'

const GAMES = [
  {
    id: 'ladder',
    path: '/ladder',
    title: '사다리타기',
    desc: '선을 따라 운명을 결정. 조용하지만 결과가 나올 때까지 모두가 보게 됩니다.',
    coverClass: styles.coverLadder,
    deco: <div className={styles.decoLadder} />,
    icon: (
      <svg className={styles.coverIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
        <path d="M16 8v48M48 8v48" />
        <path d="M16 20h32M16 32h32M16 44h32" strokeWidth={2.4} strokeDasharray="6 4" />
        <circle cx={22} cy={52} r={3} fill="currentColor" />
        <circle cx={42} cy={52} r={3} fill="currentColor" />
      </svg>
    ),
    tags: ['2~8명', '~15초', '고전'],
    dotVar: 'var(--color-plum)',
    badge: null as string | null,
  },
  {
    id: 'roulette',
    path: '/roulette',
    title: '룰렛',
    desc: '빙글빙글 돌리고 화살표가 가리키는 곳. 가장 시각적이고 가장 시끄러운 결과.',
    coverClass: styles.coverRoulette,
    deco: <div className={styles.decoWheel} />,
    icon: (
      <svg className={styles.coverIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3}>
        <circle cx={32} cy={32} r={22} />
        <circle cx={32} cy={32} r={4} fill="currentColor" />
        <path d="M32 10v44M10 32h44M16 16l32 32M48 16L16 48" strokeWidth={1.5} />
      </svg>
    ),
    tags: ['2~12명', '~25초', '파티용'],
    dotVar: 'var(--color-coral)',
    badge: '인기',
  },
  {
    id: 'random-pick',
    path: '/random-pick',
    title: '랜덤 뽑기',
    desc: '이름을 봉투에 넣고 하나만 뽑기. 빠르고, 깔끔하고, 변명의 여지가 없습니다.',
    coverClass: styles.coverRandom,
    deco: <div className={styles.decoDots} />,
    icon: (
      <svg className={styles.coverIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 22h36l-4 28a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" />
        <path d="M24 22V14a8 8 0 0 1 16 0v8" />
      </svg>
    ),
    tags: ['2~20명', '~10초', '빠름'],
    dotVar: 'var(--color-gold)',
    badge: null,
  },
  {
    id: 'number-game',
    path: '/number-game',
    title: '숫자 업다운',
    desc: '1~100 사이 정답에 가장 가까운 사람이 살아남는 추리 게임. 약간의 두뇌 플레이.',
    coverClass: styles.coverNumber,
    deco: null,
    icon: (
      <svg className={styles.coverIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 24L32 14l16 10" />
        <path d="M16 40l16 10 16-10" />
        <text x={32} y={36} textAnchor="middle" fontSize={16} fontWeight={800} fill="currentColor" stroke="none" fontFamily="-apple-system,system-ui">?</text>
      </svg>
    ),
    tags: ['2~6명', '~45초', '두뇌'],
    dotVar: 'var(--color-mint)',
    badge: null,
  },
  {
    id: 'dice',
    path: '/dice',
    title: '주사위',
    desc: '각자 하나씩 굴리고 가장 낮은 숫자가 쏘는 사람. 짧고 굵게 결정합니다.',
    coverClass: styles.coverDice,
    deco: null,
    icon: (
      <svg className={styles.coverIcon} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={3} strokeLinejoin="round">
        <rect x={10} y={10} width={44} height={44} rx={10} />
        <circle cx={22} cy={22} r={3} fill="currentColor" />
        <circle cx={42} cy={22} r={3} fill="currentColor" />
        <circle cx={32} cy={32} r={3} fill="currentColor" />
        <circle cx={22} cy={42} r={3} fill="currentColor" />
        <circle cx={42} cy={42} r={3} fill="currentColor" />
      </svg>
    ),
    tags: ['2~10명', '~12초', '스피드'],
    dotVar: 'var(--color-blue)',
    badge: null,
  },
] as const

const FAQS = [
  {
    q: '정말 무료인가요? 광고도 없나요?',
    a: '네. 가입·결제·광고 모두 없습니다. 브라우저에서 바로 동작하고, 결과는 기기 내부 저장소(localStorage)에만 남아요.',
    open: true,
  },
  {
    q: '참가자 명단은 저장되나요?',
    a: '최근 사용한 멤버 이름은 기기 내에 캐싱되어 다음에도 한 번에 불러올 수 있어요. 서버에는 어떤 정보도 전송되지 않습니다.',
  },
  {
    q: '모바일에서도 잘 되나요?',
    a: '처음부터 모바일 우선으로 만들었습니다. 한 명이 폰을 들고 있어도, 화면을 같이 보며 굴려도 됩니다.',
  },
  {
    q: '누가 사기 싫다고 우길 때는요?',
    a: '결과 화면에 "다시 굴리기"가 있습니다. 단, 다음 라운드도 결과가 같으면 깔끔하게 받아들이는 게 룰이에요.',
  },
] as const

export function Landing() {
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goLobby = () => navigate('/lobby')

  return (
    <div className={styles.page}>
      <nav ref={navRef} className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`${styles.wrap} ${styles.navInner}`}>
          <button type="button" className={styles.brand} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={styles.brandLogo} aria-hidden="true">☕</span>
            <span>커피 내기</span>
          </button>
          <div className={styles.navLinks}>
            <a href="#games">게임</a>
            <a href="#how">사용법</a>
            <a href="#faq">FAQ</a>
            <a onClick={goLobby}>로비</a>
          </div>
          <button type="button" className={styles.navCta} onClick={goLobby}>
            지금 시작
            <svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7h8M7 3l4 4-4 4" />
            </svg>
          </button>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <span className={styles.kicker}>
              <span className={styles.kickerDot} />
              v1.2 · 다섯 가지 미니게임 · 가입 없이 바로
            </span>
            <h1 className={styles.heroTitle}>
              커피값,<br />
              <span className={styles.heroStrike}>가위바위보</span><br />
              말고 <span className={styles.heroAccent}>게임</span>으로.
            </h1>
            <p className={styles.heroLead}>
              친구·동료끼리 30초 만에 끝나는 다섯 가지 결정 방식.
              주사위·룰렛·사다리·랜덤뽑기·숫자 업다운 — 누가 사는지 미리 정해두지 마세요.
            </p>
            <div className={styles.heroCtas}>
              <button type="button" className={styles.btnPrimary} onClick={goLobby}>
                한 판 돌리기
                <svg className={styles.btnPrimaryArrow} width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M8 3l5 5-5 5" />
                </svg>
              </button>
              <a href="#games" className={styles.btnGhost}>게임 둘러보기</a>
            </div>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaCheck}>
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                가입 없음
              </span>
              <span className={styles.heroMetaSep} />
              <span className={styles.heroMetaCheck}>
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                설치 불필요
              </span>
              <span className={styles.heroMetaSep} />
              <span className={styles.heroMetaCheck}>
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8.5l3 3 7-7" />
                </svg>
                광고 없음
              </span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.scene}>
              <div className={styles.phone}>
                <div className={styles.phoneScreen}>
                  <div className={styles.phoneBar}>
                    <span>9:41</span>
                    <span className={styles.phoneBarDots}>
                      <span /><span /><span />
                    </span>
                  </div>
                  <div>
                    <div className={styles.phoneTitle}>
                      오늘은 누가 살까?
                      <small className={styles.phoneTitleSub}>참여자 4명 · 평균 22초 소요</small>
                    </div>
                  </div>
                  <div className={styles.phoneGames}>
                    <div className={styles.phoneGame}>
                      <span className={styles.phoneGameSwatch} style={{ background: 'color-mix(in oklab, var(--color-plum), white 86%)', color: 'var(--color-plum)' }}>🪜</span>
                      <span>사다리타기</span>
                      <span className={styles.phoneGameArrow}>›</span>
                    </div>
                    <div className={styles.phoneGame}>
                      <span className={styles.phoneGameSwatch} style={{ background: 'var(--color-coral-soft)', color: 'var(--color-coral)' }}>🎡</span>
                      <span>룰렛</span>
                      <span className={styles.phoneGameArrow}>›</span>
                    </div>
                    <div className={styles.phoneGame}>
                      <span className={styles.phoneGameSwatch} style={{ background: 'color-mix(in oklab, var(--color-gold), white 86%)', color: 'oklch(48% 0.14 75)' }}>🎁</span>
                      <span>랜덤뽑기</span>
                      <span className={styles.phoneGameArrow}>›</span>
                    </div>
                    <div className={styles.phoneGame}>
                      <span className={styles.phoneGameSwatch} style={{ background: 'color-mix(in oklab, var(--color-blue), white 86%)', color: 'var(--color-blue)' }}>🎲</span>
                      <span>주사위</span>
                      <span className={styles.phoneGameArrow}>›</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.token} ${styles.token1}`}>
                <span className={styles.token1Face}>🎲</span>
                <span>지금 굴려</span>
              </div>
              <div className={`${styles.token} ${styles.token2}`}>
                <span style={{ fontSize: 22 }}>☕</span>
                <span>= 4,500원</span>
              </div>
              <div className={`${styles.token} ${styles.token3}`}>
                <div className={styles.token3Avatars}>
                  <span>JM</span><span>SU</span><span>HY</span><span>KW</span>
                </div>
                <span>4명 대기 중</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`${styles.wrap} ${styles.strip}`}>
        <div className={styles.stripLabel}>한 판 평균</div>
        <div className={styles.stripRow}>
          <div className={styles.stripItem}>
            <div className={styles.stripNum}>22<span className={styles.stripUnit}>초</span></div>
            <div className={styles.stripLbl}>결정까지 걸린 시간</div>
          </div>
          <div className={styles.stripItem}>
            <div className={styles.stripNum}>5</div>
            <div className={styles.stripLbl}>선택 가능한 미니게임</div>
          </div>
          <div className={styles.stripItem}>
            <div className={styles.stripNum}>2~12<span className={styles.stripUnit}>명</span></div>
            <div className={styles.stripLbl}>참가 인원 (게임별)</div>
          </div>
          <div className={styles.stripItem}>
            <div className={styles.stripNum}>0<span className={styles.stripUnit}>원</span></div>
            <div className={styles.stripLbl}>사용료 / 가입비</div>
          </div>
        </div>
      </div>

      <section id="games" className={`${styles.section} ${styles.sectionCanvas}`}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Games</span>
            <h2 className={styles.sectionTitle}>분위기 따라 골라보세요</h2>
            <p className={styles.sectionLead}>같은 결과를 다섯 가지 방식으로. 사다리는 조용히, 룰렛은 시끌벅적하게, 주사위는 쿨하게.</p>
          </div>

          <div className={styles.games}>
            {GAMES.map(game => (
              <button
                key={game.id}
                type="button"
                className={styles.gameCard}
                onClick={() => navigate(game.path)}
                aria-label={`${game.title} 게임으로 이동`}
              >
                {game.badge && <span className={styles.badgePick}>{game.badge}</span>}
                <div className={`${styles.gameCover} ${game.coverClass}`}>
                  {game.deco}
                  {game.icon}
                </div>
                <div className={styles.gameBody}>
                  <h3>{game.title}</h3>
                  <p>{game.desc}</p>
                  <div className={styles.tags}>
                    <span className={styles.tag}>
                      <span className={styles.tagDot} style={{ background: game.dotVar }} />
                      {game.tags[0]}
                    </span>
                    <span className={styles.tag}>{game.tags[1]}</span>
                    <span className={styles.tag}>{game.tags[2]}</span>
                  </div>
                </div>
              </button>
            ))}

            <button
              type="button"
              className={`${styles.gameCard} ${styles.gameCardDark}`}
              onClick={goLobby}
              aria-label="전체 게임 보기 — 로비 열기"
            >
              <div className={styles.gameCover} style={{ background: 'var(--color-text-primary)', aspectRatio: '16 / 11' }}>
                <svg viewBox="0 0 200 130" width={180} height={116} fill="none" style={{ position: 'relative', zIndex: 1 }}>
                  <rect x={14} y={22} width={52} height={80} rx={10} fill="oklch(54% 0.15 320)" opacity={0.92} />
                  <rect x={74} y={32} width={52} height={68} rx={10} fill="oklch(64% 0.13 175)" opacity={0.92} />
                  <rect x={134} y={22} width={52} height={80} rx={10} fill="oklch(70% 0.17 25)" opacity={0.92} />
                  <text x={40} y={68} textAnchor="middle" fontSize={22} fontFamily="-apple-system,system-ui">🪜</text>
                  <text x={100} y={73} textAnchor="middle" fontSize={22} fontFamily="-apple-system,system-ui">🔢</text>
                  <text x={160} y={68} textAnchor="middle" fontSize={22} fontFamily="-apple-system,system-ui">🎡</text>
                </svg>
              </div>
              <div className={styles.gameBody}>
                <h3>전체 게임 보기</h3>
                <p>로비에서 게임을 골라 바로 시작. 참가자 입력은 한 번만 하면 됩니다.</p>
                <div className={styles.tags} style={{ marginTop: 12 }}>
                  <span className={styles.tag}>로비 열기 →</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      <section id="how" className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>사용법</span>
            <h2 className={styles.sectionTitle}>30초면 결정 끝</h2>
            <p className={styles.sectionLead}>가입도 카드 등록도 없습니다. 브라우저 열고 — 이름 넣고 — 결과 확인. 그게 전부예요.</p>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h4>참가자 이름 추가</h4>
              <p>같이 있는 사람 이름을 한 명씩 입력. 2명부터, 게임마다 최대 인원이 달라요.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h4>오늘의 게임 선택</h4>
              <p>분위기에 맞춰 다섯 가지 중 하나. 룰렛은 시끌벅적, 사다리는 조용히, 주사위는 빠르게.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h4>결과 확인 → 출발</h4>
              <p>당첨된 사람이 카운터 앞에서 카드를 꺼낼 시간. 못 받겠으면 한 번 더 굴려도 됩니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionCanvas}`}>
        <div className={`${styles.wrap} ${styles.previewBlock}`}>
          <div className={styles.previewCopy}>
            <span className={styles.eyebrow}>결과 화면</span>
            <h2>당첨자가 또렷하게.</h2>
            <p>운에 맡긴 결과지만, 누가 사는지는 모두에게 분명해야 합니다. 결과 화면은 점수, 등수, 그리고 오늘의 주인공을 한눈에 보여줍니다.</p>
            <ul className={styles.features}>
              <li>
                <span className={styles.checkIcon}>
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.5l2.5 2.5L10 3.5" />
                  </svg>
                </span>
                <div>
                  <h5>점수와 등수가 같이</h5>
                  <p>왜 그 사람이 걸렸는지 숫자로 보입니다. 핑계 못 댑니다.</p>
                </div>
              </li>
              <li>
                <span className={styles.checkIcon}>
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.5l2.5 2.5L10 3.5" />
                  </svg>
                </span>
                <div>
                  <h5>동점이면 자동 재대결</h5>
                  <p>최저점이 둘 이상이면 그 사람들끼리만 한 번 더 굴립니다.</p>
                </div>
              </li>
              <li>
                <span className={styles.checkIcon}>
                  <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6.5l2.5 2.5L10 3.5" />
                  </svg>
                </span>
                <div>
                  <h5>리매치 한 번 더</h5>
                  <p>결과 못 받겠다 싶으면 같은 멤버 그대로 다른 게임으로 복수전.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.resultMock}>
            <div className={styles.confetti} aria-hidden="true">
              <span /><span /><span /><span /><span /><span />
            </div>
            <div className={styles.miniBar}>주사위 · 4명 · 종료</div>
            <div className={styles.winnerLine}>
              오늘은 <span className={styles.winnerName}>정민</span>이<br />사는 날!
            </div>
            <svg className={styles.coffeeIll} viewBox="0 0 96 96" fill="none">
              <path d="M22 32h44v34a14 14 0 0 1-14 14H36a14 14 0 0 1-14-14V32z" fill="oklch(70% 0.05 60)" />
              <path d="M66 38h6a8 8 0 0 1 0 16h-6" stroke="oklch(45% 0.06 60)" strokeWidth={3} fill="none" strokeLinecap="round" />
              <ellipse cx={44} cy={32} rx={22} ry={4} fill="oklch(28% 0.04 50)" />
              <path d="M38 20c0-3 4-3 4-6s-4-3-4-6M48 20c0-3 4-3 4-6s-4-3-4-6" stroke="oklch(70% 0.04 60)" strokeWidth={2.4} strokeLinecap="round" fill="none" />
            </svg>
            <div className={styles.breakdown}>
              <div className={`${styles.breakdownItem} ${styles.loser}`}>
                <div className={styles.breakdownAvatar} style={{ background: 'var(--color-coral)' }}>JM</div>
                <div className={styles.breakdownScore}>1점</div>
                <div className={styles.breakdownWho}>정민</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownAvatar} style={{ background: 'var(--color-mint)' }}>SU</div>
                <div className={styles.breakdownScore}>3점</div>
                <div className={styles.breakdownWho}>수아</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownAvatar} style={{ background: 'var(--color-gold)', color: 'var(--color-text-primary)' }}>HY</div>
                <div className={styles.breakdownScore}>4점</div>
                <div className={styles.breakdownWho}>현영</div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownAvatar} style={{ background: 'var(--color-plum)' }}>KW</div>
                <div className={styles.breakdownScore}>6점</div>
                <div className={styles.breakdownWho}>권모</div>
              </div>
            </div>
            <div className={styles.retryRow}>
              <button type="button" className={styles.pillBtn}>다시 굴리기</button>
              <button type="button" className={`${styles.pillBtn} ${styles.pillBtnPrimary}`}>다음 라운드 →</button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>FAQ</span>
            <h2 className={styles.sectionTitle}>자주 묻는 것</h2>
            <p className={styles.sectionLead}>가입 없이 결과를 어떻게 저장하는지부터, 진짜 무료인지까지.</p>
          </div>

          <div className={styles.faqGrid}>
            {FAQS.map((faq, i) => (
              <details key={i} className={styles.faq} open={'open' in faq && faq.open}>
                <summary className={styles.faqSummary}>
                  {faq.q}
                  <span className={styles.faqIcon}>+</span>
                </summary>
                <div className={styles.faqAns}>{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.finalCta}>
            <div className={styles.finalCtaInner}>
              <h2>한 명 정해야 되죠?</h2>
              <p>가입 없이, 30초 안에 끝납니다. 게임 골라서 굴리면 오늘의 주인공이 정해집니다.</p>
              <div className={styles.heroCtas} style={{ justifyContent: 'center' }}>
                <button type="button" className={`${styles.btnPrimary} ${styles.btnLight}`} onClick={goLobby}>
                  로비 열기
                  <svg className={styles.btnPrimaryArrow} width={16} height={16} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M8 3l5 5-5 5" />
                  </svg>
                </button>
                <button type="button" className={`${styles.btnGhost} ${styles.btnOutlineLight}`} onClick={() => navigate('/dice')}>
                  주사위로 바로 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footGrid}`}>
          <div>
            <div className={styles.footBrand}>
              <span className={styles.brandLogo} aria-hidden="true">☕</span>
              커피 내기
            </div>
            <div className={styles.footTagline}>© 2026 · 누가 살지 정하는 가장 쉬운 방법.</div>
          </div>
          <nav className={styles.footLinks}>
            <button type="button" onClick={goLobby}>로비</button>
            <a href="#games">게임</a>
            <a href="#faq">FAQ</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
