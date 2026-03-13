// ユーザープロフィール（オンボーディングで設定）
export interface UserProfile {
  nickname: string;
  interests: string[];         // 趣味・好み（例: ["読書", "料理", "音楽"]）
  difficulty: DifficultySettings;
}

// 難易度の3軸設定
export interface DifficultySettings {
  timeCost: TimeCost;
  movementCost: MovementCost;
  psychologicalBarrier: PsychologicalBarrier;
}

export type TimeCost = '5min' | '30min' | 'halfday';
export type MovementCost = 'home' | 'nearby' | 'anywhere';
export type PsychologicalBarrier = 'solo' | 'courage' | 'social';

// ミッションのカテゴリ
export type MissionCategory = 'action' | 'experience' | 'thinking' | 'social';

// ミッション本体
export interface Mission {
  id: string;
  date: string;               // "YYYY-MM-DD"
  title: string;              // ミッションのタイトル
  description: string;        // 詳細説明
  category: MissionCategory;
  hint: string;               // 達成のヒント
  isRerolled: boolean;        // 引き直し済みか
}

// ミッションの達成記録
export interface MissionRecord {
  mission: Mission;
  status: 'completed' | 'failed' | 'pending'; // 達成/未達成/未完了（当日）
  completedAt?: string;       // 達成した場合のISO日時
}

// localStorage に保存するデータ全体
export interface AppData {
  profile: UserProfile | null;
  records: MissionRecord[];   // 全履歴
  todayMission: Mission | null;
}
