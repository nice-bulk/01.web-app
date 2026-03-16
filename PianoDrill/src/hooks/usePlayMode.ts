import { useState, useEffect, useRef, useCallback } from 'react'
import type { Song, SongNote, Judgment } from '../types/music'

export interface ActiveNote extends SongNote {
  id: number
  hitTime: number    // ms: このノートが判定ラインに到達するまでの時間（開始からの相対ms）
  judgment: Judgment
  hit: boolean
}

export type GamePhase = 'idle' | 'countdown' | 'playing' | 'finished'

export const PERFECT_MS  = 100
export const GOOD_MS     = 220
export const BEAT_PX     = 120   // 1拍 = 何px
export const JUDGE_LINE_X = 160  // 判定ラインのx座標

export function usePlayMode(song: Song, bpmOverride?: number) {
  const [phase, setPhase]         = useState<GamePhase>('idle')
  const [countdown, setCountdown] = useState(3)
  const [notes, setNotes]         = useState<ActiveNote[]>([])
  const [scrollX, setScrollX]     = useState(0)   // elapsed ms
  const [combo, setCombo]         = useState(0)
  const [results, setResults]     = useState({ perfect: 0, good: 0, miss: 0 })

  const startTimeRef = useRef<number>(0)
  const rafRef       = useRef<number>(0)
  const noteIdRef    = useRef(0)
  const notesRef     = useRef<ActiveNote[]>([])
  const phaseRef     = useRef<GamePhase>('idle')

  const beatMs = (60 / (bpmOverride ?? song.bpm)) * 1000

  function buildNotes(): ActiveNote[] {
    return song.notes.map(n => ({
      ...n,
      id: noteIdRef.current++,
      hitTime: n.beat * beatMs,
      judgment: 'none' as Judgment,
      hit: false,
    }))
  }

  const tick = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current

    setScrollX(elapsed)

    // Miss判定：判定ウィンドウを過ぎたノートをMissに
    setNotes(prev => {
      let changed = false
      const updated = prev.map(n => {
        if (!n.hit && n.judgment === 'none' && elapsed - n.hitTime > GOOD_MS) {
          changed = true
          return { ...n, judgment: 'miss' as Judgment, hit: true }
        }
        return n
      })
      if (changed) {
        notesRef.current = updated
        return updated
      }
      return prev
    })

    // 曲終了判定
    const lastBeat = Math.max(...song.notes.map(n => n.beat + n.duration))
    if (elapsed >= lastBeat * beatMs + 800) {
      cancelAnimationFrame(rafRef.current)
      setPhase('finished')
      phaseRef.current = 'finished'
      // 残りのMissを集計（state更新なので最新のnotesRefを使う）
      setResults(r => {
        const missCount = notesRef.current.filter(n => n.judgment === 'miss').length
        // すでにmissカウント済みなので加算不要、totalとの差で補完
        const total = notesRef.current.length
        const counted = r.perfect + r.good + missCount
        const extra = total - counted  // 取りこぼし
        return { ...r, miss: missCount + Math.max(0, extra) }
      })
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [song, beatMs])

  const start = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const fresh = buildNotes()
    notesRef.current = fresh
    setNotes(fresh)
    setScrollX(0)
    setCombo(0)
    setResults({ perfect: 0, good: 0, miss: 0 })
    setPhase('countdown')
    phaseRef.current = 'countdown'
    setCountdown(3)

    let count = 3
    const iv = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(iv)
        startTimeRef.current = performance.now()
        setPhase('playing')
        phaseRef.current = 'playing'
      }
    }, 1000)
  }, [song, beatMs])

  useEffect(() => {
    if (phase === 'playing') {
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, tick])

  const pressNote = useCallback((noteStr: string) => {
    if (phaseRef.current !== 'playing') return
    const elapsed = performance.now() - startTimeRef.current

    setNotes(prev => {
      const candidates = prev.filter(
        n => n.note === noteStr && !n.hit && n.judgment === 'none'
      )
      if (candidates.length === 0) return prev

      const target = candidates.reduce((a, b) =>
        Math.abs(elapsed - a.hitTime) < Math.abs(elapsed - b.hitTime) ? a : b
      )

      const diff = Math.abs(elapsed - target.hitTime)
      let judgment: Judgment = 'none'
      if (diff <= PERFECT_MS)   judgment = 'perfect'
      else if (diff <= GOOD_MS) judgment = 'good'

      if (judgment === 'none') return prev  // 範囲外は無視

      const updated = prev.map(n =>
        n.id === target.id ? { ...n, judgment, hit: true } : n
      )
      notesRef.current = updated
      setResults(r => ({ ...r, [judgment as string]: r[judgment as 'perfect' | 'good'] + 1 }))
      setCombo(c => c + 1)
      return updated
    })
  }, [])

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    noteIdRef.current = 0
    setPhase('idle')
    phaseRef.current = 'idle'
    setNotes([])
    notesRef.current = []
    setScrollX(0)
    setCombo(0)
    setResults({ perfect: 0, good: 0, miss: 0 })
  }, [])

  return {
    phase, countdown, notes, scrollX, combo, results,
    beatMs, start, pressNote, reset,
  }
}
