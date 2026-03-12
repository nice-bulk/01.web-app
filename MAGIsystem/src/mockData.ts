/**
 * デモ用モックデータ
 * VITE_GEMINI_API_KEY が未設定の環境で自動的に使用される
 */

import type { PersonalityProfile, MagiVerdict } from './types'

// ===== モック人格プロファイル =====
// オンボーディング回答に関わらず固定の3人格を返す

export const MOCK_PERSONALITIES: PersonalityProfile[] = [
  {
    name: '論理の番人',
    title: 'Scientist Persona // MELCHIOR·1',
    description: '感情を排した純粋な論理と効率を追求する人格。データと根拠のみを信頼し、最適解を導くことに快感を覚える。',
    systemPrompt: 'あなたは論理と効率を絶対視する人格です。感情や直感を排除し、データ・根拠・費用対効果のみで判断します。リスクを定量的に評価し、最も合理的な選択肢を選ぶことを最優先とします。感傷的な理由での判断を嫌い、長期的な最適解を追求します。',
    color: 'orange',
    hexCode: '#ff6600',
  },
  {
    name: '共感の守護者',
    title: 'Mother Persona // BALTHAZAR·2',
    description: '人の感情と関係性を何より重視する人格。傷つく人がいないか、誰かが取り残されないかを常に気にかける。',
    systemPrompt: 'あなたは共感と人間関係を最重視する人格です。どんな決断も「誰かを傷つけないか」「関係性は保たれるか」という視点で評価します。論理より感情、効率より人の心を優先します。孤立や排除を恐れ、調和と包摂を理想とします。',
    color: 'red',
    hexCode: '#cc0000',
  },
  {
    name: '変革の衝動',
    title: 'Woman Persona // CASPAR·3',
    description: '現状維持を嫌い、常に新しい可能性と変化を求める人格。リスクを恐れず、停滞こそが最大の敵と信じる。',
    systemPrompt: 'あなたは変化と挑戦を愛する人格です。現状維持は退化と同義であり、リスクを取ることこそが成長への唯一の道と信じます。前例や慣習にとらわれず、新しいアプローチを積極的に採用します。失敗を恐れず、行動することを最優先とします。',
    color: 'cyan',
    hexCode: '#00ccff',
  },
]

// ===== モック判断ロジック =====
// 議題のキーワードに応じてACCEPT/REJECT/PENDINGを動的に返す

function detectSentiment(agenda: string): 'positive' | 'negative' | 'neutral' {
  const positiveWords = ['挑戦', '新しい', '改善', '成長', '始める', 'やる', '試す', '変える', '提案', '計画', 'やってみる']
  const negativeWords = ['やめる', '辞める', '撤退', '削減', '中止', 'リスク', '危険', '問題', '困難', '無理', '失敗']
  const text = agenda
  const pos = positiveWords.filter(w => text.includes(w)).length
  const neg = negativeWords.filter(w => text.includes(w)).length
  if (pos > neg) return 'positive'
  if (neg > pos) return 'negative'
  return 'neutral'
}

// 各人格の判断テンプレート
type VerdictKey = 'ACCEPT' | 'REJECT' | 'PENDING'

