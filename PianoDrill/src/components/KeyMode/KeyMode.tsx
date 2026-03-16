import { useState } from 'react'
import { useKeyQuestion } from '../../hooks/useKeyQuestion'
import type { KeyModeTarget } from '../../hooks/useKeyQuestion'
import { useScore } from '../../hooks/useScore'
import { useSound } from '../../hooks/useSound'
import KeySignatureDisplay from './KeySignatureDisplay'
import KeyAnswerButtons from './KeyAnswerButtons'
import ScoreBoard from '../common/ScoreBoard'
import styles from './KeyMode.module.css'

interface Props {
  onBack: () => void
}

export default function KeyMode({ onBack }: Props) {
  const [target, setTarget] = useState<KeyModeTarget>('major')
  const { question, correctKey, askMinor, answer, checkAnswer, nextQuestion: advanceQuestion } = useKeyQuestion(target)
  const { score, accuracy, recordAnswer, reset } = useScore()
  const { playCorrect, playWrong } = useSound()

  function handleAnswer(key: string) {
    const isCorrect = key === correctKey
    checkAnswer(key)
    recordAnswer(isCorrect)
    if (isCorrect) playCorrect(); else playWrong()
  }

  function handleTargetChange(t: KeyModeTarget) {
    setTarget(t)  // useKeyQuestion の useEffect で自動リセット
    reset()
  }

  const promptText =
    target === 'major' ? 'この調号は何長調？'
    : target === 'minor' ? 'この調号は何短調？'
    : askMinor ? 'この調号の平行短調は？'
    : 'この調号は何長調？'

  return (
    <div className={styles.container}>
      {/* 上：五線譜エリア */}
      <div className={styles.questionArea}>
        <header className={styles.header}>
          <button className={styles.back} onClick={onBack}>← 戻る</button>
          <h1 className={styles.title}>Key Mode</h1>
          <div className={styles.settings}>
            <div className={styles.toggle}>
              <button className={target === 'major' ? styles.active : ''} onClick={() => handleTargetChange('major')}>長調</button>
              <button className={target === 'minor' ? styles.active : ''} onClick={() => handleTargetChange('minor')}>短調</button>
              <button className={target === 'both'  ? styles.active : ''} onClick={() => handleTargetChange('both')}>両方</button>
            </div>
          </div>
          <ScoreBoard score={score} accuracy={accuracy} />
        </header>
        <p className={styles.prompt}>{promptText}</p>
        <div className={styles.staffBox}>
          <KeySignatureDisplay keySignature={question} />
        </div>
      </div>

      {/* 下：回答 */}
      <div className={styles.answerArea}>
        {answer && (
          <div className={`${styles.feedback} ${answer.correct ? styles.correct : styles.wrong}`}>
            {answer.correct
              ? `✅ 正解！ ${correctKey}`
              : `❌ 不正解。正解は ${correctKey}`}
          </div>
        )}
        {answer ? (
          <button className={styles.next} onClick={advanceQuestion}>次の問題 →</button>
        ) : (
          <KeyAnswerButtons
            target={target}
            onAnswer={handleAnswer}
            correctKey={correctKey}
            selectedKey={answer ? answer.selected : null}
          />
        )}
      </div>
    </div>
  )
}
