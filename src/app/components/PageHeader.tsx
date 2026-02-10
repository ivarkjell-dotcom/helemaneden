type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header
      style={{
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: 0,
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            marginTop: 6,
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
