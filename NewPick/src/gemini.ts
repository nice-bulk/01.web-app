// Gemini API を使った株式情報取得ユーティリティ

export interface StockRankingItem {
  ticker: string;
  name: string;
  marketCap: string;
  targetPrice: string;
  per: string;
  pbr: string;
  rank: number;
}

export interface SimilarStockItem {
  ticker: string;
  name: string;
  per: string;
  pbr: string;
  sector: string;
  reason: string;
  similarity: number; // 0-100
}

export interface InputStockInfo {
  ticker: string;
  name: string;
  sector: string;
  per: string;
  pbr: string;
}

export interface GeminiResponse {
  industry: string;
  inputStockName: string;
  inputStockInfo?: InputStockInfo;
  rankings?: StockRankingItem[];
  similarStocks?: SimilarStockItem[];
  error?: string;
}

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

async function callGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY が設定されていません（.env ファイルを確認してください）');
  const res = await fetch(`${GEMINI_API_BASE}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || `API Error: ${res.status}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

export async function fetchIndustryRanking(
  ticker: string
): Promise<GeminiResponse> {
  const prompt = `
あなたは日本株の専門家アナリストです。
以下の銘柄コードまたは銘柄名について、同業界（東証プライム市場）の銘柄を時価総額順にランキングしてください。

対象銘柄: ${ticker}

以下のJSON形式のみで回答してください。他のテキストは一切含めないでください：
{
  "industry": "業界名",
  "inputStockName": "入力銘柄の正式名称",
  "rankings": [
    {
      "rank": 1,
      "ticker": "証券コード（例: 7203）",
      "name": "銘柄名",
      "marketCap": "時価総額（例: 45.2兆円）",
      "targetPrice": "アナリスト目標株価（例: 3,200円 または データなし）",
      "per": "PER（例: 12.5倍）",
      "pbr": "PBR（例: 1.2倍）"
    }
  ]
}

rankingsには最大10銘柄を含めてください。入力銘柄自身も含めてください。
データが不明な場合は「データなし」と記載してください。
必ず有効なJSONのみ返してください。
`;

  const raw = await callGemini(prompt);
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('レスポンスのパースに失敗しました: ' + raw.slice(0, 200));
  }
}

export async function fetchSimilarStocks(
  ticker: string
): Promise<GeminiResponse> {
  const prompt = `
あなたは日本株の専門家アナリストです。
以下の銘柄コードまたは銘柄名について、業界を問わず「同じポテンシャルを持つ銘柄」を探してください。

条件：
- 東証プライム市場上場銘柄
- PERとPBRが近い水準
- 同様のチャート推移・成長ストーリーが期待できる
- 異なる業界からも候補を選ぶ

対象銘柄: ${ticker}

以下のJSON形式のみで回答してください。他のテキストは一切含めないでください：
{
  "industry": "対象銘柄の業界名",
  "inputStockName": "入力銘柄の正式名称",
  "inputStockInfo": {
    "ticker": "入力銘柄の証券コード（例: 7203）",
    "name": "入力銘柄の正式名称",
    "sector": "入力銘柄の業種",
    "per": "入力銘柄のPER（例: 12.5倍）",
    "pbr": "入力銘柄のPBR（例: 1.2倍）"
  },
  "similarStocks": [
    {
      "ticker": "証券コード（例: 9984）",
      "name": "銘柄名",
      "sector": "業種",
      "per": "PER（例: 15.3倍）",
      "pbr": "PBR（例: 2.1倍）",
      "similarity": 85,
      "reason": "類似している理由を50文字以内で"
    }
  ]
}

similarStocksには最大8銘柄を含めてください。入力銘柄自身はsimilarStocksに含めないでください。
similarityは0〜100の整数で類似度を表してください（100が最も類似）。
必ず有効なJSONのみ返してください。
`;

  const raw = await callGemini(prompt);
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    throw new Error('レスポンスのパースに失敗しました: ' + raw.slice(0, 200));
  }
}
