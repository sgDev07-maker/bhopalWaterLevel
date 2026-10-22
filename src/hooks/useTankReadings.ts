import { useCallback, useEffect, useMemo, useState } from 'react';
import { TANKS } from '../data/tanks';
import { getTankReading, getTankReadings } from '../services/tankApi';
import type { TankReading, TankStatus, TankView } from '../types/tank';
import { calculateAvailableWater, tankStatus } from '../utils/water';

const AUTO_REFRESH_MS = 60_000;

function merge(
  readings: Map<number, TankReading>,
  failed: Set<number>,
): TankView[] {
  return TANKS.map((tank) => {
    const reading = readings.get(tank.tagId);
    const percentage = reading?.value ?? null;
    const unavailable = failed.has(tank.tagId) || percentage === null;
    return {
      ...tank,
      percentage,
      captureDateTime: reading?.captureDateTime ?? null,
      availableWater:
        percentage === null
          ? null
          : calculateAvailableWater(tank.capacity, percentage),
      status: unavailable ? 'Unknown' : tankStatus(percentage),
      unavailable,
    };
  });
}

export function useTankReadings() {
  const [readings, setReadings] = useState<Map<number, TankReading>>(
    () => new Map(),
  );
  const [failed, setFailed] = useState<Set<number>>(() => new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState<'all' | number>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TankStatus>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadReadings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setNotice(null);
    const uniqueIds = [...new Set(TANKS.map((tank) => tank.tagId))];
    try {
      const list = await getTankReadings(uniqueIds);
      const next = new Map<number, TankReading>();
      const nextFailed = new Set<number>();
      for (const id of uniqueIds) {
        const found = list.find((item) => item.tagID === id);
        if (!found || found.value === null) nextFailed.add(id);
        if (found) next.set(id, found);
      }
      setReadings(next);
      setFailed(nextFailed);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : 'Unable to load tank readings. Previous values were kept.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadReadings(false);
  }, [loadReadings]);

  useEffect(() => {
    if (!autoRefresh) return undefined;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      void loadReadings(true);
    }, AUTO_REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [autoRefresh, loadReadings]);

  async function retryOne(tagId: number) {
    try {
      const reading = await getTankReading(tagId);
      setReadings((current) => new Map(current).set(tagId, reading));
      setFailed((current) => {
        const next = new Set(current);
        if (reading.value === null) next.add(tagId);
        else next.delete(tagId);
        return next;
      });
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : `Retry failed for tag ${tagId}`,
      );
    }
  }

  const rows = useMemo(() => merge(readings, failed), [readings, failed]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (zone !== 'all' && row.zone !== zone) return false;
      if (statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        String(row.tagId).includes(q) ||
        String(row.zone).includes(q)
      );
    });
  }, [rows, search, zone, statusFilter]);

  const summary = useMemo(() => {
    const withLevel = rows.filter((row) => row.percentage !== null);
    const avg =
      withLevel.length === 0
        ? null
        : withLevel.reduce((sum, row) => sum + (row.percentage ?? 0), 0) /
          withLevel.length;
    return {
      tanks: rows.length,
      avg,
      totalCapacity: rows.reduce((sum, row) => sum + row.capacity, 0),
      totalAvailable: rows.reduce(
        (sum, row) => sum + (row.availableWater ?? 0),
        0,
      ),
    };
  }, [rows]);

  return {
    rows,
    filtered,
    summary,
    loading,
    refreshing,
    notice,
    search,
    setSearch,
    zone,
    setZone,
    statusFilter,
    setStatusFilter,
    autoRefresh,
    setAutoRefresh,
    loadReadings,
    retryOne,
  };
}
