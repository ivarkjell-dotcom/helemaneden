"use client";

import styles from "./moneyinputcard.module.css";

type MoneyInputCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function MoneyInputCard({ title, description, children, actions }: MoneyInputCardProps) {
  return (
    <section className={styles.card} aria-label={title}>
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description ? <p className={styles.desc}>{description}</p> : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
