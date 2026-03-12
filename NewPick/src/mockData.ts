/**
 * デモ用モックデータ
 * VITE_GEMINI_API_KEY が未設定の環境で自動的に使用される
 */

import type { GeminiResponse } from './gemini';
import type { StockQuote } from './stockPrice';

// ===== 同業界ランキング モックデータ =====

const RANKING_MOCKS: Record<string, GeminiResponse> = {
  '7203': {
    industry: '輸送用機器（自動車）',
    inputStockName: 'トヨタ自動車',
    rankings: [
      { rank: 1, ticker: '7203', name: 'トヨタ自動車', marketCap: '45.2兆円', targetPrice: '3,200円', per: '10.2倍', pbr: '1.1倍' },
      { rank: 2, ticker: '7267', name: 'ホンダ', marketCap: '7.8兆円', targetPrice: '1,850円', per: '7.8倍', pbr: '0.6倍' },
      { rank: 3, ticker: '7270', name: 'SUBARU', marketCap: '2.4兆円', targetPrice: '2,800円', per: '8.5倍', pbr: '0.9倍' },
      { rank: 4, ticker: '7201', name: '日産自動車', marketCap: '1.6兆円', targetPrice: '550円', per: 'データなし', pbr: '0.3倍' },
      { rank: 5, ticker: '7269', name: 'スズキ', marketCap: '2.9兆円', targetPrice: '1,950円', per: '12.3倍', pbr: '1.3倍' },
      { rank: 6, ticker: '7261', name: 'マツダ', marketCap: '0.8兆円', targetPrice: '1,300円', per: '6.2倍', pbr: '0.5倍' },
      { rank: 7, ticker: '7272', name: 'ヤマハ発動機', marketCap: '0.9兆円', targetPrice: '1,600円', per: '9.1倍', pbr: '1.0倍' },
    ],
  },
  '6758': {
    industry: '電気機器（電子・エンタメ）',
    inputStockName: 'ソニーグループ',
    rankings: [
      { rank: 1, ticker: '6758', name: 'ソニーグループ', marketCap: '18.5兆円', targetPrice: '14,500円', per: '18.3倍', pbr: '2.4倍' },
      { rank: 2, ticker: '6752', name: 'パナソニックHD', marketCap: '2.6兆円', targetPrice: '1,450円', per: '15.2倍', pbr: '0.9倍' },
      { rank: 3, ticker: '6971', name: '京セラ', marketCap: '2.1兆円', targetPrice: '1,700円', per: '22.4倍', pbr: '0.8倍' },
      { rank: 4, ticker: '6701', name: 'NEC', marketCap: '1.8兆円', targetPrice: '13,500円', per: '21.6倍', pbr: '3.1倍' },
      { rank: 5, ticker: '6702', name: '富士通', marketCap: '4.2兆円', targetPrice: '3,100円', per: '28.7倍', pbr: '5.8倍' },
      { rank: 6, ticker: '6724', name: 'セイコーエプソン', marketCap: '0.6兆円', targetPrice: '2,100円', per: '11.3倍', pbr: '1.2倍' },
    ],
  },
  '9984': {
    industry: '情報・通信業（持株会社）',
    inputStockName: 'ソフトバンクグループ',
    rankings: [
      { rank: 1, ticker: '9984', name: 'ソフトバンクグループ', marketCap: '14.2兆円', targetPrice: '10,500円', per: 'データなし', pbr: '1.8倍' },
      { rank: 2, ticker: '9433', name: 'KDDI', marketCap: '9.6兆円', targetPrice: '5,200円', per: '14.8倍', pbr: '2.1倍' },
      { rank: 3, ticker: '9432', name: '日本電信電話（NTT）', marketCap: '15.8兆円', targetPrice: '180円', per: '12.1倍', pbr: '1.6倍' },
      { rank: 4, ticker: '9434', name: 'ソフトバンク', marketCap: '9.2兆円', targetPrice: '2,100円', per: '19.4倍', pbr: '5.3倍' },
      { rank: 5, ticker: '4689', name: 'LINEヤフー', marketCap: '1.9兆円', targetPrice: '380円', per: '25.2倍', pbr: '1.9倍' },
    ],
  },
  '8306': {
    industry: '銀行業（メガバンク）',
    inputStockName: '三菱UFJフィナンシャル・グループ',
    rankings: [
      { rank: 1, ticker: '8306', name: '三菱UFJフィナンシャル・グループ', marketCap: '19.8兆円', targetPrice: '1,650円', per: '11.2倍', pbr: '0.9倍' },
      { rank: 2, ticker: '8316', name: '三井住友フィナンシャルグループ', marketCap: '13.4兆円', targetPrice: '3,900円', per: '10.8倍', pbr: '0.8倍' },
      { rank: 3, ticker: '8411', name: 'みずほフィナンシャルグループ', marketCap: '7.2兆円', targetPrice: '3,200円', per: '10.1倍', pbr: '0.7倍' },
      { rank: 4, ticker: '8354', name: 'ふくおかフィナンシャルグループ', marketCap: '0.7兆円', targetPrice: '4,200円', per: '9.8倍', pbr: '0.6倍' },
      { rank: 5, ticker: '8331', name: '千葉銀行', marketCap: '0.5兆円', targetPrice: '1,100円', per: '8.9倍', pbr: '0.5倍' },
    ],
  },
};

