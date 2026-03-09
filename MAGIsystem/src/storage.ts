import type { SavedPersonalitySet, PersonalityProfile } from './types'

const STORAGE_KEY = 'magi_saved_personalities'

export function loadSavedSets(): SavedPersonalitySet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedPersonalitySet[]
  } catch {
    return []
  }
}

export function savePersonalitySet(label: string, personalities: PersonalityProfile[]): SavedPersonalitySet {
  const sets = loadSavedSets()
  const newSet: SavedPersonalitySet = {
    id: `magi_${Date.now()}`,
    label,
    createdAt: new Date().toISOString(),
    personalities,
  }
  sets.push(newSet)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets))
  return newSet
}

export function deleteSavedSet(id: string): void {
  const sets = loadSavedSets().filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sets))
}
