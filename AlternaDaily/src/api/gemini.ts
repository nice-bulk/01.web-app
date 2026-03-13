import type { Mission, MissionCategory, UserProfile } from '../types/mission';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/** APIキーが未設定の場合はデモモード（モックデータ）で動作する */
export const isDemoMode = !import.meta.env.VITE_GEMINI_API_KEY;

function categoryLabel(category: MissionCategory): string {
  const map: Record<MissionCategory, string> = {
    action: '行動系',
    experience: '体験系',
    thinking: '思考系',
    social: '人間関係系',
  };
  return map[category];
}

function timeCostLabel(t: UserProfile['difficulty']['timeCost']): string {
  return { '5min': '5分程度', '30min': '30分程度', halfday: '半日程度' }[t];
}

function movementLabel(m: UserProfile['difficulty']['movementCost']): string {
  return { home: '家でできる', nearby: '近所で完結', anywhere: 'どこでもOK' }[m];
}

function barrierLabel(b: UserProfile['difficulty']['psychologicalBarrier']): string {
  return {
    solo: '一人でできる',
    courage: '少し勇気がいる',
    social: '知らない人が関わる',
  }[b];
}

export async function generateMission(profile: UserProfile, date: string): Promise<Mission> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return mockGenerateMission(profile, date);
  }

  const { interests, difficulty, nickname } = profile;

  const prompt = `
あなたは「一日一変」というコンセプトのアプリのミッション提案AIです。
「一日一変」とは、毎日最低ひとつ新しい体験をすることで日常・人生を豊かにするという考え方です。

以下のユーザー情報をもとに、今日のミッションを1件提案してください。

## ユーザー情報
- 名前: ${nickname}
- 趣味・好み: ${interests.join('、')}
- 難易度設定:
  - 時間コスト: ${timeCostLabel(difficulty.timeCost)}
  - 移動コスト: ${movementLabel(difficulty.movementCost)}
  - 心理的ハードル: ${barrierLabel(difficulty.psychologicalBarrier)}
- 対象日: ${date}

## 出力形式
以下のJSON形式のみで返してください。JSON以外のテキストは一切出力しないでください。

{
  "title": "<ミッションのタイトル（20文字以内）>",
  "description": "<ミッションの詳細説明（50〜80文字）>",
  "category": "<action | experience | thinking | social のいずれか>",
  "hint": "<達成のヒント（30〜50文字）>"
}

## 条件
- ユーザーの趣味趣向に関連しつつ、でも「いつもとは少し違う」内容にすること
- 難易度設定に合った現実的なミッションにすること
- ポジティブで前向きな気持ちになれる表現を使うこと
- 日本語で出力すること
`;

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9 },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message ?? `API Error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  return {
    id: `${date}-${Date.now()}`,
    date,
    title: parsed.title,
    description: parsed.description,
    category: parsed.category as MissionCategory,
    hint: parsed.hint,
    isRerolled: false,
  };
}

// APIキーなし環境用モック
export async function mockGenerateMission(profile: UserProfile, date: string): Promise<Mission> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const samples: Array<Omit<Mission, 'id' | 'date' | 'isRerolled'>> = [
    {
      title: 'いつもと違う道で帰る',
      description: '帰り道を意識的に変えてみましょう。新しい景色や発見があるかもしれません。',
      category: 'action',
      hint: 'Googleマップで別ルートを検索してみよう',
    },
    {
      title: '知らないジャンルの音楽を聴く',
      description: '普段聴かないジャンルの音楽を30分だけ試してみましょう。新しい世界が広がるかも。',
      category: 'experience',
      hint: 'SpotifyやYouTubeの「おすすめ」から選んでみよう',
    },
    {
      title: '自分と逆の意見を調べる',
      description: '今日、自分が当たり前だと思っている何かについて、反対意見を探して読んでみましょう。',
      category: 'thinking',
      hint: '「〇〇 反対意見」「〇〇 デメリット」で検索してみよう',
    },
    {
      title: '久しぶりの人に連絡する',
      description: '最近連絡していない友人や知人に、一言メッセージを送ってみましょう。',
      category: 'social',
      hint: '「最近どう？」の一言でOK。気軽に送ってみよう',
    },
    {
      title: '行ったことのない近所の店に入る',
      description: '気になっていたけど入ったことがないお店に、今日こそ入ってみましょう。',
      category: 'action',
      hint: '入りにくそうなお店ほど入ってみる価値があるかも',
    },
    {
      title: '知らない料理を一品作る',
      description: '今まで作ったことのない料理にチャレンジ。失敗してもそれが体験です。',
      category: 'experience',
      hint: 'レシピサイトで「簡単 はじめて」と検索してみよう',
    },
  ];

  const idx = Math.floor(Math.random() * samples.length);
  return {
    id: `${date}-mock-${idx}`,
    date,
    isRerolled: false,
    ...samples[idx],
  };
}
