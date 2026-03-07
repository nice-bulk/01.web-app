import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { Timeline } from './components/Timeline';
import { generateTourPlan } from './api/gemini';
import { exportToPDF } from './utils/exportPDF';
import type { TourPlan } from './types/plan';
import './App.css';

function App() {
  const [plan, setPlan] = useState<TourPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleExportPDF = async () => {
    if (!plan) return;
    setPdfLoading(true);
    try {
      await exportToPDF(plan);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'PDF出力に失敗しました');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleSubmit = async (town: string, budget: number) => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const result = await generateTourPlan(town, budget);
      setPlan(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : '予期せぬエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* ヘッダー */}
      <header className="app-header">
        <div className="header-inner">
          <div className="header-logo">
            <span className="logo-icon">🗾</span>
            <div>
              <h1 className="logo-title">MachiPlan</h1>
              <p className="logo-sub">AI観光プランナー</p>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* 入力フォーム */}
        <section className="form-section">
          <div className="form-section-inner">
            <h2 className="section-title">今日はどこへ行きますか？</h2>
            <p className="section-desc">
              町の名前と予算を入力すると、AIが一日の観光プランを作成します
            </p>
            <InputForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </section>

        {/* エラー */}
        {error && (
          <div className="error-box">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* 結果 */}
        {plan && (
          <section className="result-section">
            <div className="result-header">
              <div className="result-header-top">
                <div>
                  <h2 className="result-title">
                    <span className="result-town">{plan.town}</span> 一日観光プラン
                  </h2>
                  <p className="result-subtitle">
                    {plan.spots.length}スポット ・ 予算 ¥{plan.budget.toLocaleString()}
                  </p>
                </div>
                <button
                  className={`pdf-btn ${pdfLoading ? 'loading' : ''}`}
                  onClick={handleExportPDF}
                  disabled={pdfLoading}
                >
                  {pdfLoading ? (
                    <span className="btn-loading"><span className="spinner" />生成中...</span>
                  ) : (
                    '📄 PDFで保存'
                  )}
                </button>
              </div>
            </div>
            <Timeline
              spots={plan.spots}
              totalCost={plan.totalCost}
              budget={plan.budget}
              summary={plan.summary}
            />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Gemini AI</p>
      </footer>
    </div>
  );
}

export default App;
