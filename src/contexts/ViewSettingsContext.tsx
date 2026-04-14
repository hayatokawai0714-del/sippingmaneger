import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { addMonths } from 'date-fns';

type ViewFilters = {
  onlyShipment: boolean;
  onlyEvent: boolean;
  onlyMemo: boolean;
  onlyFavorite: boolean;
};

type ViewSettingsContextValue = {
  month: Date;
  setPrevMonth: () => void;
  setNextMonth: () => void;
  goToday: () => void;
  filters: ViewFilters;
  toggleFilter: (key: keyof ViewFilters) => void;
};

const STORAGE_KEY = 'shipping-app:view-settings';

const defaultFilters: ViewFilters = {
  onlyShipment: false,
  onlyEvent: false,
  onlyMemo: false,
  onlyFavorite: false,
};

const ViewSettingsContext = createContext<ViewSettingsContextValue | null>(null);

export const ViewSettingsProvider = ({ children }: PropsWithChildren) => {
  const [month, setMonth] = useState(new Date());
  const [filters, setFilters] = useState<ViewFilters>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultFilters;
    try {
      return { ...defaultFilters, ...(JSON.parse(raw) as Partial<ViewFilters>) };
    } catch {
      return defaultFilters;
    }
  });

  const toggleFilter = (key: keyof ViewFilters) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo<ViewSettingsContextValue>(
    () => ({
      month,
      setPrevMonth: () => setMonth((prev) => addMonths(prev, -1)),
      setNextMonth: () => setMonth((prev) => addMonths(prev, 1)),
      goToday: () => setMonth(new Date()),
      filters,
      toggleFilter,
    }),
    [filters, month],
  );

  return <ViewSettingsContext.Provider value={value}>{children}</ViewSettingsContext.Provider>;
};

export const useViewSettings = (): ViewSettingsContextValue => {
  const ctx = useContext(ViewSettingsContext);
  if (!ctx) {
    throw new Error('useViewSettings must be used within ViewSettingsProvider');
  }
  return ctx;
};
