import { useEffect, useState } from 'react'
import type { ConsensusResult, MagiVerdict, PersonalityProfile } from '../types'
import { runMagiJudgment } from '../gemini'

interface Props {
  agenda: string
  personalities: PersonalityProfile[]
  onReset: () => void
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

type VerdictStatus = 'pending' | 'thinking' | 'done' | 'error'
interface MagiState { verdict: MagiVerdict | null; status: VerdictStatus; streamText: string }

function verdictColor(v?: 'ACCEPT' | 'REJECT' | 'PENDING') {
  if (v === 'ACCEPT') return C.green
  if (v === 'REJECT') return C.red
  return C.amber
}

export default function ConsensusScreen({ agenda, personalities, onReset }: Props) {
  const [magiStates, setMagiStates] = useState<MagiState[]>([
    { verdict: null, status: 'pending', streamText: '' },
    { verdict: null, status: 'pending', streamText: '' },
    { verdict: null, status: 'pending', streamText: '' },
  ])
  const [finalResult, setFinalResult] = useState<ConsensusResult | null>(null)
  const [judgmentCode] = useState(() => Math.floor(Math.random() * 900 + 100).toString())

  useEffect(() => {
    personalities.forEach((p, i) => {
      setMagiStates(prev => { const n = [...prev]; n[i] = { ...n[i], status: 'thinking' }; return n })
      runMagiJudgment(agenda, p, MAGI_LABELS[i], chunk => {
        setMagiStates(prev => { const n = [...prev]; n[i] = { ...n[i], streamText: chunk }; return n })
      })
        .then(verdict => {
          setMagiStates(prev => { const n = [...prev]; n[i] = { verdict, status: 'done', streamText: '' }; return n })
        })
        .catch(() => {
          setMagiStates(prev => { const n = [...prev]; n[i] = { ...n[i], status: 'error', streamText: '' }; return n })
        })
    })
  }, [agenda, personalities])

  useEffect(() => {
    const allDone = magiStates.every(s => s.status === 'done' || s.status === 'error')
    if (!allDone || finalResult) return
    const verdicts = magiStates.map(s => s.verdict?.verdict ?? 'REJECT')
    const accepts = verdicts.filter(v => v === 'ACCEPT').length
    const rejects = verdicts.filter(v => v === 'REJECT').length
    const finalVerdict: 'ACCEPT' | 'REJECT' | 'DEADLOCK' = accepts >= 2 ? 'ACCEPT' : rejects >= 2 ? 'REJECT' : 'DEADLOCK'
    setFinalResult({
      melchior: magiStates[0].verdict!,
      balthazar: magiStates[1].verdict!,
      caspar: magiStates[2].verdict!,
      finalVerdict,
      summaryCode: `CODE-${judgmentCode}`,
    })
  }, [magiStates, finalResult, judgmentCode])

  const finalColor = finalResult
    ? finalResult.finalVerdict === 'ACCEPT' ? C.green
      : finalResult.finalVerdict === 'REJECT' ? C.red
      : C.amber
    : C.dim

  const allProcessing = magiStates.every(s => s.status === 'pending' || s.status === 'thinking')

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: C.font }}>

      {/* ── Header ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: C.orange, fontSize: '13px', letterSpacing: '0.2em' }}>MAGI SYSTEM</div>
        <div style={{ color: C.dim, fontSize: '11px' }}>CONSENSUS // PHASE 4</div>
        <div style={{ color: C.red, fontSize: '11px' }}>
          {finalResult ? '■ JUDGEMENT COMPLETE' : '● JUDGEMENT IN PROGRESS'}
        </div>
      </div>

      {/* ── Agenda ── */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px' }}>
        <div style={{ color: C.dim, fontSize: '11px', marginBottom: '4px' }}>AGENDA</div>
        <div style={{ color: C.bright, fontFamily: C.serif, fontSize: '16px' }}>{agenda}</div>
      </div>

      {/* ── FINAL VERDICT（上部）── */}
      {finalResult ? (
        <div style={{
          borderBottom: `2px solid ${finalColor}`,
          background: `${finalColor}0a`,
          padding: '24px 32px',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            {/* 判決テキスト */}
            <div>
              <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '4px' }}>
                MAGI CONSENSUS RESULT // {finalResult.summaryCode}
              </div>
              <div style={{
                color: finalColor, fontSize: '36px', fontFamily: C.serif,
                letterSpacing: '0.1em', textShadow: `0 0 30px ${finalColor}`,
              }}>
                {finalResult.finalVerdict === 'ACCEPT' ? '可決 // ACCEPTED'
                  : finalResult.finalVerdict === 'REJECT' ? '否決 // REJECTED'
                  : 'デッドロック // DEADLOCK'}
              </div>
              <div style={{ color: C.dim, fontSize: '11px', marginTop: '6px' }}>
                {finalResult.finalVerdict === 'ACCEPT' && 'JUDGEMENT: CONSENSUS ACHIEVED — PROPOSAL ACCEPTED'}
                {finalResult.finalVerdict === 'REJECT' && 'JUDGEMENT: CONSENSUS ACHIEVED — PROPOSAL REJECTED'}
                {finalResult.finalVerdict === 'DEADLOCK' && 'JUDGEMENT: NO CONSENSUS — REQUIRES HUMAN DECISION'}
              </div>
            </div>

            {/* 3票の集計 */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              {[finalResult.melchior, finalResult.balthazar, finalResult.caspar].map((v, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ color: PERSONA_COLORS[i], fontSize: '10px', letterSpacing: '0.15em', marginBottom: '6px' }}>
                    {MAGI_LABELS[i].split('·')[0]}
                  </div>
                  <div style={{
                    padding: '8px 14px',
                    border: `1px solid ${verdictColor(v?.verdict)}`,
                    color: verdictColor(v?.verdict),
                    fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.15em',
                    textShadow: `0 0 8px ${verdictColor(v?.verdict)}`,
                    boxShadow: `0 0 10px ${verdictColor(v?.verdict)}33`,
                  }}>
                    {v?.verdict ?? '—'}
                  </div>
                </div>
              ))}
            </div>

            {/* NEW AGENDA ボタン */}
            <button
              onClick={onReset}
              style={{
                background: 'transparent', border: `1px solid ${C.red}`, color: C.red,
                fontFamily: C.font, fontSize: '13px', letterSpacing: '0.2em', padding: '12px 32px',
                cursor: 'pointer', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              }}
            >
              NEW AGENDA ↺
            </button>
          </div>
        </div>
      ) : (
        /* 処理中プレースホルダー */
        <div style={{ borderBottom: `1px solid ${C.border}`, padding: '20px 32px', background: '#0a0a0a' }}>
          <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '6px' }}>MAGI CONSENSUS RESULT</div>
          <div style={{ color: C.orange, fontSize: '14px', letterSpacing: '0.15em' }}>
            {allProcessing ? 'AWAITING MAGI RESPONSE...' : 'PROCESSING...'}
            <span style={{ marginLeft: '8px', opacity: 0.6 }}>█</span>
          </div>
        </div>
      )}

      {/* ── 3 パネル（下部）── */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {magiStates.map((state, i) => {
          const color = PERSONA_COLORS[i] ?? C.orange
          const p = personalities[i]
          return (
            <div key={i} style={{ flex: 1, borderRight: i < 2 ? `1px solid ${C.border}` : 'none', display: 'flex', flexDirection: 'column' }}>
              {/* パネルヘッダー */}
              <div style={{
                padding: '14px 20px',
                borderBottom: `1px solid ${color}33`,
                background: `${color}08`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ color, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '2px' }}>{MAGI_LABELS[i]}</div>
                  <div style={{ color, fontSize: '13px', fontFamily: C.serif }}>{p.name}</div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px' }}>
                  {state.status === 'thinking' && <div style={{ color }}>PROCESSING...</div>}
                  {state.status === 'done' && state.verdict && (
                    <div style={{
                      color: verdictColor(state.verdict.verdict), fontWeight: 'bold',
                      textShadow: `0 0 8px ${verdictColor(state.verdict.verdict)}`,
                    }}>
                      {state.verdict.verdict}
                    </div>
                  )}
                  {state.status === 'pending' && <div style={{ color: C.dim }}>STANDBY</div>}
                  {state.status === 'error' && <div style={{ color: C.red }}>ERROR</div>}
                </div>
              </div>

              {/* コンテンツ */}
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', maxHeight: '400px' }}>
                {state.status === 'thinking' && (
                  <div>
                    <div style={{ color, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px' }}>THINKING LOG</div>
                    <div style={{ color: '#777', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                      {state.streamText
                        ? state.streamText.replace(/```json\n?|\n?```/g, '').substring(0, 400)
                        : '処理中...'}
                      <span style={{ color: C.orange }}>█</span>
                    </div>
                  </div>
                )}
                {state.status === 'done' && state.verdict && (
                  <div>
                    <div style={{ color, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '12px' }}>THOUGHT PROCESS</div>
                    <div style={{ color: C.dim, fontSize: '12px', lineHeight: 1.8, marginBottom: '16px', whiteSpace: 'pre-wrap' }}>
                      {state.verdict.thinkingLog}
                    </div>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px', marginBottom: '16px' }}>
                      <div style={{ color: C.dim, fontSize: '11px', marginBottom: '6px' }}>REASONING</div>
                      <div style={{ color: color + 'cc', fontSize: '12px', lineHeight: 1.7 }}>{state.verdict.reasoning}</div>
                    </div>
                    <div style={{
                      padding: '12px', border: `1px solid ${verdictColor(state.verdict.verdict)}`,
                      textAlign: 'center', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.2em',
                      color: verdictColor(state.verdict.verdict),
                      textShadow: `0 0 10px ${verdictColor(state.verdict.verdict)}`,
                      boxShadow: `0 0 15px ${verdictColor(state.verdict.verdict)}33`,
                    }}>
                      {state.verdict.verdict === 'ACCEPT' ? '可決 // ACCEPT'
                        : state.verdict.verdict === 'REJECT' ? '否決 // REJECT'
                        : '条件付可決 // PENDING'}
                    </div>
                  </div>
                )}
                {state.status === 'pending' && <div style={{ color: C.dim, fontSize: '12px' }}>AWAITING ACTIVATION...</div>}
                {state.status === 'error' && <div style={{ color: C.red, fontSize: '12px' }}>SYSTEM ERROR // UNIT OFFLINE</div>}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── フッター ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: C.dim }}>
        <span>MAGI PARALLEL REASONING ENGINE</span>
        <span style={{ color: C.orange }}>■ ACTIVE</span>
      </div>
    </div>
  )
}