// ===== 同ポテンシャル銘柄 モックデータ =====

const SIMILAR_MOCKS: Record<string, GeminiResponse> = {
  '7203': {
    industry: '輸送用機器（自動車）',
    inputStockName: 'トヨタ自動車',
    inputStockInfo: {
      ticker: '7203',
      name: 'トヨタ自動車',
      sector: '輸送用機器',
      per: '10.2倍',
      pbr: '1.1倍',
    },
    similarStocks: [
      { ticker: '6301', name: 'コマツ', sector: '機械', per: '11.5倍', pbr: '1.3倍', similarity: 82, reason: '製造業の巨人。グローバル展開・安定配当・PER水準が類似' },
      { ticker: '7011', name: '三菱重工業', sector: '機械', per: '12.8倍', pbr: '1.8倍', similarity: 75, reason: '防衛・エネルギー転換で成長加速。収益構造の安定性が共通' },
      { ticker: '9101', name: '日本郵船', sector: '海運', per: '8.6倍', pbr: '0.9倍', similarity: 71, reason: '低PBR割安株。大型株で機関投資家好み。配当利回り高水準' },
      { ticker: '5401', name: '日本製鉄', sector: '鉄鋼', per: '9.3倍', pbr: '0.7倍', reason: '景気敏感・低PBR改善期待。ROE向上ストーリーが類似', similarity: 68 },
      { ticker: '8058', name: '三菱商事', sector: '卸売業', per: '10.1倍', pbr: '1.2倍', reason: '総合商社の雄。多角的事業構成・安定配当・バフェット銘柄', similarity: 77 },
    ],
  },
  '6758': {
    industry: '電気機器（電子・エンタメ）',
    inputStockName: 'ソニーグループ',
    inputStockInfo: {
      ticker: '6758',
      name: 'ソニーグループ',
      sector: '電気機器',
      per: '18.3倍',
      pbr: '2.4倍',
    },
    similarStocks: [
      { ticker: '4755', name: '楽天グループ', sector: '情報・通信', per: 'データなし', pbr: 'データなし', similarity: 70, reason: 'エンタメ・金融・ECの複合成長。ターンアラウンド期待が共通' },
      { ticker: '9697', name: 'カプコン', sector: 'その他製品', per: '21.4倍', pbr: '5.2倍', similarity: 78, reason: 'エンタメコンテンツIP保有。高マージン・グローバル展開' },
      { ticker: '4684', name: 'オービック', sector: '情報・通信', per: '25.1倍', pbr: '7.3倍', similarity: 65, reason: '高ROE・高利益率。コンテンツ収益に近い安定収益モデル' },
      { ticker: '6963', name: 'ローム', sector: '電気機器', per: '19.8倍', pbr: '1.9倍', similarity: 72, reason: 'パワー半導体転換期。技術力・グローバル展開でポテンシャル類似' },
    ],
  },
  '9984': {
    industry: '情報・通信業（持株会社）',
    inputStockName: 'ソフトバンクグループ',
    inputStockInfo: {
      ticker: '9984',
      name: 'ソフトバンクグループ',
      sector: '情報・通信',
      per: 'データなし',
      pbr: '1.8倍',
    },
    similarStocks: [
      { ticker: '4452', name: '花王', sector: '化学', per: '28.5倍', pbr: '3.2倍', similarity: 58, reason: 'ブランドIP・グローバル展開・ターンアラウンド期待' },
      { ticker: '3659', name: 'ネクソン', sector: 'その他製品', per: '16.4倍', pbr: '1.5倍', similarity: 72, reason: 'ゲームIP投資会社的側面。グローバルデジタル資産保有' },
      { ticker: '4686', name: 'ジャストシステム', sector: '情報・通信', per: '22.3倍', pbr: '6.8倍', similarity: 62, reason: 'テック投資・成長期待。ニッチ強者ポジションが類似' },
    ],
  },
  '8306': {
    industry: '銀行業（メガバンク）',
    inputStockName: '三菱UFJフィナンシャル・グループ',
    inputStockInfo: {
      ticker: '8306',
      name: '三菱UFJフィナンシャル・グループ',
      sector: '銀行業',
      per: '11.2倍',
      pbr: '0.9倍',
    },
    similarStocks: [
      { ticker: '8591', name: 'オリックス', sector: 'その他金融業', per: '10.5倍', pbr: '0.9倍', similarity: 80, reason: '多角金融・安定配当・低PBR改善。ビジネスモデルの堅牢性' },
      { ticker: '8766', name: '東京海上ホールディングス', sector: '保険業', per: '14.2倍', pbr: '1.6倍', similarity: 74, reason: '金融大型株・海外拡大・株主還元強化でストーリー類似' },
      { ticker: '8604', name: '野村ホールディングス', sector: '証券業', per: '12.8倍', pbr: '0.6倍', similarity: 76, reason: '低PBR金融株・ROE改善期待。リテール+法人の複合モデル' },
      { ticker: '8725', name: '三井住友海上グループHD', sector: '保険業', per: '13.1倍', pbr: '1.4倍', similarity: 71, reason: '金融コングロマリット型・高配当・安定収益で評価軸共通' },
    ],
  },
};

