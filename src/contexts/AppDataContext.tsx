import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import type {
  AppData,
  Destination,
  EventItem,
  LoadStatus,
  MemoItem,
  RegularShipment,
  SpotShipment,
  Unit,
} from '../types/app';

type AppDataContextValue = {
  status: LoadStatus;
  data: AppData | null;
  error: string | null;
  reload: () => Promise<void>;
  replaceData: (next: AppData) => void;
  addSpotShipment: (item: SpotShipment) => void;
  addRegularShipment: (item: RegularShipment) => void;
  addEvent: (item: EventItem) => void;
  addMemo: (item: MemoItem) => void;
  saveDestination: (item: Destination) => void;
  saveUnit: (item: Unit) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

const DRAFT_KEY = 'shipping-app:draft-data';

const mergeMeta = (next: AppData): AppData => ({
  ...next,
  meta: {
    ...next.meta,
    lastUpdatedAt: new Date().toISOString(),
  },
});

export const AppDataProvider = ({ children }: PropsWithChildren) => {
  const [status, setStatus] = useState<LoadStatus>('idle');
  const [data, setData] = useState<AppData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const replaceData = useCallback((next: AppData) => {
    const merged = mergeMeta(next);
    setData(merged);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(merged));
  }, []);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const localDraft = localStorage.getItem(DRAFT_KEY);
      if (localDraft) {
        setData(JSON.parse(localDraft) as AppData);
        setStatus('success');
        return;
      }
      const response = await fetch(`${import.meta.env.BASE_URL}data.json`);
      if (!response.ok) {
        throw new Error('初期データの読み込みに失敗しました');
      }
      const payload = (await response.json()) as AppData;
      setData(payload);
      setStatus('success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'データ読み込み失敗';
      setError(message);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const mutate = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = mergeMeta(updater(prev));
      localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const addSpotShipment = useCallback(
    (item: SpotShipment) => mutate((prev) => ({ ...prev, spotShipments: [...prev.spotShipments, item] })),
    [mutate],
  );

  const addRegularShipment = useCallback(
    (item: RegularShipment) =>
      mutate((prev) => ({ ...prev, regularShipments: [...prev.regularShipments, item] })),
    [mutate],
  );

  const addEvent = useCallback(
    (item: EventItem) => mutate((prev) => ({ ...prev, events: [...prev.events, item] })),
    [mutate],
  );

  const addMemo = useCallback(
    (item: MemoItem) => mutate((prev) => ({ ...prev, memos: [...prev.memos, item] })),
    [mutate],
  );

  const saveDestination = useCallback(
    (item: Destination) =>
      mutate((prev) => ({
        ...prev,
        destinations: prev.destinations.some((x) => x.id === item.id)
          ? prev.destinations.map((x) => (x.id === item.id ? item : x))
          : [...prev.destinations, item],
      })),
    [mutate],
  );

  const saveUnit = useCallback(
    (item: Unit) =>
      mutate((prev) => ({
        ...prev,
        units: prev.units.some((x) => x.id === item.id)
          ? prev.units.map((x) => (x.id === item.id ? item : x))
          : [...prev.units, item],
      })),
    [mutate],
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      status,
      data,
      error,
      reload,
      replaceData,
      addSpotShipment,
      addRegularShipment,
      addEvent,
      addMemo,
      saveDestination,
      saveUnit,
    }),
    [
      status,
      data,
      error,
      reload,
      replaceData,
      addSpotShipment,
      addRegularShipment,
      addEvent,
      addMemo,
      saveDestination,
      saveUnit,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export const useAppData = (): AppDataContextValue => {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
};
