import { format } from 'date-fns';
import type { CalendarDay } from '../utils/selectors';
import type { AppData, DailyItem } from '../types/app';

type Props = {
  days: CalendarDay[];
  data: AppData;
  onSelectDate: (isoDate: string) => void;
};

const labelForItem = (item: DailyItem, data: AppData): string => {
  if (item.type === 'event') return `${item.event.title} ${item.event.time}`.trim();
  if (item.type === 'memo') return item.memo.text;
  const dest = data.destinations.find((d) => d.id === item.shipment.destinationId);
  return `${dest?.name ?? '出荷先未設定'} ${item.shipment.standardNameFallback} ${item.shipment.quantity}${item.shipment.unitNameFallback}`;
};

export const CalendarGrid = ({ days, data, onSelectDate }: Props) => {
  return (
    <div className="grid grid-cols-7 border-l border-t border-line">
      {['日', '月', '火', '水', '木', '金', '土'].map((w) => (
        <div
          key={w}
          className="border-b border-r border-line bg-mist px-1 py-2 text-center text-xs font-semibold text-emerald-900/80"
        >
          {w}
        </div>
      ))}

      {days.map((day) => {
        const shown = day.items.slice(0, 2);
        const rest = day.items.length - shown.length;
        return (
          <button
            key={day.isoDate}
            onClick={() => onSelectDate(day.isoDate)}
            className={`min-h-28 border-b border-r border-line px-1.5 py-1.5 text-left transition ${
              day.inCurrentMonth ? 'bg-white hover:bg-accentSoft/70' : 'bg-mist/55 text-emerald-900/45'
            }`}
          >
            <div className="mb-1 text-xs font-semibold">{format(day.date, 'd')}</div>
            <div className="space-y-1">
              {shown.map((item, idx) => (
                <div
                  key={`${item.type}_${idx}`}
                  className="truncate rounded bg-emerald-50 px-1 py-0.5 text-[11px] text-emerald-900"
                >
                  {labelForItem(item, data)}
                </div>
              ))}
              {rest > 0 ? (
                <div className="text-[11px] font-medium text-emerald-700/80">+{rest}件</div>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
};
