export type ISODate = `${number}-${number}-${number}`;

export type BudgetSettings = {
  monthStartBalance: number; // saldo ved lønn / start
  monthStartDate: ISODate; // startdato (lønn)
  nextPayday: ISODate; // neste lønn
};

export type BudgetInputs = BudgetSettings & {
  todayISO: ISODate; // stabilisert dato (klient)
  currentBalance: number; // saldo i dag
};

export type WeekLabel = {
  startISO: ISODate;
  endISO: ISODate;
  startText: string; // f.eks. "man"
  endText: string; // f.eks. "søn"
};

export type BudgetPlan = {
  totalDaysInPeriod: number;
  plannedDaily: number;

  // hvor langt vi er kommet
  daysElapsed: number;
  remainingDaysTotal: number;
  remainingDaysThisWeek: number;

  weekLabel: WeekLabel;

  // plan for resterende dager i inneværende uke-segment
  plannedWeekBudgetThisWeek: number;
  expectedBalanceNow: number;
  delta: number;
};

export type BudgetRecommendation = {
  mode: "normal" | "merged";
  safeDaily: number;
  safeWeek: number;
  horizonDays: number; // hvor mange dager safeDaily er fordelt over
};

export type BudgetResult = BudgetPlan & BudgetRecommendation;
