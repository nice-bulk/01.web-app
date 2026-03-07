import type { TourPlan } from '../types/plan';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function generateTourPlan(
  town: string,
  budget: number
): Promise<TourPlan> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY が設定されていません');

  const prompt = `
あなたは日本国内の観光プランナーです。
「${town}」を一日観光する計画を、予算「${budget}円（交通費・入場料・食事すべて込み）」で作成してください。

以下の JSON 形式で返してください。JSON以外のテキストは一切出力しないでください。

{
  "town": "${town}",
  "budget": ${budget},
  "totalCost": <合計費用（数値）>,
  "summary": "<一日の総括コメント>",
  "spots": [
    {
      "time": "<訪問時間 例: 09:00〜10:30>",
      "name": "<場所名>",
      "category": "<sightseeing | lunch | dinner | cafe | shopping のいずれか>",
      "description": "<場所の説明・特徴（2〜3文）>",
      "cost": <費用（数値、円）>,
      "costNote": "<費用の内訳 例: 入場料 ¥500>",
      "transport": "<前のスポットからの移動手段と距離 例: 徒歩15分 (1.2km)。最初のスポットは「出発地から」>",
      "rating": <おすすめ度 1〜5の数値>,
      "review": "<口コミ風の一言コメント>",
      "isMeal": <食事スポットなら true、それ以外は false>
    }
  ]
}

条件:
- スポット数は6〜8件（ランチ1件、ディナー1件を含む）
- 合計費用が予算を超えないようにする
- 現実的な観光スポットと移動時間にする
- 日本語で出力する
`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? `API Error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // コードブロック除去
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const plan: TourPlan = JSON.parse(cleaned);
  return plan;
}
