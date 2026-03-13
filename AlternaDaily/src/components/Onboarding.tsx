import { useState } from 'react';
import type { DifficultySettings, UserProfile } from '../types/mission';
import { saveProfile } from '../utils/storage';

const INTEREST_OPTIONS = [
  '読書', '映画', '音楽', '料理', '旅行', 'スポーツ', 'ゲーム',
  'アート', '写真', '自然', 'カフェ', 'ファッション', 'テクノロジー',
  '歴史', '語学', '筋トレ', 'ヨガ', '散歩',
];

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultySettings>({
    timeCost: '30min',
    movementCost: 'nearby',
    psychologicalBarrier: 'solo',
  });

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleFinish = () => {
    const profile: UserProfile = { nickname, interests, difficulty };
    saveProfile(profile);
    onComplete(profile);
  };

  return (
    <div className="onboarding">
      {step === 0 && (
        <div className="onboarding-step">
          <div className="onboarding-icon">🌱</div>
          <h1>一日一変へようこそ</h1>
          <p className="onboarding-desc">
            毎日ひとつ、新しい何かを体験する。<br />
            小さな変化が、豊かな人生をつくります。
          </p>
          <label className="input-label">
            あなたのニックネームを教えてください
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例：たろう"
              maxLength={20}
              className="text-input"
            />
          </label>
          <button
            className="btn-primary"
            onClick={() => setStep(1)}
            disabled={nickname.trim().length === 0}
          >
            次へ →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="onboarding-step">
          <div className="onboarding-icon">✨</div>
          <h2>あなたの興味・好みは？</h2>
          <p className="onboarding-desc">当てはまるものを選んでください（複数OK）</p>
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
          <div className="onboarding-nav">
            <button className="btn-secondary" onClick={() => setStep(0)}>← 戻る</button>
            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              disabled={interests.length === 0}
            >
              次へ →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step">
          <div className="onboarding-icon">⚙️</div>
          <h2>難易度を設定しよう</h2>
          <p className="onboarding-desc">あなたの今の生活スタイルに合わせて設定できます</p>

          <div className="difficulty-section">
            <h3>🕐 時間コスト</h3>
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
            <h3>🚶 移動コスト</h3>
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
            <h3>💬 心理的ハードル</h3>
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

          <div className="onboarding-nav">
            <button className="btn-secondary" onClick={() => setStep(1)}>← 戻る</button>
            <button className="btn-primary" onClick={handleFinish}>
              はじめる 🎲
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
