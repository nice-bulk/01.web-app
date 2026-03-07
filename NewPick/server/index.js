import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

const app = express();
const PORT = 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// 銘柄コードを Yahoo Finance 形式に変換（日本株は末尾に .T）
function toYahooTicker(ticker) {
  const cleaned = ticker.trim();
  if (cleaned.endsWith('.T')) return cleaned;
  if (/^\d{4}$/.test(cleaned)) return `${cleaned}.T`;
  return cleaned;
}

// 単一銘柄の株価取得
app.get('/api/quote/:ticker', async (req, res) => {
  try {
    const yticker = toYahooTicker(req.params.ticker);
    const quote = await yahooFinance.quote(yticker);

    if (!quote?.regularMarketPrice) {
      return res.status(404).json({ error: '株価データが見つかりませんでした' });
    }

    res.json({
      ticker: req.params.ticker,
      currentPrice: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose,
      name: quote.shortName || quote.longName || '',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 複数銘柄の株価を一括取得
app.post('/api/quotes', async (req, res) => {
  const { tickers } = req.body;
  if (!Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: 'tickers配列が必要です' });
  }

  const results = {};
  await Promise.allSettled(
    tickers.map(async (ticker) => {
      try {
        const yticker = toYahooTicker(ticker);
        const quote = await yahooFinance.quote(yticker);
        if (quote?.regularMarketPrice) {
          results[ticker] = {
            currentPrice: quote.regularMarketPrice,
            previousClose: quote.regularMarketPreviousClose,
          };
        } else {
          results[ticker] = null;
        }
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
