"use client";

import styles from "./insighttext.module.css";

type InsightTextProps = {
  delta: number;
  mode: "normal" | "merged";
};

function formatKr(n: number) {
  const v = Math.abs(Math.floor(n));
  return v.toLocaleString("no-NO");
}

export function InsightText({ delta, mode }: InsightTextProps) {
  let text = "Legg inn saldo i dag for å få en trygg anbefaling.";

  if (mode === "merged") {
    text = "Denne uken er slått sammen med neste for at du skal holde deg trygg frem til lønn.";
  } else if (delta > 0) {
    text = `Du ligger foran planen med ${formatKr(delta)} kr. Det gir deg litt mer rom denne uken.`;
  } else if (delta < 0) {
    text = `Du ligger bak planen med ${formatKr(delta)} kr. Vi strammer inn for å beskytte resten av måneden.`;
  } else if (delta === 0) {
    text = "Du ligger på planen. Fortsetter du slik, holder du deg stabil gjennom måneden.";
  }

  return <p className={styles.text}>{text}</p>;
}
