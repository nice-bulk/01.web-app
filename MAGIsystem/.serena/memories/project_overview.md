# MAGIsystem Project Overview

## Purpose
MAGIシステム（新世紀エヴァンゲリオン）を模したWebアプリ。
ユーザーの10の質問回答からGemini AIが3つの人格プロファイルを生成し、
議題に対してMAGIの3人格（MELCHIOR / BALTHAZAR / CASPAR）が並列で思考・合議する。

## Tech Stack
- **Framework**: React 19
- **Language**: TypeScript ~5.9.3 (strict mode)
- **Build Tool**: Vite 7
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS 3 + カスタムCSS (NERV風ダークUI)
- **AI**: Gemini API (`@google/generative-ai`, model: gemini-2.0-flash)
- **Fonts**: Share Tech Mono, Noto Serif JP (Google Fonts)
- **Linting**: ESLint 9

## App Flow (4 Phases)
1. `boot` → BootScreen: システム起動シーケンス
2. `onboarding` → OnboardingScreen: 10問のアンケート
3. `initialization` → InitializationScreen: Gemini APIで3人格生成
4. `agenda` → AgendaScreen: 議題入力
5. `consensus` → ConsensusScreen: 並列推論 + 合議結果表示

## Project Structure
```
src/
├── types.ts            # 型定義
├── constants.ts        # 質問リスト、MAGIラベル
├── gemini.ts           # Gemini API呼び出し (generatePersonalities, runMagiJudgment)
├── App.tsx             # メインアプリ・フェーズ管理
├── index.css           # グローバルスタイル (NERV風)
├── main.tsx            # エントリポイント
└── components/
    ├── BootScreen.tsx
    ├── OnboardingScreen.tsx
    ├── InitializationScreen.tsx
    ├── AgendaScreen.tsx
    └── ConsensusScreen.tsx
```

## Environment Variables
- `VITE_GEMINI_API_KEY`: Gemini APIキー (.envファイルに設定)

## TypeScript Configuration (strict)
- Target: ES2022
- strict: true, noUnusedLocals, noUnusedParameters
- jsx: react-jsx, moduleResolution: bundler
