export function getMergeMessage(weeksMerged: number): string | null {
  if (!weeksMerged || weeksMerged <= 0) return null;

  if (weeksMerged === 1) {
    return "Slått sammen med neste uke. Det gir lavere trygt å bruke fremover.";
  }

  if (weeksMerged === 2) {
    return "Slått sammen med de neste 2 ukene. Det gir lavere trygt å bruke fremover.";
  }

  if (weeksMerged === 3) {
    return "Slått sammen med de neste 3 ukene. Det gir lavere trygt å bruke fremover.";
  }

  return "Slått sammen med flere av de neste ukene. Det gir lavere trygt å bruke fremover.";
}