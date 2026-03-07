export interface Spot {
  time: string;          // "09:00〜10:30"
  name: string;          // 場所名
  category: 'sightseeing' | 'lunch' | 'dinner' | 'cafe' | 'shopping';
  description: string;   // 説明・特徴
  cost: number;          // 費用（円）
  costNote: string;      // 例: "入場料 ¥800"
  transport: string;     // 移動手段 例: "徒歩10分 (800m)"
  rating: number;        // 1〜5
  review: string;        // 口コミ一言
  isMeal: boolean;       // 食事スポットか
}

export interface TourPlan {
  town: string;
  budget: number;
  totalCost: number;
  spots: Spot[];
  summary: string;       // 一日の総括コメント
}
