"use client";

import { useMemo, useState } from "react";

type Atex = "no" | "yes" | "unknown";
type Display = "none" | "small" | "full";
type Environment = "normal" | "wet" | "heavy";
type Channels = "1-3" | "3-10" | "10+";
type Safety = "none" | "basic" | "advanced";
type Noise = "normal" | "loud" | "extreme";
type Band = "UHF" | "VHF";
type Permit = "existing" | "help" | "unknown";
type Charger = "none" | "single" | "multi" | "battery";
type Battery = "standard" | "long" | "advice";
type Maintenance = "none" | "lite" | "basis" | "uitgebreid";
type Espa = "none" | "standard" | "connected";
type ModelKey = "r2" | "r5nkp" | "r5lkp" | "r7fkp" | "r7premium" | "r7exnkp" | "r7exfkp";

type Product = {
  name: string;
  variant: string;
  sku: string;
  price: number;
  label: string;
  protection: string;
  audio: string;
  battery: string;
  included: string;
  why: string;
  image: string;
};

const products: Record<ModelKey, Product> = {
  r2: { name: "Motorola R2", variant: "NKP · zonder display", sku: "MDH11YDC9JA2AN", price: 329.75, label: "Eenvoudig & betrouwbaar", protection: "IP55", audio: "101 phon", battery: "tot 26,5 uur", included: "Benchmarkset met 2300mAh-accu, antenne, riemclip en enkelvoudige lader.", why: "De voordeligste passende keuze voor heldere spraak en eenvoudige bediening.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r7-series/nile-front.png" },
  r5nkp: { name: "Motorola R5", variant: "NKP · zonder display", sku: "MDH07RDC9VA1AN", price: 435.95, label: "Beste balans", protection: "IP67", audio: "106 phon", battery: "tot 32 uur", included: "Accu en riemclip inbegrepen; lader afhankelijk van het gekozen pakket.", why: "Sterke audio, ruisonderdrukking en zware bescherming voor intensief dagelijks gebruik.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r5/R5_lkp_front_1290x1290.webp" },
  r5lkp: { name: "Motorola R5", variant: "LKP · 1,5″ display", sku: "MDH07RDH9WA1AN", price: 499.95, label: "Compact met display", protection: "IP67", audio: "106 phon", battery: "tot 32 uur", included: "Radio, accu, antenne en riemclip inbegrepen; lader apart bevestigen.", why: "Past wanneer statusinformatie of meerdere gespreksgroepen overzichtelijk zichtbaar moeten zijn.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r5/R5_lkp_front_1290x1290.webp" },
  r7fkp: { name: "Motorola R7", variant: "Capable FKP · kleurenscherm", sku: "MDH06RDN9WA2AN", price: 804.9, label: "Maximale functionaliteit", protection: "IP66 & IP68", audio: "107 phon", battery: "circa 28–29 uur", included: "Exacte pakketinhoud en geactiveerde licenties worden op offerte bevestigd.", why: "Voor kleurendisplay, geavanceerde veiligheid, connectiviteit en complexe organisaties.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r7-series/mototrbo_r7_fkp_redner_front.png" },
  r7premium: { name: "Motorola R7 Premium", variant: "NKP · zonder display", sku: "MDH06RDC9XA2AN", price: 790.95, label: "Premium zonder display", protection: "IP66 & IP68", audio: "107 phon", battery: "circa 28–29 uur", included: "2200mAh-accu, antenne en lader volgens de openbare benchmarkset.", why: "Geavanceerde R7-functies en zware bescherming met eenvoudige bediening.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r7-series/mototrbo_r7_fkp_redner_front.png" },
  r7exnkp: { name: "Motorola R7Ex", variant: "IIC NKP · zonder display", sku: "MDH57QCC9WA3AN", price: 1227.15, label: "ATEX · eenvoudige bediening", protection: "ATEX/IECEx · IP66 & IP68", audio: "108 phon", battery: "tot 19–23,5 uur", included: "Gecertificeerde accu, lader en accessoires worden op de definitieve offerte bevestigd.", why: "De explosieveilige R7Ex-productfamilie met eenvoudige bediening en zonder display.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r7ex/MOTOTRBO_R7Ex_FKP_front_1290x1290.webp" },
  r7exfkp: { name: "Motorola R7Ex", variant: "IIC FKP · display & toetsenbord", sku: "MDH57QCN9RA3AN", price: 1563.3, label: "ATEX · volledige bediening", protection: "ATEX/IECEx · IP66 & IP68", audio: "108 phon", battery: "tot 19–23,5 uur", included: "Gecertificeerde accu, lader en accessoires worden op de definitieve offerte bevestigd.", why: "Dezelfde explosieveilige R7Ex-productfamilie, met display en volledige bediening.", image: "https://www.motorolasolutions.com/content/dam/msi/images/products/two-way-radios/mototrbo/portable-radios/r7ex/MOTOTRBO_R7Ex_FKP_front_1290x1290.webp" },
};

