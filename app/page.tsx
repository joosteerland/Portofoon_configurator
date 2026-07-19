"use client";

import { useMemo, useState } from "react";

type Atex = "no" | "yes" | "unknown";
type Display = "none" | "small" | "full";
type Environment = "normal" | "wet" | "heavy";
type Channels = "64" | "256" | "1000";
type Safety = "none" | "basic" | "advanced";
type Noise = "normal" | "loud" | "extreme";
type Band = "UHF" | "VHF";
type Permit = "existing" | "help" | "unknown";
type Charger = "none" | "single" | "multi" | "battery";
type Battery = "standard" | "long" | "advice";
type ModelKey = "r2" | "r5nkp" | "r5lkp" | "r7fkp" | "r7premium" | "r7exnkp" | "r7exfkp";

type Product = {
  name: string;
  variant: string;
  sku: string;
  price: number;
  label: string;
  protection: string;
  channels: string;
  audio: string;
  battery: string;
  included: string;
  why: string;
};

const products: Record<ModelKey, Product> = {
  r2: {
    name: "Motorola R2",
    variant: "UHF digitaal · NKP",
    sku: "MDH11YDC9JA2AN",
    price: 329.75,
    label: "Eenvoudig & betrouwbaar",
    protection: "IP55",
    channels: "64 kanalen",
    audio: "101 phon",
    battery: "tot 26,5 uur",
    included: "Benchmarkset met 2300mAh-accu, antenne, riemclip en enkelvoudige lader.",
    why: "De voordeligste passende keuze voor heldere spraak zonder display, locatie of uitgebreide veiligheidsfuncties.",
  },
  r5nkp: {
    name: "Motorola R5",
    variant: "NKP UHF · zonder display",
    sku: "MDH07RDC9VA1AN",
    price: 435.95,
    label: "Beste balans",
    protection: "IP67",
    channels: "64 kanalen",
    audio: "106 phon",
    battery: "tot 32 uur",
    included: "Accu en riemclip inbegrepen; lader afhankelijk van het gekozen pakket.",
    why: "Meer audiovermogen, betere ruisonderdrukking en zwaardere bescherming voor dagelijks gebruik in lawaaiige omgevingen.",
  },
  r5lkp: {
    name: "Motorola R5",
    variant: "LKP UHF · 1,5″ display",
    sku: "MDH07RDH9WA1AN",
    price: 499.95,
    label: "Compact met display",
    protection: "IP67",
    channels: "256 kanalen",
    audio: "106 phon",
    battery: "tot 32 uur",
    included: "Radio, accu, antenne en riemclip inbegrepen; lader apart bevestigen.",
    why: "Past wanneer statusinformatie, meer zones of 65–256 kanalen nodig zijn zonder direct naar een R7 te gaan.",
  },
  r7fkp: {
    name: "Motorola R7",
    variant: "Capable FKP UHF · kleurenscherm",
    sku: "MDH06RDN9WA2AN",
    price: 804.9,
    label: "Maximale functionaliteit",
    protection: "IP66 & IP68",
    channels: "tot 1.000 kanalen",
    audio: "107 phon",
    battery: "circa 28–29 uur",
    included: "Exacte pakketinhoud en geactiveerde licenties worden op offerte bevestigd.",
    why: "De juiste basis voor kleurendisplay, veel kanalen, geavanceerde veiligheid, connectiviteit en complexe organisaties.",
  },
  r7premium: {
    name: "Motorola R7 Premium",
    variant: "NKP UHF · zonder display",
    sku: "MDH06RDC9XA2AN",
    price: 790.95,
    label: "Premium zonder display",
    protection: "IP66 & IP68",
    channels: "64 kanalen",
    audio: "107 phon",
    battery: "circa 28–29 uur",
    included: "2200mAh-accu, antenne en lader volgens de openbare benchmarkset.",
    why: "Geavanceerde R7-functies en zware bescherming, met eenvoudige bediening voor vaste gespreksgroepen.",
  },
  r7exnkp: {
    name: "Motorola R7Ex",
    variant: "IIC NKP UHF · zonder display",
    sku: "MDH57QCC9WA3AN",
    price: 1227.15,
    label: "ATEX · eenvoudige bediening",
    protection: "ATEX/IECEx · IP66 & IP68",
    channels: "uitvoeringafhankelijk",
    audio: "108 phon",
    battery: "tot 19–23,5 uur",
    included: "Definitieve certificering, accu, lader en accessoires worden per ATEX-configuratie bevestigd.",
    why: "Een afzonderlijk ontworpen explosieveilige portofoon, eenvoudig te bedienen met handschoenen en zonder display.",
  },
  r7exfkp: {
    name: "Motorola R7Ex",
    variant: "IIC FKP UHF · display & toetsenbord",
    sku: "MDH57QCN9RA3AN",
    price: 1563.3,
    label: "ATEX · volledige bediening",
    protection: "ATEX/IECEx · IP66 & IP68",
    channels: "uitvoeringafhankelijk",
    audio: "108 phon",
    battery: "tot 19–23,5 uur",
    included: "Definitieve certificering, accu, lader en accessoires worden per ATEX-configuratie bevestigd.",
    why: "Voor explosiegevaarlijke omgevingen waar display, menu’s, statusinformatie en berichten noodzakelijk zijn.",
  },
};

