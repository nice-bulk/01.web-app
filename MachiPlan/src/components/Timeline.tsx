import type { Spot } from '../types/plan';

interface TimelineProps {
  spots: Spot[];
  totalCost: number;
  budget: number;
  summary: string;
}

const CATEGORY_META: Record<Spot['category'], { icon: string; color: string; label: string }> = {
  sightseeing: { icon: '🏛️', color: '#4A90A4', label: '観光' },
  lunch:        { icon: '🍱', color: '#E8875A', label: 'ランチ' },
  dinner:       { icon: '🍽️', color: '#C0694A', label: 'ディナー' },
  cafe:         { icon: '☕', color: '#8B6F5A', label: 'カフェ' },
  shopping:     { icon: '🛍️', color: '#6B8E6B', label: 'ショッピング' },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'star filled' : 'star'}>★</span>
      ))}
    </span>
  );
}

export function Timeline({ spots, totalCost, budget, summary }: TimelineProps) {
  const remaining = budget - totalCost;

  return (
    <div className="timeline-wrap" id="tour-plan-result">
      <div className="timeline">
        {spots.map((spot, idx) => {
          const meta = CATEGORY_META[spot.category] ?? CATEGORY_META.sightseeing;
          return (
            <div key={idx} className="timeline-item">
              {/* 縦線 + ドット */}
              <div className="timeline-rail">
                <div className="dot" style={{ background: meta.color }}>
                  <span className="dot-icon">{meta.icon}</span>
                </div>
                {idx < spots.length - 1 && <div className="rail-line" />}
              </div>

              {/* カード */}
              <div className="timeline-card">
                {/* ヘッダー */}
                <div className="card-header">
                  <div className="card-header-left">
                    <span className="time-badge">{spot.time}</span>
                    <span className="category-badge" style={{ background: meta.color }}>
                      {meta.label}
                    </span>
                  </div>
                  <Stars rating={spot.rating} />
                </div>

                <h3 className="spot-name">{spot.name}</h3>
                <p className="spot-desc">{spot.description}</p>

                {/* 詳細グリッド */}
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-icon">💴</span>
                    <div>
                      <div className="detail-label">費用</div>
                      <div className="detail-value">¥{spot.cost.toLocaleString()}</div>
                      <div className="detail-sub">{spot.costNote}</div>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">🚶</span>
                    <div>
                      <div className="detail-label">移動</div>
                      <div className="detail-value">{spot.transport}</div>
                    </div>
                  </div>
                </div>

                {/* 口コミ */}
                <div className="review-box">
                  <span className="review-quote">"</span>
                  {spot.review}
                  <span className="review-quote">"</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 予算サマリー */}
      <div className="budget-summary">
        <div className="budget-row">
          <span>予算</span>
          <span className="budget-val">¥{budget.toLocaleString()}</span>
        </div>
        <div className="budget-row">
          <span>合計費用</span>
          <span className="budget-val">¥{totalCost.toLocaleString()}</span>
        </div>
        <div className="budget-divider" />
        <div className="budget-row remaining">
          <span>残り予算</span>
          <span className={`budget-val ${remaining >= 0 ? 'positive' : 'negative'}`}>
            {remaining >= 0 ? '+' : ''}¥{remaining.toLocaleString()}
          </span>
        </div>
        <p className="summary-text">{summary}</p>
      </div>
    </div>
  );
}
