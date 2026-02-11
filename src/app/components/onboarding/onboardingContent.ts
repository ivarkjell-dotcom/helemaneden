// src/app/components/onboarding/onboardingContent.ts

export type OnboardingStep = {
  key: string;
  title: string;
  body: string[];       // kort tekst
  moreTitle?: string;   // "Hva betyr ...?"
  moreBody?: string[];  // mer-forklaring
};

export type OnboardingContent = {
  durationText: string;
  steps: OnboardingStep[];
};

export const standardOnboarding: OnboardingContent = {
  durationText: "Tar ca. 30 sek",
  steps: [
    {
      key: "what",
      title: "Vær trygg hele måneden",
      body: ["HeleMåneden gir deg et trygt beløp per dag."],
      moreTitle: "Hva betyr “trygt beløp”?",
      moreBody: [
        "Det er beløpet du kan bruke uten å komme i minus før neste lønn.",
        "Du registrerer saldo – appen regner ut resten.",
      ],
    },
    {
      key: "for-whom",
      title: "For deg som vil ha kontroll",
      body: ["Ikke detaljbudsjettering. Bare klar retning."],
      moreTitle: "Må jeg kategorisere alt?",
      moreBody: [
        "Nei. Du trenger ikke føre alt du kjøper.",
        "Du registrerer bare saldo på brukskonto – det er nok.",
      ],
    },
    {
      key: "why",
      title: "Fordi forbruk varierer",
      body: ["Noen dager bruker vi mer. Andre mindre."],
      moreTitle: "Hva skjer hvis jeg bruker mer enn plan?",
      moreBody: [
        "Appen justerer automatisk resten av perioden.",
        "Da ser du hvordan “trygt å bruke” endrer seg dag for dag.",
      ],
    },
    {
      key: "how",
      title: "Slik får du best effekt",
      body: ["Betal faste regninger først. Bruk appen på resten."],
      moreTitle: "Hvorfor anbefales dette?",
      moreBody: [
        "Sett av penger til faste utgifter (bolig, strøm, mobil, TV, osv.) på en egen konto tidlig i måneden.",
        "Da jobber HeleMåneden kun med pengene du faktisk kan bruke på mat, klær, kaffe, gaver og annet forbruk.",
        "Det gjør beregningen mer presis og trygg.",
      ],
    },
    {
      key: "when",
      title: "Bruk den når det passer",
      body: ["Oppdater saldo når du vil – jo oftere, jo mer presist."],
      moreTitle: "Må jeg gjøre det hver dag?",
      moreBody: [
        "Nei. Men hver gang du oppdaterer, blir oversikten mer nøyaktig.",
        "Og du blir mer bevisst uten å føre alt du kjøper.",
      ],
    },
    {
      key: "start",
      title: "Kom i gang på 1–2 minutter",
      body: ["Gjør dette først – så får du live utregninger med en gang:"],
      // siste steg har ikke “les mer”
    },
  ],
};

export const pwaOnboarding: OnboardingContent = {
  durationText: "Tar ca. 30 sek",
  steps: standardOnboarding.steps,
};
