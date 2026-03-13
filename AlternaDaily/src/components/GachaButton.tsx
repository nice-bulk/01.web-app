import { useState } from 'react';

interface Props {
  onDraw: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function GachaButton({ onDraw, isGenerating, disabled }: Props) {
  const [spinning, setSpinning] = useState(false);

  const handleClick = async () => {
    if (disabled || isGenerating || spinning) return;
    setSpinning(true);
    onDraw();
    setTimeout(() => setSpinning(false), 1000);
  };

  return (
    <div className="gacha-wrapper">
      <button
        className={`gacha-btn ${spinning || isGenerating ? 'spinning' : ''}`}
        onClick={handleClick}
        disabled={disabled || isGenerating}
      >
        <span className="gacha-icon">🎲</span>
        <span className="gacha-label">
          {isGenerating ? 'ミッション生成中...' : '今日のミッションを引く'}
        </span>
      </button>
      {isGenerating && (
        <p className="gacha-hint">AIがあなたのミッションを考えています...</p>
      )}
    </div>
  );
}