// デフォルト（未登録銘柄）用モックデータ生成
function generateDefaultRanking(ticker: string): GeminiResponse {
  return {
    industry: '製造業（一般）',
    inputStockName: `${ticker}（デモ銘柄）`,
    rankings: [
      { rank: 1, ticker, name: `${ticker}（デモ）`, marketCap: '2.5兆円', targetPrice: '3,500円', per: '14.2倍', pbr: '1.5倍' },
      { rank: 2, ticker: 'XXXX', name: 'サンプル企業A', marketCap: '1.8兆円', targetPrice: '2,200円', per: '12.8倍', pbr: '1.2倍' },
      { rank: 3, ticker: 'YYYY', name: 'サンプル企業B', marketCap: '1.2兆円', targetPrice: '1,900円', per: '11.5倍', pbr: '1.0倍' },
      { rank: 4, ticker: 'ZZZZ', name: 'サンプル企業C', marketCap: '0.8兆円', targetPrice: '1,400円', per: '9.8倍', pbr: '0.8倍' },
      { rank: 5, ticker: 'AAAA', name: 'サンプル企業D', marketCap: '0.5兆円', targetPrice: '1,100円', per: '8.6倍', pbr: '0.7倍' },
    ],
  };
}

function generateDefaultSimilar(ticker: string): GeminiResponse {
  return {
    industry: '製造業（一般）',
    inputStockName: `${ticker}（デモ銘柄）`,
    inputStockInfo: {
      ticker,
      name: `${ticker}（デモ銘柄）`,
      sector: '製造業',
      per: '14.2倍',
      pbr: '1.5倍',
    },
    similarStocks: [
      { ticker: '6301', name: 'コマツ', sector: '機械', per: '11.5倍', pbr: '1.3倍', similarity: 85, reason: 'グローバル製造業。安定した収益構造と配当方針が類似' },
      { ticker: '7011', name: '三菱重工業', sector: '機械', per: '12.8倍', pbr: '1.8倍', similarity: 78, reason: '成長転換期の大型製造業。事業ポートフォリオの変革が共通' },
      { ticker: '8058', name: '三菱商事', sector: '卸売業', per: '10.1倍', pbr: '1.2倍', similarity: 72, reason: '多角的事業構成・安定配当・低PBR水準で評価軸が一致' },
    ],
  };
}

// ===== モック株価データ =====

