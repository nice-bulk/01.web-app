import { useKeyQuestion } from '../../hooks/useKeyQuestion'
import KeySignatureDisplay from './KeySignatureDisplay'
import KeyAnswerButtons from './KeyAnswerButtons'
import styles from './KeyMode.module.css'

interface Props {
  onBack: () => void
}

export default function KeyMode({ onBack }: Props) {
  const { question, answer, checkAnswer, nextQuestion } = useKeyQuestion()

  return (
    <div className={styles.container}>
      {/* 上：五線譜 */}
      <div className={styles.questionArea}>
        <header className={styles.header}>
          <button className={styles.back} onClick={onBack}>← 戻る</button>
          <h1 className={styles.title}>Key Mode</h1>
        </header>
        <p className={styles.prompt}>この調号は何長調？</p>
        <div className={styles.staffBox}>
          <KeySignatureDisplay keySignature={question} />
        </div>
      </div>

      {/* 下：回答 */}
      <div className={styles.answerArea}>
        {answer && (
          <div className={`${styles.feedback} ${answer.correct ? styles.correct : styles.wrong}`}>
            {answer.correct
              ? `✅ 正解！ ${question.majorKey}`
              : `❌ 不正解。正解は ${question.majorKey}`}
          </div>
        )}
        {answer ? (
          <button className={styles.next} onClick={nextQuestion}>次の問題 →</button>
        ) : (
          <KeyAnswerButtons
            onAnswer={checkAnswer}
            correctKey={question.majorKey}
            selectedKey={null}
          />
        )}
      </div>
    </div>
  )
}
