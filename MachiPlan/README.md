# MachiPlan 🗾

**日本国内 AIかんたん観光プランナー**

町名と予算を入力するだけで、Gemini AI が一日の観光プランを自動生成するWebアプリです。  
タイムライン形式で見やすく表示し、そのままPDFに保存できます。

---

## 機能

- **観光プラン自動生成** — 町名と予算を入力するだけで、Gemini AI が6〜8件のスポットを含む一日プランを生成
- **タイムライン表示** — 観光・グルメ・カフェ・ショッピングをカテゴリ別アイコン付きで時系列表示
- **費用・移動情報** — 各スポットの費用・移動手段・距離・おすすめ度・口コミを一覧表示
- **PDF エクスポート** — 生成されたプランをA4 PDF として保存（カード境界で自動改ページ）

---

## 技術スタック

| レイヤー | 使用技術 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| AI プラン生成 | Google Gemini API (`gemini-2.5-flash`) |
| PDF 出力 | jsPDF + html2canvas |
| スタイリング | CSS Modules (カスタム) |

---

## セットアップ

### 前提条件

- Node.js 18+
- pnpm（または npm / yarn）
- [Google AI Studio](https://aistudio.google.com/app/apikey) で取得した Gemini API キー

### インストール

```bash
pnpm install
```

### 環境変数の設定

`.env.example` をコピーして `.env` を作成し、APIキーを設定してください。

```bash
cp .env.example .env
```

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 起動

```bash
pnpm dev
```

ブラウザで `http://localhost:5173` を開いてください。

### ビルド

```bash
pnpm build
```

---

## 使い方

1. **観光する町** 欄に行きたい町名を入力（例: `京都`、`函館`、`長崎`）
2. **予算（円）** 欄に一日の総予算を入力（交通費・入場料・食事すべて込み）
3. **観光プランを作成** ボタンをクリック
4. タイムライン形式でプランが表示されます
5. **PDF保存** ボタンで `<町名>_観光プラン.pdf` としてダウンロード

---

## ディレクトリ構成

```
MachiPlan/
├── src/
│   ├── api/
│   │   └── gemini.ts        # Gemini API 呼び出し・プロンプト生成
│   ├── components/
│   │   ├── InputForm.tsx    # 町名・予算の入力フォーム
│   │   └── Timeline.tsx     # タイムライン形式の結果表示
│   ├── types/
│   │   └── plan.ts          # TourPlan / Spot 型定義
│   ├── utils/
│   │   └── exportPDF.ts     # PDF エクスポート処理（カード境界改ページ）
│   └── App.tsx              # メインコンポーネント
├── .env.example             # 環境変数テンプレート
└── index.html
```

---

## バイブコーディング環境

本プロジェクトは **Claude Desktop + Serena MCP** を使ったバイブコーディングで開発されました。

### 使用ツール

| ツール | 役割 |
|---|---|
| [Claude Desktop](https://claude.ai/download) | AIコーディングアシスタント（チャットUI） |
| [Serena](https://github.com/oraios/serena) | Claude用MCPサーバー。ファイル読み書き・シンボル検索・プロジェクト記憶などコードベース操作を提供 |

### 環境構築手順

#### 1. Claude Desktop のインストール

[claude.ai/download](https://claude.ai/download) からインストールします。

#### 2. Serena のセットアップ

```bash
# uv（Pythonパッケージマネージャ）が必要
# インストールされていない場合:
# https://docs.astral.sh/uv/getting-started/installation/

# Serena をクローン
git clone https://github.com/oraios/serena
cd serena
```

#### 3. Claude Desktop に Serena を登録

Claude Desktop の設定ファイル（`claude_desktop_config.json`）に以下を追加します。

**設定ファイルの場所:**
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "serena": {
      "command": "uvx",
      "args": [
        "--from", "git+https://github.com/oraios/serena",
        "serena-mcp-server",
        "--context", "desktop-app",
        "--project-directory", "C:/Users/yourname/app-dev"
      ]
    }
  }
}
```

> `--project-directory` は自分のプロジェクトフォルダに合わせて変更してください。

#### 4. プロジェクトをSerenaに登録

Claude Desktop を再起動後、チャットで以下のように話しかけるとプロジェクトが認識されます：

```
serenaを使って C:\Users\yourname\app-dev\MachiPlan を開いて
```

#### 5. 開発の始め方

あとは Claude に自然言語で指示するだけです。

```
# 例
「観光スポットにレーティング表示を追加して」
「PDFエクスポートで改ページがカードの途中にならないよう修正して」
```

---

## 注意事項

> 本ツールの観光プランはAIによる自動生成です。営業時間・料金・アクセスは変わる場合があるため、  
> 実際の訪問前に各スポットの公式情報をご確認ください。
