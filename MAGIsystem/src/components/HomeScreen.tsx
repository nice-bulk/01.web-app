import { useState } from 'react'
import { loadSavedSets } from '../storage'

interface Props {
  onNewTest: () => void
  onSelectSaved: () => void
}

const C = {
  orange: '#ff6600', red: '#cc0000', green: '#00ff41', amber: '#ffaa00',
  bg: '#050505', panel: '#0a0a0a', border: '#1a1a1a',
  dim: '#555555', bright: '#eeeeee',
  font: '"Share Tech Mono", monospace',
  serif: '"Noto Serif JP", serif',
}

export default function HomeScreen({ onNewTest, onSelectSaved }: Props) {
  const savedCount = loadSavedSets().length
  const [hoverA, setHoverA] = useState(false)
  const [hoverB, setHoverB] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, fontFamily: C.font,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundImage: `
        linear-gradient(rgba(255,102,0,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,102,0,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>

      {/* タイトル */}
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.4em', marginBottom: '12px' }}>
          GEHIRN SUPERCOMPUTER DIVISION // NERV HQ
        </div>
        <div style={{
          color: C.orange, fontSize: '4rem', fontFamily: C.serif,
          letterSpacing: '0.3em', lineHeight: 1,
          textShadow: '0 0 20px rgba(255,102,0,0.8), 0 0 40px rgba(255,102,0,0.3)',
        }}>
          MAGI
        </div>
        <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.6em', marginTop: '10px' }}>
          MULTI-PURPOSE ARTIFICIAL INTELLIGENCE COMPUTER SYSTEM
        </div>
      </div>

      {/* 選択肢 */}
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>

        {/* 1. 適性試験 */}
        <button
          onClick={onNewTest}
          onMouseEnter={() => setHoverA(true)}
          onMouseLeave={() => setHoverA(false)}
          style={{
            background: hoverA ? 'rgba(255,102,0,0.07)' : 'transparent',
            border: `1px solid ${hoverA ? C.orange : '#2a2a2a'}`,
            color: 'inherit', cursor: 'pointer', fontFamily: C.font,
            padding: '32px 40px', width: '280px', textAlign: 'left',
            boxShadow: hoverA ? `0 0 30px rgba(255,102,0,0.15)` : 'none',
            transition: 'all 0.2s',
            clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
          }}
        >
          <div style={{ color: C.orange, fontSize: '11px', letterSpacing: '0.3em', marginBottom: '12px' }}>
            PHASE 01
          </div>
          <div style={{ color: C.bright, fontSize: '18px', fontFamily: C.serif, marginBottom: '12px', lineHeight: 1.4 }}>
            適性試験を受ける
          </div>
          <div style={{ color: C.dim, fontSize: '12px', lineHeight: 1.7 }}>
            10の質問に回答し、あなた固有の<br />
            3つの人格プロファイルを新規生成する。
          </div>
          <div style={{ color: C.orange, fontSize: '11px', marginTop: '20px', letterSpacing: '0.2em' }}>
            ONBOARDING → INITIALIZATION ▶
          </div>
        </button>

        {/* 2. 保存済み人格を使う */}
        <button
          onClick={onSelectSaved}
          onMouseEnter={() => setHoverB(true)}
          onMouseLeave={() => setHoverB(false)}
          disabled={savedCount === 0}
          style={{
            background: hoverB && savedCount > 0 ? 'rgba(0,204,255,0.05)' : 'transparent',
            border: `1px solid ${savedCount === 0 ? '#1a1a1a' : hoverB ? '#00ccff' : '#2a2a2a'}`,
            color: 'inherit', cursor: savedCount === 0 ? 'not-allowed' : 'pointer',
            fontFamily: C.font, padding: '32px 40px', width: '280px', textAlign: 'left',
            opacity: savedCount === 0 ? 0.4 : 1,
            boxShadow: hoverB && savedCount > 0 ? `0 0 30px rgba(0,204,255,0.1)` : 'none',
            transition: 'all 0.2s',
            clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
          }}
        >
          <div style={{ color: '#00ccff', fontSize: '11px', letterSpacing: '0.3em', marginBottom: '12px' }}>
            PHASE 03
          </div>
          <div style={{ color: C.bright, fontSize: '18px', fontFamily: C.serif, marginBottom: '12px', lineHeight: 1.4 }}>
            保存済み人格を使う
          </div>
          <div style={{ color: C.dim, fontSize: '12px', lineHeight: 1.7 }}>
            過去に生成・保存した人格プロファイルを<br />
            選択して議題に進む。
          </div>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              color: savedCount > 0 ? '#00ccff' : C.dim,
              fontSize: '11px', letterSpacing: '0.2em',
            }}>
              {savedCount > 0
                ? `${savedCount} PROFILE${savedCount > 1 ? 'S' : ''} SAVED ▶`
                : 'NO PROFILES SAVED'}
            </div>
          </div>
        </button>
      </div>

      {/* コーナー装飾 */}
      <div style={{ position: 'fixed', top: '16px', left: '16px', fontSize: '11px' }}>
        <div style={{ color: C.dim }}>NERV HQ // TOKYO-3</div>
        <div style={{ color: C.orange }}>CODE: 601</div>
      </div>
      <div style={{ position: 'fixed', top: '16px', right: '16px', fontSize: '11px', textAlign: 'right' }}>
        <div style={{ color: C.dim }}>CLASSIFIED</div>
        <div style={{ color: C.red }}>LEVEL: ALPHA</div>
      </div>
      <div style={{ position: 'fixed', bottom: '16px', left: '0', right: '0', textAlign: 'center', fontSize: '10px', color: '#2a2a2a', letterSpacing: '0.3em' }}>
        MAGI SYSTEM v3.0.1 // ALL RIGHTS RESERVED GEHIRN INC.
      </div>
    </div>
  )
}
