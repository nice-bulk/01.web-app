export type Clef = 'treble' | 'bass'
export type Accidental = 'sharp' | 'flat' | 'natural'
export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'
export type NoteMode = 'single' | 'chord'
export type AppMode = 'select' | 'note' | 'key'

export interface Note {
  name: NoteName
  octave: number
  accidental?: Accidental
}

export interface KeySignature {
  type: 'sharp' | 'flat' | 'none'
  count: number       // 0〜7
  majorKey: string    // 'C Major', 'G Major', ...
  minorKey: string    // 'A Minor', 'E Minor', ... (将来用)
}

export interface NoteQuestion {
  clef: Clef
  keySignature: KeySignature
  notes: Note[]       // 単音なら length === 1、和音なら複数
}
