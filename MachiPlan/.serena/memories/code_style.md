# コードスタイルと規約（MachiPlan）

## 言語・型
- TypeScript 5.9（strict モード推奨）
- 型アノテーションを積極的に使用

## コンポーネント
- React 関数コンポーネント（クラスコンポーネントは使用しない）
- ファイル名は PascalCase（例: `MyComponent.tsx`）
- 1ファイル1コンポーネントを推奨

## 命名規則
- コンポーネント: PascalCase
- 変数・関数: camelCase
- 定数: UPPER_SNAKE_CASE
- CSS クラス: kebab-case

## import順序（推奨）
1. React / 外部ライブラリ
2. 内部モジュール
3. スタイル（.css）

## リンター
- ESLint 9 + typescript-eslint
- eslint-plugin-react-hooks（Hooks のルール強制）
- eslint-plugin-react-refresh（HMR 対応）
