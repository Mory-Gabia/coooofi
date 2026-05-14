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
