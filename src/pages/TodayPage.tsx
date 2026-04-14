import { format } from 'date-fns';
import { useMemo } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { getItemsByDate } from '../utils/selectors';

export const TodayPage = () => {
  const { data } = useAppData();
  const today = format(new Date(), 'yyyy-MM-dd');

  const items = useMemo(() => {
    if (!data) return [];
    const map = getItemsByDate(data, new Date());
    return map.get(today) ?? [];
  }, [data, today]);

  return (
    <div className="space-y-3">
      <section className="app-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-700/70">Today</p>
        <h2 className="text-lg font-semibold">今日の予定 ({today})</h2>
      </section>

      <ul className="space-y-2">
        {items.length === 0 ? (
          <li className="app-card p-3 text-sm text-emerald-900/70">本日の予定はありません</li>
        ) : null}
        {items.slice(0, 4).map((item, idx) => (
          <li key={`${item.type}_${idx}`} className="app-card p-3 text-sm">
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">
              {item.type === 'shipment' ? '出荷' : item.type === 'event' ? '予定' : 'メモ'}
            </span>
          </li>
        ))}
      </ul>

      {items.length > 4 ? (
        <p className="text-xs text-emerald-900/70">ほか {items.length - 4} 件</p>
      ) : null}
    </div>
  );
};
