# PianoDrill - コンポーネント設計

## ディレクトリ構成

```
src/
├── App.tsx                    # ルート：モード選択 & ルーティング
├── main.tsx
├── index.css
├── App.css
│
├── types/
│   └── music.ts               # 共通型定義（Note, KeySignature, Clef, etc.）
│
├── data/
│   └── music.ts               # 音楽データ定数（KEY_SIGNATURES, NOTES, etc.）
│
├── hooks/
│   ├── useNoteQuestion.ts     # Note Mode の出題ロジック
│   └── useKeyQuestion.ts      # Key Mode の出題ロジック
│
├── components/
│   ├── ModeSelect/
│   │   └── ModeSelect.tsx     # トップ画面：Note Mode / Key Mode 選択
│   │
│   ├── NoteMode/
│   │   ├── NoteMode.tsx       # Note Mode のメインコンテナ
│   │   ├── Staff.tsx          # 五線譜 + 調号 + 音符の SVG 描画
│   │   └── Piano.tsx          # 仮想鍵盤（クリック入力）
│   │
│   └── KeyMode/
│       ├── KeyMode.tsx        # Key Mode のメインコンテナ
│       ├── KeySignatureDisplay.tsx  # 調号のみ表示する SVG
│       └── KeyAnswerButtons.tsx     # 回答ボタン群
```

## コンポーネント責務

### App.tsx
- 現在のモード（`'select' | 'note' | 'key'`）を state で管理
- モードに応じて ModeSelect / NoteMode / KeyMode を切り替え表示

### types/music.ts
```ts
type Clef = 'treble' | 'bass'
type Accidental = 'sharp' | 'flat' | 'natural'
type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B'

interface Note {
  name: NoteName
  octave: number
  accidental?: Accidental
}

interface KeySignature {
  type: 'sharp' | 'flat' | 'none'
  count: number       // 0〜7
  majorKey: string    // 'C Major', 'G Major', ...
  minorKey: string    // 'A Minor', 'E Minor', ... (将来用)
}
```

### data/music.ts
- KEY_SIGNATURES: 全15調の調号データ配列
- TREBLE_NOTES: トレブル譜の出題音域 (C4〜G5)
- BASS_NOTES: バス譜の出題音域 (E2〜C4)
- 各調号における各音の変化（Bb調ならB→Bb, E→Eb, etc.）

### useNoteQuestion.ts
- 現在の問題（Note + Clef + KeySignature）を管理
- `nextQuestion()` でランダムに次の問題を生成
- `checkAnswer(notes: Note[])` で正誤判定

### useKeyQuestion.ts
- 現在の問題（KeySignature）を管理
- `nextQuestion()` でランダムに次の問題を生成（長調15調）
- `checkAnswer(key: string)` で正誤判定

### Staff.tsx
- SVG で五線譜を描画
- props: `clef`, `keySignature`, `notes`
- 音符の縦位置計算ロジックを内包

### Piano.tsx
- SVG または div で88鍵（または出題範囲に絞った鍵）を描画
- 単音モード：クリックで即時 `onAnswer` コールバック
- 和音モード：複数選択 → 確定ボタンで `onAnswer` コールバック
- props: `mode: 'single' | 'chord'`, `onAnswer: (notes: Note[]) => void`

### KeySignatureDisplay.tsx
- Staff.tsx をベースに調号のみ描画（音符なし）

### KeyAnswerButtons.tsx
- 長調15調のボタンを表示
- props: `onAnswer: (key: string) => void`

## 実装順序
1. types/music.ts
2. data/music.ts
3. App.tsx（モード切替のみ）
4. ModeSelect.tsx
5. KeyMode（KeySignatureDisplay → KeyAnswerButtons → useKeyQuestion → KeyMode）
6. Staff.tsx（五線譜SVG）
7. Piano.tsx（仮想鍵盤）
8. NoteMode（useNoteQuestion → NoteMode）
