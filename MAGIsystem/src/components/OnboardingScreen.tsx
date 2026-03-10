import { useEffect, useState } from 'react'
import type { QuizAnswer } from '../types'
import { QUIZ_QUESTIONS } from '../constants'

interface Props {
  onComplete: (answers: QuizAnswer[]) => void
}

const C = {
  orange: '#ff6600',
  red: '#cc0000',
  green: '#00ff41',
  amber: '#ffaa00',
  bg: '#050505',
  panel: '#0a0a0a',
  border: '#1a1a1a',
  text: '#cccccc',
  dim: '#555555',
  bright: '#eeeeee',
  font: '"Share Tech Mono", monospace',
  serif: '"Noto Serif JP", serif',
}

// A=0, B=1, C=2, D=3 のマッピング
const KEY_MAP: Record<string, number> = { a: 0, b: 1, c: 2, d: 3 }

export default function OnboardingScreen({ onComplete }: Props) {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selected, setSelected] = useState<number | null>(null)

  const question = QUIZ_QUESTIONS[currentQ]
  const progress = (currentQ / QUIZ_QUESTIONS.length) * 100

  function handleNext() {
    if (selected === null) return
    const opt = question.options[selected]
    const newAnswers = [...answers, { questionId: question.id, answer: opt.text, value: opt.value }]
    setAnswers(newAnswers)
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
    } else {
      onComplete(newAnswers)
    }
  }

  // キーボード操作
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()

      // A/B/C/D で選択
      if (key in KEY_MAP) {
        const idx = KEY_MAP[key]
        if (idx < question.options.length) {
          setSelected(idx)
        }
        return
      }

      // Enter で次へ
      if (key === 'enter' && selected !== null) {
        handleNext()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, currentQ, answers, question])

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: C.font }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: C.orange, fontSize: '13px', letterSpacing: '0.2em', textShadow: `0 0 10px ${C.orange}88` }}>MAGI SYSTEM</div>
        <div style={{ color: C.dim, fontSize: '11px' }}>PERSONALITY ASSESSMENT // PHASE 1</div>
        <div style={{ color: C.red, fontSize: '11px' }}>CLASSIFIED</div>
      </div>

      {/* Progress */}
      <div style={{ padding: '16px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.dim, marginBottom: '8px' }}>
          <span>APTITUDE TEST</span>
          <span>{currentQ + 1} / {QUIZ_QUESTIONS.length}</span>
        </div>
        <div style={{ height: '1px', background: C.border }}>
          <div style={{ height: '2px', background: `linear-gradient(90deg, ${C.orange}, ${C.amber})`, width: `${progress}%`, boxShadow: `0 0 8px ${C.orange}`, transition: 'width 0.3s ease', marginTop: '-0.5px' }} />
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{ width: '100%', maxWidth: '640px' }}>
          <div style={{ color: C.orange, fontSize: '11px', letterSpacing: '0.3em', marginBottom: '16px', textShadow: `0 0 8px ${C.orange}88` }}>
            QUESTION_{String(currentQ + 1).padStart(2, '0')}
          </div>

          <div style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '24px', marginBottom: '32px' }}>
            <div style={{ fontSize: '18px', fontFamily: C.serif, color: C.bright, lineHeight: 1.8 }}>
              {question.text}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  textAlign: 'left',
                  padding: '16px',
                  background: selected === i ? 'rgba(255,102,0,0.08)' : 'transparent',
                  border: `1px solid ${selected === i ? C.orange : C.border}`,
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  boxShadow: selected === i ? `0 0 15px rgba(255,102,0,0.2)` : 'none',
                  transition: 'all 0.2s',
                  fontFamily: C.font,
                }}
              >
                <span style={{ color: selected === i ? C.orange : '#444', fontSize: '12px', marginTop: '2px', whiteSpace: 'nowrap' }}>
                  [{opt.label}]
                </span>
                <span style={{ color: selected === i ? C.bright : '#888', fontSize: '13px' }}>
                  {opt.text}
                </span>
              </button>
            ))}
          </div>

          {/* キーヒント + NEXTボタン */}
          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#333', fontSize: '11px', letterSpacing: '0.15em' }}>
              A / B / C / D で選択　　Enter で次へ
            </div>
            <button
              onClick={handleNext}
              disabled={selected === null}
              style={{
                background: 'transparent',
                border: `1px solid ${C.orange}`,
                color: C.orange,
                fontFamily: C.font,
                fontSize: '13px',
                letterSpacing: '0.3em',
                padding: '12px 40px',
                cursor: selected === null ? 'not-allowed' : 'pointer',
                opacity: selected === null ? 0.3 : 1,
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                transition: 'all 0.2s',
              }}
            >
              {currentQ + 1 === QUIZ_QUESTIONS.length ? 'SUBMIT DATA' : 'NEXT'} ▶
            </button>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.dim }}>
        <span>NERV PSYCHOLOGICAL PROFILING SYSTEM</span>
        <span style={{ color: C.orange }}>■ RECORDING</span>
      </div>
    </div>
  )
}
