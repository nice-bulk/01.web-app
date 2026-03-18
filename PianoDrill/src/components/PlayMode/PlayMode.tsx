import { useState, useRef, useEffect } from 'react'
import { usePlayMode } from '../../hooks/usePlayMode'
import { useSound } from '../../hooks/useSound'
import { useLang } from '../../context/AppContext'
import { SONGS } from '../../data/songs'
import PlayLane from './PlayLane'
import PlayPiano from './PlayPiano'
import PlayResult from './PlayResult'
import styles from './PlayMode.module.css'

interface Props {
  onBack: () => void
}

type Difficulty = 'easy' | 'normal' | 'hard'

const DIFF_RATIO: Record<Difficulty, number> = {
  easy:   0.6,
  normal: 1.0,
  hard:   1.3,
}

// PCキーボード → 音名マッピング（白鍵のみ、2オクターブ）
// A S D F G H J  = C4 D4 E4 F4 G4 A4 B4
// K L ; ' Z X C  = C5 D5 E5 F5 G5 A5 B5
const KEY_MAP: Record<string, string> = {
  a: 'C4', s: 'D4', d: 'E4', f: 'F4', g: 'G4', h: 'A4', j: 'B4',
  k: 'C5', l: 'D5', ';': 'E5', "'": 'F5', z: 'G5', x: 'A5', c: 'B5',
}

const DIFF_LABEL: Record<Difficulty, Record<'en' | 'ja', string>> = {
  easy:   { en: 'Easy',   ja: 'かんたん' },
  normal: { en: 'Normal', ja: 'ふつう'   },
  hard:   { en: 'Hard',   ja: 'むずかしい' },
}

export default function PlayMode({ onBack }: Props) {
  const [songIdx, setSongIdx]       = useState(0)
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set())
  const { lang } = useLang()
  const { playPianoNote } = useSound()

  const song   = SONGS[songIdx]
  const bpm    = Math.round(song.bpm * DIFF_RATIO[difficulty])

  const {
    phase, countdown, notes, scrollX, combo, results,
    beatMs, start, pressNote, reset,
  } = usePlayMode(song, bpm)

  // 視覚的なキーハイライト（短時間表示）
  const activeTimers  = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  // 押しっぱなし防止
  const pressedKeys   = useRef<Set<string>>(new Set())

  // PCキーボードイベント
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // 入力フォーカス中は無視
      if (e.target instanceof HTMLSelectElement) return
      if (pressedKeys.current.has(e.key)) return  // 押しっぱなし無視
      pressedKeys.current.add(e.key)

      const noteStr = KEY_MAP[e.key.toLowerCase()]
      if (noteStr) handleKeyPress.current(noteStr)
    }
    function onKeyUp(e: KeyboardEvent) {
      pressedKeys.current.delete(e.key)
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [phase])

  const handleKeyPress = useRef((noteStr: string) => {
    playPianoNote(noteStr)
    pressNote(noteStr)
    setActiveNotes(prev => new Set([...prev, noteStr]))
    if (activeTimers.current.has(noteStr)) {
      clearTimeout(activeTimers.current.get(noteStr)!)
    }
    const t = setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev)
        next.delete(noteStr)
        return next
      })
    }, 150)
    activeTimers.current.set(noteStr, t)
  })
  // 最新の pressNote / playPianoNote を参照できるよう毎回更新
  handleKeyPress.current = (noteStr: string) => {
    playPianoNote(noteStr)
    pressNote(noteStr)
    setActiveNotes(prev => new Set([...prev, noteStr]))
    if (activeTimers.current.has(noteStr)) {
      clearTimeout(activeTimers.current.get(noteStr)!)
    }
    const t = setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev)
        next.delete(noteStr)
        return next
      })
    }, 150)
    activeTimers.current.set(noteStr, t)
  }

  function handleSongChange(idx: number) {
    reset()
    setSongIdx(idx)
  }

  function handleDiffChange(d: Difficulty) {
    reset()
    setDifficulty(d)
  }

  function handleReplay() {
    reset()
    start()
  }

  return (
    <div className={styles.container}>
      {/* リザルト */}
      {phase === 'finished' && (
        <PlayResult
          results={results}
          songTitle={song.title}
          lang={lang}
          onReplay={handleReplay}
          onBack={onBack}
        />
      )}

      {/* 上：ゲームレーン */}
      <div className={styles.laneArea}>
        <header className={styles.header}>
          <button className={styles.back} onClick={onBack}>← {lang === 'en' ? 'Back' : '戻る'}</button>
          <h1 className={styles.title}>Play Mode</h1>

          {/* 曲選択 */}
          <select
            className={styles.songSelect}
            value={songIdx}
            onChange={e => handleSongChange(Number(e.target.value))}
            disabled={phase === 'playing' || phase === 'countdown'}
          >
            {SONGS.map((s, i) => (
              <option key={s.id} value={i}>{s.title}</option>
            ))}
          </select>

          {/* 難易度トグル */}
          <div className={`${styles.diffToggle} ${phase === 'playing' || phase === 'countdown' ? styles.diffDisabled : ''}`}>
            {(['easy', 'normal', 'hard'] as Difficulty[]).map(d => (
              <button
                key={d}
                className={`${styles.diffBtn} ${styles[d]} ${difficulty === d ? styles.diffActive : ''}`}
                onClick={() => handleDiffChange(d)}
                disabled={phase === 'playing' || phase === 'countdown'}
              >
                {DIFF_LABEL[d][lang]}
              </button>
            ))}
          </div>

          {/* BPM 表示 */}
          <span className={styles.bpmBadge}>♩{bpm}</span>

          {/* コンボ */}
          {phase === 'playing' && combo >= 3 && (
            <div className={styles.combo}>
              <span className={styles.comboNum}>{combo}</span>
              <span className={styles.comboLabel}>combo</span>
            </div>
          )}
        </header>

        {/* カウントダウン */}
        {phase === 'countdown' && (
          <div className={styles.countdown}>
            <span key={countdown} className={styles.countNum}>{countdown}</span>
          </div>
        )}

        {/* 五線譜レーン */}
        <div className={styles.laneBox}>
          <PlayLane
            notes={notes}
            scrollX={scrollX}
            beatMs={beatMs}
          />
        </div>

        {/* スタートボタン */}
        {phase === 'idle' && (
          <button className={styles.startBtn} onClick={start}>
            ▶ {lang === 'en' ? 'Start' : 'スタート'}
          </button>
        )}
      </div>

      {/* 下：鍵盤 */}
      <div className={styles.pianoArea}>
        <PlayPiano
          onPress={handleKeyPress.current}
          activeNotes={activeNotes}
        />
      </div>
    </div>
  )
}