const QUOTE_MOCKS: Record<string, StockQuote> = {
  // 自動車
  '7203': { currentPrice: 3185, previousClose: 3120, targetPrice: 3200,  trailingPE: 10.2, forwardPE: 9.8,  priceToBook: 1.12 },
  '7267': { currentPrice: 1842, previousClose: 1810, targetPrice: 1850,  trailingPE: 7.8,  forwardPE: 8.1,  priceToBook: 0.62 },
  '7270': { currentPrice: 2760, previousClose: 2720, targetPrice: 2800,  trailingPE: 8.5,  forwardPE: 8.2,  priceToBook: 0.91 },
  '7201': { currentPrice: 398,  previousClose: 405,  targetPrice: 550,   trailingPE: null, forwardPE: null, priceToBook: 0.28 },
  '7269': { currentPrice: 1910, previousClose: 1880, targetPrice: 1950,  trailingPE: 12.3, forwardPE: 11.8, priceToBook: 1.31 },
  '7261': { currentPrice: 1045, previousClose: 1020, targetPrice: 1300,  trailingPE: 6.2,  forwardPE: 6.8,  priceToBook: 0.52 },
  '7272': { currentPrice: 1380, previousClose: 1350, targetPrice: 1600,  trailingPE: 9.1,  forwardPE: 8.8,  priceToBook: 1.02 },
  // 電気機器
  '6758': { currentPrice: 2890, previousClose: 2840, targetPrice: 14500, trailingPE: 18.3, forwardPE: 17.2, priceToBook: 2.42 },
  '6752': { currentPrice: 1320, previousClose: 1295, targetPrice: 1450,  trailingPE: 15.2, forwardPE: 14.8, priceToBook: 0.91 },
  '6971': { currentPrice: 1580, previousClose: 1550, targetPrice: 1700,  trailingPE: 22.4, forwardPE: 21.0, priceToBook: 0.82 },
  '6701': { currentPrice: 12800,previousClose: 12500,targetPrice: 13500, trailingPE: 21.6, forwardPE: 20.2, priceToBook: 3.12 },
  '6702': { currentPrice: 2890, previousClose: 2820, targetPrice: 3100,  trailingPE: 28.7, forwardPE: 26.4, priceToBook: 5.82 },
  '6724': { currentPrice: 1980, previousClose: 1940, targetPrice: 2100,  trailingPE: 11.3, forwardPE: 10.8, priceToBook: 1.22 },
  // 通信
  '9984': { currentPrice: 9850, previousClose: 9720, targetPrice: 10500, trailingPE: null, forwardPE: null, priceToBook: 1.82 },
  '9433': { currentPrice: 4980, previousClose: 4920, targetPrice: 5200,  trailingPE: 14.8, forwardPE: 14.2, priceToBook: 2.12 },
  '9432': { currentPrice: 158,  previousClose: 155,  targetPrice: 180,   trailingPE: 12.1, forwardPE: 11.8, priceToBook: 1.62 },
  '9434': { currentPrice: 1980, previousClose: 1950, targetPrice: 2100,  trailingPE: 19.4, forwardPE: 18.8, priceToBook: 5.32 },
  '4689': { currentPrice: 342,  previousClose: 335,  targetPrice: 380,   trailingPE: 25.2, forwardPE: 23.8, priceToBook: 1.92 },
  // 銀行・金融
  '8306': { currentPrice: 1620, previousClose: 1590, targetPrice: 1650,  trailingPE: 11.2, forwardPE: 10.8, priceToBook: 0.92 },
  '8316': { currentPrice: 3680, previousClose: 3620, targetPrice: 3900,  trailingPE: 10.8, forwardPE: 10.4, priceToBook: 0.82 },
  '8411': { currentPrice: 2980, previousClose: 2930, targetPrice: 3200,  trailingPE: 10.1, forwardPE: 9.8,  priceToBook: 0.72 },
  '8354': { currentPrice: 3850, previousClose: 3780, targetPrice: 4200,  trailingPE: 9.8,  forwardPE: 9.4,  priceToBook: 0.62 },
  '8331': { currentPrice: 980,  previousClose: 960,  targetPrice: 1100,  trailingPE: 8.9,  forwardPE: 8.6,  priceToBook: 0.52 },
};

// ===== エクスポート関数 =====

export async function mockFetchIndustryRanking(ticker: string): Promise<GeminiResponse> {
  await new Promise(r => setTimeout(r, 1200));
  const key = ticker.trim().replace(/[（(].*/, ''); // "7203（トヨタ）" → "7203"
  return RANKING_MOCKS[key] ?? generateDefaultRanking(key);
}

export async function mockFetchSimilarStocks(ticker: string): Promise<GeminiResponse> {
  await new Promise(r => setTimeout(r, 1400));
  const key = ticker.trim().replace(/[（(].*/, '');
  return SIMILAR_MOCKS[key] ?? generateDefaultSimilar(key);
}

/** 未登録tickerにダミー株価を生成（取得失敗を防ぐ） */
function generateDummyQuote(ticker: string): StockQuote {
  // tickerの数値からシード値を作り、それっぽい価格を生成
  const seed = ticker.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = 500 + (seed % 4500);
  return {
    currentPrice: base,
    previousClose: Math.floor(base * 0.98),
    targetPrice: Math.floor(base * 1.12),
    trailingPE: 10 + (seed % 20),
    forwardPE: 9 + (seed % 18),
    priceToBook: parseFloat((0.5 + (seed % 30) / 10).toFixed(2)),
  };
}

export async function mockFetchQuotes(
  tickers: string[]
): Promise<Record<string, StockQuote | null>> {
  await new Promise(r => setTimeout(r, 400));
  return Object.fromEntries(
    tickers.map(t => [t, QUOTE_MOCKS[t] ?? generateDummyQuote(t)])
  );
}
