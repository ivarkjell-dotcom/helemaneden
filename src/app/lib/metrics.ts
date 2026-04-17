const OPEN_COUNT_KEY = "hm_open_count";
const INPUT_COUNT_KEY = "hm_input_count";

export function getMetrics() {
  if (typeof window === "undefined") return { opens: 0, inputs: 0 };

  return {
    opens: Number(localStorage.getItem(OPEN_COUNT_KEY) || 0),
    inputs: Number(localStorage.getItem(INPUT_COUNT_KEY) || 0),
  };
}

export function incrementOpens() {
  if (typeof window === "undefined") return;

  const current = Number(localStorage.getItem(OPEN_COUNT_KEY) || 0);
  localStorage.setItem(OPEN_COUNT_KEY, String(current + 1));
}

export function incrementInputs() {
  if (typeof window === "undefined") return;

  const current = Number(localStorage.getItem(INPUT_COUNT_KEY) || 0);
  localStorage.setItem(INPUT_COUNT_KEY, String(current + 1));
}