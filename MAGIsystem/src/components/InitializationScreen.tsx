import { useEffect, useRef, useState } from 'react'
import type { PersonalityProfile } from '../types'
import { savePersonalitySet } from '../storage'

interface Props {
  personalities: PersonalityProfile[]
  onComplete: () => void
}

const MAGI_LABELS = ['MELCHIOR·1', 'BALTHAZAR·2', 'CASPAR·3']

const STATUS_MSGS = [
  'ANALYZING PSYCHOLOGICAL VECTORS...',
  'CROSS-REFERENCING VALUE PATTERNS...',
  'IDENTIFYING COGNITIVE DISSONANCE...',
  'MAPPING INTERNAL CONFLICT NODES...',
  'GENERATING PERSONA MATRICES...',
  'CALIBRATING MELCHIOR PARAMETERS...',
  'CALIBRATING BALTHAZAR PARAMETERS...',
  'CALIBRATING CASPAR PARAMETERS...',
]

const C = {
  orange: '#ff6600', red: '#cc0000', green: '#00ff41', amber: '#ffaa00',
  bg: '#050505', panel: '#0a0a0a', border: '#1a1a1a',
  dim: '#555555', bright: '#eeeeee', text: '#cccccc',
  font: '"Share Tech Mono", monospace',
  serif: '"Noto Serif JP", serif',
}

const PERSONA_COLORS = [C.orange, C.red, '#00ccff']

