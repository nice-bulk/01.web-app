import { useState } from 'react'
import { useNoteQuestion } from '../../hooks/useNoteQuestion'
import { useScore } from '../../hooks/useScore'
import { useSound } from '../../hooks/useSound'
import { useTimer } from '../../hooks/useTimer'
import { useLang } from '../../context/AppContext'
import { localizeNote, t } from '../../utils/localize'
import Staff from './Staff'
import Piano from './Piano'
import ScoreBoard from '../common/ScoreBoard'
import TimerBar from '../common/TimerBar'
import TimeUpModal from '../common/TimeUpModal'
import styles from './NoteMode.module.css'
import type { Clef, Note } from '../../types/music'

const TIMER_SEC = 60

interface Props {
  onBack: () => void
}

export default function NoteMode({ onBack }: Props) {
  const [clef, setClef] = useState<Clef>('treble')
  const [noteMode, setNoteMode] = useState<'single' | 'chord'>('single')
  const [timerMode, setTimerMode] = useState(false)
  const [flashClass, setFlashClass] = useState('')

  const {
    question, answer, selected,
    checkSingle, confirmChord, toggleNote, nextQuestion,
  } = useNoteQuestion(clef)

  const { score, accuracy, recordAnswer, reset } = useScore()
  const { playCorrect, playWrong } = useSound()
  const { remaining, running, finished, start: startTimer, reset: resetTimer } = useTimer(TIMER_SEC)
  const { lang } = useLang()

  function triggerFlash(isCorrect: boolean) {
    setFlashClass(isCorrect ? 'animate-flash-correct' : 'animate-flash-wrong')
    setTimeout(() => setFlashClass(''), 500)
  }

  function handlePianoPress(note: Note) {
    if (answer || finished) return
    if (noteMode === 'single') {
      const isCorrect = checkSingle(note)
      recordAnswer(isCorrect)
      triggerFlash(isCorrect)
      if (isCorrect) {
        playCorrect()
      } else {
        playWrong()
      }
    } else {
      toggleNote(note)
    }
  }

  function handleConfirmChord() {
    const isCorrect = confirmChord(selected)
    recordAnswer(isCorrect)
    triggerFlash(isCorrect)
    if (isCorrect) {
      playCorrect()
    } else {
      playWrong()
    }
  }

  function handleToggleTimer() {
    setTimerMode(v => !v)
    reset()
    resetTimer()
  }

  function handleStartTimer() {
    reset()
    startTimer()
  }

  function handleRestart() {
    reset()
    nextQuestion()
    startTimer()
  }

  // 正解後の表示：音名をローカライズして表示
  function formatExpected(notes: Note[]): string {
    return notes.map(n => {
      const name = localizeNote(n.name, lang)
      return lang === 'en' ? `${name}${n.octave}` : `${name}（${n.octave}）`
    }).join(', ')
  }

  return (
    <div className={styles.container}>
      {finished && (
        <TimeUpModal
          score={score}
          accuracy={accuracy}
          lang={lang}
          onRestart={handleRestart}
          onBack={onBack}
        />
      )}

      {/* 上：五線譜エリア */}
      <div className={`${styles.questionArea} ${flashClass}`}>
        <header className={styles.header}>
          <button className={styles.back} onClick={onBack}>← 戻る</button>
          <h1 className={styles.title}>Note Mode</h1>
          <div className={styles.settings}>
            <div className={styles.toggle}>
              <button
                className={clef === 'treble' ? styles.active : ''}
                onClick={() => setClef('treble')}>{t('noteMode.treble', lang)}</button>
              <button
                className={clef === 'bass' ? styles.active : ''}
                onClick={() => setClef('bass')}>{t('noteMode.bass', lang)}</button>
            </div>
            <div className={styles.toggle}>
              <button
                className={noteMode === 'single' ? styles.active : ''}
                onClick={() => setNoteMode('single')}>{t('noteMode.single', lang)}</button>
              <button
                className={noteMode === 'chord' ? styles.active : ''}
                onClick={() => setNoteMode('chord')}>{t('noteMode.chord', lang)}</button>
            </div>
            <button
              className={`${styles.timerBtn} ${timerMode ? styles.timerActive : ''}`}
              onClick={handleToggleTimer}
              title="タイムアタックモード"
            >⏱</button>
          </div>
          <ScoreBoard score={score} accuracy={accuracy} lang={lang} />
        </header>

        {timerMode && (
          <div className={styles.timerBarWrap}>
            <TimerBar remaining={remaining} total={TIMER_SEC} />
          </div>
        )}

        <p className={styles.prompt}>{t('noteMode.prompt', lang)}</p>
        <div
          className={`${styles.staffBox} animate-pop-in`}
          key={`${question.notes.map(n=>n.name+n.octave).join('-')}-${question.keySignature.majorKey}`}
        >
          <Staff
            clef={question.clef}
            keySignature={question.keySignature}
            notes={question.notes}
          />
        </div>
      </div>

      {/* 下：鍵盤エリア */}
      <div className={styles.answerArea}>
        {timerMode && !running && !finished && score.total === 0 && (
          <button className={styles.startTimer} onClick={handleStartTimer}>
            {t('noteMode.start', lang)}
          </button>
        )}

        {answer && (
          <div className={`${styles.feedback} ${answer.correct ? styles.correct : styles.wrong}`}>
            {answer.correct
              ? t('noteMode.correct', lang)
              : `${t('noteMode.wrong', lang)}${formatExpected(answer.expectedNotes)}`}
          </div>
        )}

        <Piano
          clef={clef}
          selected={selected}
          answered={!!answer}
          correctNotes={answer ? answer.expectedNotes : []}
          onPress={handlePianoPress}
        />

        {answer ? (
          <button className={styles.next} onClick={nextQuestion}>{t('noteMode.next', lang)}</button>
        ) : noteMode === 'chord' && selected.length > 0 && (!timerMode || running) ? (
          <button className={styles.confirm} onClick={handleConfirmChord}>{t('noteMode.confirm', lang)}</button>
        ) : null}
      </div>
    </div>
  )
}
