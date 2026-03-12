import { useState } from 'react'
import type { PersonalityProfile, QuizAnswer, AppPhase } from './types'
import { generatePersonalities } from './gemini'
import BootScreen from './components/BootScreen'
import HomeScreen from './components/HomeScreen'
import OnboardingScreen from './components/OnboardingScreen'
import InitializationScreen from './components/InitializationScreen'
import SelectScreen from './components/SelectScreen'
import AgendaScreen from './components/AgendaScreen'
import ConsensusScreen from './components/ConsensusScreen'
import './index.css'

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('boot')
  const [personalities, setPersonalities] = useState<PersonalityProfile[]>([])
  const [agenda, setAgenda] = useState('')
  const [error, setError] = useState<string | null>(null)

  // 10問回答完了 → Gemini APIで人格生成
  async function handleOnboardingComplete(answers: QuizAnswer[]) {
    setError(null)
    setPhase('initialization')
    try {
      const profiles = await generatePersonalities(answers)
      setPersonalities(profiles)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      console.error(e)
      setPhase('onboarding')
    }
  }

  // 保存済み人格を選択 → 議題入力へ
  function handleSelectSaved(selected: PersonalityProfile[]) {
    setPersonalities(selected)
    setPhase('agenda')
  }

  function handleAgendaSubmit(text: string) {
    setAgenda(text)
    setPhase('consensus')
  }

  // 合議後リセット → ホームに戻る
  function handleReset() {
    setPhase('home')
    setAgenda('')
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontFamily: '"Share Tech Mono", monospace',
      }}>
        <div style={{ textAlign: 'center', padding: '32px', border: '1px solid #cc0000', maxWidth: '480px' }}>
          <div style={{ color: '#cc0000', fontSize: '22px', marginBottom: '16px', textShadow: '0 0 10px #cc000088' }}>
            SYSTEM ERROR
          </div>
          <div style={{ color: '#666', fontSize: '13px', marginBottom: '20px', wordBreak: 'break-all' }}>{error}</div>
          <div style={{ color: '#444', fontSize: '11px', marginBottom: '20px' }}>
            VITE_GEMINI_API_KEY が .env ファイルに正しく設定されているか確認してください
          </div>
          <button
            onClick={() => { setError(null); setPhase('home') }}
            style={{
              background: 'transparent', border: '1px solid #ff6600', color: '#ff6600',
              fontFamily: '"Share Tech Mono", monospace', fontSize: '13px', letterSpacing: '0.2em',
              padding: '10px 32px', cursor: 'pointer',
            }}
          >
            RESTART SYSTEM
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {!import.meta.env.VITE_GEMINI_API_KEY && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(4px)',
          borderBottom: '1px solid #ff660044',
          padding: '6px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
          fontFamily: '"Share Tech Mono", monospace',
        }}>
          <span style={{
            color: '#050505', background: '#ff6600',
            fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em',
            padding: '2px 10px', animation: 'pulse-demo 2.5s ease-in-out infinite',
          }}>DEMO MODE</span>
          <span style={{ color: '#555', fontSize: '11px', letterSpacing: '0.12em' }}>
            API KEY NOT CONFIGURED — RUNNING ON MOCK DATA
          </span>
        </div>
      )}
      {phase === 'boot' && (
        <BootScreen onComplete={() => setPhase('home')} />
      )}
      {phase === 'home' && (
        <HomeScreen
          onNewTest={() => setPhase('onboarding')}
          onSelectSaved={() => setPhase('select')}
        />
      )}
      {phase === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {phase === 'initialization' && (
        <InitializationScreen
          personalities={personalities}
          onComplete={() => setPhase('agenda')}
        />
      )}
      {phase === 'select' && (
        <SelectScreen
          onSelect={handleSelectSaved}
          onBack={() => setPhase('home')}
        />
      )}
      {phase === 'agenda' && personalities.length > 0 && (
        <AgendaScreen personalities={personalities} onSubmit={handleAgendaSubmit} />
      )}
      {phase === 'consensus' && personalities.length > 0 && (
        <ConsensusScreen
          agenda={agenda}
          personalities={personalities}
          onReset={handleReset}
        />
      )}
    </>
  )
}
