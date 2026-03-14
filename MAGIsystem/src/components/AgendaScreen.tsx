import { useState } from 'react'
import type { PersonalityProfile } from '../types'

interface Props {
  personalities: PersonalityProfile[]
  onSubmit: (agenda: string) => void
}

const MAGI_LABELS = ['MELCHIOR·1', 'BALTHAZAR·2', 'CASPAR·3']
const PERSONA_COLORS = ['#ff6600', '#cc0000', '#00ccff']

const C = {
  orange: '#ff6600', red: '#cc0000', green: '#00ff41', amber: '#ffaa00',
  bg: '#050505', panel: '#0a0a0a', border: '#1a1a1a',
  dim: '#555555', bright: '#eeeeee', text: '#cccccc',
  font: '"Share Tech Mono", monospace',
  serif: '"Noto Serif JP", serif',
}

export default function AgendaScreen({ personalities, onSubmit }: Props) {
  const [agenda, setAgenda] = useState('')

  const valid = agenda.trim().length >= 5

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: C.font }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ color: C.orange, fontSize: '13px', letterSpacing: '0.2em' }}>MAGI SYSTEM</div>
        <div style={{ color: C.dim, fontSize: '11px' }}>AGENDA INPUT // PHASE 3</div>
        <div style={{ color: C.red, fontSize: '11px' }}>CLASSIFIED</div>
      </div>

      <div className="agenda-body" style={{ flex: 1, display: 'flex' }}>
        {/* Left: MAGI status */}
        <div className="agenda-sidebar" style={{ width: '280px', borderRight: `1px solid ${C.border}`, padding: '24px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em' }}>MAGI STATUS</div>
          {personalities.map((p, i) => {
            const color = PERSONA_COLORS[i] ?? C.orange
            return (
              <div key={i} style={{ padding: '16px', border: `1px solid ${color}33`, background: `${color}08` }}>
                <div style={{ color, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '4px' }}>{MAGI_LABELS[i]}</div>
                <div style={{ color, fontSize: '14px', fontFamily: C.serif, marginBottom: '4px' }}>{p.name}</div>
                <div style={{ color: C.dim, fontSize: '11px', marginBottom: '8px' }}>{p.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.green }} />
                  <span style={{ color: C.green, fontSize: '11px' }}>STANDBY</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: input */}
        <div className="agenda-main" style={{ flex: 1, padding: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ color: C.orange, fontSize: '11px', letterSpacing: '0.3em', marginBottom: '8px' }}>AGENDA INPUT</div>
            <div style={{ fontSize: '20px', fontFamily: C.serif, color: C.bright, marginBottom: '32px', lineHeight: 1.6 }}>
              あなたの悩みや選択肢を入力してください
            </div>

            <div style={{ background: C.panel, border: `1px solid ${C.border}`, marginBottom: '8px' }}>
              <div style={{ color: C.dim, fontSize: '11px', padding: '12px 16px 4px' }}>AGENDA TEXT</div>
              <textarea
                value={agenda}
                onChange={e => setAgenda(e.target.value)}
                placeholder="例: 今の会社を辞めて独立すべきか？転職すべきか？"
                style={{
                  width: '100%', background: 'transparent', border: 'none', outline: 'none',
                  color: C.text, fontFamily: C.font, fontSize: '13px', padding: '12px 16px',
                  resize: 'none', height: '140px', boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.dim, marginBottom: '32px' }}>
              <span>{agenda.length} chars</span>
              <span>MINIMUM 5 CHARACTERS REQUIRED</span>
            </div>

            <div style={{ border: `1px solid ${C.border}`, padding: '16px', marginBottom: '32px', fontSize: '12px', color: C.dim, lineHeight: 1.7 }}>
              <div style={{ color: C.amber, marginBottom: '8px' }}>⚠ NOTICE</div>
              3つのMAGIが並列で議題を解析し、それぞれの人格に基づいた判断を下します。
              合議結果はあなたの内なる葛藤を反映したものです。
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => onSubmit(agenda.trim())}
                disabled={!valid}
                style={{
                  background: 'transparent', border: `1px solid ${C.orange}`, color: C.orange,
                  fontFamily: C.font, fontSize: '14px', letterSpacing: '0.3em', padding: '14px 48px',
                  cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : 0.3,
                  clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                  transition: 'all 0.2s',
                }}
              >
                SUBMIT TO MAGI ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.dim }}>
        <span>MAGI CONSENSUS PROTOCOL</span>
        <span style={{ color: C.green }}>● ALL UNITS ONLINE</span>
      </div>
    </div>
  )
}
