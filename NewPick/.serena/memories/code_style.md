# コードスタイルと規約

## 言語・フォーマット
- TypeScript 使用 (strict モード)
- ファイル拡張子: `.tsx` (Reactコンポーネント), `.ts` (ロジック)
- 文字コード: UTF-8

## コンポーネント
- 関数コンポーネント + Hooks を使用
- デフォルトエクスポートを使用 (`export default`)
- コンポーネント名はパスカルケース (例: `App`, `MyComponent`)

## 命名規則
- 変数・関数: キャメルケース (`myVariable`, `handleClick`)
- コンポーネント: パスカルケース (`MyComponent`)
- CSSクラス: ケバブケース (`my-class`)

## ESLint
- `eslint-plugin-react-hooks` でフック規則を強制
- `eslint-plugin-react-refresh` でHMR互換を確認
- `typescript-eslint` でTypeScript固有のルールを適用

## スタイリング
- CSS Modules または通常のCSSファイル (`App.css`, `index.css`)
