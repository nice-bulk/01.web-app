import { useState, useEffect } from 'react';
import {
  fetchIndustryRanking,
  fetchSimilarStocks,
  type GeminiResponse,
  type StockRankingItem,
  type SimilarStockItem,
  type InputStockInfo,
} from './gemini';
import { fetchQuotes, formatPrice, type StockQuote } from './stockPrice';
import {
  loadHistory,
  addHistory,
  clearHistory,
  loadFavorites,
  toggleFavorite,
  isFavorite,
  type HistoryEntry,
  type FavoriteEntry,
} from './storage';
import { exportRankingCsv, exportSimilarCsv, exportFavoritesCsv } from './export';
import './App.css';

type Tab = 'ranking' | 'similar';
type SidePanel = 'history' | 'favorites' | null;

function App() {
  const [ticker, setTicker] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('ranking');
  const [rankingResult, setRankingResult] = useState<GeminiResponse | null>(null);
  const [similarResult, setSimilarResult] = useState<GeminiResponse | null>(null);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidePanel, setSidePanel] = useState<SidePanel>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [exportFlash, setExportFlash] = useState(false);
  const [quotes, setQuotes] = useState<Record<string, StockQuote | null>>({});

  // 初期ロード
  useEffect(() => {
    setHistory(loadHistory());
    setFavorites(loadFavorites());
  }, []);

  const currentResult = activeTab === 'ranking' ? rankingResult : similarResult;

  const handleRanking = async () => {
    if (!ticker.trim()) { setError('銘柄コードまたは銘柄名を入力してください'); return; }
    setError(null);
    setLoadingRanking(true);
    setActiveTab('ranking');
    try {
      const result = await fetchIndustryRanking(ticker);
      setRankingResult(result);
      // 銘柄コードを抽出して株価を取得
      if (result.rankings?.length) {
        const tickers = result.rankings.map(r => r.ticker);
        const priceData = await fetchQuotes(tickers);
        setQuotes(priceData);
      }
      const updated = addHistory({
        ticker: result.inputStockName || ticker,
        stockName: result.inputStockName || ticker,
        industry: result.industry || '',
        type: 'ranking',
      });
      setHistory(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '不明なエラーが発生しました');
    } finally {
      setLoadingRanking(false);
    }
  };

  const handleSimilar = async () => {
    if (!ticker.trim()) { setError('銘柄コードまたは銘柄名を入力してください'); return; }
    setError(null);
    setLoadingSimilar(true);
    setActiveTab('similar');
    try {
      const result = await fetchSimilarStocks(ticker);
      setSimilarResult(result);
      const updated = addHistory({
        ticker: result.inputStockName || ticker,
        stockName: result.inputStockName || ticker,
        industry: result.industry || '',
        type: 'similar',
      });
      setHistory(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '不明なエラーが発生しました');
    } finally {
      setLoadingSimilar(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!currentResult) return;
    const updated = toggleFavorite({
      ticker: currentResult.inputStockName || ticker,
      name: currentResult.inputStockName || ticker,
      industry: currentResult.industry || '',
    });
    setFavorites(updated);
  };

  const handleLoadFromHistory = (entry: HistoryEntry) => {
    setTicker(entry.stockName);
    setSidePanel(null);
  };

  const handleLoadFromFavorite = (entry: FavoriteEntry) => {
    setTicker(entry.name);
    setSidePanel(null);
  };

  const handleExport = () => {
    if (activeTab === 'ranking' && rankingResult?.rankings) {
      exportRankingCsv(rankingResult.rankings, rankingResult.inputStockName || ticker, rankingResult.industry || '');
    } else if (activeTab === 'similar' && similarResult?.similarStocks) {
      exportSimilarCsv(similarResult.similarStocks, similarResult.inputStockName || ticker);
    }
    setExportFlash(true);
    setTimeout(() => setExportFlash(false), 1500);
  };

  const isLoading = loadingRanking || loadingSimilar;
  const isFav = currentResult
    ? isFavorite(currentResult.inputStockName || ticker, favorites)
    : false;
  const canExport =
    (activeTab === 'ranking' && !!rankingResult?.rankings?.length) ||
    (activeTab === 'similar' && !!similarResult?.similarStocks?.length);

  return (
    <div className="app">
      <div className="bg-grid" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-mark">N</span>
            <span className="logo-text">ew<span className="logo-accent">Pick</span></span>
          </div>
          <p className="header-subtitle">日本株 ポテンシャル分析ツール</p>
          {!import.meta.env.VITE_GEMINI_API_KEY && (
            <span className="demo-badge">DEMO MODE</span>
          )}
          <div className="header-actions">
            <button
              className={`header-icon-btn ${sidePanel === 'history' ? 'active' : ''}`}
              onClick={() => setSidePanel(p => p === 'history' ? null : 'history')}
              title="検索履歴"
            >
              <span>🕐</span>
              {history.length > 0 && <span className="badge">{history.length}</span>}
            </button>
            <button
              className={`header-icon-btn ${sidePanel === 'favorites' ? 'active' : ''}`}
              onClick={() => setSidePanel(p => p === 'favorites' ? null : 'favorites')}
              title="お気に入り"
            >
              <span>⭐</span>
              {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="layout">
        {/* Main Content */}
        <main className="main">
          {/* Input Panel */}
          <section className="input-panel">
            <div className="input-row">
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">
                  <span className="label-icon">📈</span>銘柄コード / 銘柄名
                </label>
                <input
                  type="text"
                  className="input-field ticker-field"
                  placeholder="例: 7203 / トヨタ自動車"
                  value={ticker}
                  onChange={e => setTicker(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleRanking(); }}
                />
              </div>
            </div>

            <div className="btn-group">
              <button className="btn btn-primary" onClick={handleRanking} disabled={isLoading}>
                {loadingRanking
                  ? <><span className="spinner" /> 検索中...</>
                  : <><span>🏆</span> 同業界ランキング検索</>}
              </button>
              <button className="btn btn-secondary" onClick={handleSimilar} disabled={isLoading}>
                {loadingSimilar
                  ? <><span className="spinner" /> 検索中...</>
                  : <><span>🔍</span> 同ポテンシャル銘柄検索</>}
              </button>
            </div>

            {error && <div className="error-box"><span>⚠️</span> {error}</div>}
          </section>

          {/* Sample chips when empty */}
          {!isLoading && !rankingResult && !similarResult && !error && (
            <div className="empty-state">
              <div className="empty-icon">🇯🇵</div>
              <p className="empty-title">日本株を分析しましょう</p>
              <p className="empty-desc">銘柄コードや銘柄名を入力して、<br />同業界ランキングや類似ポテンシャル銘柄を検索できます</p>
              <div className="sample-tickers">
                <span className="sample-label">サンプル：</span>
                {['7203（トヨタ）', '6758（ソニー）', '9984（ソフトバンクG）', '8306（三菱UFJ）'].map(s => (
                  <button key={s} className="sample-chip" onClick={() => setTicker(s.split('（')[0])}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && !rankingResult && !similarResult && (
            <div className="loading-state">
              <div className="loading-orb" />
              <p>Gemini AIが分析中...</p>
              <p className="loading-sub">東証プライム市場のデータを処理しています</p>
            </div>
          )}

          {/* Results */}
          {(rankingResult || similarResult) && (
            <section className="results-panel">
              {/* Banner + actions */}
              {currentResult && (
                <div className="stock-banner">
                  <div className="stock-banner-inner">
                    <div className="stock-ticker-badge">{currentResult.inputStockName || ticker}</div>
                    <div className="stock-industry">{currentResult.industry}</div>
                  </div>
                  <div className="banner-actions">
                    <button
                      className={`action-btn fav-btn ${isFav ? 'fav-active' : ''}`}
                      onClick={handleToggleFavorite}
                      title={isFav ? 'お気に入り解除' : 'お気に入りに追加'}
                    >
                      {isFav ? '⭐' : '☆'} {isFav ? '登録済み' : 'お気に入り'}
                    </button>
                    {canExport && (
                      <button
                        className={`action-btn export-btn ${exportFlash ? 'flash' : ''}`}
                        onClick={handleExport}
                        title="CSVエクスポート"
                      >
                        {exportFlash ? '✅ ダウンロード中...' : '📥 CSV出力'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="tab-bar">
                <button
                  className={`tab-btn ${activeTab === 'ranking' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ranking')}
                  disabled={!rankingResult}
                >
                  <span>🏆</span> 同業界ランキング
                  {rankingResult && <span className="tab-count">{rankingResult.rankings?.length}</span>}
                </button>
                <button
                  className={`tab-btn ${activeTab === 'similar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('similar')}
                  disabled={!similarResult}
                >
                  <span>🔍</span> 同ポテンシャル銘柄
                  {similarResult && <span className="tab-count">{similarResult.similarStocks?.length}</span>}
                </button>
              </div>

              {activeTab === 'ranking' && rankingResult?.rankings && (
                <RankingTable items={rankingResult.rankings} quotes={quotes} />
              )}
              {activeTab === 'similar' && similarResult?.similarStocks && (
                <SimilarGrid
                  items={similarResult.similarStocks}
                  inputStockInfo={similarResult.inputStockInfo}
                />
              )}
            </section>
          )}
        </main>

        {/* Side Panel */}
        {sidePanel && (
          <aside className="side-panel">
            {sidePanel === 'history' && (
              <HistoryPanel
                history={history}
                onLoad={handleLoadFromHistory}
                onClear={() => { setHistory(clearHistory()); }}
                onClose={() => setSidePanel(null)}
              />
            )}
            {sidePanel === 'favorites' && (
              <FavoritesPanel
                favorites={favorites}
                onLoad={handleLoadFromFavorite}
                onToggle={(f) => setFavorites(toggleFavorite(f))}
                onExport={() => exportFavoritesCsv(favorites)}
                onClose={() => setSidePanel(null)}
              />
            )}
          </aside>
        )}
      </div>

      <footer className="footer">
        <p>※ 本ツールの情報はAI生成であり、投資判断の参考に留めてください。投資は自己責任でお願いします。</p>
      </footer>
    </div>
  );
}

/* ---- RankingTable ---- */
function RankingTable({
  items,
  quotes,
}: {
  items: StockRankingItem[];
  quotes: Record<string, StockQuote | null>;
}) {
  return (
    <div className="table-wrap">
      <table className="stock-table">
        <thead>
          <tr>
            <th>順位</th><th>コード</th><th>銘柄名</th>
            <th className="num-col">時価総額</th>
            <th className="num-col">現在株価 <span className="col-hint">※15分遅延</span></th>
            <th className="num-col">目標株価 <span className="col-hint">※アナリスト平均</span></th>
            <th className="num-col">PER <span className="col-hint">実績</span></th>
            <th className="num-col">PBR</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => {
            const quote = quotes[item.ticker];
            return (
              <tr key={item.ticker} className="table-row">
                <td>
                  <span className={`rank-badge rank-${item.rank <= 3 ? item.rank : 'other'}`}>
                    {item.rank <= 3 ? ['🥇','🥈','🥉'][item.rank - 1] : item.rank}
                  </span>
                </td>
                <td><span className="ticker-code">{item.ticker}</span></td>
                <td className="name-col">{item.name}</td>
                <td className="num-col"><span className="value-chip">{item.marketCap}</span></td>
                <td className="num-col">
                  {quote === undefined ? (
                    <span className="value-loading">取得中...</span>
                  ) : quote === null ? (
                    <span className="value-na">取得失敗</span>
                  ) : (
                    <span className="value-current">{formatPrice(quote.currentPrice)}</span>
                  )}
                </td>
                <td className="num-col">
                  {quote === undefined ? (
                    <span className="value-loading">取得中...</span>
                  ) : quote?.targetPrice != null ? (
                    <span className="value-accent">{formatPrice(quote.targetPrice)}</span>
                  ) : (
                    <span className="value-na">{item.targetPrice}</span>
                  )}
                </td>
                <td className="num-col">
                  {quote === undefined ? (
                    <span className="value-loading">取得中...</span>
                  ) : quote?.trailingPE != null ? (
                    <span>{quote.trailingPE.toFixed(1)}x</span>
                  ) : (
                    <span className="value-na">{item.per}</span>
                  )}
                </td>
                <td className="num-col">
                  {quote === undefined ? (
                    <span className="value-loading">取得中...</span>
                  ) : quote?.priceToBook != null ? (
                    <span>{quote.priceToBook.toFixed(2)}x</span>
                  ) : (
                    <span className="value-na">{item.pbr}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ---- SimilarGrid ---- */
function SimilarGrid({
  items,
  inputStockInfo,
}: {
  items: SimilarStockItem[];
  inputStockInfo?: InputStockInfo;
}) {
  return (
    <div className="similar-grid">
      {/* 入力銘柄（基準カード） */}
      {inputStockInfo && (
        <div className="similar-card input-stock-card">
          <div className="input-stock-label">📌 検索銘柄（基準）</div>
          <div className="similar-card-header">
            <div>
              <span className="similar-ticker">{inputStockInfo.ticker}</span>
              <span className="similar-name">{inputStockInfo.name}</span>
            </div>
            <div className="similarity-ring" style={{ '--pct': '100%' } as React.CSSProperties}>
              <span>基準</span>
            </div>
          </div>
          <div className="similar-sector">{inputStockInfo.sector}</div>
          <div className="similar-metrics">
            <div className="metric"><span className="metric-label">PER</span><span className="metric-value">{inputStockInfo.per}</span></div>
            <div className="metric"><span className="metric-label">PBR</span><span className="metric-value">{inputStockInfo.pbr}</span></div>
          </div>
        </div>
      )}
      {/* 類似銘柄 */}
      {items.map(item => (
        <div key={item.ticker} className="similar-card">
          <div className="similar-card-header">
            <div>
              <span className="similar-ticker">{item.ticker}</span>
              <span className="similar-name">{item.name}</span>
            </div>
            <div className="similarity-ring" style={{ '--pct': `${item.similarity}%` } as React.CSSProperties}>
              <span>{item.similarity}</span>
            </div>
          </div>
          <div className="similar-sector">{item.sector}</div>
          <div className="similar-metrics">
            <div className="metric"><span className="metric-label">PER</span><span className="metric-value">{item.per}</span></div>
            <div className="metric"><span className="metric-label">PBR</span><span className="metric-value">{item.pbr}</span></div>
          </div>
          <p className="similar-reason">{item.reason}</p>
        </div>
      ))}
    </div>
  );
}

/* ---- HistoryPanel ---- */
function HistoryPanel({
  history,
  onLoad,
  onClear,
  onClose,
}: {
  history: HistoryEntry[];
  onLoad: (e: HistoryEntry) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  return (
    <div className="panel-inner">
      <div className="panel-header">
        <h3 className="panel-title"><span>🕐</span> 検索履歴</h3>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {history.length > 0 && (
            <button className="panel-clear-btn" onClick={onClear} title="履歴をクリア">🗑️</button>
          )}
          <button className="panel-close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
      {history.length === 0 ? (
        <p className="panel-empty">履歴がありません</p>
      ) : (
        <ul className="panel-list">
          {history.map(entry => (
            <li key={entry.id} className="panel-item" onClick={() => onLoad(entry)}>
              <div className="panel-item-main">
                <span className="panel-item-name">{entry.stockName}</span>
                <span className={`panel-type-badge type-${entry.type}`}>
                  {entry.type === 'ranking' ? '🏆' : '🔍'}
                </span>
              </div>
              <div className="panel-item-sub">
                <span className="panel-item-industry">{entry.industry}</span>
                <span className="panel-item-date">
                  {new Date(entry.searchedAt).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---- FavoritesPanel ---- */
function FavoritesPanel({
  favorites,
  onLoad,
  onToggle,
  onExport,
  onClose,
}: {
  favorites: FavoriteEntry[];
  onLoad: (e: FavoriteEntry) => void;
  onToggle: (e: Omit<FavoriteEntry, 'addedAt'>) => void;
  onExport: () => void;
  onClose: () => void;
}) {
  return (
    <div className="panel-inner">
      <div className="panel-header">
        <h3 className="panel-title"><span>⭐</span> お気に入り</h3>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {favorites.length > 0 && (
            <button className="panel-export-btn" onClick={onExport} title="CSVエクスポート">📥</button>
          )}
          <button className="panel-close-btn" onClick={onClose}>✕</button>
        </div>
      </div>
      {favorites.length === 0 ? (
        <p className="panel-empty">お気に入りがありません<br /><span>検索結果の ☆ から登録できます</span></p>
      ) : (
        <ul className="panel-list">
          {favorites.map(entry => (
            <li key={entry.ticker} className="panel-item">
              <div className="panel-item-main" onClick={() => onLoad(entry)} style={{ cursor: 'pointer', flex: 1 }}>
                <span className="panel-item-name">{entry.name}</span>
                <span className="ticker-code" style={{ fontSize: '0.75rem' }}>{entry.ticker}</span>
              </div>
              <button
                className="fav-remove-btn"
                onClick={() => onToggle({ ticker: entry.ticker, name: entry.name, industry: entry.industry })}
                title="削除"
              >⭐</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
