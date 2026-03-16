import { KEY_SIGNATURES } from '../../data/music'
import type { KeyModeTarget } from '../../hooks/useKeyQuestion'
import styles from './KeyAnswerButtons.module.css'

interface Props {
  target: KeyModeTarget
  onAnswer: (key: string) => void
  correctKey: string
  selectedKey: string | null
}

export default function KeyAnswerButtons({ target, onAnswer, correctKey, selectedKey }: Props) {
  const keys =
    target === 'major' ? KEY_SIGNATURES.map(k => k.majorKey)
    : target === 'minor' ? KEY_SIGNATURES.map(k => k.minorKey)
    : [...KEY_SIGNATURES.map(k => k.majorKey), ...KEY_SIGNATURES.map(k => k.minorKey)]

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.grid} ${target === 'both' ? styles.wide : ''}`}>
        {keys.map(key => {
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
