import { useState } from 'react';

interface InputFormProps {
  onSubmit: (town: string, budget: number) => void;
  loading: boolean;
}

export function InputForm({ onSubmit, loading }: InputFormProps) {
  const [town, setTown] = useState('');
  const [budget, setBudget] = useState('');

  const handleSubmit = () => {
    const b = parseInt(budget.replace(/,/g, ''), 10);
    if (!town.trim() || isNaN(b) || b <= 0) return;
    onSubmit(town.trim(), b);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="input-form">
      <div className="form-group">
        <label className="form-label">🗾 観光する町</label>
        <input
          className="form-input"
          type="text"
          placeholder="例: 京都、函館、長崎..."
          value={town}
          onChange={e => setTown(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      </div>
      <div className="form-group">
        <label className="form-label">💴 予算（円）</label>
        <input
          className="form-input"
          type="number"
          placeholder="例: 10000"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          onKeyDown={handleKeyDown}
          min={1000}
          disabled={loading}
        />
      </div>
      <button
        className={`plan-btn ${loading ? 'loading' : ''}`}
        onClick={handleSubmit}
        disabled={loading || !town.trim() || !budget}
      >
        {loading ? (
          <span className="btn-loading">
            <span className="spinner" />
            プランを生成中...
          </span>
        ) : (
          '🗺️ 観光プランを作成'
        )}
      </button>
    </div>
  );
}