const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
const SLR5500_PACKAGE_PRICE = 5500;

export default function Home() {
  const [quantity, setQuantity] = useState(8);
  const [atex, setAtex] = useState<Atex>("no");
  const [display, setDisplay] = useState<Display>("none");
  const [environment, setEnvironment] = useState<Environment>("wet");
  const [channels, setChannels] = useState<Channels>("64");
  const [safety, setSafety] = useState<Safety>("basic");
  const [noise, setNoise] = useState<Noise>("loud");
  const [band, setBand] = useState<Band>("UHF");
  const [permit, setPermit] = useState<Permit>("unknown");
  const [charger, setCharger] = useState<Charger>("single");
  const [battery, setBattery] = useState<Battery>("standard");
  const [extensions, setExtensions] = useState<string[]>([]);
  const [repeater, setRepeater] = useState(false);
  const [atexHazard, setAtexHazard] = useState("gas-en-stof");
  const [atexZone, setAtexZone] = useState("onbekend");
  const [atexGroup, setAtexGroup] = useState("IIC");
  const [temperatureClass, setTemperatureClass] = useState("onbekend");
  const [repeaterMount, setRepeaterMount] = useState("wand");
  const [backupPower, setBackupPower] = useState("ja");
  const [siteConnect, setSiteConnect] = useState("nee");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [quoteState, setQuoteState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [quoteMessage, setQuoteMessage] = useState("");

  const recommendation = useMemo(() => {
    let key: ModelKey;
    if (atex === "yes") {
      key = display === "none" ? "r7exnkp" : "r7exfkp";
    } else if (display === "full" || channels === "1000") {
      key = "r7fkp";
    } else if (environment === "heavy" || safety === "advanced" || noise === "extreme" || extensions.length > 1) {
      key = display === "none" ? "r7premium" : "r7fkp";
    } else if (display === "small" || channels === "256") {
      key = "r5lkp";
    } else if (environment === "wet" || safety === "basic" || noise === "loud") {
      key = "r5nkp";
    } else {
      key = "r2";
    }
    const product = products[key];
    return { key, product, subtotal: product.price * quantity };
  }, [atex, display, environment, channels, safety, noise, extensions, quantity]);

  const quoteItems = [
    charger !== "none" && !(recommendation.key === "r2" && charger === "single") ? "gekozen laadoplossing" : null,
    battery !== "standard" ? "accu en bijbehorende technische waarden" : null,
    extensions.length ? "softwarefuncties en licenties" : null,
    permit !== "existing" ? "frequentievergunning of begeleiding" : null,
    repeater && siteConnect === "ja" ? "IP Site Connect-activering en netwerkconfiguratie" : null,
    atex === "yes" ? "exacte ATEX/IECEx-classificatie en gecertificeerde accessoires" : null,
    atex === "unknown" ? "ATEX-beoordeling door een specialist" : null,
  ].filter(Boolean) as string[];

  const systemTotal = recommendation.subtotal + (repeater ? SLR5500_PACKAGE_PRICE : 0);

  const toggleExtension = (value: string) => {
    setExtensions((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const requestQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuoteState("sending");
    setQuoteMessage("");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          email,
          website,
          configuration: {
            model: recommendation.product.name,
            variant: recommendation.product.variant,
            sku: recommendation.product.sku,
            quantity,
            unitPrice: recommendation.product.price,
            radioSubtotal: recommendation.subtotal,
            systemTotal,
            atex,
            atexHazard,
            atexZone,
            atexGroup,
            temperatureClass,
            display,
            environment,
            channels,
            safety,
            noise,
            band,
            permit,
            charger,
            battery,
            extensions,
            repeater,
            repeaterMount,
            backupPower,
            siteConnect,
            quoteItems,
          },
        }),
      });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "De aanvraag kon niet worden verzonden.");
      setQuoteState("sent");
      setQuoteMessage(result.message || "Je aanvraag is ontvangen.");
    } catch (error) {
      setQuoteState("error");
      setQuoteMessage(error instanceof Error ? error.message : "De aanvraag kon niet worden verzonden.");
    }
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#configurator" aria-label="PortofoonPrijs configurator">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>PORTOFOON<span>PRIJS</span></span>
        </a>
        <span className="header-note">Prijsbenchmark · 19 juli 2026 · excl. btw</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow"><span /> Professionele Motorola-keuzehulp</div>
        <h1 id="page-title">Configureer de juiste<br /><em>portofoonoplossing.</em></h1>
        <p>Van eenvoudige R2 tot explosieveilige R7Ex. Beantwoord de technische vragen en ontvang direct een onderbouwd modeladvies met actuele openbare vanafprijs.</p>
        <div className="trust-row">
          <span>Exacte Motorola-uitvoering</span><span>Onmogelijke keuzes geblokkeerd</span><span>Transparante vanafprijzen</span>
        </div>
      </section>

      <section className="configurator-shell" id="configurator" aria-label="Motorola portofoonconfigurator">
        <div className="questions-panel">
          <div className="panel-heading">
            <div><span className="step-kicker">Jouw toepassing</span><h2>Bouw de passende configuratie</h2></div>
            <span className="progress-label">Technische voorselectie</span>
          </div>

          <Question number="01" title="Is ATEX of IECEx verplicht?" subtitle="Explosiegevaar bepaalt de productfamilie en alle toegestane accessoires.">
            <div className="choice-grid three">
              <Choice active={atex === "no"} title="Nee" subtitle="Geen explosiegevaar" onClick={() => setAtex("no")} />
              <Choice active={atex === "yes"} title="Ja" subtitle="Gas, stof of beide" onClick={() => { setAtex("yes"); setBand("UHF"); setEnvironment("heavy"); setChannels("64"); setDisplay((current) => current === "small" ? "full" : current); }} />
              <Choice active={atex === "unknown"} title="Weet ik niet" subtitle="Technische beoordeling nodig" onClick={() => setAtex("unknown")} />
            </div>
            {atex === "yes" && (
              <div className="conditional-card warning-card">
                <div className="conditional-title"><b>ATEX-specificatie</b><span>Verplicht voor een veilige offerte</span></div>
                <div className="select-grid">
                  <label>Risico<select value={atexHazard} onChange={(e) => setAtexHazard(e.target.value)}><option value="gas">Gas</option><option value="stof">Stof</option><option value="gas-en-stof">Gas en stof</option></select></label>
                  <label>Zone<select value={atexZone} onChange={(e) => setAtexZone(e.target.value)}><option value="onbekend">Nog vaststellen</option><option>Zone 0 / 20</option><option>Zone 1 / 21</option><option>Zone 2 / 22</option></select></label>
                  <label>Gasgroep<select value={atexGroup} onChange={(e) => setAtexGroup(e.target.value)}><option>IIA</option><option>IIB</option><option>IIC</option><option value="onbekend">Nog vaststellen</option></select></label>
                  <label>Temperatuurklasse<select value={temperatureClass} onChange={(e) => setTemperatureClass(e.target.value)}><option value="onbekend">Nog vaststellen</option><option>T1</option><option>T2</option><option>T3</option><option>T4</option></select></label>
                </div>
                <p>Alleen goedgekeurde R7Ex-accu’s, laders, microfoons en headsets worden toegestaan. Standaard R7-accessoires zijn niet uitwisselbaar.</p>
              </div>
            )}
            {atex === "unknown" && <div className="inline-alert">Laat de zone en stof-/gasclassificatie eerst beoordelen. Het onderstaande advies is voorlopig en geen veilige ATEX-selectie.</div>}
          </Question>

          <Question number="02" title="Welke bediening is nodig?" subtitle="Display en toetsenbord bepalen de frontvariant en kanaalcapaciteit.">
            <div className="choice-grid three">
              <Choice active={display === "none"} title="Geen display" subtitle="Vaste groepen, eenvoudige bediening" onClick={() => setDisplay("none")} />
              <Choice active={display === "small"} title="Kleine statusweergave" subtitle="R5 Limited Keypad, maximaal 256 kanalen" onClick={() => setDisplay("small")} disabled={atex === "yes"} />
              <Choice active={display === "full"} title="Kleurenscherm" subtitle="Volledige bediening en berichten" onClick={() => setDisplay("full")} />
            </div>
          </Question>

          <Question number="03" title="Hoe zwaar is de werkomgeving?" subtitle="Kies op basis van water, stof en mechanische belasting.">
            <div className="choice-grid three">
              <Choice active={environment === "normal"} title="Normaal · IP55" subtitle="Stof en incidentele regen" onClick={() => setEnvironment("normal")} disabled={atex === "yes"} />
              <Choice active={environment === "wet"} title="Zwaar · IP67" subtitle="Stofdicht en tijdelijk onderdompelbaar" onClick={() => setEnvironment("wet")} disabled={atex === "yes"} />
              <Choice active={environment === "heavy"} title="Extreem · IP68" subtitle="Hogedrukwater en onderdompeling" onClick={() => setEnvironment("heavy")} />
            </div>
          </Question>

          <Question number="04" title="Hoeveel kanalen en groepen zijn nodig?" subtitle="Meer kanalen vragen om een displaymodel.">
            <div className="choice-grid three">
              <Choice active={channels === "64"} title="Tot 64" subtitle="Alle modellen mogelijk" onClick={() => setChannels("64")} />
              <Choice active={channels === "256"} title="65–256" subtitle="Minimaal R5 LKP" onClick={() => { setChannels("256"); if (display === "none") setDisplay("small"); }} disabled={atex === "yes"} />
              <Choice active={channels === "1000"} title="257–1.000" subtitle="R7 FKP met kleurenscherm" onClick={() => { setChannels("1000"); setDisplay("full"); }} disabled={atex === "yes"} />
            </div>
          </Question>

          <Question number="05" title="Wat vragen veiligheid en geluidsniveau?" subtitle="Audio, sensoren en locatie kunnen een zwaarder model noodzakelijk maken.">
            <div className="split-questions">
              <div><span className="sub-label">Veiligheidsfuncties</span><div className="choice-stack">
                <Choice active={safety === "none"} title="Geen" subtitle="Alleen spraakcommunicatie" onClick={() => setSafety("none")} />
                <Choice active={safety === "basic"} title="Basis" subtitle="Noodknop of lone worker" onClick={() => setSafety("basic")} />
                <Choice active={safety === "advanced"} title="Geavanceerd" subtitle="GNSS, man-down, sensoren en beheer" onClick={() => setSafety("advanced")} />
              </div></div>
              <div><span className="sub-label">Omgevingsgeluid</span><div className="choice-stack">
                <Choice active={noise === "normal"} title="Normaal" subtitle="Kantoor, retail, evenementen" onClick={() => setNoise("normal")} />
                <Choice active={noise === "loud"} title="Lawaaiig" subtitle="Magazijn of productie" onClick={() => setNoise("loud")} />
                <Choice active={noise === "extreme"} title="Zeer lawaaiig" subtitle="Industrie en zware machines" onClick={() => setNoise("extreme")} />
              </div></div>
            </div>
            <span className="sub-label extension-label">Gewenste uitbreidingen · afzonderlijk geprijsd</span>
            <div className="toggle-grid">
              {["Bluetooth / Wi‑Fi", "GNSS / GPS", "Man-down", "Capacity Plus", "AES-256", "WAVE PTX"].map((item) => (
                <button type="button" key={item} className={`toggle-chip ${extensions.includes(item) ? "active" : ""}`} onClick={() => toggleExtension(item)} aria-pressed={extensions.includes(item)}>{extensions.includes(item) ? "✓ " : "+ "}{item}</button>
              ))}
            </div>
          </Question>

          <Question number="06" title="Frequentie, vergunning en aantal" subtitle="Professionele UHF/VHF-uitvoeringen zijn in Nederland vergunningsplichtig.">
            <div className="split-questions">
              <div><span className="sub-label">Frequentieband</span><div className="choice-grid two">
                <Choice active={band === "UHF"} title="UHF" subtitle="Veel gebruikt in gebouwen" onClick={() => setBand("UHF")} />
                <Choice active={band === "VHF"} title="VHF" subtitle="Vaak geschikt voor open terrein" onClick={() => setBand("VHF")} disabled={atex === "yes"} />
              </div></div>
              <div><span className="sub-label">Vergunning</span><div className="choice-stack compact">
                <Choice active={permit === "existing"} title="Al aanwezig" subtitle="Frequenties bekend" onClick={() => setPermit("existing")} />
                <Choice active={permit === "help"} title="Hulp gewenst" subtitle="Begeleiding apart offreren" onClick={() => setPermit("help")} />
                <Choice active={permit === "unknown"} title="Weet ik niet" subtitle="Eerst inventariseren" onClick={() => setPermit("unknown")} />
              </div></div>
            </div>
            <div className="quantity-row">
              <label htmlFor="quantity">Aantal portofoons</label>
              <div className="quantity-control"><button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Eén portofoon minder">−</button><output><strong>{quantity}</strong><span>stuks</span></output><button type="button" onClick={() => setQuantity((value) => Math.min(250, value + 1))} aria-label="Eén portofoon meer">+</button></div>
              <input id="quantity" className="range" type="range" min="1" max="250" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </div>
          </Question>

          <Question number="07" title="Is bereikuitbreiding met een SLR5500 nodig?" subtitle="De repeater krijgt een eigen systeemprijs en wordt direct bij het live totaal opgeteld.">
            <div className="repeater-choice-grid">
              <button type="button" className={`repeater-option ${!repeater ? "active" : ""}`} onClick={() => setRepeater(false)} aria-pressed={!repeater}>
                <span className="repeater-symbol no-repeater" aria-hidden="true">↔</span>
                <span><b>Zonder repeater</b><small>Direct bereik tussen de portofoons</small></span>
                <strong>Geen meerprijs</strong>
              </button>
              <button type="button" className={`repeater-option featured ${repeater ? "active" : ""}`} onClick={() => setRepeater(true)} aria-pressed={repeater}>
                <span className="recommended-badge">Bereikuitbreiding</span>
                <span className="repeater-symbol" aria-hidden="true">SLR</span>
                <span><b>Compleet SLR5500-pakket</b><small>Repeater, RF-infrastructuur, montage en dekkingsmeting</small></span>
                <strong>+ {euro.format(SLR5500_PACKAGE_PRICE)}</strong>
              </button>
            </div>
            {repeater && (
              <div className="conditional-card repeater-details">
                <div className="conditional-title"><b>SLR5500-infrastructuur</b><span>Direct meegerekend</span></div>
                <div className="package-includes"><span>SLR5500-repeater</span><span>Antenne & kabel</span><span>Duplexfilter</span><span>Voeding</span><span>Programmering</span><span>Montage</span><span>Inbedrijfstelling</span><span>Dekkingsmeting</span></div>
                <div className="select-grid three-cols">
                  <label>Montage<select value={repeaterMount} onChange={(e) => setRepeaterMount(e.target.value)}><option value="wand">Wandbehuizing</option><option value="rack">Rackbehuizing</option><option value="advice">Laat adviseren</option></select></label>
                  <label>Noodstroom<select value={backupPower} onChange={(e) => setBackupPower(e.target.value)}><option value="ja">Ja</option><option value="nee">Nee</option><option value="advice">Laat adviseren</option></select></label>
                  <label>IP Site Connect<select value={siteConnect} onChange={(e) => setSiteConnect(e.target.value)}><option value="nee">Nee</option><option value="ja">Ja</option><option value="advice">Laat adviseren</option></select></label>
                </div>
                <p>De pakketprijs van {euro.format(SLR5500_PACKAGE_PRICE)} excl. btw is een indicatieve configuratorprijs. Locatieafhankelijke bouwkundige werkzaamheden en aanvullende netwerklicenties kunnen de definitieve offerte wijzigen.</p>
              </div>
            )}
          </Question>

          <Question number="08" title="Kies accu en laadoplossing" subtitle="Afwijkende accu’s en laders worden technisch en financieel in de definitieve offerte bevestigd.">
            <div className="select-grid two-cols">
              <label>Accu<select value={battery} onChange={(e) => setBattery(e.target.value as Battery)}><option value="standard">Standaard pakketaccu</option><option value="long">Langere gebruiksduur</option><option value="advice">Laat adviseren</option></select></label>
              <label>Lader<select value={charger} onChange={(e) => setCharger(e.target.value as Charger)}><option value="none">Geen lader</option><option value="single">Enkelvoudige lader</option><option value="multi">Zesvoudige multilader</option><option value="battery">Reserve-/acculader</option></select></label>
            </div>
          </Question>
        </div>

        <aside className="result-panel" aria-live="polite">
          <div className="result-topline"><span className="live-dot" /> Live modeladvies</div>
          <div className="model-visual" aria-hidden="true"><span className="antenna" /><span className="radio-shell"><i>{recommendation.product.name.replace("Motorola ", "")}</i><b /><b /><b /><em /></span></div>
          <p className="recommendation-label">Beste passende benchmark</p>
          <h2>{recommendation.product.name}</h2>
          <span className="model-pill">{recommendation.product.label}</span>
          <p className="variant-copy">{recommendation.product.variant}</p>
          <code className="sku">SKU {recommendation.product.sku}</code>
          <p className="model-copy">{recommendation.product.why}</p>

          <div className="spec-grid">
            <div><small>Bescherming</small><b>{recommendation.product.protection}</b></div>
            <div><small>Capaciteit</small><b>{recommendation.product.channels}</b></div>
            <div><small>Max. luidheid</small><b>{recommendation.product.audio}</b></div>
            <div><small>Accuduur</small><b>{recommendation.product.battery}</b></div>
          </div>

          {atex === "unknown" && <div className="result-warning"><b>ATEX-status nog onbekend</b><span>Laat de omgeving beoordelen voordat je een definitieve keuze maakt.</span></div>}
          {atex === "yes" && <div className="result-warning safe"><b>{atexHazard} · {atexZone} · {atexGroup}</b><span>Temperatuurklasse: {temperatureClass}. Definitief te valideren op offerte.</span></div>}

          <div className="price-block">
            <span>Indicatief live systeemtotaal</span>
            <strong>{euro.format(systemTotal)}</strong>
            <small>{quantity} × {recommendation.product.name} = {euro.format(recommendation.subtotal)}</small>
            {repeater && <small>Compleet SLR5500-pakket = {euro.format(SLR5500_PACKAGE_PRICE)}</small>}
            <small>Alles exclusief btw</small>
          </div>
          <p className="included-copy">{recommendation.product.included}</p>

          <details className="breakdown" open>
            <summary>Offerte-aanvullingen <span>+</span></summary>
            {quoteItems.length ? <ul>{quoteItems.map((item) => <li key={item}>{item}</li>)}</ul> : <p>Geen aanvullende prijscomponenten geselecteerd.</p>}
          </details>
          <div className="quote-status"><span>Berekend subtotaal</span><b>{euro.format(systemTotal)}</b></div>
          <p className="fineprint">Prijsbenchmark gecontroleerd op 19 juli 2026, exclusief btw. Geen offerte. Beschikbaarheid, pakketinhoud, licenties, frequenties en certificering worden bij bestelling bevestigd.</p>
        </aside>
      </section>

      <div className="floating-price" role="status" aria-live="polite">
        <div><small>Live totaal excl. btw</small><b>{euro.format(systemTotal)}</b></div>
        <span>{recommendation.product.name}{repeater ? " + SLR5500" : ""}</span>
      </div>

      <section className="quote-request" aria-labelledby="quote-title">
        <div className="quote-intro">
          <span className="step-kicker">Persoonlijke offerte</span>
          <h2 id="quote-title">Laat Firecom je configuratie controleren.</h2>
          <p>Stuur je keuzes naar het salesteam. Een specialist controleert de uitvoering, beschikbaarheid en eventuele vergunningen en neemt contact met je op voor een echte offerte.</p>
          <div className="quote-summary">
            <span><small>Geselecteerd</small><b>{quantity} × {recommendation.product.name}</b></span>
            <span><small>Indicatief totaal</small><b>{euro.format(systemTotal)} excl. btw</b></span>
            {repeater && <span><small>Bereikuitbreiding</small><b>SLR5500-pakket inbegrepen</b></span>}
          </div>
        </div>
        <form className="quote-form" onSubmit={requestQuote}>
          <label>Bedrijfsnaam<input name="companyName" value={companyName} onChange={(event) => setCompanyName(event.target.value)} autoComplete="organization" required maxLength={120} /></label>
          <label>Naam<input name="contactName" value={contactName} onChange={(event) => setContactName(event.target.value)} autoComplete="name" required maxLength={120} /></label>
          <label>E-mailadres<input name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required maxLength={254} /></label>
          <label className="website-field" aria-hidden="true">Website<input name="website" value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} autoComplete="off" /></label>
          <button type="submit" disabled={quoteState === "sending" || quoteState === "sent"}>{quoteState === "sending" ? "Aanvraag verzenden…" : quoteState === "sent" ? "Aanvraag verzonden" : "Vraag mijn offerte aan"}</button>
          <p className="privacy-note">Door te verzenden geef je Firecom toestemming om contact op te nemen over deze configuratie.</p>
          {quoteState !== "idle" && quoteState !== "sending" && <div className={`form-status ${quoteState}`} role="status">{quoteMessage}</div>}
        </form>
      </section>

      <section className="comparison" aria-labelledby="compare-title">
        <div className="section-heading"><span className="step-kicker">Modeloverzicht</span><h2 id="compare-title">Van praktische werkportofoon tot ATEX-topmodel.</h2></div>
        <div className="comparison-grid">
          <article><span>R2</span><b>Vanaf €329,75</b><p>IP55 · 64 kanalen · eenvoudige spraak</p></article>
          <article><span>R5</span><b>Vanaf €435,95</b><p>IP67 · betere audio · tot 256 kanalen</p></article>
          <article><span>R7</span><b>Vanaf €790,95</b><p>IP68 · maximale connectiviteit en veiligheid</p></article>
          <article><span>R7Ex</span><b>Vanaf €1.227,15</b><p>ATEX/IECEx · uitsluitend gecertificeerde accessoires</p></article>
        </div>
      </section>

      <footer><span>PORTOFOON<span>PRIJS</span></span><p>Een technische voorselectie en openbare prijsbenchmark — geen offerte, dekkingsmeting of ATEX-validatie.</p></footer>
    </main>
  );
}

function Question({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) {
  return <fieldset className="question-group"><legend><span>{number}</span><div><b>{title}</b><small>{subtitle}</small></div></legend>{children}</fieldset>;
}

function Choice({ active, title, subtitle, onClick, disabled = false }: { active: boolean; title: string; subtitle: string; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className={`choice-card ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active} disabled={disabled}><span className="radio-dot" aria-hidden="true" /><b>{title}</b><small>{subtitle}</small>{disabled && <em>Niet beschikbaar</em>}</button>;
}
