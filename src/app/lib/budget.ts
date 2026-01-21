export function calculateDailyAmount(
  balance: number,
  daysLeft: number
): number {
  if (daysLeft <= 0) return 0;
  return Math.floor(balance / daysLeft);
}

export function calculateDaysLeft(nextPayday: Date): number {
  const today = new Date();
  const diffMs = nextPayday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function calculateDaysBetween(
  startDate: Date,
  endDate: Date
): number {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
