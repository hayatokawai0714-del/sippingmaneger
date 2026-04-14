import {
  addDays,
  endOfMonth,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameMonth,
  parseISO,
  startOfMonth,
  subDays,
} from 'date-fns';
import type {
  AppData,
  DailyItem,
  ExpandedShipment,
  RegularShipment,
} from '../types/app';

export type CalendarDay = {
  date: Date;
  isoDate: string;
  inCurrentMonth: boolean;
  items: DailyItem[];
};

const formatIso = (date: Date): string => format(date, 'yyyy-MM-dd');

const buildRegularDates = (regular: RegularShipment, month: Date): Date[] => {
  const start = parseISO(regular.startDate);
  const end = parseISO(regular.endDate);
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const cursorStart = isBefore(start, monthStart) ? monthStart : start;
  const cursorEnd = isBefore(monthEnd, end) ? monthEnd : end;
  const dates: Date[] = [];

  let cursor = cursorStart;
  while (isBefore(cursor, cursorEnd) || isEqual(cursor, cursorEnd)) {
    if (getDay(cursor) === regular.weekday) {
      const diffDays = Math.floor(
        (cursor.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
      );
      const diffWeeks = Math.floor(diffDays / 7);
      if (diffWeeks % regular.intervalWeeks === 0) {
        dates.push(cursor);
      }
    }
    cursor = addDays(cursor, 1);
  }

  return dates;
};

export const expandRegularShipmentsByMonth = (
  data: AppData,
  month: Date,
): ExpandedShipment[] => {
  return data.regularShipments
    .filter((r) => r.isActive)
    .flatMap((regular) => {
      return buildRegularDates(regular, month).map((date) => ({
        id: `${regular.id}_${formatIso(date)}`,
        shipDate: formatIso(date),
        destinationId: regular.destinationId,
        standardId: regular.standardId,
        standardNameFallback: regular.standardNameFallback,
        quantity: regular.quantity,
        unitId: regular.unitId,
        unitNameFallback: regular.unitNameFallback,
        notes: regular.notes,
        attachmentId: '',
        status: 'scheduled',
        updatedAt: regular.updatedAt,
        updatedBy: regular.updatedBy,
        source: 'regular' as const,
      }));
    });
};

export const getItemsByDate = (data: AppData, month: Date): Map<string, DailyItem[]> => {
  const map = new Map<string, DailyItem[]>();
  const regulars = expandRegularShipmentsByMonth(data, month);
  const spots = data.spotShipments.map((s) => ({ ...s, source: 'spot' as const }));

  const shipments = [...regulars, ...spots];
  shipments.forEach((shipment) => {
    const row: DailyItem = { type: 'shipment', date: shipment.shipDate, shipment };
    map.set(shipment.shipDate, [...(map.get(shipment.shipDate) ?? []), row]);
  });

  data.events.forEach((event) => {
    const row: DailyItem = { type: 'event', date: event.date, event };
    map.set(event.date, [...(map.get(event.date) ?? []), row]);
  });

  data.memos.forEach((memo) => {
    const row: DailyItem = { type: 'memo', date: memo.date, memo };
    map.set(memo.date, [...(map.get(memo.date) ?? []), row]);
  });

  map.forEach((items, key) => map.set(key, sortDailyItems(items, data.settings.displayOrder)));
  return map;
};

export const sortDailyItems = (
  items: DailyItem[],
  order: Array<'event' | 'shipment' | 'memo'>,
): DailyItem[] => {
  return [...items].sort((a, b) => {
    const orderA = order.findIndex((x) => x === a.type);
    const orderB = order.findIndex((x) => x === b.type);
    if (orderA !== orderB) return orderA - orderB;
    if (a.type === 'event' && b.type === 'event') {
      return (a.event.time ?? '').localeCompare(b.event.time ?? '');
    }
    return 0;
  });
};

export const buildCalendarDays = (data: AppData, month: Date): CalendarDay[] => {
  const first = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const gridStart = subDays(first, getDay(first));
  const gridEnd = addDays(monthEnd, 6 - getDay(monthEnd));
  const itemMap = getItemsByDate(data, month);
  const cells: CalendarDay[] = [];

  let cursor = gridStart;
  while (isBefore(cursor, gridEnd) || isEqual(cursor, gridEnd)) {
    const isoDate = formatIso(cursor);
    cells.push({
      date: cursor,
      isoDate,
      inCurrentMonth: isSameMonth(cursor, month),
      items: itemMap.get(isoDate) ?? [],
    });
    cursor = addDays(cursor, 1);
  }
  return cells;
};
