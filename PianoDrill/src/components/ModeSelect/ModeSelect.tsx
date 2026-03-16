import type { AppMode } from '../../types/music'
import { useLang } from '../../context/AppContext'
import { t } from '../../utils/localize'
import styles from './ModeSelect.module.css'

interface Props {
  onSelect: (mode: AppMode) => void
}

export default function ModeSelect({ onSelect }: Props) {
  const { lang, setLang } = useLang()

  return (
    <div className={styles.container}>
      {/* 言語トグル */}
      <div className={styles.langToggle}>
        <button
          className={lang === 'en' ? styles.langActive : ''}
          onClick={() => setLang('en')}
        >EN</button>
        <button
          className={lang === 'ja' ? styles.langActive : ''}
          onClick={() => setLang('ja')}
        >日本語</button>
      </div>

      <h1 className={styles.title}>🎹 PianoDrill</h1>
      <p className={styles.subtitle}>{t('modeSelect.subtitle', lang)}</p>

      <div className={styles.cards}>
        <button className={styles.card} onClick={() => onSelect('note')}>
          <span className={styles.icon}>🎼</span>
          <h2>Note Mode</h2>
          <p>{t('modeSelect.noteDesc', lang)}</p>
        </button>
        <button className={styles.card} onClick={() => onSelect('key')}>
          <span className={styles.icon}>🔑</span>
          <h2>Key Mode</h2>
          <p>{t('modeSelect.keyDesc', lang)}</p>
        </button>
        <button className={styles.card} onClick={() => onSelect('play')}>
          <span className={styles.icon}>🎮</span>
          <h2>Play Mode</h2>
          <p>{t('modeSelect.playDesc', lang)}</p>
        </button>
      </div>
    </div>
  )
}
