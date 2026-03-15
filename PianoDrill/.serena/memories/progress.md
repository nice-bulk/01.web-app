# 実装進捗

## 完了
- [x] プロジェクトオンボーディング
- [x] 仕様策定 (spec.md)
- [x] コンポーネント設計 (component_design.md)
- [x] types/music.ts
- [x] data/music.ts
- [x] App.tsx（モード切替）
- [x] ModeSelect（モード選択画面）
- [x] Key Mode
  - KeySignatureDisplay.tsx（調号SVG）
  - KeyAnswerButtons.tsx（回答ボタン）
  - useKeyQuestion.ts（出題ロジック）
  - KeyMode.tsx（メイン）
- [x] Note Mode
  - Staff.tsx（五線譜＋調号＋音符SVG）
  - Piano.tsx（仮想鍵盤）
  - useNoteQuestion.ts（出題ロジック）
  - NoteMode.tsx（メイン）

## 未実装（将来対応）
- [ ] 短調（平行調）対応 - Key Mode
- [ ] スコア・正解率記録
- [ ] MIDIキーボード入力（WebMIDI API）
- [ ] 和音モードの出題（現在は単音のみ出題）
- [ ] スマホ対応レイアウト調整

## 既知の課題・改善余地
- Staff.tsx の音符縦位置の精度（加線周辺）
- 調号によって音符の臨時記号表示が正確でない可能性
- 黒鍵（半音）は現在クリック不可（音域外のため）
