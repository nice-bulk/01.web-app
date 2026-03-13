import { useEffect, useState } from 'react';
import { getRecords } from '../utils/storage';
import type { MissionRecord, MissionCategory } from '../types/mission';

const CATEGORY_LABEL: Record<MissionCategory, string> = {
  action: '🏃 行動系',
  experience: '✨ 体験系',
  thinking: '💭 思考系',
  social: '🤝 人間関係系',
};

export function History() {
  const [records, setRecords] = useState<MissionRecord[]>([]);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const completedCount = records.filter((r) => r.status === 'completed').length;

  if (records.length === 0) {
    return (
      <div className="history-empty">
        <p>まだ記録がありません。</p>
        <p>ミッションをこなすとここに記録されます。</p>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-summary">
        <div className="summary-stat">
          <span className="stat-num">{records.length}</span>
          <span className="stat-label">総ミッション数</span>
        </div>
        <div className="summary-stat">
          <span className="stat-num">{completedCount}</span>
          <span className="stat-label">達成数</span>
        </div>
        <div className="summary-stat">
          <span className="stat-num">
            {records.length > 0 ? Math.round((completedCount / records.length) * 100) : 0}%
          </span>
          <span className="stat-label">達成率</span>
        </div>
      </div>

      <div className="history-list">
        {records.map((record) => (
          <div key={record.mission.id} className={`history-item ${record.status}`}>
            <div className="history-item-header">
              <span className="history-date">{record.mission.date}</span>
              <span className="history-category">
                {CATEGORY_LABEL[record.mission.category]}
              </span>
              <span className={`history-status ${record.status}`}>
                {record.status === 'completed' ? '✅ 達成' : record.status === 'failed' ? '❌ 未達成' : '⏳ 未完了'}
              </span>
            </div>
            <p className="history-title">{record.mission.title}</p>
            <p className="history-desc">{record.mission.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
