# AlternaDaily Project Overview

## Purpose
「一日一変」をコンセプトにしたデイリーミッションアプリ。
毎日ひとつ新しいことに挑戦することで日常を豊かにする。
Gemini APIがユーザーの趣味趣向と難易度設定をもとにミッションを動的生成する。

## Tech Stack
- **Framework**: React 19 + TypeScript ~5.9 (strict mode)
- **Build Tool**: Vite 8
- **Package Manager**: pnpm
- **AI**: Gemini API (gemini-2.5-flash) via `VITE_GEMINI_API_KEY`
- **Data**: localStorage のみ（ログイン不要）
- **Linting**: ESLint 9

## Project Structure
```
src/
├── api/
│   └── gemini.ts        # Gemini API呼び出し + モックデータ
├── components/
│   ├── GachaButton.tsx  # ガチャ演出ボタン
│   ├── History.tsx      # 履歴画面
│   ├── MissionCard.tsx  # ミッション表示カード
│   ├── Onboarding.tsx   # 初回オンボーディング（3ステップ）
│   └── Settings.tsx     # 設定画面
├── hooks/
│   └── useMission.ts    # ミッション状態管理カスタムフック
├── types/
│   └── mission.ts       # 全型定義
├── utils/
│   └── storage.ts       # localStorage操作ユーティリティ
├── App.tsx              # ルーティング（home/history/settings）
└── App.css              # 全スタイル（ダークテーマ）
```
