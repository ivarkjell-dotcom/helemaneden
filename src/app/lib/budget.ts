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
export type BudgetResult = {
  dailyAvailable: number;
  weeklyAvailable: number;
  monthlyAvailable: number;
};

export function calculateBudget({
  currentBalance,
  daysLeftInMonth,
  daysLeftInWeek,
}: {
  currentBalance: number;
  daysLeftInMonth: number;
  daysLeftInWeek: number;
}): BudgetResult {
  if (daysLeftInMonth <= 0) {
    return {
      dailyAvailable: 0,
      weeklyAvailable: 0,
      monthlyAvailable: currentBalance,
    };
  }

  const dailyAvailable = currentBalance / daysLeftInMonth;
  const weeklyAvailable =
    dailyAvailable * Math.min(daysLeftInWeek, daysLeftInMonth);

  return {
    dailyAvailable: Math.round(dailyAvailable),
    weeklyAvailable: Math.round(weeklyAvailable),
    monthlyAvailable: Math.round(currentBalance),
  };
}

export function calculateDaysLeftInWeek(nextPayday: Date): number {
  const today = new Date();

  // 0 = søndag, 1 = mandag, ..., 6 = lørdag
  const dayOfWeek = today.getDay();

  // Hvor mange dager igjen til søndag
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  // Dager igjen til lønn
  const diffMs = nextPayday.getTime() - today.getTime();
  const daysUntilPayday = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysUntilPayday <= 0) return 0;

  return Math.min(daysUntilSunday, daysUntilPayday);
}

