# 🎹 PianoDrill

音符やキー（調）を瞬時に当てられるようになるための、ピアノ練習用Webアプリです。

🌐 **デモサイト**: https://pianodrill.vercel.app/

## 機能

### Note Mode（音符あてモード）
- 五線譜に表示された音符を見て、画面上の仮想鍵盤で回答
- ト音記号 / ヘ音記号の切り替えに対応
- 単音 / 和音モードの切り替えに対応
- 調号（♯・♭）付きの問題に対応
- 正解・不正解を鍵盤のカラーハイライトでフィードバック

### Key Mode（キーあてモード）
- 五線譜上の調号だけを見て、何長調かをボタンで回答
- 長調15調（C Major 〜 Cb Major）に対応
- ランダム出題

## Tech Stack

| 項目 | 内容 |
|---|---|
| フレームワーク | React 19 |
| 言語 | TypeScript ~5.9 |
| ビルドツール | Vite 8 |
| パッケージマネージャ | pnpm |
| スタイリング | CSS Modules |
| ホスティング | Vercel |

## 開発環境のセットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

ブラウザで http://localhost:5173 を開いてください。

## ビルド

```bash
# 型チェック + プロダクションビルド
pnpm build

# ビルド結果のプレビュー
pnpm preview
```

## Lint

```bash
pnpm lint
```

## ディレクトリ構成

```
src/
├── types/
│   └── music.ts              # 共通型定義
├── data/
│   └── music.ts              # 音楽データ定数（調号・音域など）
├── hooks/
│   ├── useKeyQuestion.ts     # Key Mode 出題ロジック
│   └── useNoteQuestion.ts    # Note Mode 出題ロジック
└── components/
    ├── ModeSelect/           # モード選択画面
    ├── KeyMode/              # Key Mode 画面
    └── NoteMode/             # Note Mode 画面（五線譜・仮想鍵盤）
```

## 今後の予定

- [ ] 短調（平行調）対応 — Key Mode に短調を追加
- [ ] スコア・正解率の記録
- [ ] MIDIキーボード入力対応（WebMIDI API）
- [ ] スマホ対応レイアウトの改善
