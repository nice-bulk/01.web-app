// Yahoo Finance バックエンドから株価を取得するユーティリティ

const SERVER_BASE = 'http://localhost:3001';

export interface StockQuote {
  currentPrice: number;
  previousClose: number;
}

// 複数銘柄の株価を一括取得
export async function fetchQuotes(
  tickers: string[]
): Promise<Record<string, StockQuote | null>> {
  try {
    const res = await fetch(`${SERVER_BASE}/api/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickers }),
    });
    if (!res.ok) throw new Error('株価サーバーエラー');
    return await res.json();
  } catch {
    // サーバーが落ちていても画面は表示できるようにnullを返す
    return Object.fromEntries(tickers.map(t => [t, null]));
  }
}

// 株価を日本円フォーマットに変換（例: 2847 → "2,847円"）
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return 'データなし';
  return `${price.toLocaleString('ja-JP')}円`;
}