const maintenancePlans: Record<Maintenance, { name: string; price: number; response: string; summary: string[] }> = {
  none: { name: "Geen contract", price: 0, response: "Reguliere planning", summary: ["Onderhoud op nacalculatie", "€ 105 per uur"] },
  lite: { name: "LITE", price: 1000, response: "Binnen 24 kantooruren", summary: ["Voorrang in de planning", "Calamiteitenvoorraad", "€ 105 per onderhoudsuur"] },
  basis: { name: "BASIS", price: 1500, response: "Binnen 4 uur", summary: ["Hogere prioriteit", "Calamiteitenvoorraad", "Avond- en weekendservice"] },
  uitgebreid: { name: "UITGEBREID", price: 2000, response: "Binnen 2 uur", summary: ["Hoogste prioriteit", "Calamiteitenvoorraad", "24/7 dienstverlening"] },
};

const QUOTE_FORM_URL = "https://formspree.io/f/mdaqgbjj";
const PROGRAMMING_PRICE = 25;
const SLR5500_PACKAGE_PRICE = 5500;
const REPEATER_INSTALLATION_PRICE = 950;
const ESPA_STANDARD_PRICE = 1500;
const ESPA_CONNECTED_PRICE = 3000;
const ESPA_APP_YEARLY_PRICE = 100;
const RDI_ONE_TIME = 219;
const RDI_ANNUAL_RADIOS = 83;
const RDI_ANNUAL_REPEATER = 507;
const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });

