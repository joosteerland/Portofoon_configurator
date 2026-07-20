import styles from "./portal.module.css";

export default function ConfiguratorChoice() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="./" aria-label="Firecom configuratoren">
          <img className={styles.brandLogo} src="./firecom-logo-secondary.png" alt="" aria-hidden="true" />
          <span className={styles.brandTitle}>Firecom <b>online configurator</b></span>
        </a>
        <span className={styles.help}>Samenstellen en prijsindicatie</span>
      </header>

      <section className={styles.intro} aria-labelledby="choice-title">
        <span className={styles.eyebrow}><i /> Firecom configuratoren</span>
        <h1 id="choice-title">Kies uw<br /><em>toepassing</em></h1>
        <p>Stel uw communicatie- of alarmeringsoplossing samen. U ziet welke onderdelen zijn gekozen en welke kosten daarbij horen.</p>
      </section>

      <section className={styles.choices} aria-label="Kies een configurator">
        <a className={styles.choice} href="./communicatie/">
          <span className={styles.number}>01</span>
          <span className={`${styles.icon} ${styles.speakerIcon}`} aria-hidden="true"><i /><b /></span>
          <span className={styles.content}>
            <small>Configurator</small>
            <h2>Communicatie</h2>
            <p>Portofoons, bereik, ESPA, vergunning en onderhoud.</p>
            <strong>Open communicatie <i>→</i></strong>
          </span>
        </a>

        <a className={`${styles.choice} ${styles.alarming}`} href="./alarmering/">
          <span className={styles.number}>02</span>
          <span className={`${styles.icon} ${styles.sirenIcon}`} aria-hidden="true"><i /><b /></span>
          <span className={styles.content}>
            <small>Configurator</small>
            <h2>Alarmering</h2>
            <p>Apps, alarmontvangers, RF-infrastructuur, koppelingen en onderhoud.</p>
            <strong>Open alarmering <i>→</i></strong>
          </span>
        </a>
      </section>

      <footer className={styles.footer}>
        <div><b>Firecom B.V.</b><span>Randweg 10–12 · 2941 CG Lekkerkerk</span></div>
        <div><a href="tel:+31854011980">085 401 19 80</a><a href="mailto:info@firecom.nl">info@firecom.nl</a></div>
        <p>Na verzending controleert een Firecom-specialist uw configuratie en ontvangt u een concrete offerte.</p>
      </footer>
    </main>
  );
}
