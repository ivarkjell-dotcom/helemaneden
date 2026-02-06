export const STORAGE_KEYS = {
  monthStartBalance: "monthStartBalance",
  monthStartDate: "monthStartDate",
  nextPayday: "nextPayday",
  currentBalance: "currentBalance",
} as const;

export const UI = {
  cardPadding: 32,
  tapMinSize: 44,
} as const;

export const BUDGET = {
  // 7-dagers segmenter fra startdato (første/siste kan være kortere via cap mot remainingDaysTotal)
  segmentDays: 7,

  // hvis noe skulle gi negativt/NaN, beskytt output
  minDays: 1,

  // kan settes høyere senere hvis du ønsker “minimum per dag”-regel
  minSafeDaily: 0,
} as const;

export const WEEKDAY_NO = ["søn", "man", "tir", "ons", "tor", "fre", "lør"] as const;
