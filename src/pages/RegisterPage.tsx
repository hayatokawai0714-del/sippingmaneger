import { useMemo, useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';

type Tab = 'spot' | 'regular' | 'event' | 'memo' | 'attachment';

const tabList: Tab[] = ['spot', 'regular', 'event', 'memo', 'attachment'];
const tabLabel: Record<Tab, string> = {
  spot: 'スポット出荷',
  regular: '定期出荷',
  event: '一般予定',
  memo: 'メモ',
  attachment: '注文書確認',
};

const uid = (prefix: string): string =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
const todayYmd = (): string => new Date().toISOString().slice(0, 10);

export const RegisterPage = () => {
  const { data, addSpotShipment, addRegularShipment, addEvent, addMemo } = useAppData();
  const [tab, setTab] = useState<Tab>('spot');

  const [spotDate, setSpotDate] = useState(todayYmd());
  const [spotQuantity, setSpotQuantity] = useState(1);
  const [spotNote, setSpotNote] = useState('');

  const [regularWeekday, setRegularWeekday] = useState<number>(new Date().getDay());
  const [regularInterval, setRegularInterval] = useState<1 | 2>(1);
  const [regularStart, setRegularStart] = useState(todayYmd());
  const [regularEnd, setRegularEnd] = useState('2099-12-31');
  const [regularQuantity, setRegularQuantity] = useState(1);
  const [regularNote, setRegularNote] = useState('');

  const [eventDate, setEventDate] = useState(todayYmd());
  const [eventTime, setEventTime] = useState('09:00');
  const [eventTitle, setEventTitle] = useState('');

  const [memoDate, setMemoDate] = useState(todayYmd());
  const [memoText, setMemoText] = useState('');

  const firstDestination = useMemo(() => data?.destinations[0], [data]);
  const firstUnit = useMemo(() => data?.units[0], [data]);

  if (!data) return null;

  return (
    <div className="space-y-3 pb-8">
      <section className="app-card p-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-emerald-700/70">
          Quick Input
        </p>
        <h2 className="text-lg font-semibold">出荷登録</h2>

        <div className="mt-3 flex flex-wrap gap-2">
          {tabList.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                tab === item
                  ? 'border-accent bg-accent text-white'
                  : 'border-line bg-white text-ink hover:bg-mist'
              }`}
            >
              {tabLabel[item]}
            </button>
          ))}
        </div>
      </section>

      {tab === 'spot' ? (
        <form
          className="app-card space-y-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            addSpotShipment({
              id: uid('spot'),
              shipDate: spotDate,
              destinationId: firstDestination?.id ?? '',
              standardId: '',
              standardNameFallback: '自由入力',
              quantity: spotQuantity,
              unitId: firstUnit?.id ?? '',
              unitNameFallback: firstUnit?.name ?? 'kg',
              notes: spotNote,
              attachmentId: '',
              status: 'draft',
              updatedAt: new Date().toISOString(),
              updatedBy: 'Local',
            });
            setSpotNote('');
          }}
        >
          <label className="block text-xs font-medium">出荷日</label>
          <input
            type="date"
            value={spotDate}
            onChange={(e) => setSpotDate(e.target.value)}
            className="input-base"
          />

          <label className="block text-xs font-medium">数量</label>
          <input
            type="number"
            min={0}
            value={spotQuantity}
            onChange={(e) => setSpotQuantity(Number(e.target.value || 0))}
            className="input-base"
          />

          <label className="block text-xs font-medium">メモ</label>
          <input value={spotNote} onChange={(e) => setSpotNote(e.target.value)} className="input-base" />

          <button type="submit" className="btn-primary">
            スポット出荷を追加
          </button>
        </form>
      ) : null}

      {tab === 'regular' ? (
        <form
          className="app-card space-y-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            addRegularShipment({
              id: uid('reg'),
              destinationId: firstDestination?.id ?? '',
              frequency: 'weekly',
              intervalWeeks: regularInterval,
              weekday: regularWeekday as 0 | 1 | 2 | 3 | 4 | 5 | 6,
              standardId: '',
              standardNameFallback: '自由入力',
              quantity: regularQuantity,
              unitId: firstUnit?.id ?? '',
              unitNameFallback: firstUnit?.name ?? 'kg',
              startDate: regularStart,
              endDate: regularEnd,
              notes: regularNote,
              isActive: true,
              updatedAt: new Date().toISOString(),
              updatedBy: 'Local',
            });
            setRegularNote('');
          }}
        >
          <label className="block text-xs font-medium">曜日 (0=日 ... 6=土)</label>
          <input
            type="number"
            min={0}
            max={6}
            value={regularWeekday}
            onChange={(e) => setRegularWeekday(Number(e.target.value || 0))}
            className="input-base"
          />

          <label className="block text-xs font-medium">間隔週</label>
          <select
            value={regularInterval}
            onChange={(e) => setRegularInterval(Number(e.target.value) as 1 | 2)}
            className="input-base"
          >
            <option value={1}>毎週</option>
            <option value={2}>隔週</option>
          </select>

          <label className="block text-xs font-medium">開始日</label>
          <input
            type="date"
            value={regularStart}
            onChange={(e) => setRegularStart(e.target.value)}
            className="input-base"
          />

          <label className="block text-xs font-medium">終了日</label>
          <input
            type="date"
            value={regularEnd}
            onChange={(e) => setRegularEnd(e.target.value)}
            className="input-base"
          />

          <label className="block text-xs font-medium">数量</label>
          <input
            type="number"
            min={0}
            value={regularQuantity}
            onChange={(e) => setRegularQuantity(Number(e.target.value || 0))}
            className="input-base"
          />

          <label className="block text-xs font-medium">メモ</label>
          <input
            value={regularNote}
            onChange={(e) => setRegularNote(e.target.value)}
            className="input-base"
          />

          <button type="submit" className="btn-primary">
            定期出荷を追加
          </button>
        </form>
      ) : null}

      {tab === 'event' ? (
        <form
          className="app-card space-y-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!eventTitle.trim()) return;
            addEvent({
              id: uid('evt'),
              date: eventDate,
              time: eventTime,
              title: eventTitle,
              notes: '',
              category: 'general',
              updatedAt: new Date().toISOString(),
              updatedBy: 'Local',
            });
            setEventTitle('');
          }}
        >
          <label className="block text-xs font-medium">日付</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="input-base"
          />
          <label className="block text-xs font-medium">時刻</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="input-base"
          />
          <label className="block text-xs font-medium">タイトル</label>
          <input
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="input-base"
          />
          <button type="submit" className="btn-primary">
            一般予定を追加
          </button>
        </form>
      ) : null}

      {tab === 'memo' ? (
        <form
          className="app-card space-y-2 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!memoText.trim()) return;
            addMemo({
              id: uid('memo'),
              date: memoDate,
              text: memoText,
              priority: 1,
              updatedAt: new Date().toISOString(),
              updatedBy: 'Local',
            });
            setMemoText('');
          }}
        >
          <label className="block text-xs font-medium">日付</label>
          <input
            type="date"
            value={memoDate}
            onChange={(e) => setMemoDate(e.target.value)}
            className="input-base"
          />
          <label className="block text-xs font-medium">メモ</label>
          <input value={memoText} onChange={(e) => setMemoText(e.target.value)} className="input-base" />
          <button type="submit" className="btn-primary">
            メモを追加
          </button>
        </form>
      ) : null}

      {tab === 'attachment' ? (
        <div className="app-card p-3 text-xs text-emerald-900/70">
          注文書確認は初期実装ではローカル選択と目視確認の補助のみです。
        </div>
      ) : null}
    </div>
  );
};
