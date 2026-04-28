"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function DataSikkerhetPage() {
  const router = useRouter();
  return (
    <main
      style={{
        padding: "24px 20px 80px",
        maxWidth: 720,
        margin: "0 auto",
        lineHeight: 1.6,
      }}
    >

<div style={{ marginBottom: 12 }}>
  <button
    onClick={() => router.back()}
    style={{
      background: "transparent",
      border: "none",
      padding: 0,
      cursor: "pointer",
    }}
  >
    <ArrowLeft size={22} />
  </button>
</div>

      <h1 style={{ fontSize: 22, marginBottom: 16 }}>
        Data og sikkerhet
      </h1>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>
          Hvordan lagres dataene dine?
        </h2>
        <p>
          HeleMåneden lagrer all informasjon lokalt på din enhet.
          Det betyr at ingen økonomiske tall sendes til en server.
        </p>
        <p>
          Data lagres i nettleserens lokale lagring (localStorage),
          og er kun tilgjengelig på denne enheten.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>
          Samler vi inn personopplysninger?
        </h2>
        <p>
          Nei. HeleMåneden samler ikke inn navn, e-post,
          kontonummer eller annen identifiserbar informasjon.
        </p>
        <p>
          Appen fungerer uten innlogging og uten deling av data.
        </p>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>
          Hva med varsler?
        </h2>
        <p>
          Hvis du aktiverer varsler, lagres kun tidspunktet
          du selv velger. Ingen data sendes videre.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>
          Ditt ansvar
        </h2>
        <p>
          Siden data lagres lokalt, vil de forsvinne hvis du
          sletter nettleserdata eller bytter enhet.
        </p>
        <p>
          Sørg for at enheten din er sikret med passord
          eller biometrisk lås.
        </p>
      </section>
    </main>
  );
}
