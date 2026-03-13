import type { AppData, Mission, MissionRecord, UserProfile } from '../types/mission';

const STORAGE_KEY = 'alternadaily_data';

function load(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profile: null, records: [], todayMission: null };
    return JSON.parse(raw) as AppData;
  } catch {
    return { profile: null, records: [], todayMission: null };
  }
}

function save(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAppData(): AppData {
  return load();
}

export function saveProfile(profile: UserProfile): void {
  const data = load();
  save({ ...data, profile });
}

export function saveTodayMission(mission: Mission): void {
  const data = load();
  // 今日のレコードがなければ pending として追加
  const today = mission.date;
  const exists = data.records.find((r) => r.mission.date === today);
  const records = exists
    ? data.records.map((r) =>
        r.mission.date === today ? { ...r, mission } : r
      )
    : [...data.records, { mission, status: 'pending' as const }];
  save({ ...data, todayMission: mission, records });
}

export function completeMission(date: string): void {
  const data = load();
  const records = data.records.map((r) =>
    r.mission.date === date
      ? { ...r, status: 'completed' as const, completedAt: new Date().toISOString() }
      : r
  );
  save({ ...data, records });
}

export function failMission(date: string): void {
  const data = load();
  const records = data.records.map((r) =>
    r.mission.date === date ? { ...r, status: 'failed' as const } : r
  );
  save({ ...data, records });
}

export function getRecords(): MissionRecord[] {
  return load().records.sort(
    (a, b) => new Date(b.mission.date).getTime() - new Date(a.mission.date).getTime()
  );
}

export function getStreak(): number {
  const records = load().records;
  const completed = records
    .filter((r) => r.status === 'completed')
    .map((r) => r.mission.date)
    .sort()
    .reverse();

  if (completed.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < completed.length; i++) {
    const expected = new Date(today);
    expected.setDate(today.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (completed[i] === expectedStr) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}
