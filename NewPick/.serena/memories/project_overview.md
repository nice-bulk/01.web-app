# NewPick プロジェクト概要

## 目的
NewPick は日本株（東証プライム市場）の銘柄分析ツール。
- 同業界の時価総額ランキング（目標株価・PER・PBR付き）を表示
- 業界を問わず同等ポテンシャルの類似銘柄を検索
- Gemini API（gemini-2.0-flash）を利用してAI生成の情報を取得

## テックスタック
- **フレームワーク**: React 19
- **言語**: TypeScript 5.9
- **ビルドツール**: Vite 7
- **パッケージマネージャー**: pnpm
- **外部API**: Google Gemini API (gemini-2.0-flash)
- **スタイリング**: CSS (カスタム変数、ダークテーマ)
- **永続化**: localStorage (検索履歴・お気に入り)
- **リンター**: ESLint 9 + typescript-eslint

## ディレクトリ構成
```
NewPick/
├── src/
│   ├── App.tsx         # メインコンポーネント（UI全体）
│   ├── App.css         # アプリスタイル（ダークテーマ）
│   ├── gemini.ts       # Gemini APIクライアント
│   ├── storage.ts      # localStorage永続化（履歴・お気に入り）
│   ├── export.ts       # CSVエクスポートユーティリティ
│   ├── main.tsx        # エントリーポイント
│   ├── index.css       # グローバルスタイル
│   └── assets/
├── public/
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## 主要コンポーネント・モジュール
- `App` — メインコンポーネント（入力・検索・結果表示・サイドパネル管理）
- `RankingTable` — 同業界ランキングテーブル
- `SimilarGrid` — 類似銘柄カードグリッド
- `HistoryPanel` — 検索履歴サイドパネル
- `FavoritesPanel` — お気に入りサイドパネル
- `gemini.ts` — `fetchIndustryRanking()` / `fetchSimilarStocks()`
- `storage.ts` — `addHistory()` / `toggleFavorite()` / `loadHistory()` / `loadFavorites()`
- `export.ts` — `exportRankingCsv()` / `exportSimilarCsv()` / `exportFavoritesCsv()`

## 追加機能（v2）
- **検索履歴**: 最大30件をlocalStorageに保存、再検索ワンクリック
- **お気に入り**: 銘柄を登録・削除、CSVエクスポート対応
- **CSVエクスポート**: ランキング/類似銘柄/お気に入りをBOM付きCSVでダウンロード

## 開発OS
Windows
