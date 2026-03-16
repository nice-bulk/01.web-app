# 🎹 PianoDrill

音符・キー（調）の読譜力を鍛えるピアノ練習用 Web アプリです。

🌐 **デモサイト**: https://pianodrill.vercel.app/

## モード一覧

### 🎼 Note Mode（音符あてモード）
- 五線譜に表示された音符を見て、画面上の仮想鍵盤で回答
- ト音記号 / ヘ音記号の切り替えに対応
- 単音 / 和音モードの切り替えに対応
- 調号（♯・♭）付きの問題に対応
- 正解・不正解を鍵盤のカラーハイライトでフィードバック
- 正解音・不正解音のサウンドフィードバック（Web Audio API）
- 正解率・連続正解・問題数をリアルタイム表示
- ⏱ タイムアタックモード（60秒）対応

### 🔑 Key Mode（キーあてモード）
- 五線譜上の調号だけを見て、何調かをボタンで回答
- **長調 / 短調 / 両方** の切り替えに対応（全15調 × 2）
- 正解音・不正解音のサウンドフィードバック（Web Audio API）
- 正解率・連続正解・問題数をリアルタイム表示
- 5連続正解で 🔥 表示
- ⏱ タイムアタックモード（60秒）対応

### 🎮 Play Mode（演奏モード）
- 有名な曲の音符バーが五線譜上を右から左へ流れるリズムゲーム
- 判定ラインに合わせて鍵盤をクリックして演奏
- **Perfect / Good / Miss** の3段階タイミング判定
- **Easy / Normal / Hard** の難易度切り替え（BPM 調整）
- 演奏中に Web Audio API でピアノ音を再生
- 曲終了後に S〜D ランクのリザルト表示
- 収録曲：きらきら星、メリーさんの羊

## 共通機能

- **EN / 日本語** の言語切り替え（全 UI に対応）
- アニメーション：正解/不正解時のフラッシュ、問題切り替え時のポップイン

## Tech Stack

| 項目 | 内容 |
|---|---|
| フレームワーク | React 19 |
| 言語 | TypeScript ~5.9 |
| ビルドツール | Vite 8 |
| パッケージマネージャ | pnpm |
| スタイリング | CSS Modules |
| サウンド | Web Audio API（外部ライブラリなし） |
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
│   └── music.ts                  # 共通型定義（Note, Song, Judgment など）
├── data/
│   ├── music.ts                  # 音楽データ定数（調号・音域など）
│   └── songs.ts                  # Play Mode 収録曲データ
├── context/
│   └── AppContext.tsx             # 言語設定グローバル管理
├── utils/
│   └── localize.ts               # EN/日本語ローカライズユーティリティ
├── hooks/
│   ├── useKeyQuestion.ts         # Key Mode 出題ロジック
│   ├── useNoteQuestion.ts        # Note Mode 出題ロジック
│   ├── usePlayMode.ts            # Play Mode ゲームループ・判定ロジック
│   ├── useScore.ts               # スコア管理（正解率・連続正解）
│   ├── useSound.ts               # サウンドフィードバック（Web Audio API）
│   └── useTimer.ts               # タイムアタック用カウントダウン
└── components/
    ├── common/                   # 共通コンポーネント
    │   ├── ScoreBoard            # スコア表示
    │   ├── TimerBar              # タイマーバー
    │   └── TimeUpModal           # タイムアップ結果モーダル
    ├── ModeSelect/               # モード選択画面
    ├── KeyMode/                  # Key Mode 画面
    ├── NoteMode/                 # Note Mode 画面（五線譜・仮想鍵盤）
    └── PlayMode/                 # Play Mode 画面（リズムゲーム）
```

## 今後の予定

- [ ] Play Mode 収録曲の追加
- [ ] MIDIキーボード入力対応（WebMIDI API）
- [ ] 和音モードの出題（Note Mode）
- [ ] 弱点（間違いの多い調・音符）のハイライト表示
- [ ] スマホ対応レイアウトの改善
