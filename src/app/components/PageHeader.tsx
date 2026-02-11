type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div
      style={{
        paddingTop: 0,          // 🔼 nærmere TopBar
        paddingBottom: 16,      // 🔽 kontrollert luft ned
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: 0,            // 🔥 viktig: fjerner default margin
        }}
      >
        {title}
      </h1>

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