export default function Home() {
  const [quantity, setQuantity] = useState(0);
  const [atex, setAtex] = useState<Atex>("no");
  const [display, setDisplay] = useState<Display>("none");
  const [environment, setEnvironment] = useState<Environment>("normal");
  const [channels, setChannels] = useState<Channels>("1-3");
  const [safety, setSafety] = useState<Safety>("none");
  const [noise, setNoise] = useState<Noise>("normal");
  const [band, setBand] = useState<Band>("UHF");
  const [permit, setPermit] = useState<Permit>("unknown");
  const [charger, setCharger] = useState<Charger>("single");
  const [battery, setBattery] = useState<Battery>("standard");
  const [extensions, setExtensions] = useState<string[]>([]);
  const [repeater, setRepeater] = useState(false);
  const [siteConnect, setSiteConnect] = useState("nee");
  const [espa, setEspa] = useState<Espa>("none");
  const [maintenance, setMaintenance] = useState<Maintenance>("none");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [quoteState, setQuoteState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [quoteMessage, setQuoteMessage] = useState("");

  const recommendation = useMemo(() => {
    let key: ModelKey;
    if (atex === "yes") key = display === "none" ? "r7exnkp" : "r7exfkp";
    else if (display === "full") key = "r7fkp";
    else if (environment === "heavy" || safety === "advanced" || noise === "extreme" || extensions.length > 1) key = display === "none" ? "r7premium" : "r7fkp";
    else if (display === "small") key = "r5lkp";
    else if (environment === "wet" || safety === "basic" || noise === "loud") key = "r5nkp";
    else key = "r2";
    const product = products[key];
    return { key, product, subtotal: product.price * quantity };
  }, [atex, display, environment, safety, noise, extensions, quantity]);

  const programmingTotal = quantity * PROGRAMMING_PRICE;
  const repeaterTotal = repeater ? SLR5500_PACKAGE_PRICE + REPEATER_INSTALLATION_PRICE : 0;
  const espaTotal = espa === "standard" ? ESPA_STANDARD_PRICE : espa === "connected" ? ESPA_CONNECTED_PRICE : 0;
  const espaName = espa === "standard" ? "ESPA 4.4.4" : espa === "connected" ? "ESPA 4.4.4 Connected" : "Geen ESPA-module";
  const systemTotal = recommendation.subtotal + programmingTotal + repeaterTotal + espaTotal;
  const annualRdi = repeater ? RDI_ANNUAL_REPEATER : RDI_ANNUAL_RADIOS;
  const plan = maintenancePlans[maintenance];
  const recommendationReasons = useMemo(() => {
    const reasons: string[] = [];
    if (quantity === 0) reasons.push("Kies het aantal portofoons om de investering te berekenen.");
    if (atex === "yes") reasons.push("ATEX is gekozen; daarom adviseren we de explosieveilige Motorola R7Ex.");
    else if (atex === "unknown") reasons.push("ATEX is nog niet vastgesteld; Firecom controleert dit vóór de offerte.");
    if (environment === "heavy") reasons.push("De zware werkomgeving vraagt om maximale bescherming.");
    else if (environment === "wet") reasons.push("Stof, regen en intensief gebruik vragen om een robuuster toestel.");
    if (noise === "extreme") reasons.push("Het zeer hoge geluidsniveau vraagt om de krachtigste audio in de selectie.");
    else if (noise === "loud") reasons.push("De lawaaiige omgeving vraagt om extra luide en heldere audio.");
    if (display !== "none") reasons.push(display === "full" ? "Een volledig display is gekozen voor menu’s en berichten." : "Een compact display is gekozen voor statusinformatie.");
    if (safety !== "none") reasons.push(safety === "advanced" ? "Geavanceerde veiligheidsfuncties vragen om een uitgebreidere toestelserie." : "De gekozen basisveiligheid vraagt om een toestel met noodfuncties.");
    if (repeater) reasons.push("De SLR5500 is toegevoegd voor aanvullende dekking.");
    return reasons.slice(0, 4);
  }, [quantity, atex, environment, noise, display, safety, repeater]);

  const applyPreset = (preset: "simple" | "logistics" | "industrial" | "atex") => {
    if (preset === "simple") { setAtex("no"); setDisplay("none"); setEnvironment("normal"); setNoise("normal"); setSafety("none"); setChannels("1-3"); setRepeater(false); setEspa("none"); }
    if (preset === "logistics") { setAtex("no"); setDisplay("small"); setEnvironment("wet"); setNoise("loud"); setSafety("basic"); setChannels("3-10"); }
    if (preset === "industrial") { setAtex("no"); setDisplay("none"); setEnvironment("heavy"); setNoise("extreme"); setSafety("advanced"); setChannels("10+"); }
    if (preset === "atex") { setAtex("yes"); setDisplay("none"); setEnvironment("heavy"); setNoise("extreme"); setSafety("advanced"); setChannels("3-10"); }
    document.getElementById("vragen")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExtension = (value: string) => setExtensions((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const requestQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setQuoteState("sending"); setQuoteMessage("");
    try {
      const configuration = [
        `Communicatie configurator`, `Model: ${recommendation.product.name}`, `Uitvoering: ${recommendation.product.variant}`, `SKU: ${recommendation.product.sku}`,
        `Aantal portofoons: ${quantity}`, `Stuksprijs excl. btw: ${euro.format(recommendation.product.price)}`, `Portofoons: ${euro.format(recommendation.subtotal)}`,
        `Programmering (${quantity} × ${euro.format(PROGRAMMING_PRICE)}): ${euro.format(programmingTotal)}`, `Indicatief systeemtotaal excl. btw: ${euro.format(systemTotal)}`,
        `ATEX: ${atex}`, `Display: ${display}`, `Werkomgeving: ${environment}`, `Aantal gespreksgroepen: ${channels}`, `Veiligheid: ${safety}`, `Geluidsniveau: ${noise}`,
        `Frequentieband: ${band}`, `Vergunning: ${permit}`, `RDI-indicatie indien nodig: ${euro.format(RDI_ONE_TIME)} eenmalig + ${euro.format(annualRdi)} per jaar`,
        `Lader: ${charger}`, `Accu: ${battery}`, `Uitbreidingen: ${extensions.length ? extensions.join(", ") : "Geen"}`,
        `SLR5500-pakket: ${repeater ? `Ja, ${euro.format(SLR5500_PACKAGE_PRICE)} + plaatsing ${euro.format(REPEATER_INSTALLATION_PRICE)}` : "Nee"}`, `IP Site Connect: ${siteConnect}`,
        `ESPA 4.4.4: ${espa === "none" ? "Nee" : espa === "standard" ? `BMC-meldingen naar portofoons, inclusief plaatsing binnen 12 meter vanaf de BMC, zonder kabels trekken · ${euro.format(ESPA_STANDARD_PRICE)}` : `BMC-meldingen naar portofoons, internet- en appkoppeling en berichten vanuit de webapplicatie · ${euro.format(ESPA_CONNECTED_PRICE)} eenmalig + ${euro.format(ESPA_APP_YEARLY_PRICE)} per app per jaar; aantal apps later vast te stellen`}`,
        `Onderhoud: ${plan.name} · ${euro.format(plan.price)} per jaar · ${plan.response}`,
      ].join("\n");
      const response = await fetch(QUOTE_FORM_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: `Offerteaanvraag Communicatie configurator · ${companyName}`, _replyto: email, _gotcha: website, bedrijfsnaam: companyName, naam: contactName, email, telefoonnummer: phone, configuratie: configuration }) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "De aanvraag kon niet worden verzonden.");
      setQuoteState("sent"); setQuoteMessage("Bedankt! Je configuratie is naar Firecom verstuurd. Een specialist neemt contact met je op.");
    } catch (error) { setQuoteState("error"); setQuoteMessage(error instanceof Error ? error.message : "De aanvraag kon niet worden verzonden."); }
  };

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="../" aria-label="Terug naar configuratorkeuze">
          <img className="brand-logo" src="../firecom-logo-white.png" alt="" aria-hidden="true" />
          <span className="brand-title">Firecom <b>online configurator</b></span>
        </a>
        <a className="header-cta" href="#offerte">Vraag offerte aan</a>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow"><span /> Firecom communicatie</div>
        <h1 id="page-title">Communicatie<br /><em>configurator</em></h1>
        <p>Kies de portofoons, dekking en service die uw organisatie nodig heeft. De prijs verandert direct mee; een Firecom-specialist controleert het voorstel.</p>
        <div className="trust-row"><span>Prijzen excl. btw</span><span>Programmering meegerekend</span><span>Controle door een specialist</span></div>
      </section>

      <nav className="step-nav" aria-label="Stappen"><a href="#start">1. Start</a><a href="#vragen">2. Toestellen</a><a href="#bereik">3. Bereik</a><a href="#onderhoud">4. Onderhoud</a><a href="#offerte">5. Offerte</a></nav>

      <section className="quick-start" id="start" aria-labelledby="quick-title">
        <div className="section-intro"><span className="step-kicker">Voorinstellingen</span><h2 id="quick-title">Kies een uitgangspunt</h2><p>Een voorinstelling vult de belangrijkste keuzes in. Daarna kunt u alles aanpassen.</p></div>
        <div className="preset-grid">
          <Preset number="01" title="Eenvoudige communicatie" text="Vaste groepen, rustige omgeving" action={() => applyPreset("simple")} />
          <Preset number="02" title="Magazijn & logistiek" text="Lawaai, water en statusweergave" action={() => applyPreset("logistics")} />
          <Preset number="03" title="Industrie" text="Zware omstandigheden en veiligheid" action={() => applyPreset("industrial")} />
          <Preset number="04" title="Explosiegevaar" text="Motorola R7Ex voor ATEX-omgevingen" action={() => applyPreset("atex")} featured />
        </div>
      </section>

      <section className="configurator-shell" id="configurator" aria-label="Communicatie configurator">
        <div className="questions-panel" id="vragen">
          <div className="panel-heading"><div><span className="step-kicker">Toestelkeuze</span><h2>Vertel ons wat je nodig hebt</h2></div><span className="progress-label">Live berekening</span></div>

          <Question number="01" title="Is een ATEX-toestel nodig?" subtitle="Bij explosiegevaar adviseren we de Motorola R7Ex-productfamilie.">
            <div className="choice-grid three"><Choice active={atex === "no"} title="Nee" subtitle="Geen explosiegevaar" onClick={() => setAtex("no")} /><Choice active={atex === "yes"} title="Ja" subtitle="Motorola R7Ex" onClick={() => { setAtex("yes"); setEnvironment("heavy"); }} /><Choice active={atex === "unknown"} title="Weet ik niet" subtitle="Firecom controleert dit" onClick={() => setAtex("unknown")} /></div>
            {atex === "yes" && <div className="inline-alert">Er is één ATEX-productfamilie: de Motorola R7Ex. Je kiest alleen nog de bediening met of zonder display; verdere certificering controleert Firecom in de offerte.</div>}
          </Question>

          <Question number="02" title="Welke bediening past bij de gebruikers?" subtitle="Een display is handig voor status, menu’s en meerdere gespreksgroepen.">
            <div className="choice-grid three"><Choice active={display === "none"} title="Zonder display" subtitle="Snel en eenvoudig" onClick={() => setDisplay("none")} /><Choice active={display === "small"} title="Klein display" subtitle="Compacte statusweergave" onClick={() => setDisplay("small")} disabled={atex === "yes"} /><Choice active={display === "full"} title="Volledig display" subtitle="Menu’s en berichten" onClick={() => setDisplay("full")} /></div>
          </Question>

          <Question number="03" title="Hoe wordt de portofoon gebruikt?" subtitle="Water, stof, geluid en veiligheidsfuncties bepalen de juiste serie.">
            <div className="split-questions"><div><span className="sub-label">Werkomgeving</span><div className="choice-stack"><Choice active={environment === "normal"} title="Normaal" subtitle="Binnen, droog en licht gebruik" onClick={() => setEnvironment("normal")} disabled={atex === "yes"} /><Choice active={environment === "wet"} title="Zwaar" subtitle="Stof, regen en intensief gebruik" onClick={() => setEnvironment("wet")} disabled={atex === "yes"} /><Choice active={environment === "heavy"} title="Extreem" subtitle="Industrieel en maximale bescherming" onClick={() => setEnvironment("heavy")} /></div></div><div><span className="sub-label">Omgevingsgeluid</span><div className="choice-stack"><Choice active={noise === "normal"} title="Normaal" subtitle="Kantoor, retail of evenement" onClick={() => setNoise("normal")} /><Choice active={noise === "loud"} title="Lawaaiig" subtitle="Magazijn of productie" onClick={() => setNoise("loud")} /><Choice active={noise === "extreme"} title="Zeer lawaaiig" subtitle="Machines en zware industrie" onClick={() => setNoise("extreme")} /></div></div></div>
          </Question>

          <Question number="04" title="Hoeveel gespreksgroepen en veiligheid zijn nodig?" subtitle="Alle toestellen zijn leverbaar in VHF en UHF; het exacte kanaalplan maakt Firecom.">
            <div className="split-questions"><div><span className="sub-label">Gespreksgroepen</span><div className="choice-stack"><Choice active={channels === "1-3"} title="1–3" subtitle="Kleine organisatie" onClick={() => setChannels("1-3")} /><Choice active={channels === "3-10"} title="3–10" subtitle="Meerdere teams of afdelingen" onClick={() => setChannels("3-10")} /><Choice active={channels === "10+"} title="10 of meer" subtitle="Uitgebreide organisatie" onClick={() => setChannels("10+")} /></div></div><div><span className="sub-label">Veiligheidsfuncties</span><div className="choice-stack"><Choice active={safety === "none"} title="Geen" subtitle="Alleen spraak" onClick={() => setSafety("none")} /><Choice active={safety === "basic"} title="Basis" subtitle="Noodknop of lone worker" onClick={() => setSafety("basic")} /><Choice active={safety === "advanced"} title="Geavanceerd" subtitle="GNSS, man-down en beheer" onClick={() => setSafety("advanced")} /></div></div></div>
            <span className="sub-label extension-label">Gewenste uitbreidingen · apart te offreren</span><div className="toggle-grid">{["Bluetooth / Wi‑Fi", "GNSS / GPS", "Man-down", "Capacity Plus", "AES-256", "WAVE PTX"].map((item) => <button type="button" key={item} className={`toggle-chip ${extensions.includes(item) ? "active" : ""}`} onClick={() => toggleExtension(item)} aria-pressed={extensions.includes(item)}>{extensions.includes(item) ? "✓ " : "+ "}{item}</button>)}</div>
          </Question>

          <Question number="05" title="Frequentie, aantal en laden" subtitle="VHF en UHF zijn voor alle toestelseries beschikbaar. Firecom adviseert wat het beste past.">
            <div className="option-row"><div><span className="sub-label">Frequentieband</span><div className="choice-grid two"><Choice active={band === "UHF"} title="UHF" subtitle="Vaak in en rond gebouwen" onClick={() => setBand("UHF")} /><Choice active={band === "VHF"} title="VHF" subtitle="Vaak op open terrein" onClick={() => setBand("VHF")} /></div></div><div><label className="select-label">Accu<select value={battery} onChange={(e) => setBattery(e.target.value as Battery)}><option value="standard">Standaard pakketaccu</option><option value="long">Langere gebruiksduur</option><option value="advice">Laat adviseren</option></select></label><label className="select-label">Lader<select value={charger} onChange={(e) => setCharger(e.target.value as Charger)}><option value="none">Geen lader</option><option value="single">Enkelvoudige lader</option><option value="multi">Zesvoudige multilader</option><option value="battery">Reserve-/acculader</option></select></label></div></div>
            <div className="quantity-row"><label htmlFor="quantity">Aantal portofoons</label><div className="quantity-control"><button type="button" onClick={() => setQuantity((v) => Math.max(0, v - 1))}>−</button><output><strong>{quantity}</strong><span>stuks</span></output><button type="button" onClick={() => setQuantity((v) => Math.min(250, v + 1))}>+</button></div><input id="quantity" className="range" type="range" min="0" max="250" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /></div>
            <div className="cost-note"><b>Programmering direct meegerekend</b><span>{quantity} × {euro.format(PROGRAMMING_PRICE)} = {euro.format(programmingTotal)} excl. btw</span></div>
          </Question>

          <div id="bereik" />
          <Question number="06" title="Is een repeater nodig voor extra bereik?" subtitle="De SLR5500 krijgt een prominente plek en wordt bij selectie direct volledig meegerekend.">
            <div className="repeater-choice-grid"><button type="button" className={`repeater-option ${!repeater ? "active" : ""}`} onClick={() => setRepeater(false)}><span className="repeater-symbol no-repeater">↔</span><span><b>Zonder repeater</b><small>Directe verbinding tussen portofoons</small></span><strong>Geen meerprijs</strong></button><button type="button" className={`repeater-option featured ${repeater ? "active" : ""}`} onClick={() => setRepeater(true)}><span className="recommended-badge">Compleet geleverd</span><img src="https://www.motorolasolutions.com/content/dam/msi/images/products/mototrbo/slr5000-series/product-slr5000-front-angle-abaco-darrell-ryan-0609.jpg" alt="Motorola SLR5500 repeater" /><span><b>Motorola SLR5500</b><small>Noodstroom, antenne en plaatsing inbegrepen</small></span><strong>+ {euro.format(SLR5500_PACKAGE_PRICE + REPEATER_INSTALLATION_PRICE)}</strong></button></div>
            {repeater && <div className="repeater-package"><h3>Complete repeateroplossing</h3><div className="package-includes"><span>SLR5500-repeater</span><span>Antenne & kabel</span><span>Duplexfilter</span><span>Noodstroom</span><span>Programmering</span><span>Plaatsing</span><span>Inbedrijfstelling</span><span>Dekkingsmeting</span></div><div className="price-lines"><span><b>Repeaterpakket</b><strong>{euro.format(SLR5500_PACKAGE_PRICE)}</strong></span><span><b>Plaatsing, indicatief</b><strong>{euro.format(REPEATER_INSTALLATION_PRICE)}</strong></span></div><label className="select-label">Meerdere locaties koppelen<select value={siteConnect} onChange={(e) => setSiteConnect(e.target.value)}><option value="nee">Nee</option><option value="ja">Ja, IP Site Connect</option><option value="advice">Laat adviseren</option></select></label><p>Locatieafhankelijke bouwkundige werkzaamheden en aanvullende netwerklicenties kunnen de definitieve offerte wijzigen.</p></div>}
          </Question>

          <Question number="07" title="Wilt u BMC-meldingen op de portofoons ontvangen?" subtitle="Met een ESPA 4.4.4-module komen berichten uit de brandmeldcentrale direct op de portofoons binnen.">
            <div className="espa-choice-grid">
              <button type="button" className={`repeater-option espa-option ${espa === "none" ? "active" : ""}`} onClick={() => setEspa("none")}><span className="repeater-symbol no-repeater">—</span><span><b>Geen ESPA-module</b><small>Alleen portofooncommunicatie</small></span><strong>Geen meerprijs</strong></button>
              <button type="button" className={`repeater-option espa-option featured ${espa === "standard" ? "active" : ""}`} onClick={() => setEspa("standard")}><span className="recommended-badge">Incl. plaatsing</span><span className="repeater-symbol espa-symbol">ESPA</span><span><b>ESPA 4.4.4</b><small>BMC-meldingen direct op de portofoons</small></span><strong>+ {euro.format(ESPA_STANDARD_PRICE)}</strong></button>
              <button type="button" className={`repeater-option espa-option connected ${espa === "connected" ? "active" : ""}`} onClick={() => setEspa("connected")}><span className="recommended-badge">Internet & app</span><span className="repeater-symbol espa-symbol">ESPA</span><span><b>ESPA 4.4.4 Connected</b><small>Ook appmeldingen en berichten vanuit de webapplicatie · app {euro.format(ESPA_APP_YEARLY_PRICE)} per app per jaar</small></span><strong>+ {euro.format(ESPA_CONNECTED_PRICE)}</strong></button>
            </div>
            {espa !== "none" && <div className="repeater-package espa-package"><h3>{espaName}</h3><div className="package-includes"><span>BMC-meldingen op portofoons</span><span>Plaatsing binnen 12 meter</span><span>Configuratie</span><span>Inbedrijfstelling</span>{espa === "connected" && <><span>Internetaansluiting</span><span>Meldingen in de app</span><span>Webapplicatie → portofoons</span></>}</div><div className="price-lines"><span><b>Complete ESPA-oplossing</b><strong>{euro.format(espaTotal)}</strong></span>{espa === "connected" && <span><b>Applicatie · per app per jaar</b><strong>{euro.format(ESPA_APP_YEARLY_PRICE)}</strong></span>}</div><p>De prijs is inclusief plaatsing binnen 12 meter vanaf de brandmeldcentrale (BMC). Kabels trekken en een eventueel benodigd kabeltracé zijn niet inbegrepen.{espa === "connected" && " Het aantal apps wordt later bepaald; de jaarlijkse appkosten zijn daarom niet opgenomen in de eenmalige investering."}</p></div>}
          </Question>

          <Question number="08" title="Is er al een frequentievergunning?" subtitle="Als die er nog niet is, tonen we altijd de indicatieve RDI-kosten.">
            <div className="choice-grid three"><Choice active={permit === "existing"} title="Ja" subtitle="Vergunning is aanwezig" onClick={() => setPermit("existing")} /><Choice active={permit === "help"} title="Nee, hulp gewenst" subtitle="Firecom vult de papieren in" onClick={() => setPermit("help")} /><Choice active={permit === "unknown"} title="Weet ik niet" subtitle="Firecom controleert dit" onClick={() => setPermit("unknown")} /></div>
            {permit !== "existing" && <div className="permit-card"><div><span>RDI · eenmalig</span><strong>{euro.format(RDI_ONE_TIME)}</strong></div><div><span>RDI · per jaar</span><strong>{euro.format(annualRdi)}</strong></div><p>De vergunning voor uw portofoonnetwerk wordt rechtstreeks betaald aan het Rijksinspectie Digitale Infrastructuur (RDI). Firecom vult de papieren zover mogelijk voor u in; u verstuurt de aanvraag zelf. Met één repeater bestaat het jaarlijkse bedrag van {euro.format(RDI_ANNUAL_REPEATER)} uit {euro.format(RDI_ANNUAL_RADIOS)} per vergunning plus {euro.format(424)} per vaste post/repeater. Deze bedragen gelden voor kalenderjaar 2022 en kunnen inmiddels zijn gewijzigd. Firecom is niet aansprakelijk voor tariefwijzigingen.</p><a href="https://zoek.officielebekendmakingen.nl/stcrt-2021-45605.html" target="_blank" rel="noreferrer">Bekijk de officiële regeling en tarieventabel ↗</a></div>}
          </Question>

          <div id="onderhoud" />
          <Question number="09" title="Welk onderhoudsniveau past bij uw organisatie?" subtitle="Alle drie onderhoudscontracten worden altijd aangeboden. Ook zonder contract blijft service mogelijk.">
            <div className="maintenance-grid">{(Object.keys(maintenancePlans) as Maintenance[]).map((key) => { const item = maintenancePlans[key]; return <button type="button" key={key} className={`maintenance-card ${maintenance === key ? "active" : ""} ${key === "basis" ? "recommended" : ""}`} onClick={() => setMaintenance(key)}>{key === "basis" && <em>Meest gekozen</em>}<span className="radio-dot" /><h3>{item.name}</h3><strong>{item.price ? `${euro.format(item.price)} / jaar` : "Geen jaarlijkse kosten"}</strong><b>{item.response}</b><ul>{item.summary.map((line) => <li key={line}>{line}</li>)}</ul></button>; })}</div>
            <p className="maintenance-note">Alle bedragen zijn excl. btw. Contractduur: 1 jaar. Onderhoudswerkzaamheden worden volgens het voorstel berekend tegen {euro.format(105)} per uur.</p>
          </Question>
        </div>

        <aside className="result-panel" aria-live="polite">
          <div className="result-topline"><span className="live-dot" /> Voorlopige configuratie</div>
          <div className="product-photo"><img src={recommendation.product.image} alt={recommendation.product.name} /></div>
          <span className="model-pill">{recommendation.product.label}</span><h2>{recommendation.product.name}</h2><p className="variant-copy">{recommendation.product.variant} · {band}</p><code className="sku">SKU {recommendation.product.sku}</code><p className="model-copy">{recommendation.product.why}</p>
          <div className="spec-grid"><div><small>Bescherming</small><b>{recommendation.product.protection}</b></div><div><small>Audio</small><b>{recommendation.product.audio}</b></div><div><small>Accuduur</small><b>{recommendation.product.battery}</b></div><div><small>Groepen</small><b>{channels}</b></div></div>
          <div className="recommendation-reasons"><b>Waarom dit voorstel</b><ul>{recommendationReasons.map((reason) => <li key={reason}>{reason}</li>)}</ul></div>
          <div className="price-block"><span>Indicatieve investering</span><strong>{euro.format(systemTotal)}</strong><small>exclusief btw · definitieve prijs volgt na controle</small></div>
          <div className="summary-lines"><span><b>{quantity} × {recommendation.product.name}</b><strong>{euro.format(recommendation.subtotal)}</strong></span><span><b>Programmering</b><strong>{euro.format(programmingTotal)}</strong></span>{repeater && <><span><b>SLR5500-pakket</b><strong>{euro.format(SLR5500_PACKAGE_PRICE)}</strong></span><span><b>Plaatsing repeater</b><strong>{euro.format(REPEATER_INSTALLATION_PRICE)}</strong></span></>}{espa !== "none" && <span><b>{espaName}</b><strong>{euro.format(espaTotal)}</strong></span>}<span className="total"><b>Totaal excl. btw</b><strong>{euro.format(systemTotal)}</strong></span></div>
          {permit !== "existing" && <div className="aside-notice"><b>RDI rechtstreeks te betalen</b><span>{euro.format(RDI_ONE_TIME)} eenmalig + {euro.format(annualRdi)} per jaar (tarief 2022)</span></div>}
          <div className="aside-notice maintenance"><b>Onderhoud: {plan.name}</b><span>{plan.price ? `${euro.format(plan.price)} per jaar` : "Geen jaarlijkse kosten"} · {plan.response}</span></div>
          <a className="aside-cta" href="#offerte">Ontvang een echte offerte</a>
          <p className="fineprint">Alle prijzen zijn indicatief en exclusief btw. Geen definitieve offerte. Beschikbaarheid, pakketinhoud, licenties, frequenties en certificering worden door Firecom bevestigd.</p>
        </aside>
      </section>

      <div className="floating-price"><div><small>Indicatieve prijs · excl. btw</small><b>{euro.format(systemTotal)}</b></div><span>{quantity} × {recommendation.product.name}{repeater ? " + SLR5500" : ""}{espa !== "none" ? " + ESPA 4.4.4" : ""}</span></div>

      <section className="quote-request" id="offerte" aria-labelledby="quote-title">
        <div className="quote-intro"><span className="step-kicker">Controle door Firecom</span><h2 id="quote-title">Laat uw configuratie controleren.</h2><p>Een specialist controleert toestelkeuze, bereik, vergunning en pakketinhoud. Daarna ontvangt u een concrete offerte.</p><div className="quote-summary"><span><small>Geselecteerd</small><b>{quantity} × {recommendation.product.name}</b></span><span><small>Indicatieve investering</small><b>{euro.format(systemTotal)} excl. btw</b></span><span><small>Onderhoud</small><b>{plan.name}{plan.price ? ` · ${euro.format(plan.price)}/jaar` : ""}</b></span></div></div>
        <form className="quote-form" onSubmit={requestQuote}><label>Bedrijfsnaam<input value={companyName} onChange={(e) => setCompanyName(e.target.value)} autoComplete="organization" required /></label><label>Naam<input value={contactName} onChange={(e) => setContactName(e.target.value)} autoComplete="name" required /></label><label>E-mailadres<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label><label>Telefoonnummer<input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" /></label><label className="website-field" aria-hidden="true">Website<input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} /></label><button type="submit" disabled={quoteState === "sending" || quoteState === "sent"}>{quoteState === "sending" ? "Verzenden…" : quoteState === "sent" ? "Aanvraag verzonden" : "Vraag mijn offerte aan"}</button><p className="privacy-note">Door te verzenden geeft u Firecom toestemming om contact op te nemen over deze configuratie.</p>{quoteState !== "idle" && quoteState !== "sending" && <div className={`form-status ${quoteState}`}>{quoteMessage}</div>}</form>
      </section>

      <section className="comparison" aria-labelledby="compare-title"><div className="section-intro"><span className="step-kicker">Motorola portofoons</span><h2 id="compare-title">Modellen en prijzen</h2><p>De getoonde modellen blijven beschikbaar, ook als de configurator een ander toestel adviseert.</p></div><div className="comparison-grid">{Object.entries(products).map(([key, product]) => <article key={key}><img src={product.image} alt="" /><span>{product.name}</span><b>{product.variant}</b><small>SKU {product.sku}</small><strong>{euro.format(product.price)}</strong><p>{product.protection} · {product.audio} · VHF/UHF</p></article>)}</div></section>
      <FirecomFooter />
    </main>
  );
}

