import { KEY_SIGNATURES, pickRandom } from '../data/music'
import type { KeySignature } from '../types/music'
import { useState, useCallback } from 'react'

interface AnswerState {
  correct: boolean
  selected: string
}

export function useKeyQuestion() {
  const [question, setQuestion] = useState<KeySignature>(() => pickRandom(KEY_SIGNATURES))
  const [answer, setAnswer] = useState<AnswerState | null>(null)

  const checkAnswer = useCallback((key: string) => {
    const correct = key === question.majorKey
    setAnswer({ correct, selected: key })
  }, [question])

  const nextQuestion = useCallback(() => {
    setQuestion(pickRandom(KEY_SIGNATURES))
    setAnswer(null)
  }, [])

  return { question, answer, checkAnswer, nextQuestion }
}
