import type { Lang } from '../context/AppContext'

// ── 調名ローカライズ ──────────────────────────────────────────

const MAJOR_JA: Record<string, string> = {
  'C Major':  'ハ長調',
  'G Major':  'ト長調',
  'D Major':  'ニ長調',
  'A Major':  'イ長調',
  'E Major':  'ホ長調',
  'B Major':  'ロ長調',
  'F# Major': '嬰ヘ長調',
  'C# Major': '嬰ハ長調',
  'F Major':  'ヘ長調',
  'Bb Major': '変ロ長調',
  'Eb Major': '変ホ長調',
  'Ab Major': '変イ長調',
  'Db Major': '変ニ長調',
  'Gb Major': '変ト長調',
  'Cb Major': '変ハ長調',
}

const MINOR_JA: Record<string, string> = {
  'A Minor':  'イ短調',
  'E Minor':  'ホ短調',
  'B Minor':  'ロ短調',
  'F# Minor': '嬰ヘ短調',
  'C# Minor': '嬰ハ短調',
  'G# Minor': '嬰ト短調',
  'D# Minor': '嬰ニ短調',
  'A# Minor': '嬰イ短調',
  'D Minor':  'ニ短調',
  'G Minor':  'ト短調',
  'C Minor':  'ハ短調',
  'F Minor':  'ヘ短調',
  'Bb Minor': '変ロ短調',
  'Eb Minor': '変ホ短調',
  'Ab Minor': '変イ短調',
}

const ALL_JA = { ...MAJOR_JA, ...MINOR_JA }

export function localizeKey(key: string, lang: Lang): string {
  if (lang === 'en') return key
  return ALL_JA[key] ?? key
}

export function localizeNote(name: string, lang: Lang): string {
  if (lang === 'en') return name
  const map: Record<string, string> = {
    C: 'ド', D: 'レ', E: 'ミ', F: 'ファ', G: 'ソ', A: 'ラ', B: 'シ',
  }
  return map[name] ?? name
}

// ── UI テキスト ───────────────────────────────────────────────

type UITextKey =
  | 'modeSelect.subtitle'
  | 'modeSelect.noteDesc'
  | 'modeSelect.keyDesc'
  | 'modeSelect.playDesc'
  | 'noteMode.prompt'
  | 'noteMode.treble'
  | 'noteMode.bass'
  | 'noteMode.single'
  | 'noteMode.chord'
  | 'noteMode.correct'
  | 'noteMode.wrong'
  | 'noteMode.next'
  | 'noteMode.confirm'
  | 'noteMode.start'
  | 'keyMode.promptMajor'
  | 'keyMode.promptMinor'
  | 'keyMode.promptBothMajor'
  | 'keyMode.promptBothMinor'
  | 'keyMode.major'
  | 'keyMode.minor'
  | 'keyMode.both'
  | 'keyMode.correct'
  | 'keyMode.wrong'
  | 'keyMode.next'
  | 'keyMode.start'
  | 'timeUp.message.perfect'
  | 'timeUp.message.great'
  | 'timeUp.message.good'
  | 'timeUp.message.ok'
  | 'timeUp.message.keep'
  | 'timeUp.questions'
  | 'timeUp.accuracy'
  | 'timeUp.bestStreak'
  | 'timeUp.restart'
  | 'timeUp.back'
  | 'score.accuracy'
  | 'score.streak'
  | 'score.bestStreak'
  | 'score.total'

const UI: Record<UITextKey, Record<Lang, string>> = {
  'modeSelect.subtitle':       { en: 'Choose a practice mode',          ja: '練習するモードを選んでください' },
  'modeSelect.noteDesc':       { en: 'Read notes on the staff',         ja: '音符を見て鍵盤を当てる' },
  'modeSelect.keyDesc':        { en: 'Identify key signatures',         ja: '調号を見て何調かを当てる' },
  'modeSelect.playDesc':       { en: 'Play along with the score',       ja: '楽譜を読んでリズムよく演奏' },
  'noteMode.prompt':           { en: 'What is this note?',              ja: 'この音符は？' },
  'noteMode.treble':           { en: 'Treble',                          ja: 'ト音' },
  'noteMode.bass':             { en: 'Bass',                            ja: 'ヘ音' },
  'noteMode.single':           { en: 'Single',                          ja: '単音' },
  'noteMode.chord':            { en: 'Chord',                           ja: '和音' },
  'noteMode.correct':          { en: '✅ Correct!',                     ja: '✅ 正解！' },
  'noteMode.wrong':            { en: '❌ Wrong. Answer: ',              ja: '❌ 不正解。正解は ' },
  'noteMode.next':             { en: 'Next →',                          ja: '次の問題 →' },
  'noteMode.confirm':          { en: 'Confirm',                         ja: '確定' },
  'noteMode.start':            { en: '▶ Start (60s)',                   ja: '▶ スタート（60秒）' },
  'keyMode.promptMajor':       { en: 'What major key is this?',         ja: 'この調号は何長調？' },
  'keyMode.promptMinor':       { en: 'What minor key is this?',         ja: 'この調号は何短調？' },
  'keyMode.promptBothMajor':   { en: 'What major key is this?',         ja: 'この調号は何長調？' },
  'keyMode.promptBothMinor':   { en: 'What is the relative minor?',     ja: 'この調号の平行短調は？' },
  'keyMode.major':             { en: 'Major',                           ja: '長調' },
  'keyMode.minor':             { en: 'Minor',                           ja: '短調' },
  'keyMode.both':              { en: 'Both',                            ja: '両方' },
  'keyMode.correct':           { en: '✅ Correct! ',                    ja: '✅ 正解！ ' },
  'keyMode.wrong':             { en: '❌ Wrong. Answer: ',              ja: '❌ 不正解。正解は ' },
  'keyMode.next':              { en: 'Next →',                          ja: '次の問題 →' },
  'keyMode.start':             { en: '▶ Start (60s)',                   ja: '▶ スタート（60秒）' },
  'timeUp.message.perfect':    { en: 'Perfect! 🏆',                    ja: 'パーフェクト！🏆' },
  'timeUp.message.great':      { en: 'Amazing! 🔥',                    ja: 'すごい！🔥' },
  'timeUp.message.good':       { en: 'Nice! 🎶',                       ja: 'いい感じ！🎶' },
  'timeUp.message.ok':         { en: 'Getting there! 🎵',              ja: 'もう少し！🎵' },
  'timeUp.message.keep':       { en: 'Keep practicing! 💪',            ja: '練習あるのみ！💪' },
  'timeUp.questions':          { en: 'Questions',                       ja: '問' },
  'timeUp.accuracy':           { en: 'Accuracy',                        ja: '正解率' },
  'timeUp.bestStreak':         { en: 'Best Streak',                     ja: '最高連続' },
  'timeUp.restart':            { en: 'Play Again 🔄',                   ja: 'もう一度 🔄' },
  'timeUp.back':               { en: 'Back to Menu',                    ja: 'モード選択へ' },
  'score.accuracy':            { en: 'Accuracy',                        ja: '正解率' },
  'score.streak':              { en: 'Streak',                          ja: '連続正解' },
  'score.bestStreak':          { en: 'Best',                            ja: '最高連続' },
  'score.total':               { en: 'Total',                           ja: '問題数' },
}

export function t(key: UITextKey, lang: Lang): string {
  return UI[key]?.[lang] ?? key
}
