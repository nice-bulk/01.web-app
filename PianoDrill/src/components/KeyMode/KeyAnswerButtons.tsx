import { KEY_SIGNATURES } from '../../data/music'
import styles from './KeyAnswerButtons.module.css'

interface Props {
  onAnswer: (key: string) => void
  correctKey: string
  selectedKey: string | null
}

export default function KeyAnswerButtons({ onAnswer, correctKey, selectedKey }: Props) {
  const majorKeys = KEY_SIGNATURES.map(k => k.majorKey)

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {majorKeys.map(key => {
          let state: 'default' | 'correct' | 'wrong' = 'default'
          if (selectedKey) {
            if (key === correctKey) state = 'correct'
            else if (key === selectedKey) state = 'wrong'
          }
          return (
            <button
              key={key}
              className={`${styles.btn} ${styles[state]}`}
              onClick={() => onAnswer(key)}
              disabled={!!selectedKey}
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
