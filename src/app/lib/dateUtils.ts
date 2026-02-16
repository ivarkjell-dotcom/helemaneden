// /lib/dateUtils.ts
// --------------------------------------------------
// Robust ISO-dato-håndtering
// --------------------------------------------------

import type { ISODate } from "./types";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function isValidISODate(value: string): value is ISODate {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

export function parseISO(iso: ISODate): Date {
  return new Date(iso + "T00:00:00");
}

export function daysBetween(a: ISODate, b: ISODate): number {
  const da = parseISO(a);
  const db = parseISO(b);
  return Math.floor((db.getTime() - da.getTime()) / MS_PER_DAY);
}

export function clampMin(value: number, min: number): number {
  if (!Number.isFinite(value)) return min;
  return value < min ? min : value;
}
