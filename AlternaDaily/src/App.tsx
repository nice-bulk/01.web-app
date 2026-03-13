import { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { MissionCard } from './components/MissionCard';
import { GachaButton } from './components/GachaButton';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { useMission } from './hooks/useMission';
import { getAppData } from './utils/storage';
import { isDemoMode } from './api/gemini';
import type { UserProfile } from './types/mission';
import './App.css';

type Tab = 'home' | 'history' | 'settings';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const data = getAppData();
    setProfile(data.profile);
    setInitialized(true);
  }, []);

  const {
    mission,
    state,
    streak,
    error,
    isGenerating,
    drawMission,
    complete,
    fail,
  } = useMission(profile);

  if (!initialized) return null;

  if (!profile) {
    return <Onboarding onComplete={(p) => setProfile(p)} />;
  }

  return (
    <div className="app">
      {/* サイドバー */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-mark">変</span>
          <div className="logo-title">
            <span className="logo-text">一日一変</span>
            {isDemoMode && <span className="demo-badge">DEMO</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-btn ${tab === 'home' ? 'active' : ''}`}
            onClick={() => setTab('home')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">ホーム</span>
          </button>
          <button
            className={`nav-btn ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-label">履歴</span>
          </button>
          <button
            className={`nav-btn ${tab === 'settings' ? 'active' : ''}`}
            onClick={() => setTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">設定</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-profile">
            <span className="profile-avatar">
              {profile.nickname.charAt(0)}
            </span>
            <span className="profile-name">{profile.nickname}</span>
          </div>
          {streak > 0 && (
            <div className="streak-badge">🔥 {streak}日連続</div>
          )}
        </div>
      </aside>

      {/* メインコンテンツ */}
      <main className="main-content">
        {tab === 'home' && (
          <div className="home">
            <header className="page-header">
              <div>
                <h1 className="page-title">今日のミッション</h1>
                <p className="page-subtitle">
                  {new Date().toLocaleDateString('ja-JP', {
                    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
                  })}
                </p>
              </div>
              {streak > 0 && (
                <div className="streak-badge-large">🔥 {streak}日連続達成中</div>
              )}
            </header>

            {isDemoMode && (
              <div className="demo-notice">
                🧪 デモモードで動作中です。実際のミッション生成には <code>VITE_GEMINI_API_KEY</code> の設定が必要です。
              </div>
            )}

            <div className="home-body">
              <div className="home-main">
                {state === 'loading' && (
                  <div className="state-placeholder">
                    <div className="loading-spinner" />
                    <p>読み込み中...</p>
                  </div>
                )}

                {state === 'idle' && !isGenerating && (
                  <div className="idle-state">
                    <p className="idle-message">
                      今日はまだミッションを引いていません。<br />
                      ガチャを引いて、今日の「一変」を見つけよう。
                    </p>
                    <GachaButton
                      onDraw={() => drawMission(false)}
                      isGenerating={isGenerating}
                    />
                  </div>
                )}

                {isGenerating && (
                  <div className="state-placeholder">
                    <div className="loading-spinner accent" />
                    <p className="generating-text">AIがあなたのミッションを考えています...</p>
                  </div>
                )}

                {error && (
                  <div className="error-msg">
                    <p>⚠️ {error}</p>
                    <button className="btn-secondary" onClick={() => drawMission(false)}>
                      もう一度試す
                    </button>
                  </div>
                )}

                {mission && (state === 'ready' || state === 'completed' || state === 'failed') && (
                  <div className="mission-area">
                    <MissionCard
                      mission={mission}
                      status={state === 'ready' ? 'ready' : state}
                      onComplete={complete}
                      canReroll={!mission.isRerolled && state === 'ready'}
                      onReroll={() => drawMission(true)}
                    />
                    {state === 'ready' && (
                      <button className="btn-ghost" onClick={fail}>
                        今日はできなかった
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* サイドパネル：難易度設定サマリー */}
              <aside className="home-side">
                <div className="side-card">
                  <h3 className="side-card-title">現在の難易度設定</h3>
                  <div className="side-card-items">
                    <div className="side-item">
                      <span className="side-item-icon">🕐</span>
                      <div>
                        <p className="side-item-label">時間コスト</p>
                        <p className="side-item-value">
                          {{ '5min': '5分程度', '30min': '30分程度', halfday: '半日程度' }[profile.difficulty.timeCost]}
                        </p>
                      </div>
                    </div>
                    <div className="side-item">
                      <span className="side-item-icon">🚶</span>
                      <div>
                        <p className="side-item-label">移動コスト</p>
                        <p className="side-item-value">
                          {{ home: '家でできる', nearby: '近所で完結', anywhere: 'どこでもOK' }[profile.difficulty.movementCost]}
                        </p>
                      </div>
                    </div>
                    <div className="side-item">
                      <span className="side-item-icon">💬</span>
                      <div>
                        <p className="side-item-label">心理的ハードル</p>
                        <p className="side-item-value">
                          {{ solo: '一人でできる', courage: '少し勇気がいる', social: '知らない人が関わる' }[profile.difficulty.psychologicalBarrier]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="side-card">
                  <h3 className="side-card-title">好み・興味</h3>
                  <div className="side-tags">
                    {profile.interests.map((i) => (
                      <span key={i} className="side-tag">{i}</span>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="history-page">
            <header className="page-header">
              <h1 className="page-title">履歴</h1>
              <p className="page-subtitle">これまでの「一変」の記録</p>
            </header>
            <History />
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <header className="page-header">
              <h1 className="page-title">設定</h1>
              <p className="page-subtitle">プロフィールと難易度を編集できます</p>
            </header>
            <Settings profile={profile} onSave={(p) => setProfile(p)} />
          </div>
        )}
      </main>
    </div>
  );
}
