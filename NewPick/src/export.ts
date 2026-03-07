// CSVエクスポートユーティリティ

import type { StockRankingItem, SimilarStockItem } from './gemini';

function escapeCsv(value: string | number): string {
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsv(headers: string[], rows: string[][]): string {
  const bom = '\uFEFF'; // BOM for Excel compatibility
  const headerLine = headers.map(escapeCsv).join(',');
  const dataLines = rows.map(row => row.map(escapeCsv).join(','));
  return bom + [headerLine, ...dataLines].join('\r\n');
}

function downloadCsv(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportRankingCsv(
  items: StockRankingItem[],
  stockName: string,
  industry: string
): void {
  const headers = ['順位', '証券コード', '銘柄名', '時価総額', '目標株価', 'PER', 'PBR'];
  const rows = items.map(item => [
    String(item.rank),
    item.ticker,
    item.name,
    item.marketCap,
    item.targetPrice,
    item.per,
    item.pbr,
  ]);
  const csv = buildCsv(headers, rows);
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `NewPick_同業界ランキング_${stockName}_${date}.csv`);
}

export function exportSimilarCsv(
  items: SimilarStockItem[],
  stockName: string
): void {
  const headers = ['証券コード', '銘柄名', '業種', 'PER', 'PBR', '類似度', '類似理由'];
  const rows = items.map(item => [
    item.ticker,
    item.name,
    item.sector,
    item.per,
    item.pbr,
    String(item.similarity),
    item.reason,
  ]);
  const csv = buildCsv(headers, rows);
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `NewPick_類似銘柄_${stockName}_${date}.csv`);
}

export function exportFavoritesCsv(
  items: { ticker: string; name: string; industry: string; addedAt: string }[]
): void {
  const headers = ['証券コード', '銘柄名', '業界', '登録日'];
  const rows = items.map(item => [
    item.ticker,
    item.name,
    item.industry,
    new Date(item.addedAt).toLocaleDateString('ja-JP'),
  ]);
  const csv = buildCsv(headers, rows);
  const date = new Date().toISOString().slice(0, 10);
  downloadCsv(csv, `NewPick_お気に入り銘柄_${date}.csv`);
}
