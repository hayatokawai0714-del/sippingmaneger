import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useViewSettings } from '../contexts/ViewSettingsContext';
import { CalendarGrid } from '../components/CalendarGrid';
import { DetailModal } from '../components/DetailModal';
import { buildCalendarDays, getItemsByDate } from '../utils/selectors';

export const CalendarPage = () => {
  const { data, status, error, reload } = useAppData();
  const { month, setPrevMonth, setNextMonth, goToday } = useViewSettings();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const days = useMemo(() => (data ? buildCalendarDays(data, month) : []), [data, month]);
  const itemMap = useMemo(() => (data ? getItemsByDate(data, month) : new Map()), [data, month]);
  const selectedItems = selectedDate ? (itemMap.get(selectedDate) ?? []) : [];

  if (status === 'loading' || status === 'idle') {
    return <div className="app-card p-4 text-sm">読み込み中です...</div>;
  }

  if (status === 'error') {
    return (
      <div className="app-card border-red-200 bg-red-50 p-4 text-sm">
        <p className="mb-2 font-semibold text-red-700">初期データの読み込みに失敗しました</p>
        <p className="mb-3 text-xs text-red-700/80">{error}</p>
        <button onClick={() => void reload()} className="btn-secondary">
          再読み込み
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-3">
      <section className="app-card p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-700/70">
              Monthly Overview
            </p>
            <h2 className="text-lg font-semibold">{format(month, 'yyyy年M月')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={setPrevMonth}>
              前月
            </button>
            <button className="btn-primary" onClick={goToday}>
              Today
            </button>
            <button className="btn-secondary" onClick={setNextMonth}>
              次月
            </button>
          </div>
        </div>
      </section>

      <section className="app-card overflow-hidden">
        <CalendarGrid days={days} data={data} onSelectDate={setSelectedDate} />
      </section>

      <DetailModal
        open={Boolean(selectedDate)}
        date={selectedDate ?? ''}
        items={selectedItems}
        data={data}
        onClose={() => setSelectedDate(null)}
      />
    </div>
  );
};
