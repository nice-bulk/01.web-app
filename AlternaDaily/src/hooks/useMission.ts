import { useState, useEffect, useCallback } from 'react';
import { generateMission } from '../api/gemini';
import {
  getAppData,
  saveTodayMission,
  completeMission,
  failMission,
  getStreak,
  getTodayDateString,
} from '../utils/storage';
import type { Mission, UserProfile } from '../types/mission';

export type MissionState =
  | 'loading'
  | 'idle'        // ミッション未取得
  | 'ready'       // ミッション表示中（未完了）
  | 'completed'   // 完了
  | 'failed'      // 未達成
  | 'error';

export function useMission(profile: UserProfile | null) {
  const [mission, setMission] = useState<Mission | null>(null);
  const [state, setState] = useState<MissionState>('loading');
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const today = getTodayDateString();

  const refresh = useCallback(() => {
    const data = getAppData();
    const todayRecord = data.records.find((r) => r.mission.date === today);

    if (todayRecord) {
      setMission(todayRecord.mission);
      if (todayRecord.status === 'completed') setState('completed');
      else if (todayRecord.status === 'failed') setState('failed');
      else setState('ready');
    } else {
      setState('idle');
      setMission(null);
    }
    setStreak(getStreak());
  }, [today]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const drawMission = useCallback(
    async (reroll = false) => {
      if (!profile) return;
      if (reroll && mission?.isRerolled) return; // 引き直しは1回のみ

      setIsGenerating(true);
      setError(null);
      try {
        const newMission = await generateMission(profile, today);
        newMission.isRerolled = reroll;
        saveTodayMission(newMission);
        setMission(newMission);
        setState('ready');
      } catch (e) {
        setError(e instanceof Error ? e.message : '生成に失敗しました');
        setState('error');
      } finally {
        setIsGenerating(false);
      }
    },
    [profile, today, mission]
  );

  const complete = useCallback(() => {
    if (!mission) return;
    completeMission(today);
    setState('completed');
    setStreak(getStreak());
  }, [mission, today]);

  const fail = useCallback(() => {
    if (!mission) return;
    failMission(today);
    setState('failed');
  }, [mission, today]);

  return {
    mission,
    state,
    streak,
    error,
    isGenerating,
    drawMission,
    complete,
    fail,
  };
}
