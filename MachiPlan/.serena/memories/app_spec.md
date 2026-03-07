# MachiPlan - App Specification

## 概要
町の名前と予算を入力すると、Gemini APIを使って一日の観光計画を生成するアプリ。

## 入力
- 町の名前（テキスト）
- 予算（円、数値）

## 出力（タイムライン形式）
各スポットに以下を表示:
- 訪問時間（何時〜何時）
- 場所名・説明・特徴
- 費用（入場料など）
- 歩行距離・移動手段（前のスポットからの）
- 食事スポット（ランチ・ディナーの場合はその旨）
- おすすめ度（★）・口コミ情報
- 予算合計（交通費+入場料+食事すべて込み）

## Gemini API
- モデル: gemini-2.0-flash
- APIキー: 環境変数 VITE_GEMINI_API_KEY
- レスポンス形式: JSON（構造化データ）

## ファイル構成
- src/App.tsx - メインUI
- src/components/Timeline.tsx - タイムライン表示
- src/components/InputForm.tsx - 入力フォーム
- src/api/gemini.ts - Gemini API呼び出し
- src/types/plan.ts - 型定義
- src/index.css - グローバルスタイル
