import { ArrowLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

export function PageHeader({ title, subtitle, onBack }: PageHeaderProps) {
  return (
    <div
      style={{
        paddingTop: 0,
        paddingBottom: 16,
      }}
    >
      {/* 🔙 Tilbakepil */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            padding: 4,
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* 🧾 Tittel */}
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* 🔽 Subtitle */}
      {subtitle && (
        <div
          style={{
            marginTop: 4,
            fontSize: 13,
            opacity: 0.6,
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
}