# web-app 🛠️

**Claude Desktop + Serena MCP** を使ったバイブコーディングで開発したアプリ集です。

---

## プロジェクト一覧

| プロジェクト | 説明 |
|---|---|
| [MAGI SYSTEM](./MAGIsystem) | エヴァンゲリオンのMAGIシステムを模した、AI合議型意思決定Webアプリ |
| [NewPick](./NewPick) | 日本株 ポテンシャル分析ツール。銘柄コード・銘柄名から同業界ランキングや類似銘柄をAIが分析 |
| [MachiPlan](./MachiPlan) | 日本国内 AIかんたん観光プランナー。町名と予算を入力するだけで一日の観光プランを自動生成・PDF出力 |
| [AlternaDaily](./AlternaDaily) | 「一日一変」デイリーミッションアプリ。趣味趣向と難易度設定をもとにGemini AIが毎日ひとつのミッションを提案 |

---

## バイブコーディング環境

### 使用ツール

| ツール | 役割 |
|---|---|
| [Claude Desktop](https://claude.ai/download) | AIコーディングアシスタント（チャットUI） |
| [Serena](https://github.com/oraios/serena) | Claude用MCPサーバー。ファイル読み書き・シンボル検索・プロジェクト記憶などコードベース操作を提供 |

---

## 環境構築手順

### 1. Node.js のインストール

[nodejs.org](https://nodejs.org/ja) から LTS版をインストールします。
```bash
# インストール確認
node -v   # v18以上
npm -v
```

### 2. pnpm のインストール

各プロジェクトのパッケージマネージャとして pnpm を使用します。
```bash
npm install -g pnpm

# インストール確認
pnpm -v
```

### 3. uv のインストール

Serena の実行に必要な Python パッケージマネージャです。
```bash
# Windows (PowerShell)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# インストール確認
uv --version
```

### 4. Claude Desktop のインストール

[claude.ai/download](https://claude.ai/download) からインストールします。

### 5. Claude Desktop に Serena を登録

Claude Desktop の設定ファイル（`claude_desktop_config.json`）を開き、以下を追加します。

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

> `--project-directory` は自分の `app-dev` フォルダのパスに合わせて変更してください。

### 6. Claude Desktop を再起動

設定ファイル保存後、Claude Desktop を再起動すると Serena が有効になります。

### 7. 新しいプロジェクトを作成する場合

React + TypeScript + Vite のプロジェクトを新規作成するには：
```bash
cd C:\Users\yourname\app-dev

# Vite でプロジェクト作成
pnpm create vite my-app --template react-ts

cd my-app

# 依存関係インストール
pnpm install

# 開発サーバー起動確認
pnpm dev
```

その後、Claude Desktop のチャットで話しかけます：
```
serenaを使って C:\Users\yourname\app-dev\my-app を開いて
〇〇な機能を持つアプリを作って
```

---

## 既存プロジェクトのセットアップ

各プロジェクトをクローン後、以下の手順で起動できます。
```bash
cd AlternaDaily  # または NewPick, MachiPlan, MAGIsystem

# 依存関係インストール
pnpm install

# .env ファイルを作成してAPIキーを設定（任意・未設定でもデモモードで動作）
cp .env.example .env
# .env を開いて VITE_GEMINI_API_KEY=your_key_here を編集

# 開発サーバー起動
pnpm dev
```

> Gemini API キーは [Google AI Studio](https://aistudio.google.com/app/apikey) で無料取得できます。  
> **AlternaDaily・MachiPlan・NewPick は APIキーなしでもデモモードで動作します。**

### NewPick のみ：バックエンドサーバーの起動

NewPick は株価データ取得のために Express サーバーが必要です。別ターミナルで起動してください。
```bash
cd NewPick/server

# 依存関係インストール
npm install

# サーバー起動
npm run dev
```

---

## 共通技術スタック

| 項目 | 内容 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| パッケージマネージャ | pnpm |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| APIキー管理 | `.env` ファイル（Gitに含まれない） |
| コーディング環境 | Claude Desktop + Serena MCP |

## プロジェクト固有の技術

| プロジェクト | 追加ライブラリ・特記事項 |
|---|---|
| AlternaDaily | デモモード対応（APIキーなしでモック動作・DEMOバッジ表示） |
| NewPick | Express + yahoo-finance2（株価取得バックエンド） |
| MachiPlan | html2canvas + jsPDF（PDF出力機能） |
