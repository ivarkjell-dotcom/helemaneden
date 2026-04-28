"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "../../components/PageHeader";

export default function FAQPage() {
  const router = useRouter();

  const faqs = [
    {
      q: "Hva betyr “trygt å bruke”?",
      a: "Et konkret forslag til hva du kan bruke nå, basert på det du har igjen og tiden til neste inntekt.",
    },
    {
      q: "Hva skjer hvis jeg bruker mer enn tallet?",
      a: "Da justeres resten av perioden automatisk.",
    },
    {
      q: "Når bør jeg bruke appen?",
      a: "Når du lurer på om det er rom for å bruke penger.",
    },
    {
      q: "Må jeg følge tallet?",
      a: "Nei. Det er støtte, ikke en regel.",
    },
    {
      q: "Hvor ofte bør jeg oppdatere saldo?",
      a: "Når du vil. Litt oftere gir mer presise svar.",
    },
    {
      q: "Hva skjer hvis jeg storhandler?",
      a: "Det du har igjen fordeles på resten av perioden.",
    },
    {
      q: "Lagrer dere informasjon om meg?",
      a: "Nei. Alt lagres lokalt på din mobil.",
    },
  ];

  return (
    <main
  style={{
    maxWidth: 520,
    margin: "0 auto",
    padding: "24px 16px 16px", // 👈 økt topp-padding
  }}
>
      <PageHeader
  title="Spørsmål og svar"
  subtitle=""
  onBack={() => router.back()}
/>
      {/* FAQ */}
      <div className="space-y-4">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <p className="font-medium mb-2">{item.q}</p>
            <p className="text-sm opacity-80 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-8 text-sm opacity-60">
        Du bruker appen akkurat så mye eller lite du vil.
      </div>
    </main>
  );
}