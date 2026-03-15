import { useState } from 'react'
import { useNoteQuestion } from '../../hooks/useNoteQuestion'
import Staff from './Staff'
import Piano from './Piano'
import styles from './NoteMode.module.css'
import type { Clef } from '../../types/music'

interface Props {
  onBack: () => void
}

export default function NoteMode({ onBack }: Props) {
  const [clef, setClef] = useState<Clef>('treble')
  const [noteMode, setNoteMode] = useState<'single' | 'chord'>('single')

  const {
    question, answer, selected,
    checkSingle, confirmChord, toggleNote, nextQuestion,
  } = useNoteQuestion(clef)

  function handlePianoPress(note: import('../../types/music').Note) {
    if (answer) return
    if (noteMode === 'single') {
      checkSingle(note)
    } else {
      toggleNote(note)
    }
  }

  return (
    <div className={styles.container}>
      {/* 上：五線譜エリア */}
      <div className={styles.questionArea}>
        <header className={styles.header}>
          <button className={styles.back} onClick={onBack}>← 戻る</button>
          <h1 className={styles.title}>Note Mode</h1>
          <div className={styles.settings}>
            <div className={styles.toggle}>
              <button
                className={clef === 'treble' ? styles.active : ''}
                onClick={() => setClef('treble')}>ト音</button>
              <button
                className={clef === 'bass' ? styles.active : ''}
                onClick={() => setClef('bass')}>ヘ音</button>
            </div>
            <div className={styles.toggle}>
              <button
                className={noteMode === 'single' ? styles.active : ''}
                onClick={() => setNoteMode('single')}>単音</button>
              <button
                className={noteMode === 'chord' ? styles.active : ''}
                onClick={() => setNoteMode('chord')}>和音</button>
            </div>
          </div>
        </header>

        <p className={styles.prompt}>この音符は？</p>
        <div className={styles.staffBox}>
          <Staff
            clef={question.clef}
            keySignature={question.keySignature}
            notes={question.notes}
          />
        </div>
      </div>

      {/* 下：鍵盤エリア */}
      <div className={styles.answerArea}>
        {answer && (
          <div className={`${styles.feedback} ${answer.correct ? styles.correct : styles.wrong}`}>
            {answer.correct
              ? `✅ 正解！`
              : `❌ 不正解。正解は ${answer.expectedNotes.map(n => n.name + n.octave).join(', ')}`}
          </div>
        )}

        <Piano
          clef={clef}
          mode={noteMode}
          selected={selected}
          answered={!!answer}
          correctNotes={answer ? answer.expectedNotes : []}
          onPress={handlePianoPress}
        />

        {answer ? (
          <button className={styles.next} onClick={nextQuestion}>次の問題 →</button>
        ) : noteMode === 'chord' && selected.length > 0 ? (
          <button className={styles.confirm} onClick={confirmChord}>確定</button>
        ) : null}
      </div>
    </div>
  )
}
