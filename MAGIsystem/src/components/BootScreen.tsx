import { useEffect, useRef, useState } from 'react'

interface Props {
  onComplete: () => void
}

const BOOT_LINES = [
  'NERV CENTRAL DOGMA MAINFRAME',
  'INITIALIZING MAGI SYSTEM...',
  '> MELCHIOR·1 ... [ONLINE]',
  '> BALTHAZAR·2 ... [ONLINE]',
  '> CASPAR·3 ... [ONLINE]',
  ' ',
  'LOADING PERSONALITY ENGINE v3.0.1',
  'CROSS-REFERENCING NEURAL MATRIX...',
  'SECURITY CLEARANCE: LEVEL ALPHA',
  ' ',
  '██████████████████████ 100%',
  ' ',
  'ALL SYSTEMS NOMINAL',
  'MAGI CONSENSUS PROTOCOL: ACTIVE',
  ' ',
  '--- WELCOME TO MAGI SYSTEM ---',
]

const S = {
  root: {
    minHeight: '100vh',
    background: '#050505',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    fontFamily: '"Share Tech Mono", monospace',
    backgroundImage: `
      linear-gradient(rgba(255,102,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,102,0,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  },
  inner: { width: '100%', maxWidth: '640px' },
  heading: { marginBottom: '2rem', textAlign: 'center' as const },
  sub: { color: '#555', fontSize: '11px', letterSpacing: '0.3em', marginBottom: '8px' },
  title: {
    color: '#ff6600',
    fontSize: '2.5rem',
    letterSpacing: '0.2em',
    textShadow: '0 0 10px rgba(255,102,0,0.8), 0 0 20px rgba(255,102,0,0.4)',
    marginBottom: '4px',
    fontFamily: '"Noto Serif JP", serif',
  },
  sub2: { color: '#555', fontSize: '11px', letterSpacing: '0.5em' },
  terminal: {
    background: '#0a0a0a',
    border: '1px solid #1a1a1a',
    padding: '1.5rem',
    minHeight: '240px',
    position: 'relative' as const,
  },
  termHeader: {
    color: '#444',
    fontSize: '11px',
    marginBottom: '1rem',
    borderBottom: '1px solid #1a1a1a',
    paddingBottom: '8px',
  },
  btnWrap: { marginTop: '2rem', textAlign: 'center' as const },
  btn: {
    background: 'transparent',
    border: '1px solid #ff6600',
    color: '#ff6600',
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '14px',
    letterSpacing: '0.3em',
    padding: '14px 48px',
    cursor: 'pointer',
    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
    transition: 'all 0.2s',
  },
  hint: { marginTop: '12px', color: '#555', fontSize: '11px' },
  cornerTL: { position: 'fixed' as const, top: '16px', left: '16px', fontSize: '11px' },
  cornerTR: { position: 'fixed' as const, top: '16px', right: '16px', fontSize: '11px', textAlign: 'right' as const },
}

function lineColor(line: string | undefined): string {
  if (!line || line.trim() === '') return '#666666'
  if (line.includes('[ONLINE]')) return '#00ff41'
  if (line.includes('100%')) return '#ff6600'
  if (line.includes('---')) return '#ffaa00'
  if (line.includes('ERROR')) return '#cc0000'
  return '#666666'
}

export default function BootScreen({ onComplete }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Enterキーで次へ
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && done) onComplete()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [done, onComplete])

  // ログ追加のたびに最下部へ自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i]
        setLines(prev => [...prev, line])
        i++
      } else {
        clearInterval(interval)
        setTimeout(() => setDone(true), 600)
      }
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={S.root}>
      <div style={S.inner}>
        <div style={S.heading}>
          <div style={S.sub}>GEHIRN SUPERCOMPUTER DIVISION</div>
          <div style={S.title}>MAGI</div>
          <div style={S.sub2}>SYSTEM BOOT SEQUENCE</div>
        </div>

        <div style={S.terminal}>
          <div style={S.termHeader}>TERMINAL // BOOT.LOG</div>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                color: lineColor(line),
                fontSize: '13px',
                marginBottom: '4px',
                fontFamily: '"Share Tech Mono", monospace',
                minHeight: '18px',
              }}
            >
              {line.trim() === '' ? '\u00A0' : line}
            </div>
          ))}
          {!done && <div style={{ color: '#ff6600' }}>█</div>}
          <div ref={bottomRef} />
        </div>

        {done && (
          <div style={S.btnWrap}>
            <button
              onClick={onComplete}
              style={{
                ...S.btn,
                ...(btnHover ? {
                  background: 'rgba(255,102,0,0.15)',
                  boxShadow: '0 0 20px rgba(255,102,0,0.4)',
                  textShadow: '0 0 10px rgba(255,102,0,0.8)',
                } : {}),
              }}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              ENTER SYSTEM
            </button>
            <div style={S.hint}>[ CLICK OR PRESS ENTER TO INITIATE PERSONALITY PROFILING ]</div>
          </div>
        )}
      </div>

      <div style={S.cornerTL}>
        <div style={{ color: '#555', fontSize: '11px' }}>NERV HQ // TOKYO-3</div>
        <div style={{ color: '#ff6600', fontSize: '11px' }}>CODE: 601</div>
      </div>
      <div style={S.cornerTR}>
        <div style={{ color: '#555', fontSize: '11px' }}>CLASSIFIED</div>
        <div style={{ color: '#cc0000', fontSize: '11px' }}>LEVEL: ALPHA</div>
      </div>
    </div>
  )
}
