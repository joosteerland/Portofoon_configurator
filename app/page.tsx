"use client";

import { useMemo, useState } from "react";

type Model = "R2" | "R5" | "R7";
type WorkType = "standard" | "noisy" | "critical";
type Coverage = "compact" | "floors" | "campus";

const radioPrices: Record<Model, number> = { R2: 515, R5: 745, R7: 1095 };

const euro = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function getRecommendation(workType: WorkType): Model {
  if (workType === "critical") return "R7";
  if (workType === "noisy") return "R5";
  return "R2";
}

export default function Home() {
  const [quantity, setQuantity] = useState(8);
  const [workType, setWorkType] = useState<WorkType>("noisy");
  const [coverage, setCoverage] = useState<Coverage>("floors");

  const result = useMemo(() => {
    const model = getRecommendation(workType);
    const repeaterNeeded = coverage !== "compact";
    const radios = quantity * radioPrices[model];
    const programming = 395 + quantity * 25;
    const repeater = repeaterNeeded ? 4250 : 0;
    const installation = repeaterNeeded ? 1250 : 350;
    const total = radios + programming + repeater + installation;
    return {
      model,
      repeaterNeeded,
      radios,
      programming,
      repeater,
      installation,
      total,
      low: Math.round((total * 0.9) / 50) * 50,
      high: Math.round((total * 1.15) / 50) * 50,
    };
  }, [quantity, workType, coverage]);

  const modelCopy: Record<Model, { label: string; text: string }> = {
    R2: {
      label: "Betrouwbaar & eenvoudig",
      text: "Voor dagelijks gebruik in een overzichtelijke, relatief rustige werkomgeving.",
    },
    R5: {
      label: "Helder in rumoer",
      text: "Voor teams die robuuste communicatie en duidelijke audio in lawaai nodig hebben.",
    },
    R7: {
      label: "Maximale bedrijfszekerheid",
      text: "Voor kritische processen, zware omstandigheden en de hoogste audio-eisen.",
    },
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#calculator" aria-label="Portofoonprijs home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>PORTOFOON<span>PRIJS</span></span>
        </a>
        <span className="header-note">Onafhankelijke prijsindicatie</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow"><span /> In 1 minuut een globale raming</div>
        <h1 id="page-title">Wat kost jouw<br /><em>portofoonsysteem?</em></h1>
        <p>Beantwoord drie praktische vragen. Je krijgt direct een Motorola-advies, repeateradvies en een transparante prijsopbouw.</p>
        <div className="trust-row" aria-label="Eigenschappen van de calculator">
          <span>Geen contactgegevens nodig</span>
          <span>Direct resultaat</span>
          <span>Prijzen excl. btw</span>
        </div>
      </section>

      <section className="calculator-shell" id="calculator" aria-label="Portofoon calculator">
        <div className="questions-panel">
          <div className="panel-heading">
            <div><span className="step-kicker">Jouw situatie</span><h2>Stel je systeem samen</h2></div>
            <span className="progress-label">3 keuzes</span>
          </div>

          <fieldset className="question-group">
            <legend><span>01</span><div><b>Hoeveel portofoons heb je nodig?</b><small>Voor alle gelijktijdige gebruikers</small></div></legend>
            <div className="quantity-control">
              <button type="button" onClick={() => setQuantity((value) => Math.max(2, value - 1))} aria-label="Eén portofoon minder">−</button>
              <output aria-live="polite"><strong>{quantity}</strong><span>portofoons</span></output>
              <button type="button" onClick={() => setQuantity((value) => Math.min(50, value + 1))} aria-label="Eén portofoon meer">+</button>
            </div>
            <input className="range" type="range" min="2" max="50" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} aria-label="Aantal portofoons" />
            <div className="range-labels"><span>2</span><span>50</span></div>
          </fieldset>

          <fieldset className="question-group">
            <legend><span>02</span><div><b>Wat vraagt de werkomgeving?</b><small>Dit bepaalt welk model goed past</small></div></legend>
            <div className="choice-grid three">
              <Choice active={workType === "standard"} title="Standaard" subtitle="Kantoor, retail, horeca" onClick={() => setWorkType("standard")} />
              <Choice active={workType === "noisy"} title="Rumoerig" subtitle="Logistiek, bouw, productie" onClick={() => setWorkType("noisy")} />
              <Choice active={workType === "critical"} title="Kritisch" subtitle="Zwaar, lawaaiig, veiligheid" onClick={() => setWorkType("critical")} />
            </div>
          </fieldset>

          <fieldset className="question-group last">
            <legend><span>03</span><div><b>Hoe groot en complex is het bereik?</b><small>Dit bepaalt of een repeater nodig is</small></div></legend>
            <div className="choice-grid">
              <Choice active={coverage === "compact"} title="Compact" subtitle="Eén verdieping of open terrein" onClick={() => setCoverage("compact")} />
              <Choice active={coverage === "floors"} title="Meerdere verdiepingen" subtitle="Muren, staal of betonnen vloeren" onClick={() => setCoverage("floors")} />
              <Choice active={coverage === "campus"} title="Groot of verspreid" subtitle="Meerdere hallen of buitenterrein" onClick={() => setCoverage("campus")} />
            </div>
          </fieldset>
        </div>

        <aside className="result-panel" aria-live="polite">
          <div className="result-topline"><span className="live-dot" /> Jouw indicatie</div>
          <div className="radio-visual" aria-hidden="true">
            <div className="antenna" /><div className="knob" /><div className="radio-body"><span className="screen">{result.model}</span><span className="speaker">••••<br />••••<br />••••</span><i /><i /></div>
          </div>
          <p className="recommendation-label">Ons globale advies</p>
          <h2>Motorola <strong>{result.model}</strong></h2>
          <span className="model-pill">{modelCopy[result.model].label}</span>
          <p className="model-copy">{modelCopy[result.model].text}</p>

          <div className={`repeater-card ${result.repeaterNeeded ? "needed" : ""}`}>
            <span className="repeater-icon" aria-hidden="true">⌁</span>
            <div><small>Repeater</small><b>{result.repeaterNeeded ? "Aanbevolen" : "Niet nodig"}</b></div>
            <span className="status-chip">{result.repeaterNeeded ? "Inbegrepen" : "Direct bereik"}</span>
          </div>

          <div className="price-block">
            <span>Globale investering</span>
            <strong>{euro.format(result.total)}</strong>
            <small>Meestal tussen {euro.format(result.low)} en {euro.format(result.high)} excl. btw</small>
          </div>

          <details className="breakdown">
            <summary>Bekijk prijsopbouw <span>+</span></summary>
            <dl>
              <div><dt>{quantity}× Motorola {result.model}</dt><dd>{euro.format(result.radios)}</dd></div>
              <div><dt>Programmering & configuratie</dt><dd>{euro.format(result.programming)}</dd></div>
              {result.repeaterNeeded && <div><dt>Repeaterpakket</dt><dd>{euro.format(result.repeater)}</dd></div>}
              <div><dt>Inbedrijfstelling</dt><dd>{euro.format(result.installation)}</dd></div>
            </dl>
          </details>
          <p className="fineprint">Indicatief, inclusief accu en lader per portofoon. Exacte dekking, frequenties, accessoires en montage kunnen de prijs wijzigen.</p>
        </aside>
      </section>

      <section className="how-it-works" aria-labelledby="how-title">
        <div><span className="step-kicker">Zo rekenen we</span><h2 id="how-title">Eenvoudig genoeg om te begrijpen.<br />Serieus genoeg voor een eerste budget.</h2></div>
        <div className="logic-cards">
          <article><span>R2</span><h3>Dagelijks gebruik</h3><p>De praktische keuze voor heldere, overzichtelijke werkomgevingen.</p></article>
          <article><span>R5</span><h3>Rumoerige werkvloer</h3><p>Extra audio en robuustheid voor logistiek, bouw en productie.</p></article>
          <article><span>R7</span><h3>Kritische communicatie</h3><p>De meest complete keuze voor zware omstandigheden en veiligheid.</p></article>
        </div>
      </section>

      <footer><span>PORTOFOON<span>PRIJS</span></span><p>Een globale calculator — geen offerte of dekkingsmeting.</p></footer>
    </main>
  );
}

function Choice({ active, title, subtitle, onClick }: { active: boolean; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button type="button" className={`choice-card ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}>
      <span className="radio-dot" aria-hidden="true" /><b>{title}</b><small>{subtitle}</small>
    </button>
  );
}