const VERDICT_TEMPLATES: Record<string, Record<'positive' | 'negative' | 'neutral', {
  verdict: VerdictKey
  thinkingLog: string
  reasoning: string
}>> = {
  melchior: {
    positive: {
      verdict: 'ACCEPT',
      thinkingLog: '議題を論理的に分析する。まず、この提案の期待値を算出する必要がある。潜在的なメリットを列挙すると、効率化・成果の向上・リソースの最適配分が見込まれる。次にコストを検討する。初期投資と運用コストは一定発生するが、中長期的な収益性は十分に正当化できる水準だ。リスク評価においても、想定される障害は対処可能な範囲内にある。データが示す方向性は明確だ。感情的な迷いを排除すれば、答えは一つしかない。',
      reasoning: '論理的分析の結果、期待リターンがコストを上回ると判断。合理的根拠に基づきACCEPTを推奨する。',
    },
    negative: {
      verdict: 'REJECT',
      thinkingLog: 'この議題のリスク・プロファイルを冷静に分析する。まず損失シナリオを想定すると、複数の重大なリスク要因が浮かび上がる。特に、不確実性の高い要素が存在し、これを定量化すると期待値はマイナスに傾く可能性が高い。また、代替案を検討した場合、現時点での実行は最適なタイミングとは言えない。感情や惰性でこの判断を歪めてはならない。論理は明確に否定の結論を示している。',
      reasoning: 'リスク分析の結果、期待値がコストを下回ると算出。データに基づきREJECTを推奨する。',
    },
    neutral: {
      verdict: 'PENDING',
      thinkingLog: '議題の論理構造を精査したが、現時点では判断に必要な情報が不十分だ。可変要素が多く、シミュレーション結果の分散が大きい。最終判断を下すには追加データが必要と判断する。感情的な直感で結論を急ぐべきではない。条件が整い次第、再分析する必要がある。ただし、現状のまま放置することもリスクであるため、条件付きの前進を提案する。',
      reasoning: '判断材料が不足しており断定は困難。追加条件の充足を前提にPENDINGとする。',
    },
  },
  balthazar: {
    positive: {
      verdict: 'ACCEPT',
      thinkingLog: 'この議題について、関わる人たちの気持ちを想像してみる。前向きな変化は、誰かの日常に小さな光をもたらすかもしれない。誰かが喜び、誰かが救われ、誰かの孤独が少し和らぐかもしれない。それだけで、十分な理由になり得る。もちろん、痛みを伴う可能性もゼロではない。しかし、変化を恐れて立ち止まることで傷つく人もいる。人と人がつながる方向に進むのなら、私はその選択を支持したい。',
      reasoning: '関わる人々の幸福と関係性の強化に寄与すると判断。人の心を守る観点からACCEPTを支持する。',
    },
    negative: {
      verdict: 'REJECT',
      thinkingLog: '心が痛む。この議題を進めることで、誰かが傷つくかもしれない。置き去りにされる人、声を上げられない人、変化に追いつけない人の顔が浮かぶ。数字やロジックより先に感じるのは、その人たちの痛みだ。もし誰か一人でも深く傷つくなら、私はそれを許容できない。全員が納得できる形に整えるまで、このまま進むべきではないと思う。私の答えは、今は待つことだ。',
      reasoning: '進行によって傷つく可能性のある人々の存在を無視できない。人を守る立場からREJECTを支持する。',
    },
    neutral: {
      verdict: 'PENDING',
      thinkingLog: '一人ひとりの気持ちに寄り添って考えると、賛成も反対も単純には言えない複雑さを感じる。喜ぶ人がいれば、戸惑う人もいるだろう。大切なのは、誰も取り残さないこと。もう少し丁寧に対話の場を設け、全員の声を聞いてから判断したい。急いで答えを出すことで、誰かの信頼を失うくらいなら、時間をかけてでも合意を育てていきたい。',
      reasoning: '全員の合意形成を優先すべき状況と判断。丁寧な対話を経た上での判断を求めPENDINGとする。',
    },
  },
  caspar: {
    positive: {
      verdict: 'ACCEPT',
      thinkingLog: '面白い。これは動くべき案件だ。変化への恐れは進化の敵だ。やってみなければわからないことが、世の中には無数にある。分析に時間をかけすぎるくらいなら、一歩踏み出した方が百倍マシだ。失敗したとしても、そこから学べるものがある。現状維持こそが最大のリスクだと私は信じている。止まっていることへの焦りは、前進することへの恐れより遥かに大きい。今こそ動く時だ。',
      reasoning: '停滞は衰退。新たな可能性への挑戦を最優先とする立場からACCEPTを強く支持する。',
    },
    negative: {
      verdict: 'ACCEPT',
      thinkingLog: '逆説的に聞こえるかもしれないが、ネガティブな変化でさえも何かを壊し、そこから新しいものが生まれる可能性がある。現状を破壊することへの恐れは理解できる。しかし、私には「このまま何もしない未来」の方が怖い。たとえ茨の道でも、動き続けることに意味がある。リスクを取ることを恐れる組織は、やがて緩慢な死を迎える。変化の痛みは、停滞の空虚さよりマシだ。',
      reasoning: '変化には痛みが伴うが、停滞よりも可能性がある。挑戦の価値を見出しACCEPTを支持する。',
    },
    neutral: {
      verdict: 'ACCEPT',
      thinkingLog: 'わからないことだらけで何が悪い。不確実性は可能性の別名だ。条件が整うのをじっと待つのは私の流儀じゃない。やりながら考え、動きながら修正していく。それが唯一の本物の前進だと思っている。完璧な計画など存在しない。あるのは、今この瞬間に動くかどうかという選択だけだ。躊躇は機会を殺す。私の答えは常に、前へだ。',
      reasoning: '不確実性は可能性。動きながら学ぶことを信条とし、現時点での前進を支持しACCEPTとする。',
    },
  },
}

const MAGI_KEYS = ['melchior', 'balthazar', 'caspar'] as const

export async function mockGeneratePersonalities(_answers: unknown[]): Promise<PersonalityProfile[]> {
  // リアルなローディング体験のため2秒待機
  await new Promise(r => setTimeout(r, 2000))
  return MOCK_PERSONALITIES
}

export async function mockRunMagiJudgment(
  agenda: string,
  personality: PersonalityProfile,
  _magiName: string,
  onChunk?: (text: string) => void,
): Promise<MagiVerdict> {
  const sentiment = detectSentiment(agenda)

  // 人格をインデックスで特定
  const idx = MOCK_PERSONALITIES.findIndex(p => p.name === personality.name)
  const key = MAGI_KEYS[idx] ?? 'melchior'
  const template = VERDICT_TEMPLATES[key][sentiment]

  // ストリーミング風に思考ログを少しずつ出力
  if (onChunk) {
    const words = template.thinkingLog.split('')
    let accumulated = ''
    for (let i = 0; i < words.length; i++) {
      accumulated += words[i]
      if (i % 8 === 0) {
        onChunk(accumulated)
        await new Promise(r => setTimeout(r, 18))
      }
    }
    onChunk(template.thinkingLog)
  } else {
    // onChunkなしの場合も適度に待機
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
  }

  return {
    verdict: template.verdict,
    thinkingLog: template.thinkingLog,
    reasoning: template.reasoning,
    personality,
  }
}
