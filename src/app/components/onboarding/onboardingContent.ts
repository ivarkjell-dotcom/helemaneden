export type OnboardingStep = {
  title: string;
  body: string[];
};

export const standardOnboarding = {
  durationText: "Tar ca. 2 min",
  steps: [
    {
      title: "Velkommen til HeleMåneden",
      body: [
        "HeleMåneden hjelper deg å få oversikt over hva du trygt kan bruke på dagligvare og annet forbruk.",
        "Én dag av gangen. Og gjennom hele uken og måneden.",
        "Ingen budsjetter å følge slavisk. Bare rolig kontroll."
      ]
    },
    {
      title: "Slik fungerer HeleMåneden",
      body: [
        "Du legger inn saldo én gang om dagen.",
        "Vi regner automatisk ut hvor mye du har igjen:",
        "I dag. Denne uken. Denne måneden.",
        "Du trenger ikke føre utgifter eller kategorier."
      ]
    },
    {
      title: "Før du starter",
      body: [
        "HeleMåneden fungerer best når kontoen du bruker her kun viser penger til daglig bruk.",
        "Vi anbefaler derfor at faste regninger og forventede trekk ligger på en annen konto.",
        "Da ser du alltid hva du faktisk kan bruke."
      ]
    }
  ]
};

export const pwaOnboarding = {
  durationText: "Tar ca. 1 min",
  steps: [
    {
      title: "Bra valg",
      body: [
        "Du har lagt HeleMåneden på hjemskjermen.",
        "Det gjør det enkelt å sjekke hva du trygt kan bruke i hverdagen."
      ]
    },
    {
      title: "Slik får du mest nytte av appen",
      body: [
        "Appen fungerer best når kontoen du bruker her kun viser penger til daglig bruk.",
        "Vi anbefaler derfor at faste regninger og forventede trekk ligger på en annen konto.",
        "Da ser du alltid hva du faktisk kan bruke."
      ]
    }
  ]
};
