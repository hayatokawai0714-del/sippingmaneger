export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export type AppMeta = {
  appVersion: string;
  lastUpdatedAt: string;
  updatedBy: string;
};

export type AppSettings = {
  displayOrder: Array<'event' | 'shipment' | 'memo'>;
  defaultView: 'calendar' | 'today';
  weekStartsOn: 0 | 1;
};

export type Unit = {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
};

export type Standard = {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
};

export type Destination = {
  id: string;
  name: string;
  address: string;
  phone: string;
  contactPerson: string;
  email: string;
  notes: string;
  isFavorite: boolean;
  isActive: boolean;
  sortOrder: number;
};

export type RegularShipment = {
  id: string;
  destinationId: string;
  frequency: 'weekly';
  intervalWeeks: 1 | 2;
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  standardId: string;
  standardNameFallback: string;
  quantity: number;
  unitId: string;
  unitNameFallback: string;
  startDate: string;
  endDate: string;
  notes: string;
  isActive: boolean;
  updatedAt: string;
  updatedBy: string;
};

export type SpotShipment = {
  id: string;
  shipDate: string;
  destinationId: string;
  standardId: string;
  standardNameFallback: string;
  quantity: number;
  unitId: string;
  unitNameFallback: string;
  notes: string;
  attachmentId: string;
  status: string;
  updatedAt: string;
  updatedBy: string;
};

export type EventItem = {
  id: string;
  date: string;
  time: string;
  title: string;
  notes: string;
  category: string;
  updatedAt: string;
  updatedBy: string;
};

export type MemoItem = {
  id: string;
  date: string;
  text: string;
  priority: number;
  updatedAt: string;
  updatedBy: string;
};

export type Attachment = {
  id: string;
  name: string;
  type: string;
  localOnly: boolean;
  linkedEntityType: string;
  linkedEntityId: string;
  notes: string;
};

export type AppData = {
  meta: AppMeta;
  settings: AppSettings;
  units: Unit[];
  standards: Standard[];
  destinations: Destination[];
  regularShipments: RegularShipment[];
  spotShipments: SpotShipment[];
  events: EventItem[];
  memos: MemoItem[];
  attachments: Attachment[];
};

export type DailyItemType = 'shipment' | 'event' | 'memo';

export type ExpandedShipment = SpotShipment & { source: 'spot' | 'regular' };

export type DailyItem =
  | { type: 'shipment'; date: string; shipment: ExpandedShipment }
  | { type: 'event'; date: string; event: EventItem }
  | { type: 'memo'; date: string; memo: MemoItem };

export type ImportValidationIssue = {
  sheet: string;
  row: number;
  column: string;
  reason: string;
  fix: string;
  level: 'error' | 'warning';
};
