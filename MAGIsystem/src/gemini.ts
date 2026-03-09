import type { QuizAnswer, PersonalityProfile, MagiVerdict } from './types'

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

function getApiKey(): string {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY が設定されていません')
  return apiKey
}

async function callGemini(prompt: string): Promise<string> {
  const apiKey = getApiKey()
  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8 },
    }),
  })

  if (!res.ok) {
    const err = await res.json() as { error?: { message?: string } }
    throw new Error(err?.error?.message ?? `API Error: ${res.status}`)
  }

  const data = await res.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
  }
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
  return raw.replace(/```json\n?|```/g, '').trim()
}

export async function generatePersonalities(answers: QuizAnswer[]): Promise<PersonalityProfile[]> {
  const answerSummary = answers.map(a => `Q${a.questionId}: ${a.answer}`).join('\n')

  const prompt = `
あなたはユーザーの内面を分析する心理プロファイラーです。
以下のアンケート回答を元に、このユーザーの内面に存在する3つの相反する人格を生成してください。

アンケート回答:
${answerSummary}

以下のJSON形式で厳密に回答してください。余分なテキストは一切含めないこと:
{
  "personalities": [
    {
      "id": "melchior",
      "name": "人格の名称（例：効率の化身、論理の番人等）",
      "title": "肩書き（例：Scientist Persona）",
      "description": "この人格の特徴を2文で説明",
      "systemPrompt": "この人格のAIシステムプロンプト。この人格として思考する際の価値観、優先順位、思考パターンを詳細に記述（200文字程度）"
    },
    {
      "id": "balthazar",
      "name": "人格の名称",
      "title": "肩書き",
      "description": "この人格の特徴を2文で説明",
      "systemPrompt": "この人格のAIシステムプロンプト（200文字程度）"
    },
    {
      "id": "caspar",
      "name": "人格の名称",
      "title": "肩書き",
      "description": "この人格の特徴を2文で説明",
      "systemPrompt": "この人格のAIシステムプロンプト（200文字程度）"
    }
  ]
}

3つの人格は互いに異なる価値観を持ち、同じ問題について異なる結論を出すことがあるようにしてください。
ユーザーの回答から読み取れる内なる葛藤を反映させること。
`

  const cleaned = await callGemini(prompt)
  const parsed = JSON.parse(cleaned) as {
    personalities: Array<{
      id: string
      name: string
      title: string
      description: string
      systemPrompt: string
    }>
  }

  const colorMap: Record<string, PersonalityProfile['color']> = {
    melchior: 'orange',
    balthazar: 'red',
    caspar: 'cyan',
  }
  const hexMap: Record<string, string> = {
    melchior: '#ff6600',
    balthazar: '#cc0000',
    caspar: '#00ccff',
  }

  return parsed.personalities.map(p => ({
    name: p.name,
    title: p.title,
    systemPrompt: p.systemPrompt,
    color: colorMap[p.id] ?? 'orange',
    hexCode: hexMap[p.id] ?? '#ff6600',
    description: p.description,
  }))
}

export async function runMagiJudgment(
  agenda: string,
  personality: PersonalityProfile,
  magiName: string,
  _onChunk?: (text: string) => void,
): Promise<MagiVerdict> {
  const prompt = `
${personality.systemPrompt}

あなたはMAGIシステムの${magiName}です。以下の議題について判断を下してください。

議題: "${agenda}"

以下のJSON形式で厳密に回答してください。JSON以外のテキストは出力しないこと:
{
  "verdict": "ACCEPT または REJECT または PENDING",
  "thinkingLog": "判断に至るまでの思考プロセスを詳細に記述。内なる葛藤、検討した要素、迷いも含めて400文字程度",
  "reasoning": "最終的な判断理由を簡潔に100文字程度"
}

あなたの人格・価値観に基づいて判断すること。
verdictは必ずACCEPT、REJECT、PENDINGのいずれかにすること。
`

  const cleaned = await callGemini(prompt)
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Invalid response from Gemini')

  const parsed = JSON.parse(jsonMatch[0]) as {
    verdict: 'ACCEPT' | 'REJECT' | 'PENDING'
    thinkingLog: string
    reasoning: string
  }

  return {
    verdict: parsed.verdict,
    thinkingLog: parsed.thinkingLog,
    reasoning: parsed.reasoning,
    personality,
  }
}
