# 開発コマンド一覧 (Windows / pnpm)

## 開発サーバー起動
```
pnpm dev
```
→ http://localhost:5173 で起動 (Vite HMR 有効)

## ビルド
```
pnpm build
```
→ TypeScript コンパイル + Vite プロダクションビルド → `dist/` に出力

## リント
```
pnpm lint
```
→ ESLint 実行

## プレビュー (ビルド後の確認)
```
pnpm preview
```

## パッケージインストール
```
pnpm install
```

## Windowsユーティリティコマンド
- ディレクトリ一覧: `dir`
- ファイル検索: `dir /s /b <pattern>`
- Git: `git status`, `git log --oneline`, `git diff`
- パス区切り: バックスラッシュ `\`
