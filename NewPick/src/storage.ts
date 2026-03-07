// ローカルストレージを使った永続化ユーティリティ

export interface HistoryEntry {
  id: string;
  ticker: string;
  stockName: string;
  industry: string;
  searchedAt: string; // ISO文字列
  type: 'ranking' | 'similar' | 'both';
}

export interface FavoriteEntry {
  ticker: string;
  name: string;
  industry: string;
  addedAt: string;
}

const HISTORY_KEY = 'newpick_history';
const FAVORITES_KEY = 'newpick_favorites';
const API_KEY_KEY = 'newpick_apikey';
const MAX_HISTORY = 30;

// --- API Key ---
export function loadApiKey(): string {
  try { return localStorage.getItem(API_KEY_KEY) ?? ''; }
  catch { return ''; }
}

export function saveApiKey(key: string): void {
  try {
    if (key) localStorage.setItem(API_KEY_KEY, key);
    else localStorage.removeItem(API_KEY_KEY);
  } catch { /* noop */ }
}

// --- 検索履歴 ---
export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch { /* noop */ }
}

export function addHistory(entry: Omit<HistoryEntry, 'id' | 'searchedAt'>): HistoryEntry[] {
  const current = loadHistory();
  // 同じtickerの既存エントリを削除（重複防止）
  const filtered = current.filter(h => h.ticker !== entry.ticker);
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    searchedAt: new Date().toISOString(),
  };
  const updated = [newEntry, ...filtered];
  saveHistory(updated);
  return updated;
}

export function clearHistory(): HistoryEntry[] {
  saveHistory([]);
  return [];
}

// --- お気に入り ---
export function loadFavorites(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveFavorites(entries: FavoriteEntry[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(entries));
  } catch { /* noop */ }
}

export function toggleFavorite(entry: Omit<FavoriteEntry, 'addedAt'>): FavoriteEntry[] {
  const current = loadFavorites();
  const exists = current.some(f => f.ticker === entry.ticker);
  let updated: FavoriteEntry[];
  if (exists) {
    updated = current.filter(f => f.ticker !== entry.ticker);
  } else {
    updated = [...current, { ...entry, addedAt: new Date().toISOString() }];
  }
  saveFavorites(updated);
  return updated;
}

export function isFavorite(ticker: string, favorites: FavoriteEntry[]): boolean {
  return favorites.some(f => f.ticker === ticker);
}
