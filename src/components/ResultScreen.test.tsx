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
