import styles from "./portal.module.css";

export default function ConfiguratorChoice() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="./" aria-label="Firecom configuratoren">
          <span className={styles.brandMark} aria-hidden="true"><i /><i /><i /></span>
          <span>FIRECOM <em>CONFIGURATOREN</em></span>
        </a>
        <span className={styles.help}>Professionele keuzehulp</span>
      </header>

      <section className={styles.intro} aria-labelledby="choice-title">
        <span className={styles.eyebrow}><i /> Firecom keuzehulp</span>
        <h1 id="choice-title">Wat wilt u<br /><em>configureren?</em></h1>
        <p>Kies de oplossing die bij uw organisatie past. Iedere configurator heeft zijn eigen producten, prijzen en onderhoudsopties.</p>
      </section>

      <section className={styles.choices} aria-label="Kies een configurator">
        <a className={styles.choice} href="./communicatie/">
          <span className={styles.number}>01</span>
          <span className={styles.icon} aria-hidden="true">🔊</span>
          <span className={styles.content}>
            <small>Direct beschikbaar</small>
            <h2>Communicatie</h2>
            <p>Stel een complete portofoonoplossing samen met toestellen, bereik, ESPA, vergunning en onderhoud.</p>
            <strong>Open communicatie <i>→</i></strong>
          </span>
        </a>

        <a className={`${styles.choice} ${styles.alarming}`} href="./alarmering/">
          <span className={styles.number}>02</span>
          <span className={styles.icon} aria-hidden="true">🚨</span>
          <span className={styles.content}>
            <small>Direct beschikbaar</small>
            <h2>Alarmering</h2>
            <p>De nieuwe configurator voor alarmeringsoplossingen, inclusief passende onderhoudsmogelijkheden.</p>
            <strong>Open alarmering <i>→</i></strong>
          </span>
        </a>
      </section>

      <footer className={styles.footer}>
        <span>Advies van Firecom</span>
        <span>Indicatieve prijzen</span>
        <span>Offerte op maat</span>
      </footer>
    </main>
  );
}
