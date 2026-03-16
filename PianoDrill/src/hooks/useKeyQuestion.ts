import { KEY_SIGNATURES, pickRandom } from '../data/music'
import type { KeySignature } from '../types/music'
import { useState, useCallback, useEffect } from 'react'

export type KeyModeTarget = 'major' | 'minor' | 'both'

interface AnswerState {
  correct: boolean
  selected: string
}

function newQuestion(): KeySignature {
  return pickRandom(KEY_SIGNATURES)
}

function pickAskMinor(target: KeyModeTarget): boolean {
  return target === 'both' ? Math.random() < 0.5 : target === 'minor'
}

export function useKeyQuestion(target: KeyModeTarget = 'major') {
  const [question, setQuestion] = useState<KeySignature>(newQuestion)
  const [askMinor, setAskMinor] = useState<boolean>(() => pickAskMinor(target))
  const [answer, setAnswer] = useState<AnswerState | null>(null)

  // target が変わったら問題をリセット
  useEffect(() => {
    setQuestion(newQuestion())
    setAskMinor(pickAskMinor(target))
    setAnswer(null)
  }, [target])

  const correctKey = askMinor ? question.minorKey : question.majorKey

  const checkAnswer = useCallback((key: string) => {
    setAnswer({ correct: key === correctKey, selected: key })
  }, [correctKey])

  const nextQuestion = useCallback(() => {
    setQuestion(newQuestion())
    setAskMinor(pickAskMinor(target))
    setAnswer(null)
  }, [target])

  return { question, correctKey, askMinor, answer, checkAnswer, nextQuestion }
}
