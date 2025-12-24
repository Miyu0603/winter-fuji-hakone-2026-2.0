
export interface LocationDetail {
  id: string;
  title: string;
  description: string;
  address?: string;
  openingHours?: string;
  mapUrl?: string;
  websiteUrl?: string;
  carNaviPhone?: string; // For Japanese Car GPS
  imageUrl?: string; // New: Image to display in detail view
  transitLegs?: TransitLeg[]; // New: Structured transit info
  reservation?: {
    id: string;
    sections: ReservationSection[];
  };
}

export interface ReservationSection {
  title: string;
  items: { label: string; value: string; isFullWidth?: boolean }[];
}

export interface TransitLeg {
  type: 'bus' | 'walk' | 'train' | 'wait';
  transport: string;
  depTime: string;
  depStop: string;
  arrTime: string;
  arrStop: string;
  details: string[];
}

export interface ItineraryEvent {
  time: string;
  description: string;
  isHighlight?: boolean; // For Red accent #C63D0F
  note?: string;
  locationId?: string; // Link to LocationDetail
}

export interface DaySchedule {
  date: string;
  weekday: string;
  title: string;
  accommodation?: string;
  accommodationMapUrl?: string; // New: Link for accommodation
  mapUrl?: string;
  events: ItineraryEvent[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  category?: string;
}

export interface UsefulLink {
  title: string;
  url: string;
}

export interface EmergencyContact {
  title: string;
  number: string;
  note?: string;
}

export interface ShoppingItem {
  id: string;
  text: string;
  isCompleted: boolean;
}

export interface ExpenseRecord {
  rowIndex: number; // Important for Edit/Delete
  date: string;
  item: string;
  payer: '想想' | '錢錢';
  amountTwd: number;
  amountJpy: number;
  note: string;
  // New Split Fields
  splitType: 'equal' | 'manual';
  splitXiangTwd: number;
  splitXiangJpy: number;
  splitQianTwd: number;
  splitQianJpy: number;
}

export enum Tab {
  ITINERARY = 'Itinerary',
  PREP = 'Prep',
  COST = 'Cost',
  PACKING = 'Packing',
  SHOPPING = 'Shopping',
  INFO = 'Info'
}
