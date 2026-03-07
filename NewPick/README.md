# NewPick 🇯🇵

**日本株 ポテンシャル分析ツール**

銘柄コードまたは銘柄名を入力するだけで、同業界ランキングや類似ポテンシャル銘柄を AI が分析・提示するWebアプリです。

---

## 機能

- **同業界ランキング検索** — 入力銘柄と同じ業界の銘柄を時価総額・PER・PBR・AI推定目標株価付きで一覧表示
- **同ポテンシャル銘柄検索** — 財務指標や事業特性が似た銘柄を類似度スコア付きでカード表示
- **リアルタイム株価取得** — Yahoo Finance 経由で現在株価を15分遅延で取得（Express サーバー）
- **検索履歴・お気に入り** — ブラウザの localStorage に保存。サイドパネルから再検索可能
- **CSV エクスポート** — ランキング・類似銘柄・お気に入りリストをCSVでダウンロード

---

## 技術スタック

| レイヤー | 使用技術 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| AI 分析 | Google Gemini API (`gemini-2.5-flash`) |
| 株価取得 | Express + yahoo-finance2 |
| スタイリング | CSS Modules (カスタム) |

---

## セットアップ

### 前提条件

- Node.js 18+
- pnpm（または npm / yarn）
- [Google AI Studio](https://aistudio.google.com/app/apikey) で取得した Gemini API キー

### インストール

```bash
# フロントエンド依存関係
pnpm install

# サーバー依存関係
cd server && npm install && cd ..
```

### 起動

```bash
# ターミナル1: 株価取得サーバー（ポート 3001）
cd server && node index.js

# ターミナル2: フロントエンド開発サーバー（ポート 5173）
pnpm dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ビルド

```bash
pnpm build
```

---

## 使い方

1. **Gemini API Key** 欄に取得したAPIキーを入力（入力後は自動保存）
2. **銘柄コード / 銘柄名** 欄に検索したい銘柄を入力（例: `7203` / `トヨタ自動車`）
3. **同業界ランキング検索** または **同ポテンシャル銘柄検索** ボタンをクリック
4. 結果は ⭐ でお気に入り登録、📥 で CSV 出力が可能

---

## ディレクトリ構成

```
NewPick/
├── src/
│   ├── App.tsx          # メインコンポーネント・UI全体
│   ├── gemini.ts        # Gemini API 呼び出しロジック
│   ├── stockPrice.ts    # 株価取得（サーバー経由）
│   ├── storage.ts       # 履歴・お気に入り・APIキーの永続化
│   └── export.ts        # CSV エクスポート処理
├── server/
│   └── index.js         # Express サーバー（Yahoo Finance プロキシ）
└── index.html
```

---

## 注意事項

> 本ツールの分析結果はAIによる推定であり、投資判断の参考情報です。  
> 実際の投資判断はご自身の責任でお願いします。株価データは15分程度の遅延があります。
