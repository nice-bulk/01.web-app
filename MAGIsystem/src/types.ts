export interface PersonalityProfile {
  name: string
  title: string
  systemPrompt: string
  color: 'orange' | 'red' | 'cyan'
  hexCode: string
  description: string
}

export interface QuizAnswer {
  questionId: number
  answer: string
  value: number
}

export interface MagiVerdict {
  verdict: 'ACCEPT' | 'REJECT' | 'PENDING'
  reasoning: string
  thinkingLog: string
  personality: PersonalityProfile
}

export interface ConsensusResult {
  melchior: MagiVerdict
  balthazar: MagiVerdict
  caspar: MagiVerdict
  finalVerdict: 'ACCEPT' | 'REJECT' | 'DEADLOCK'
  summaryCode: string
}

export interface SavedPersonalitySet {
  id: string
  label: string       // ユーザーが付けた名前
  createdAt: string   // ISO文字列
  personalities: PersonalityProfile[]
}

export type AppPhase = 'boot' | 'home' | 'onboarding' | 'initialization' | 'select' | 'agenda' | 'consensus'
