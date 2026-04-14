import * as XLSX from 'xlsx';
import type { AppData, ImportValidationIssue } from '../types/app';

const requiredSheets = [
  'destinations',
  'shipments_regular',
  'shipments_spot',
  'events',
  'memos',
  'units',
] as const;

const defaultData = (): AppData => ({
  meta: {
    appVersion: '1.0.0',
    lastUpdatedAt: new Date().toISOString(),
    updatedBy: 'Local',
  },
  settings: {
    displayOrder: ['event', 'shipment', 'memo'],
    defaultView: 'calendar',
    weekStartsOn: 0,
  },
  units: [],
  standards: [],
  destinations: [],
  regularShipments: [],
  spotShipments: [],
  events: [],
  memos: [],
  attachments: [],
});

const readSheet = (wb: XLSX.WorkBook, name: string): Record<string, unknown>[] => {
  const ws = wb.Sheets[name];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json(ws, { defval: '' }) as Record<string, unknown>[];
};

const isYmd = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value);
const isHm = (value: string): boolean => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

export const validateAppData = (data: AppData): ImportValidationIssue[] => {
  const issues: ImportValidationIssue[] = [];
  const destinationIds = new Set(data.destinations.map((d) => d.id));
  const unitIds = new Set(data.units.map((u) => u.id));

  data.regularShipments.forEach((item, i) => {
    if (!destinationIds.has(item.destinationId)) {
      issues.push({
        sheet: 'shipments_regular',
        row: i + 2,
        column: 'destinationId',
        reason: '未知の destinationId',
        fix: 'destinations シートに存在するIDを指定',
        level: 'error',
      });
    }
    if (!unitIds.has(item.unitId)) {
      issues.push({
        sheet: 'shipments_regular',
        row: i + 2,
        column: 'unitId',
        reason: '未知の unitId',
        fix: 'units シートに追加するか unitId を修正',
        level: 'warning',
      });
    }
    if (!isYmd(item.startDate) || !isYmd(item.endDate)) {
      issues.push({
        sheet: 'shipments_regular',
        row: i + 2,
        column: 'startDate/endDate',
        reason: '日付形式不正',
        fix: 'YYYY-MM-DD 形式で入力',
        level: 'error',
      });
    }
    if (!(item.intervalWeeks === 1 || item.intervalWeeks === 2)) {
      issues.push({
        sheet: 'shipments_regular',
        row: i + 2,
        column: 'intervalWeeks',
        reason: '1 or 2 以外',
        fix: '1 または 2 を入力',
        level: 'error',
      });
    }
    if (item.weekday < 0 || item.weekday > 6) {
      issues.push({
        sheet: 'shipments_regular',
        row: i + 2,
        column: 'weekday',
        reason: '0-6 以外',
        fix: '0(Sun)-6(Sat)で入力',
        level: 'error',
      });
    }
    if (item.endDate < item.startDate) {
      issues.push({
        sheet: 'shipments_regular',
        row: i + 2,
        column: 'endDate',
        reason: 'endDate < startDate',
        fix: '期間を見直す',
        level: 'error',
      });
    }
  });

  data.spotShipments.forEach((item, i) => {
    if (!isYmd(item.shipDate)) {
      issues.push({
        sheet: 'shipments_spot',
        row: i + 2,
        column: 'shipDate',
        reason: '日付形式不正',
        fix: 'YYYY-MM-DD 形式で入力',
        level: 'error',
      });
    }
    if (item.quantity < 0) {
      issues.push({
        sheet: 'shipments_spot',
        row: i + 2,
        column: 'quantity',
        reason: '数量が負数',
        fix: '0以上で入力',
        level: 'error',
      });
    }
  });

  data.events.forEach((item, i) => {
    if (!isYmd(item.date)) {
      issues.push({
        sheet: 'events',
        row: i + 2,
        column: 'date',
        reason: '日付形式不正',
        fix: 'YYYY-MM-DD 形式で入力',
        level: 'error',
      });
    }
    if (item.time && !isHm(item.time)) {
      issues.push({
        sheet: 'events',
        row: i + 2,
        column: 'time',
        reason: '時刻形式不正',
        fix: 'HH:mm 形式で入力',
        level: 'error',
      });
    }
  });

  return issues;
};

export const importExcelToAppData = async (
  file: File,
): Promise<{ data: AppData; issues: ImportValidationIssue[] }> => {
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: 'array' });
  const missing = requiredSheets.filter((sheet) => !wb.SheetNames.includes(sheet));
  if (missing.length > 0) {
    return {
      data: defaultData(),
      issues: missing.map((sheet) => ({
        sheet,
        row: 1,
        column: '',
        reason: '必須シート不足',
        fix: `${sheet} シートを追加`,
        level: 'error' as const,
      })),
    };
  }

  const data: AppData = {
    ...defaultData(),
    destinations: readSheet(wb, 'destinations') as AppData['destinations'],
    regularShipments: readSheet(wb, 'shipments_regular') as AppData['regularShipments'],
    spotShipments: readSheet(wb, 'shipments_spot') as AppData['spotShipments'],
    events: readSheet(wb, 'events') as AppData['events'],
    memos: readSheet(wb, 'memos') as AppData['memos'],
    units: readSheet(wb, 'units') as AppData['units'],
    standards: readSheet(wb, 'standards') as AppData['standards'],
  };

  const issues = validateAppData(data);
  return { data, issues };
};

const appendSheet = (
  wb: XLSX.WorkBook,
  name: string,
  rows: Record<string, unknown>[],
): void => {
  const ws = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, name);
};

export const exportAppDataToExcel = (data: AppData, filename = 'shipping-data.xlsx'): void => {
  const wb = XLSX.utils.book_new();
  appendSheet(wb, 'destinations', data.destinations);
  appendSheet(wb, 'shipments_regular', data.regularShipments);
  appendSheet(wb, 'shipments_spot', data.spotShipments);
  appendSheet(wb, 'events', data.events);
  appendSheet(wb, 'memos', data.memos);
  appendSheet(wb, 'units', data.units);
  appendSheet(wb, 'standards', data.standards);
  XLSX.writeFile(wb, filename);
};