export default function InitializationScreen({ personalities, onComplete }: Props) {
  const [statusLines, setStatusLines] = useState<string[]>([])
  const [logDone, setLogDone] = useState(false)
  const [revealIndex, setRevealIndex] = useState(-1)
  const [revealDone, setRevealDone] = useState(false)
  const hasStartedReveal = useRef(false)

  // 保存UI
  const [saveLabel, setSaveLabel] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let i = 0
    const iv = setInterval(() => {
      const msg = STATUS_MSGS[i]
      if (msg !== undefined) {
        setStatusLines(prev => [...prev, msg])
        i++
      } else {
        clearInterval(iv)
        setLogDone(true)
      }
    }, 280)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    if (!logDone || personalities.length === 0 || hasStartedReveal.current) return
    hasStartedReveal.current = true
    setStatusLines(prev => [...prev, 'PERSONA GENERATION COMPLETE'])
    // デフォルトの保存名を設定
    const defaultLabel = `MAGI-${new Date().toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '').replace(' ', '-')}`
    setSaveLabel(defaultLabel)
    let ri = 0
    const iv = setInterval(() => {
      setRevealIndex(ri)
      ri++
      if (ri >= personalities.length) {
        clearInterval(iv)
        setTimeout(() => setRevealDone(true), 600)
      }
    }, 700)
    return () => clearInterval(iv)
  }, [logDone, personalities])

  function handleSave() {
    if (!saveLabel.trim() || saved) return
    savePersonalitySet(saveLabel.trim(), personalities)
    setSaved(true)
  }

  const isWaiting = logDone && personalities.length === 0

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: C.font }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ color: C.orange, fontSize: '13px', letterSpacing: '0.2em' }}>MAGI SYSTEM</div>
        <div style={{ color: C.dim, fontSize: '11px' }}>INITIALIZATION // PHASE 2</div>
        <div style={{ color: C.red, fontSize: '11px' }}>CLASSIFIED</div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        {/* Left log */}
        <div style={{ width: '320px', borderRight: `1px solid ${C.border}`, padding: '24px', flexShrink: 0 }}>
          <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '16px' }}>ANALYSIS LOG</div>
          {statusLines.map((line, i) => {
            const safeL = line ?? ''
            return (
              <div key={i} style={{ color: safeL.includes('COMPLETE') ? C.green : '#555', fontSize: '12px', marginBottom: '6px' }}>
                {safeL.includes('COMPLETE') ? '✓ ' : '> '}{safeL}
              </div>
            )
          })}
          {(!logDone || isWaiting) && <div style={{ color: C.orange }}>█</div>}
          {isWaiting && (
            <div style={{ color: C.amber, fontSize: '11px', marginTop: '8px' }}>
              &gt; AWAITING GEMINI RESPONSE...
            </div>
          )}
        </div>

        {/* Right: cards */}
        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {personalities.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: C.orange, fontSize: '13px', letterSpacing: '0.2em' }}>GENERATING PERSONALITY MATRIX...</div>
              <div style={{ color: C.dim, fontSize: '11px', marginTop: '12px' }}>Gemini API と通信中...</div>
            </div>
          ) : (
            <>
              <div style={{ color: C.orange, fontSize: '11px', letterSpacing: '0.3em', marginBottom: '24px' }}>PERSONA MATRIX GENERATED</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {personalities.map((p, i) => {
                  const color = PERSONA_COLORS[i] ?? C.orange
                  const visible = revealIndex >= i
                  return (
                    <div key={i} style={{
                      background: C.panel,
                      border: `1px solid ${visible ? color + '44' : C.border}`,
                      padding: '20px',
                      boxShadow: visible ? `0 0 20px ${color}22` : 'none',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                      transition: 'all 0.5s ease',
                    }}>
                      {visible && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div>
                              <div style={{ color, fontSize: '11px', letterSpacing: '0.3em', marginBottom: '4px' }}>{MAGI_LABELS[i]}</div>
                              <div style={{ color, fontSize: '17px', fontFamily: C.serif, textShadow: `0 0 10px ${color}66` }}>{p.name}</div>
                              <div style={{ color: C.dim, fontSize: '11px', marginTop: '4px' }}>{p.title}</div>
                            </div>
                            <div style={{ color, fontSize: '28px', opacity: 0.2 }}>{String(i + 1).padStart(2, '0')}</div>
                          </div>
                          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '12px', color: C.dim, fontSize: '12px', lineHeight: 1.7 }}>
                            {p.description}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* 保存UI */}
              {revealDone && (
                <div style={{ marginTop: '28px', padding: '20px', border: `1px solid ${C.border}`, background: '#080808' }}>
                  <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px' }}>
                    REGISTER PROFILE
                  </div>
                  {saved ? (
                    <div style={{ color: C.green, fontSize: '13px', letterSpacing: '0.15em' }}>
                      ✓ PROFILE SAVED: {saveLabel}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={saveLabel}
                        onChange={e => setSaveLabel(e.target.value)}
                        placeholder="プロファイル名を入力"
                        style={{
                          flex: 1, background: 'transparent',
                          border: `1px solid #2a2a2a`, color: C.bright,
                          fontFamily: C.font, fontSize: '13px', padding: '8px 12px',
                          outline: 'none',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = C.orange }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#2a2a2a' }}
                      />
                      <button
                        onClick={handleSave}
                        disabled={!saveLabel.trim()}
                        style={{
                          background: 'transparent', border: `1px solid ${C.orange}`, color: C.orange,
                          fontFamily: C.font, fontSize: '12px', letterSpacing: '0.2em',
                          padding: '8px 20px', cursor: saveLabel.trim() ? 'pointer' : 'not-allowed',
                          opacity: saveLabel.trim() ? 1 : 0.4,
                          transition: 'all 0.2s',
                        }}
                      >
                        SAVE
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 進む */}
              {revealDone && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <button
                    onClick={onComplete}
                    style={{
                      background: 'transparent', border: `1px solid ${C.orange}`, color: C.orange,
                      fontFamily: C.font, fontSize: '13px', letterSpacing: '0.3em', padding: '12px 48px',
                      cursor: 'pointer', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    }}
                  >
                    PROCEED TO AGENDA INPUT ▶
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.dim }}>
        <span>PERSONALITY ENGINE v3.0.1</span>
        <span style={{ color: C.orange }}>■ PROCESSING</span>
      </div>
    </div>
  )
}
