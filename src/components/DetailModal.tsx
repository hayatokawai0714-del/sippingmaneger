import type { AppData, DailyItem } from '../types/app';

type Props = {
  open: boolean;
  date: string;
  items: DailyItem[];
  data: AppData;
  onClose: () => void;
};

const renderItem = (item: DailyItem, data: AppData) => {
  if (item.type === 'event') return `${item.event.time} ${item.event.title}`;
  if (item.type === 'memo') return item.memo.text;
  const dest = data.destinations.find((d) => d.id === item.shipment.destinationId);
  return `${dest?.name ?? '出荷先未設定'} / ${item.shipment.quantity}${item.shipment.unitNameFallback} / ${item.shipment.standardNameFallback}`;
};

export const DetailModal = ({ open, date, items, data, onClose }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 bg-emerald-950/35 p-4" onClick={onClose}>
      <div className="mx-auto mt-16 max-w-lg rounded-xl border border-line bg-white p-4 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">{date} の予定</h2>
          <button className="btn-secondary" onClick={onClose}>
            閉じる
          </button>
        </div>

        <ul className="space-y-2">
          {items.length === 0 ? (
            <li className="rounded-lg bg-mist p-3 text-sm text-emerald-900/70">データはありません</li>
          ) : null}

          {items.map((item, idx) => (
            <li key={`${item.type}_${idx}`} className="rounded-lg border border-line p-2 text-sm">
              <div className="mb-1 text-xs text-emerald-900/65">{item.type}</div>
              {renderItem(item, data)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
