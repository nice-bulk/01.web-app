import { useState, useCallback } from 'react'
import { KEY_SIGNATURES, TREBLE_NOTES, BASS_NOTES, pickRandom } from '../data/music'
import type { NoteQuestion, Note, Clef } from '../types/music'

interface AnswerState {
  correct: boolean
  expectedNotes: Note[]
}

function generateQuestion(clef: Clef): NoteQuestion {
  const keySig = pickRandom(KEY_SIGNATURES)
  const notePool = clef === 'treble' ? TREBLE_NOTES : BASS_NOTES
  const note = pickRandom(notePool)
  return { clef, keySignature: keySig, notes: [note] }
}

export function useNoteQuestion(clef: Clef = 'treble') {
  const [question, setQuestion] = useState<NoteQuestion>(() => generateQuestion(clef))
  const [answer, setAnswer] = useState<AnswerState | null>(null)
  const [selected, setSelected] = useState<Note[]>([])

  const toggleNote = useCallback((note: Note) => {
    setSelected(prev => {
      const exists = prev.some(n => n.name === note.name && n.octave === note.octave)
      return exists
        ? prev.filter(n => !(n.name === note.name && n.octave === note.octave))
        : [...prev, note]
    })
  }, [])

  // 単音モード：即時判定
  const checkSingle = useCallback((note: Note) => {
    const expected = question.notes[0]
    const correct = note.name === expected.name && note.octave === expected.octave
    setAnswer({ correct, expectedNotes: question.notes })
    setSelected([note])
  }, [question])

  // 和音モード：確定ボタン
  const confirmChord = useCallback(() => {
    const expected = question.notes
    const correct =
      selected.length === expected.length &&
      expected.every(en => selected.some(s => s.name === en.name && s.octave === en.octave))
    setAnswer({ correct, expectedNotes: expected })
  }, [question, selected])

  const nextQuestion = useCallback(() => {
    setQuestion(generateQuestion(clef))
    setAnswer(null)
    setSelected([])
  }, [clef])

  return { question, answer, selected, toggleNote, checkSingle, confirmChord, nextQuestion }
}
