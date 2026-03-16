import { useState } from 'react'
import { useKeyQuestion } from '../../hooks/useKeyQuestion'
import type { KeyModeTarget } from '../../hooks/useKeyQuestion'
import { useScore } from '../../hooks/useScore'
import { useSound } from '../../hooks/useSound'
import { useTimer } from '../../hooks/useTimer'
import { useLang } from '../../context/AppContext'
import { localizeKey, t } from '../../utils/localize'
import KeySignatureDisplay from './KeySignatureDisplay'
import KeyAnswerButtons from './KeyAnswerButtons'
import ScoreBoard from '../common/ScoreBoard'
import TimerBar from '../common/TimerBar'
import TimeUpModal from '../common/TimeUpModal'
import styles from './KeyMode.module.css'

const TIMER_SEC = 60

interface Props {
  onBack: () => void
}

export default function KeyMode({ onBack }: Props) {
  const [target, setTarget] = useState<KeyModeTarget>('major')
  const [timerMode, setTimerMode] = useState(false)
  const [flashClass, setFlashClass] = useState('')

  const { question, correctKey, askMinor, answer, checkAnswer, nextQuestion: advanceQuestion } = useKeyQuestion(target)
  const { score, accuracy, recordAnswer, reset } = useScore()
  const { playCorrect, playWrong } = useSound()
  const { remaining, running, finished, start: startTimer, reset: resetTimer } = useTimer(TIMER_SEC)
  const { lang } = useLang()

  function handleAnswer(key: string) {
    if (finished) return
    const isCorrect = key === correctKey
    checkAnswer(key)
    recordAnswer(isCorrect)
    if (isCorrect) {
      playCorrect()
      setFlashClass('animate-flash-correct')
    } else {
      playWrong()
      setFlashClass('animate-flash-wrong')
    }
    setTimeout(() => setFlashClass(''), 500)
  }

  function handleTargetChange(t: KeyModeTarget) {
    setTarget(t)
    reset()
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
    advanceQuestion()
    startTimer()
  }

  const promptText =
    target === 'major' ? t('keyMode.promptMajor', lang)
    : target === 'minor' ? t('keyMode.promptMinor', lang)
    : askMinor ? t('keyMode.promptBothMinor', lang)
    : t('keyMode.promptBothMajor', lang)

  const localCorrectKey = localizeKey(correctKey, lang)

  return (
    <div className={styles.container}>
      {/* タイムアップモーダル */}
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
          <h1 className={styles.title}>Key Mode</h1>
          <div className={styles.settings}>
            <div className={styles.toggle}>
              <button className={target === 'major' ? styles.active : ''} onClick={() => handleTargetChange('major')}>{t('keyMode.major', lang)}</button>
              <button className={target === 'minor' ? styles.active : ''} onClick={() => handleTargetChange('minor')}>{t('keyMode.minor', lang)}</button>
              <button className={target === 'both'  ? styles.active : ''} onClick={() => handleTargetChange('both')}>{t('keyMode.both', lang)}</button>
            </div>
            <button
              className={`${styles.timerBtn} ${timerMode ? styles.timerActive : ''}`}
              onClick={handleToggleTimer}
              title="タイムアタックモード"
            >⏱</button>
          </div>
          <ScoreBoard score={score} accuracy={accuracy} lang={lang} />
        </header>

        {/* タイマーバー */}
        {timerMode && (
          <div className={styles.timerBarWrap}>
            <TimerBar remaining={remaining} total={TIMER_SEC} />
          </div>
        )}

        <p className={styles.prompt}>{promptText}</p>
        <div className={`${styles.staffBox} animate-pop-in`} key={question.majorKey + target}>
          <KeySignatureDisplay keySignature={question} />
        </div>
      </div>

      {/* 下：回答 */}
      <div className={styles.answerArea}>
        {/* タイマー未開始の案内 */}
        {timerMode && !running && !finished && score.total === 0 && (
          <button className={styles.startTimer} onClick={handleStartTimer}>
            {t('keyMode.start', lang)}
          </button>
        )}

        {answer && (
          <div className={`${styles.feedback} ${answer.correct ? styles.correct : styles.wrong}`}>
            {answer.correct
              ? `${t('keyMode.correct', lang)}${localCorrectKey}`
              : `${t('keyMode.wrong', lang)}${localCorrectKey}`}
          </div>
        )}
        {answer ? (
          <button className={styles.next} onClick={advanceQuestion}>{t('keyMode.next', lang)}</button>
        ) : (
          (!timerMode || running) && (
            <KeyAnswerButtons
              target={target}
              lang={lang}
              onAnswer={handleAnswer}
              correctKey={correctKey}
              selectedKey={null}
            />
          )
        )}
      </div>
    </div>
  )
}
