import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8',
};

// 銘柄コードを Yahoo Finance 形式に変換（日本株は末尾に .T）
function toYahooTicker(ticker) {
  const cleaned = ticker.trim();
  if (cleaned.endsWith('.T')) return cleaned;
  if (/^\d{4}$/.test(cleaned)) return `${cleaned}.T`;
  return cleaned;
}

// v8 チャートAPI: 現在株価・前日終値
async function fetchPrice(yticker) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yticker)}?interval=1d&range=2d`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`price HTTP ${res.status}`);
  const data = await res.json();
  const meta = data?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error('株価データなし');
  return {
    currentPrice: meta.regularMarketPrice ?? meta.previousClose ?? null,
    previousClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
  };
}

// v10 quoteSummary: PER・PBR・目標株価
async function fetchSummary(yticker) {
  const modules = 'financialData,defaultKeyStatistics';
  const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(yticker)}?modules=${modules}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) return {};  // 取得できなくてもクラッシュしない
  const data = await res.json();
  const fin = data?.quoteSummary?.result?.[0]?.financialData ?? {};
  const stat = data?.quoteSummary?.result?.[0]?.defaultKeyStatistics ?? {};
  return {
    targetPrice: fin.targetMeanPrice?.raw ?? null,       // アナリスト平均目標株価
    trailingPE:  fin.trailingPE?.raw ?? null,            // 実績PER
    forwardPE:   fin.forwardPE?.raw  ?? null,            // 予想PER
    priceToBook: stat.priceToBook?.raw ?? null,          // PBR
  };
}

// 1銘柄まとめて取得
async function fetchQuote(ticker) {
  const yticker = toYahooTicker(ticker);
  const [price, summary] = await Promise.all([
    fetchPrice(yticker),
    fetchSummary(yticker),
  ]);
  return { ...price, ...summary };
}

// 単一銘柄
app.get('/api/quote/:ticker', async (req, res) => {
  try {
    const quote = await fetchQuote(req.params.ticker);
    res.json({ ticker: req.params.ticker, ...quote });
  } catch (e) {
    console.error(`[${req.params.ticker}] エラー:`, e.message);
    res.status(500).json({ error: e.message });
  }
});

// 複数銘柄一括
app.post('/api/quotes', async (req, res) => {
  const { tickers } = req.body;
  if (!Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: 'tickers配列が必要です' });
  }

  const results = {};
  await Promise.allSettled(
    tickers.map(async (ticker) => {
      try {
        results[ticker] = await fetchQuote(ticker);
      } catch (e) {
        console.error(`[${ticker}] 取得失敗:`, e.message);
        results[ticker] = null;
      }
    })
  );

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`✅ NewPick サーバー起動: http://localhost:${PORT}`);
});
