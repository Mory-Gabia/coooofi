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
