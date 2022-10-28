export interface Reservation {
  id?: string;
  createDate: Date;
  updateDate: Date;
  reservationStart: Date;
  reservationEnd: Date;
  emailOfReservator: string;
  phoneOfReservator?: string;
  firstNameOfReservator?: string;
  lastNameOfReservator?: string;
  personCount: number;
  confirmed: boolean;
  tableNumbers: string[];
  [propertyKey: string]: any;
}
export interface FetchedReservation {
  id?: string;
  createDate: string;
  updateDate: string;
  reservationStart: string;
  reservationEnd: string;
  emailOfReservator: string;
  phoneOfReservator?: string;
  firstNameOfReservator?: string;
  lastNameOfReservator?: string;
  personCount: number;
  confirmed: boolean;
  tableNumbers: string[];
  [propertyKey: string]: any;
}

export interface RestaurantConfig {
  id?: string;
  openingHours?: OpeningHours[];
  tables?: Table[];
  defaultReservationLength?: number;
}

export interface OpeningHours {
  start?: Date;
  end?: Date;
  day?: DayOfWeek;
}

export interface SuggestionResponse {
  startTime: Date;
  tableNumber: string;
}

export interface Table {
  tableNumber: string;
  maxSeats: number;
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export interface SuggestionResponse {
  startTime: Date;
  tableNumber: string;
}

export interface Option {
  label: string;
  value: number;
}
