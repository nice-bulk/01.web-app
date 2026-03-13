import { useState } from 'react';
import type { DifficultySettings, UserProfile } from '../types/mission';
import { saveProfile } from '../utils/storage';

const INTEREST_OPTIONS = [
  '読書', '映画', '音楽', '料理', '旅行', 'スポーツ', 'ゲーム',
  'アート', '写真', '自然', 'カフェ', 'ファッション', 'テクノロジー',
  '歴史', '語学', '筋トレ', 'ヨガ', '散歩',
];

const TIME_COST_LABEL: Record<string, string> = {
  '5min': '5分程度', '30min': '30分程度', halfday: '半日程度',
};
const MOVEMENT_LABEL: Record<string, string> = {
  home: '家でできる', nearby: '近所で完結', anywhere: 'どこでもOK',
};
const BARRIER_LABEL: Record<string, string> = {
  solo: '一人でできる', courage: '少し勇気がいる', social: '知らない人が関わる',
};

interface Props {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

export function Settings({ profile, onSave }: Props) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [interests, setInterests] = useState<string[]>(profile.interests);
  const [difficulty, setDifficulty] = useState<DifficultySettings>(profile.difficulty);
  const [saved, setSaved] = useState(false);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSave = () => {
    const newProfile: UserProfile = { nickname, interests, difficulty };
    saveProfile(newProfile);
    onSave(newProfile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const canSave = nickname.trim().length > 0 && interests.length > 0;

  return (
    <div className="settings-layout">
      {/* 左：設定フォーム */}
      <div className="settings">
        <section className="settings-section">
          <h3>ニックネーム</h3>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={20}
            className="text-input"
          />
        </section>

        <section className="settings-section">
          <h3>興味・好み</h3>
          <p className="settings-hint">ミッションの内容に反映されます（複数選択可）</p>
          <div className="interest-grid">
            {INTEREST_OPTIONS.map((item) => (
              <button
                key={item}
                className={`interest-chip ${interests.includes(item) ? 'selected' : ''}`}
                onClick={() => toggleInterest(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h3>難易度設定</h3>
          <p className="settings-hint">今の生活スタイルに合わせて調整できます</p>

          <div className="difficulty-section">
            <h4>🕐 時間コスト</h4>
            <div className="difficulty-options">
              {([['5min', '5分程度'], ['30min', '30分程度'], ['halfday', '半日程度']] as const).map(([val, label]) => (
                <button
                  key={val}
                  className={`diff-chip ${difficulty.timeCost === val ? 'selected' : ''}`}
                  onClick={() => setDifficulty({ ...difficulty, timeCost: val })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="difficulty-section">
            <h4>🚶 移動コスト</h4>
            <div className="difficulty-options">
              {([['home', '家でできる'], ['nearby', '近所で完結'], ['anywhere', 'どこでもOK']] as const).map(([val, label]) => (
                <button
                  key={val}
                  className={`diff-chip ${difficulty.movementCost === val ? 'selected' : ''}`}
                  onClick={() => setDifficulty({ ...difficulty, movementCost: val })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="difficulty-section">
            <h4>💬 心理的ハードル</h4>
            <div className="difficulty-options">
              {([['solo', '一人でできる'], ['courage', '少し勇気がいる'], ['social', '知らない人が関わる']] as const).map(([val, label]) => (
                <button
                  key={val}
                  className={`diff-chip ${difficulty.psychologicalBarrier === val ? 'selected' : ''}`}
                  onClick={() => setDifficulty({ ...difficulty, psychologicalBarrier: val })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={!canSave}
        >
          {saved ? '✅ 保存しました！' : '保存する'}
        </button>
      </div>

      {/* 右：プレビューパネル */}
      <aside className="settings-side">
        <div className="side-card">
          <h3 className="side-card-title">プレビュー</h3>
          <div className="settings-preview-profile">
            <div className="preview-avatar">
              {nickname.trim().charAt(0) || '?'}
            </div>
            <div>
              <p className="preview-name">{nickname.trim() || '（未入力）'}</p>
              <p className="preview-sub">{interests.length}個の興味を設定中</p>
            </div>
          </div>
        </div>

        <div className="side-card">
          <h3 className="side-card-title">難易度サマリー</h3>
          <div className="side-card-items">
            <div className="side-item">
              <span className="side-item-icon">🕐</span>
              <div>
                <p className="side-item-label">時間コスト</p>
                <p className="side-item-value">{TIME_COST_LABEL[difficulty.timeCost]}</p>
              </div>
            </div>
            <div className="side-item">
              <span className="side-item-icon">🚶</span>
              <div>
                <p className="side-item-label">移動コスト</p>
                <p className="side-item-value">{MOVEMENT_LABEL[difficulty.movementCost]}</p>
              </div>
            </div>
            <div className="side-item">
              <span className="side-item-icon">💬</span>
              <div>
                <p className="side-item-label">心理的ハードル</p>
                <p className="side-item-value">{BARRIER_LABEL[difficulty.psychologicalBarrier]}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="side-card">
          <h3 className="side-card-title">選択中の興味</h3>
          {interests.length === 0 ? (
            <p className="preview-empty">まだ選択されていません</p>
          ) : (
            <div className="side-tags">
              {interests.map((i) => (
                <span key={i} className="side-tag">{i}</span>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
