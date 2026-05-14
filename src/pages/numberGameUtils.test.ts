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