function Question({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) { return <fieldset className="question-group"><legend><span>{number}</span><div><b>{title}</b><small>{subtitle}</small></div></legend>{children}</fieldset>; }
function Choice({ active, title, subtitle, onClick, disabled = false }: { active: boolean; title: string; subtitle: string; onClick: () => void; disabled?: boolean }) { return <button type="button" className={`choice-card ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active} disabled={disabled}><span className="radio-dot" /><b>{title}</b><small>{subtitle}</small>{disabled && <em>Niet beschikbaar</em>}</button>; }
function Preset({ number, title, text, action, featured = false }: { number: string; title: string; text: string; action: () => void; featured?: boolean }) { return <button type="button" className={`preset-card ${featured ? "featured" : ""}`} onClick={action}><span>{number}</span><b>{title}</b><small>{text}</small><em>Gebruik deze voorinstelling →</em></button>; }
function FirecomFooter() { return <footer className="company-footer"><div><b>Firecom B.V.</b><span>Randweg 10–12 · 2941 CG Lekkerkerk</span></div><div className="footer-contact"><a href="tel:+31854011980">085 401 19 80</a><a href="mailto:info@firecom.nl">info@firecom.nl</a></div><p>Een Firecom-specialist controleert iedere aanvraag voordat u een offerte ontvangt.</p></footer>; }
