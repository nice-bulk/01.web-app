// Yahoo Finance バックエンドから株価を取得するユーティリティ
import { mockFetchQuotes } from './mockData';

const SERVER_BASE = 'http://localhost:3001';

export interface StockQuote {
  currentPrice: number;
  previousClose: number;
  targetPrice: number | null;   // アナリスト平均目標株価
  trailingPE:  number | null;   // 実績PER
  forwardPE:   number | null;   // 予想PER
  priceToBook: number | null;   // PBR
}

// 複数銘柄の株価を一括取得
export async function fetchQuotes(
  tickers: string[]
): Promise<Record<string, StockQuote | null>> {
  // APIキーがない場合はモック株価を返す（デモ環境用）
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return mockFetchQuotes(tickers);
  }

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
