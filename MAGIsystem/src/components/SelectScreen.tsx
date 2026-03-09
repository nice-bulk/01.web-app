import { useState } from 'react'
import type { SavedPersonalitySet, PersonalityProfile } from '../types'
import { loadSavedSets, deleteSavedSet } from '../storage'

interface Props {
  onSelect: (personalities: PersonalityProfile[]) => void
  onBack: () => void
}

const MAGI_LABELS = ['MELCHIOR·1', 'BALTHAZAR·2', 'CASPAR·3']
const PERSONA_COLORS = ['#ff6600', '#cc0000', '#00ccff']

const C = {
  orange: '#ff6600', red: '#cc0000', green: '#00ff41',
  bg: '#050505', panel: '#0a0a0a', border: '#1a1a1a',
  dim: '#555555', bright: '#eeeeee',
  font: '"Share Tech Mono", monospace',
  serif: '"Noto Serif JP", serif',
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function SelectScreen({ onSelect, onBack }: Props) {
  const [sets, setSets] = useState<SavedPersonalitySet[]>(() => loadSavedSets())
  const [selectedId, setSelectedId] = useState<string | null>(sets[0]?.id ?? null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const selected = sets.find(s => s.id === selectedId) ?? null

  function handleDelete(id: string) {
    deleteSavedSet(id)
    const next = loadSavedSets()
    setSets(next)
    if (selectedId === id) setSelectedId(next[0]?.id ?? null)
    setConfirmDelete(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', fontFamily: C.font }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: C.orange, fontSize: '13px', letterSpacing: '0.2em' }}>MAGI SYSTEM</div>
        <div style={{ color: C.dim, fontSize: '11px' }}>PROFILE SELECT // PHASE 3</div>
        <div style={{ color: C.red, fontSize: '11px' }}>CLASSIFIED</div>
      </div>

      <div style={{ flex: 1, display: 'flex' }}>

        {/* 左: プロファイル一覧 */}
        <div style={{ width: '320px', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '20px 24px 12px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em' }}>SAVED PROFILES</div>
            <div style={{ color: '#333', fontSize: '11px', marginTop: '4px' }}>{sets.length} RECORD{sets.length !== 1 ? 'S' : ''} FOUND</div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {sets.length === 0 ? (
              <div style={{ padding: '32px 24px', color: C.dim, fontSize: '12px' }}>
                保存済みのプロファイルはありません。<br />先に適性試験を受けてください。
              </div>
            ) : (
              sets.map(set => (
                <div
                  key={set.id}
                  onClick={() => setSelectedId(set.id)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: `1px solid ${C.border}`,
                    cursor: 'pointer',
                    background: selectedId === set.id ? 'rgba(255,102,0,0.06)' : 'transparent',
                    borderLeft: selectedId === set.id ? `2px solid ${C.orange}` : '2px solid transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ color: selectedId === set.id ? C.orange : C.bright, fontSize: '14px', fontFamily: C.serif, marginBottom: '4px' }}>
                    {set.label}
                  </div>
                  <div style={{ color: C.dim, fontSize: '11px' }}>{formatDate(set.createdAt)}</div>
                  <div style={{ color: '#333', fontSize: '11px', marginTop: '4px' }}>
                    {set.personalities.map(p => p.name).join(' / ')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 右: 詳細プレビュー */}
        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column' }}>
          {selected ? (
            <>
              <div style={{ marginBottom: '32px' }}>
                <div style={{ color: C.dim, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '4px' }}>PROFILE DETAIL</div>
                <div style={{ color: C.bright, fontSize: '22px', fontFamily: C.serif, marginBottom: '4px' }}>{selected.label}</div>
                <div style={{ color: C.dim, fontSize: '11px' }}>CREATED: {formatDate(selected.createdAt)}</div>
              </div>

              {/* 3人格カード */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {selected.personalities.map((p, i) => {
                  const color = PERSONA_COLORS[i] ?? C.orange
                  return (
                    <div key={i} style={{
                      background: C.panel,
                      border: `1px solid ${color}33`,
                      padding: '16px 20px',
                      boxShadow: `0 0 15px ${color}11`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ color, fontSize: '11px', letterSpacing: '0.2em', marginBottom: '4px' }}>{MAGI_LABELS[i]}</div>
                          <div style={{ color, fontSize: '15px', fontFamily: C.serif, textShadow: `0 0 8px ${color}55` }}>{p.name}</div>
                          <div style={{ color: C.dim, fontSize: '11px', marginTop: '2px' }}>{p.title}</div>
                        </div>
                        <div style={{ color, fontSize: '20px', opacity: 0.2 }}>{String(i + 1).padStart(2, '0')}</div>
                      </div>
                      <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '10px', paddingTop: '10px', color: C.dim, fontSize: '12px', lineHeight: 1.6 }}>
                        {p.description}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* アクションボタン */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <button
                  onClick={() => onSelect(selected.personalities)}
                  style={{
                    background: 'transparent', border: `1px solid ${C.orange}`, color: C.orange,
                    fontFamily: C.font, fontSize: '14px', letterSpacing: '0.2em', padding: '14px 48px',
                    cursor: 'pointer',
                    clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
                    transition: 'all 0.2s',
                  }}
                >
                  このプロファイルで議題投入 ▶
                </button>

                {confirmDelete === selected.id ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: C.dim, fontSize: '12px' }}>削除しますか？</span>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      style={{
                        background: 'rgba(204,0,0,0.15)', border: `1px solid ${C.red}`, color: C.red,
                        fontFamily: C.font, fontSize: '12px', padding: '6px 16px', cursor: 'pointer',
                      }}
                    >YES</button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      style={{
                        background: 'transparent', border: `1px solid #333`, color: C.dim,
                        fontFamily: C.font, fontSize: '12px', padding: '6px 16px', cursor: 'pointer',
                      }}
                    >NO</button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(selected.id)}
                    style={{
                      background: 'transparent', border: `1px solid #2a2a2a`, color: C.dim,
                      fontFamily: C.font, fontSize: '12px', padding: '8px 20px', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    DELETE
                  </button>
                )}
              </div>
            </>
          ) : (
            <div style={{ color: C.dim, fontSize: '13px', marginTop: '32px' }}>
              左のリストからプロファイルを選択してください
            </div>
          )}
        </div>
      </div>

      {/* フッター */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'transparent', border: 'none', color: C.dim,
            fontFamily: C.font, fontSize: '12px', letterSpacing: '0.2em', cursor: 'pointer',
          }}
        >
          ◀ BACK TO HOME
        </button>
        <span style={{ color: '#2a2a2a', fontSize: '11px' }}>MAGI PROFILE REGISTRY</span>
      </div>
    </div>
  )
}
