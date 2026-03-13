import type { Mission, MissionCategory } from '../types/mission';

const CATEGORY_LABEL: Record<MissionCategory, string> = {
  action: '🏃 行動系',
  experience: '✨ 体験系',
  thinking: '💭 思考系',
  social: '🤝 人間関係系',
};

const CATEGORY_COLOR: Record<MissionCategory, string> = {
  action: '#ff6b6b',
  experience: '#ffd43b',
  thinking: '#74c0fc',
  social: '#63e6be',
};

interface Props {
  mission: Mission;
  status: 'ready' | 'completed' | 'failed';
  onComplete?: () => void;
  canReroll: boolean;
  onReroll?: () => void;
}

export function MissionCard({ mission, status, onComplete, canReroll, onReroll }: Props) {
  const color = CATEGORY_COLOR[mission.category];

  return (
    <div className={`mission-card ${status}`} style={{ '--card-color': color } as React.CSSProperties}>
      <div className="mission-category-badge">
        {CATEGORY_LABEL[mission.category]}
      </div>

      <h2 className="mission-title">{mission.title}</h2>
      <p className="mission-description">{mission.description}</p>

      <div className="mission-hint">
        <span className="hint-icon">💡</span>
        <span>{mission.hint}</span>
      </div>

      {status === 'ready' && (
        <div className="mission-actions">
          <button className="btn-complete" onClick={onComplete}>
            ✅ 達成した！
          </button>
          {canReroll && (
            <button className="btn-reroll" onClick={onReroll}>
              🎲 引き直す（残り1回）
            </button>
          )}
        </div>
      )}

      {status === 'completed' && (
        <div className="mission-result completed">
          🎉 今日のミッション達成！
        </div>
      )}

      {status === 'failed' && (
        <div className="mission-result failed">
          📝 今日は未達成として記録しました
        </div>
      )}
    </div>
  );
}
