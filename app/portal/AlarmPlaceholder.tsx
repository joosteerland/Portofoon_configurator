import styles from "./portal.module.css";

export default function AlarmPlaceholder() {
  return (
    <main className={`${styles.page} ${styles.placeholderPage}`}>
      <header className={styles.header}>
        <a className={styles.brand} href="../" aria-label="Terug naar Firecom configuratoren">
          <span className={styles.brandMark} aria-hidden="true"><i /><i /><i /></span>
          <span>FIRECOM <em>CONFIGURATOREN</em></span>
        </a>
        <a className={styles.backLink} href="../">← Terug naar keuze</a>
      </header>

      <section className={styles.placeholder} aria-labelledby="alarm-title">
        <span className={styles.routeReady}>Route staat klaar</span>
        <span className={`${styles.icon} ${styles.placeholderIcon}`} aria-hidden="true">ALM</span>
        <h1 id="alarm-title">Alarmerings-<br /><em>configurator</em></h1>
        <p>De producten, vragen, prijzen en onderhoudsopties worden hier in de volgende stap toegevoegd.</p>
        <a href="../">Terug naar het keuzescherm</a>
      </section>
    </main>
  );
}
