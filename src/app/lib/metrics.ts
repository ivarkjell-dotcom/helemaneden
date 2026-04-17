const OPEN_COUNT_KEY = "hm_open_count";
const INPUT_COUNT_KEY = "hm_input_count";
const DAYS_KEY = "hm_active_days";

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getMetrics() {
  if (typeof window === "undefined") return { opens: 0, inputs: 0, days: 0 };

  const days = JSON.parse(localStorage.getItem(DAYS_KEY) || "[]");

  return {
    opens: Number(localStorage.getItem(OPEN_COUNT_KEY) || 0),
    inputs: Number(localStorage.getItem(INPUT_COUNT_KEY) || 0),
    days: days.length,
  };
}

export function incrementOpens() {
  if (typeof window === "undefined") return;

  const current = Number(localStorage.getItem(OPEN_COUNT_KEY) || 0);
  localStorage.setItem(OPEN_COUNT_KEY, String(current + 1));

  // 👇 registrer dag
  const days: string[] = JSON.parse(localStorage.getItem(DAYS_KEY) || "[]");
  const todayStr = today();

  if (!days.includes(todayStr)) {
    days.push(todayStr);
    localStorage.setItem(DAYS_KEY, JSON.stringify(days));
  }
}

export function incrementInputs() {
  if (typeof window === "undefined") return;

  const current = Number(localStorage.getItem(INPUT_COUNT_KEY) || 0);
  localStorage.setItem(INPUT_COUNT_KEY, String(current + 1));
}