import { useState, useCallback } from 'react'

export interface ScoreState {
  total: number
  correct: number
  streak: number
  bestStreak: number
}

const initialScore: ScoreState = { total: 0, correct: 0, streak: 0, bestStreak: 0 }

export function useScore() {
  const [score, setScore] = useState<ScoreState>(initialScore)

  const recordAnswer = useCallback((isCorrect: boolean) => {
    setScore(prev => {
      const streak = isCorrect ? prev.streak + 1 : 0
      return {
        total: prev.total + 1,
        correct: isCorrect ? prev.correct + 1 : prev.correct,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
      }
    })
  }, [])

  const reset = useCallback(() => setScore(initialScore), [])

  const accuracy = score.total === 0 ? null : Math.round((score.correct / score.total) * 100)

  return { score, accuracy, recordAnswer, reset }
}
