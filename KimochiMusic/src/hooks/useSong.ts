import { useState, useCallback } from 'react'
import { SONGS } from '../data/songs'
import type { Song } from '../types'

export function useSong() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [usedIds, setUsedIds] = useState<string[]>([])
  const [looped, setLooped] = useState(false)

  const pickSong = useCallback((tagId: string, currentUsedIds: string[]) => {
    const candidates = SONGS.filter(s => s.tags.includes(tagId))
    if (candidates.length === 0) return

    const remaining = candidates.filter(s => !currentUsedIds.includes(s.id))
    const didLoop = remaining.length === 0
    const pool = didLoop ? candidates : remaining

    const picked = pool[Math.floor(Math.random() * pool.length)]
    setCurrentSong(picked)
    setSelectedTag(tagId)
    setLooped(didLoop)
    setUsedIds(didLoop ? [picked.id] : [...currentUsedIds, picked.id])
  }, [])

  const handleTagSelect = useCallback((tagId: string) => {
    setLooped(false)
    pickSong(tagId, [])
  }, [pickSong])

  const pickAnother = useCallback(() => {
    if (!selectedTag) return
    pickSong(selectedTag, usedIds)
  }, [selectedTag, usedIds, pickSong])

  const reset = useCallback(() => {
    setCurrentSong(null)
    setSelectedTag(null)
    setUsedIds([])
    setLooped(false)
  }, [])

  return { currentSong, selectedTag, looped, handleTagSelect, pickAnother, reset }
}
