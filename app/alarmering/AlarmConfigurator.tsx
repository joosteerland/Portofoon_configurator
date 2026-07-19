"use client";

import { useMemo, useState } from "react";
import { ALARM_MAINTENANCE, ALARM_PRICES, calculateAlarmConfiguration, type MaintenanceKey } from "./pricing";
import "./alarmering.css";

type Reliability = 1 | 2 | 3 | 4;
type Permit = "existing" | "help" | "unknown";
type Backup = "none" | "8" | "24" | "48" | "72";

const QUOTE_FORM_URL = "https://formspree.io/f/mdaqgbjj";
const euro = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
const applicationOptions = ["BHV", "Bedrijfsbrandweer", "Agressie", "Alleenwerkers", "Techniek", "Beveiliging", "Medisch", "Brandmeldinstallatie"];
const specialAreaOptions = ["Kelder / parkeergarage", "Zwaar beton of staal", "Buitenterrein", "ATEX-zone"];

const adviceCopy = {
  protect: { name: "Firecom Protect", label: "Flexibel via LTE", copy: "Voor meerdere locaties, apps en dedicated devices. Deze richting gebruikt publieke mobiele netwerken, internet en het online platform." },
  rf: { name: "RF-oproepsysteem", label: "Lokale onafhankelijke alarmering", copy: "Eigen zenders en pagers zorgen voor lokale alarmering zonder afhankelijkheid van publiek internet of mobiele telefonie." },
  hybrid: { name: "Hybride alarmering", label: "RF primair · LTE aanvullend", copy: "RF-pagers vormen de primaire alarmering. Apps en dedicated devices vergroten aanvullend het bereik naar mobiele gebruikers en andere locaties." },
};

export default function AlarmConfigurator() {
  const [applications, setApplications] = useState<string[]>(["BHV"]);
  const [organizationType, setOrganizationType] = useState("Kantoororganisatie");
  const [reliability, setReliability] = useState<Reliability>(2);
  const [independentOfTelecom, setIndependentOfTelecom] = useState(false);
  const [locations, setLocations] = useState(1);
  const [buildings, setBuildings] = useState(1);
  const [floors, setFloors] = useState(3);
  const [specialAreas, setSpecialAreas] = useState<string[]>([]);
  const [appUsers, setAppUsers] = useState(10);
  const [devices, setDevices] = useState(0);
  const [pagers, setPagers] = useState(0);
  const [initiators, setInitiators] = useState<string[]>(["App", "Dashboard"]);
  const [dashboard, setDashboard] = useState(true);
  const [receptionScreen, setReceptionScreen] = useState(false);
  const [controlRoom, setControlRoom] = useState(false);
  const [espa, setEspa] = useState(false);
  const [bmcType, setBmcType] = useState("");
  const [transmitters, setTransmitters] = useState(1);
  const [permit, setPermit] = useState<Permit>("unknown");
  const [backup, setBackup] = useState<Backup>("24");
  const [coverageStudy, setCoverageStudy] = useState(false);
  const [maintenance, setMaintenance] = useState<MaintenanceKey>("none");
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [quoteState, setQuoteState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [quoteMessage, setQuoteMessage] = useState("");

  const atex = specialAreas.includes("ATEX-zone");
  const calculation = useMemo(() => calculateAlarmConfiguration({ reliability, independentOfTelecom, applications, locations, buildings, appUsers, devices, pagers, transmitters, espa, dashboard, atex, maintenance }), [reliability, independentOfTelecom, applications, locations, buildings, appUsers, devices, pagers, transmitters, espa, dashboard, atex, maintenance]);
  const advice = adviceCopy[calculation.direction];
  const plan = ALARM_MAINTENANCE[maintenance];
  const complexLocation = buildings > 1 || specialAreas.length > 0 || reliability >= 3;
  const hasQuoteItems = dashboard || receptionScreen || controlRoom || espa || coverageStudy || backup !== "none" || calculation.pagersOnQuote;

  const toggle = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const applyPreset = (preset: "bhv" | "safety" | "fire" | "hybrid") => {
    if (preset === "bhv") { setApplications(["BHV"]); setReliability(2); setIndependentOfTelecom(false); setAppUsers(15); setDevices(0); setPagers(0); setLocations(1); setBuildings(1); setEspa(false); setDashboard(true); }
    if (preset === "safety") { setApplications(["Agressie", "Alleenwerkers"]); setReliability(2); setIndependentOfTelecom(false); setAppUsers(5); setDevices(10); setPagers(0); setInitiators(["Fysieke noodknop", "App"]); setEspa(false); }
    if (preset === "fire") { setApplications(["Bedrijfsbrandweer", "Brandmeldinstallatie"]); setReliability(4); setIndependentOfTelecom(true); setAppUsers(0); setDevices(0); setPagers(20); setTransmitters(2); setEspa(true); setDashboard(true); setCoverageStudy(true); }
    if (preset === "hybrid") { setApplications(["BHV", "Techniek", "Brandmeldinstallatie"]); setReliability(4); setIndependentOfTelecom(true); setAppUsers(10); setDevices(0); setPagers(20); setTransmitters(2); setEspa(true); setDashboard(true); setCoverageStudy(true); }
    document.getElementById("alarm-vragen")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const requestQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setQuoteState("sending"); setQuoteMessage("");
    try {
      const configuration = [
        "Alarmeringsconfigurator", `Adviesrichting: ${advice.name}`, `Toepassingen: ${applications.join(", ") || "Nog niet gekozen"}`, `Organisatie: ${organizationType}`,
        `Betrouwbaarheidsniveau: ${reliability}`, `Onafhankelijk van telecom vereist: ${independentOfTelecom ? "Ja" : "Nee"}`, `Locaties: ${locations}`, `Gebouwen: ${buildings}`, `Verdiepingen: ${floors}`, `Bijzondere ruimten: ${specialAreas.join(", ") || "Geen"}`,
        `Appgebruikers: ${appUsers} × ${euro.format(ALARM_PRICES.appYearLicense)} per jaar`, `Dedicated devices: ${devices} × ${euro.format(ALARM_PRICES.devicePurchase)} + ${euro.format(ALARM_PRICES.deviceYearLicense)} per jaar`, `Alarmontvangers (Swissphone C35): ${pagers} × ${euro.format(ALARM_PRICES.pagerWithCharger)} incl. oplaadstation`,
        `Melding starten via: ${initiators.join(", ") || "Nog niet gekozen"}`, `Dashboard: ${dashboard ? "Ja" : "Nee"}`, `Receptiescherm: ${receptionScreen ? "Ja" : "Nee"}`, `Externe meldkamer: ${controlRoom ? "Ja" : "Nee"}`,
        `RF-systeem: ${calculation.includesRf ? (calculation.extendedRf ? "Uitgebreid" : "Eenvoudig") : "Niet geselecteerd"}`, `Zenders: ${calculation.transmitterCount}`, `ESPA/BMC: ${espa ? `Ja${bmcType ? ` · ${bmcType}` : ""}` : "Nee"}`, `Vergunning: ${permit}`, `Noodstroom: ${backup === "none" ? "Niet gekozen" : `${backup} uur`}`, `Dekkingsonderzoek: ${coverageStudy ? "Ja" : "Nee"}`,
        `Bekende eenmalige investering excl. btw: ${euro.format(calculation.knownInvestment)}`, `Bekende jaarlijkse kosten excl. btw: ${euro.format(calculation.knownYearly)}`, `Onderhoud: ${plan.name} · ${euro.format(plan.price)} per jaar · ${plan.response}`, `Maatwerkposten: ${hasQuoteItems ? "Aanwezig; definitief op offerte" : "Geen geselecteerde maatwerkposten"}`,
      ].join("\n");
      const response = await fetch(QUOTE_FORM_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ _subject: `Offerteaanvraag Alarmeringsconfigurator · ${companyName}`, _replyto: email, _gotcha: website, bedrijfsnaam: companyName, naam: contactName, email, telefoonnummer: phone, configuratie: configuration }) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "De aanvraag kon niet worden verzonden.");
      setQuoteState("sent"); setQuoteMessage("Bedankt! Uw alarmeringsconfiguratie is naar Firecom verstuurd. Een specialist neemt contact met u op.");
    } catch (error) { setQuoteState("error"); setQuoteMessage(error instanceof Error ? error.message : "De aanvraag kon niet worden verzonden."); }
  };

  return (
    <main className="alarm-configurator">
      <header className="site-header">
        <a className="brand" href="../" aria-label="Terug naar configuratorkeuze"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span>ALARMERING <em>CONFIGURATOR</em></span></a>
        <a className="header-cta" href="#alarm-offerte">Vraag offerte aan</a>
      </header>

      <section className="hero alarm-hero" aria-labelledby="alarm-title">
        <div className="eyebrow"><span /> Firecom keuzehulp</div>
        <h1 id="alarm-title">Alarmerings-<br /><em>configurator</em></h1>
        <p>Begin bij uw situatie en gewenste betrouwbaarheid. U krijgt direct een technisch onderbouwde oplossingsrichting met bekende eenmalige en jaarlijkse kosten.</p>
        <div className="trust-row"><span>Alle prijzen excl. btw</span><span>LTE, RF of hybride advies</span><span>Onderhoud altijd meegenomen</span></div>
      </section>

      <nav className="step-nav" aria-label="Stappen"><a href="#alarm-start">1. Start</a><a href="#alarm-vragen">2. Situatie</a><a href="#alarm-bereik">3. Bereik</a><a href="#alarm-onderhoud">4. Onderhoud</a><a href="#alarm-offerte">5. Offerte</a></nav>

      <section className="quick-start" id="alarm-start" aria-labelledby="alarm-quick-title">
        <div className="section-intro"><span className="step-kicker">Snel beginnen</span><h2 id="alarm-quick-title">Welke situatie komt het dichtst in de buurt?</h2><p>Kies een uitgangspunt. Alle keuzes kunnen daarna worden aangepast.</p></div>
        <div className="preset-grid"><Preset icon="BHV" title="BHV via app" text="Flexibel alarmeren via Firecom Protect" action={() => applyPreset("bhv")} /><Preset icon="SOS" title="Persoonlijke veiligheid" text="Agressie en alleenwerkers met noodknop" action={() => applyPreset("safety")} /><Preset icon="RF" title="Bedrijfsbrandweer" text="Onafhankelijke RF-alarmering met pagers" action={() => applyPreset("fire")} featured /><Preset icon="HYB" title="Hybride industrie" text="RF primair, apps aanvullend en ESPA" action={() => applyPreset("hybrid")} /></div>
      </section>

      <section className="configurator-shell" aria-label="Alarmeringsconfigurator">
        <div className="questions-panel" id="alarm-vragen">
          <div className="panel-heading"><div><span className="step-kicker">Situatie & risico</span><h2>Vertel ons hoe u alarmeert</h2></div><span className="progress-label">Live advies</span></div>

          <Question number="01" title="Waarvoor wordt de alarmering gebruikt?" subtitle="U kunt meerdere toepassingen combineren.">
            <div className="toggle-grid">{applicationOptions.map((item) => <button type="button" key={item} className={`toggle-chip ${applications.includes(item) ? "active" : ""}`} onClick={() => toggle(item, setApplications)} aria-pressed={applications.includes(item)}>{applications.includes(item) ? "✓ " : "+ "}{item}</button>)}</div>
            <label className="select-label alarm-select">Type organisatie<select value={organizationType} onChange={(event) => setOrganizationType(event.target.value)}><option>Kantoororganisatie</option><option>Zorginstelling</option><option>Woningcorporatie</option><option>Distributiecentrum</option><option>Fabriek</option><option>Chemische plant</option><option>Industrieterrein</option><option>Ziekenhuis</option><option>Onderwijsinstelling</option><option>Hotel of recreatie</option><option>Gemeente</option><option>Bedrijfsbrandweer</option><option>Anders</option></select></label>
          </Question>

          <Question number="02" title="Hoe kritisch is de alarmering?" subtitle="Dit is de belangrijkste keuze tussen LTE en eigen RF-infrastructuur.">
            <div className="reliability-grid"><Choice active={reliability === 1} title="1 · Operationeel" subtitle="Tijdelijke uitval is vervelend, maar niet direct gevaarlijk" onClick={() => setReliability(1)} /><Choice active={reliability === 2} title="2 · Veiligheidskritisch" subtitle="Voor BHV, agressie en alleenwerkers" onClick={() => setReliability(2)} /><Choice active={reliability === 3} title="3 · Bedrijfskritisch" subtitle="Moet lokaal werken bij telecomuitval" onClick={() => { setReliability(3); setIndependentOfTelecom(true); }} /><Choice active={reliability === 4} title="4 · Missiekritisch" subtitle="Levensreddend of bedrijfsbrandweer" onClick={() => { setReliability(4); setIndependentOfTelecom(true); setCoverageStudy(true); }} /></div>
            <button type="button" className={`alarm-switch ${independentOfTelecom ? "active" : ""}`} onClick={() => setIndependentOfTelecom((value) => !value)} aria-pressed={independentOfTelecom}><span>{independentOfTelecom ? "✓" : ""}</span><div><b>Blijven functioneren zonder mobiel internet of telefonie</b><small>Bij selectie wordt eigen RF-infrastructuur onderdeel van het advies.</small></div></button>
          </Question>

          <div id="alarm-bereik" />
          <Question number="03" title="Waar moet de oplossing bereikbaar zijn?" subtitle="Gebouwopbouw en kritieke ruimten bepalen of een dekkingsonderzoek nodig is.">
            <div className="alarm-number-grid"><NumberField label="Locaties" value={locations} min={1} max={50} setValue={setLocations} /><NumberField label="Gebouwen" value={buildings} min={1} max={30} setValue={setBuildings} /><NumberField label="Verdiepingen" value={floors} min={1} max={40} setValue={setFloors} /></div>
            <span className="sub-label alarm-sub-label">Bijzondere ruimten of omstandigheden</span><div className="toggle-grid">{specialAreaOptions.map((item) => <button type="button" key={item} className={`toggle-chip ${specialAreas.includes(item) ? "active" : ""}`} onClick={() => toggle(item, setSpecialAreas)} aria-pressed={specialAreas.includes(item)}>{specialAreas.includes(item) ? "✓ " : "+ "}{item}</button>)}</div>
            {complexLocation && <div className="inline-alert">Een locatiebezoek of dekkingsonderzoek wordt geadviseerd. De genoemde dekking is nooit een garantie; beton, staal, machines en terreinindeling hebben grote invloed.</div>}
          </Question>

          <Question number="04" title="Wie ontvangen de meldingen?" subtitle="Combineer apps, dedicated devices en alarmontvangers naar behoefte.">
            <div className="receiver-grid"><Receiver title="App op eigen telefoon" subtitle={`${euro.format(ALARM_PRICES.appYearLicense)} per gebruiker per jaar`} value={appUsers} setValue={setAppUsers} image="./smartphone.png" /><Receiver title="Dedicated device" subtitle={`${euro.format(ALARM_PRICES.devicePurchase)} aanschaf + ${euro.format(ALARM_PRICES.deviceYearLicense)} per jaar`} value={devices} setValue={setDevices} image="./twig-embody.jpg" /><Receiver title="Alarmontvanger" subtitle={`${euro.format(ALARM_PRICES.pagerWithCharger)} incl. oplaadstation`} value={pagers} setValue={setPagers} image="./swissphone-c35.png" /></div>
            {pagers > 0 && <div className="cost-note"><b>Oplaadstation inbegrepen</b><span>De gekoppelde laders kunnen eenvoudig tot een multiladeropstelling worden gecombineerd.</span></div>}
            {calculation.pagersOnQuote && <div className="inline-alert">Voor een ATEX-zone is een specifieke gecertificeerde alarmontvanger nodig. De standaardprijs is daarom niet in het totaal opgenomen.</div>}
          </Question>

          <Question number="05" title="Hoe worden meldingen gestart en beheerd?" subtitle="De keuze voor ESPA, apps of dashboard kan automatisch uitgebreidere centrale hardware activeren.">
            <span className="sub-label">Melding starten via</span><div className="toggle-grid">{["App", "Fysieke noodknop", "Dashboard", "Brandmeldcentrale", "Technische installatie"].map((item) => <button type="button" key={item} className={`toggle-chip ${initiators.includes(item) ? "active" : ""}`} onClick={() => toggle(item, setInitiators)} aria-pressed={initiators.includes(item)}>{initiators.includes(item) ? "✓ " : "+ "}{item}</button>)}</div>
            <div className="feature-grid"><Feature active={dashboard} title="Online / centraal dashboard" subtitle="Berichten starten, groepen beheren en historie bekijken" onClick={() => setDashboard((value) => !value)} /><Feature active={receptionScreen} title="Receptiescherm & narrowcasting" subtitle="BHV-aanwezigheid, instructies en actieve meldingen" onClick={() => setReceptionScreen((value) => !value)} /><Feature active={controlRoom} title="Externe meldkamer" subtitle="Opvolging volgens een afgesproken protocol" onClick={() => setControlRoom((value) => !value)} /><Feature active={espa} title="ESPA-koppeling met BMC" subtitle="Brandmeldingen automatisch als tekstbericht doorzetten" onClick={() => { setEspa((value) => !value); setIndependentOfTelecom(true); }} /></div>
            {espa && <label className="select-label alarm-select">Merk en type brandmeldcentrale, indien bekend<input value={bmcType} onChange={(event) => setBmcType(event.target.value)} placeholder="Bijvoorbeeld merk en type BMC" /></label>}
          </Question>

          {calculation.includesRf && <Question number="06" title="Lokale RF-infrastructuur" subtitle="De configurator schakelt automatisch naar uitgebreide centrale apparatuur wanneer dat technisch nodig is.">
            <div className="rf-package"><div className="rf-image"><img src="./centrale-apparatuur.jpg" alt="Voorstel voor centrale RF-alarmeringsapparatuur" /></div><div><span className="model-pill">{calculation.extendedRf ? "Uitgebreid systeem" : "Eenvoudig systeem"}</span><h3>{calculation.extendedRf ? "Centrale apparatuur met gekoppelde zenders" : "Eenvoudig basisstation"}</h3><p>{calculation.extendedRf ? `${euro.format(ALARM_PRICES.extendedCentralEquipment)} centrale apparatuur + ${euro.format(ALARM_PRICES.extendedTransmitter)} per zender.` : `${euro.format(ALARM_PRICES.simpleBaseStation)} voor één eenvoudig basisstation.`}</p></div></div>
            <div className="alarm-number-grid rf-controls"><NumberField label="Gewenste zenders" value={calculation.transmitterCount} min={locations} max={50} setValue={(value) => setTransmitters(Math.max(locations, value))} /><label className="select-label">Noodstroom<select value={backup} onChange={(event) => setBackup(event.target.value as Backup)}><option value="none">Niet gekozen</option><option value="8">8 uur</option><option value="24">24 uur</option><option value="48">48 uur</option><option value="72">72 uur</option></select></label><label className="select-label">Frequentievergunning<select value={permit} onChange={(event) => setPermit(event.target.value as Permit)}><option value="existing">Aanwezig</option><option value="help">Hulp bij aanvraag gewenst</option><option value="unknown">Weet ik niet</option></select></label></div>
            <button type="button" className={`alarm-switch ${coverageStudy ? "active" : ""}`} onClick={() => setCoverageStudy((value) => !value)} aria-pressed={coverageStudy}><span>{coverageStudy ? "✓" : ""}</span><div><b>Dekkingsonderzoek of locatiebezoek opnemen</b><small>De prijs wordt na afstemming als offertepost toegevoegd.</small></div></button>
            <p className="rf-disclaimer">Frequentiegebruik kan vergunningplichtig zijn. Firecom controleert de technische en wettelijke voorwaarden. Installatie, antennes, bekabeling, engineering, noodstroom, monitoring en koppelingen worden definitief op offerte vastgesteld.</p>
          </Question>}

          <div id="alarm-onderhoud" />
          <Question number={calculation.includesRf ? "07" : "06"} title="Welk onderhoudsniveau past bij uw organisatie?" subtitle="De onderhoudsprijzen zijn gelijk aan de communicatieconfigurator.">
            <div className="maintenance-grid">{(Object.keys(ALARM_MAINTENANCE) as MaintenanceKey[]).map((key) => { const item = ALARM_MAINTENANCE[key]; return <button type="button" key={key} className={`maintenance-card ${maintenance === key ? "active" : ""} ${key === "basis" ? "recommended" : ""}`} onClick={() => setMaintenance(key)}>{key === "basis" && <em>Meest gekozen</em>}<span className="radio-dot" /><h3>{item.name}</h3><strong>{item.price ? `${euro.format(item.price)} / jaar` : "Geen jaarlijkse kosten"}</strong><b>{item.response}</b><ul>{item.summary.map((line) => <li key={line}>{line}</li>)}</ul></button>; })}</div>
            <p className="maintenance-note">Alle bedragen zijn excl. btw. Contractduur: 1 jaar. Onderhoudswerkzaamheden worden berekend tegen {euro.format(105)} per uur.</p>
          </Question>
        </div>

        <aside className="result-panel alarm-result" aria-live="polite">
          <div className="result-topline"><span className="live-dot" /> Uw live alarmeringsadvies</div>
          <div className={`alarm-advice-visual ${calculation.includesRf ? "rf" : "protect"}`}>{calculation.includesRf ? <><img src="./centrale-apparatuur.jpg" alt="Centrale RF-alarmeringsapparatuur" />{pagers > 0 && <img className="pager-thumb" src="./swissphone-c35.png" alt="Swissphone C35-pager" />}</> : <div className="protect-symbol"><span>!</span><b>LTE</b></div>}</div>
          <span className="model-pill">{advice.label}</span><h2>{advice.name}</h2><p className="model-copy">{advice.copy}</p>
          <div className="reliability-summary"><small>Betrouwbaarheidsniveau</small><b>{reliability} van 4</b><span>{independentOfTelecom ? "Eigen RF-infrastructuur vereist" : "Publieke telecominfrastructuur acceptabel"}</span></div>
          <div className="dual-price"><div><span>Bekende investering</span><strong>{euro.format(calculation.knownInvestment)}</strong><small>eenmalig · excl. btw</small></div><div><span>Bekende jaarlijkse kosten</span><strong>{euro.format(calculation.knownYearly)}</strong><small>licenties + onderhoud · excl. btw</small></div></div>
          <div className="summary-lines">{calculation.rfCentral > 0 && <span><b>{calculation.extendedRf ? "Centrale apparatuur" : "Basisstation"}</b><strong>{euro.format(calculation.rfCentral)}</strong></span>}{calculation.rfTransmitters > 0 && <span><b>{calculation.transmitterCount} × zender</b><strong>{euro.format(calculation.rfTransmitters)}</strong></span>}{pagers > 0 && <span><b>{pagers} × alarmontvanger incl. lader</b><strong>{calculation.pagersOnQuote ? "Op offerte" : euro.format(calculation.pagerTotal)}</strong></span>}{devices > 0 && <span><b>{devices} × dedicated device</b><strong>{euro.format(calculation.devicePurchaseTotal)}</strong></span>}{appUsers > 0 && <span><b>{appUsers} × applicentie / jaar</b><strong>{euro.format(appUsers * ALARM_PRICES.appYearLicense)}</strong></span>}{devices > 0 && <span><b>{devices} × devicelicentie / jaar</b><strong>{euro.format(devices * ALARM_PRICES.deviceYearLicense)}</strong></span>}<span><b>Onderhoud {plan.name}</b><strong>{plan.price ? `${euro.format(plan.price)}/jr` : euro.format(0)}</strong></span></div>
          {hasQuoteItems && <div className="aside-notice"><b>Aanvullende offerteposten</b><span>Installatie, inrichting, dashboard, koppelingen, dekking, meldkamer en/of noodstroom worden na technische controle geprijsd.</span></div>}
          <a className="aside-cta" href="#alarm-offerte">Ontvang een echte offerte</a>
          <p className="fineprint">Alle prijzen zijn indicatief en exclusief btw. Radiodekking, beschikbaarheid, koppelingen, vergunning, installatie en abonnementsvoorwaarden worden door Firecom bevestigd.</p>
        </aside>
      </section>

      <div className="floating-price alarm-floating"><div><small>Bekende investering excl. btw</small><b>{euro.format(calculation.knownInvestment)}</b></div><span>{advice.name} · jaarlijks {euro.format(calculation.knownYearly)}</span></div>

      <section className="alarm-products" aria-labelledby="alarm-products-title"><div className="section-intro"><span className="step-kicker">Indicatieve hardware</span><h2 id="alarm-products-title">Herkenbare apparatuur</h2><p>De definitieve systeemopbouw wordt technisch gecontroleerd voordat Firecom een offerte uitbrengt.</p></div><div className="alarm-product-grid"><article><div><img src="./swissphone-c35.png" alt="Swissphone s.QUAD C35-alarmontvanger" /></div><span>Alarmontvanger</span><b>Swissphone s.QUAD C35 met oplaadstation</b><strong>{euro.format(ALARM_PRICES.pagerWithCharger)}</strong><p>Gekoppelde laders kunnen eenvoudig als multiladeropstelling worden gebruikt.</p></article><article><div><img src="./centrale-apparatuur.jpg" alt="Conceptvoorstel centrale alarmeringsapparatuur" /></div><span>Centrale RF-apparatuur</span><b>Merkneutraal conceptvoorstel</b><strong>Vanaf {euro.format(ALARM_PRICES.simpleBaseStation)}</strong><p>De exacte kast, zenders, antennes, noodstroom en koppelingen volgen uit het technisch ontwerp.</p></article></div></section>

      <section className="quote-request" id="alarm-offerte" aria-labelledby="alarm-quote-title"><div className="quote-intro"><span className="step-kicker">Laatste stap</span><h2 id="alarm-quote-title">Ontvang een onderbouwde offerte.</h2><p>Firecom controleert de gekozen betrouwbaarheid, dekking, apparatuur, vergunning en koppelingen en neemt contact met u op.</p><div className="quote-summary"><span><small>Advies</small><b>{advice.name}</b></span><span><small>Bekende investering</small><b>{euro.format(calculation.knownInvestment)} excl. btw</b></span><span><small>Bekend per jaar</small><b>{euro.format(calculation.knownYearly)} excl. btw</b></span></div></div><form className="quote-form" onSubmit={requestQuote}><label>Bedrijfsnaam<input value={companyName} onChange={(event) => setCompanyName(event.target.value)} autoComplete="organization" required /></label><label>Naam<input value={contactName} onChange={(event) => setContactName(event.target.value)} autoComplete="name" required /></label><label>E-mailadres<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Telefoonnummer<input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" /></label><label className="website-field" aria-hidden="true">Website<input value={website} onChange={(event) => setWebsite(event.target.value)} tabIndex={-1} /></label><button type="submit" disabled={quoteState === "sending" || quoteState === "sent"}>{quoteState === "sending" ? "Verzenden…" : quoteState === "sent" ? "Aanvraag verzonden" : "Vraag mijn offerte aan"}</button><p className="privacy-note">Door te verzenden geeft u Firecom toestemming om contact op te nemen over deze configuratie.</p>{quoteState !== "idle" && quoteState !== "sending" && <div className={`form-status ${quoteState}`}>{quoteMessage}</div>}</form></section>

      <footer><a href="../">← Terug naar configuratorkeuze</a><p>Een indicatieve keuzehulp van Firecom · alle prijzen exclusief btw.</p></footer>
    </main>
  );
}

function Question({ number, title, subtitle, children }: { number: string; title: string; subtitle: string; children: React.ReactNode }) { return <fieldset className="question-group"><legend><span>{number}</span><div><b>{title}</b><small>{subtitle}</small></div></legend>{children}</fieldset>; }
function Choice({ active, title, subtitle, onClick }: { active: boolean; title: string; subtitle: string; onClick: () => void }) { return <button type="button" className={`choice-card ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}><span className="radio-dot" /><b>{title}</b><small>{subtitle}</small></button>; }
function Feature({ active, title, subtitle, onClick }: { active: boolean; title: string; subtitle: string; onClick: () => void }) { return <button type="button" className={`choice-card alarm-feature ${active ? "active" : ""}`} onClick={onClick} aria-pressed={active}><span className="radio-dot" /><b>{title}</b><small>{subtitle}</small></button>; }
function Preset({ icon, title, text, action, featured = false }: { icon: string; title: string; text: string; action: () => void; featured?: boolean }) { return <button type="button" className={`preset-card ${featured ? "featured" : ""}`} onClick={action}><span>{icon}</span><b>{title}</b><small>{text}</small><em>Start hiermee →</em></button>; }
function NumberField({ label, value, min, max, setValue }: { label: string; value: number; min: number; max: number; setValue: (value: number) => void }) { return <div className="alarm-number"><label>{label}</label><div><button type="button" onClick={() => setValue(Math.max(min, value - 1))}>−</button><output>{value}</output><button type="button" onClick={() => setValue(Math.min(max, value + 1))}>+</button></div></div>; }
function Receiver({ title, subtitle, value, setValue, image }: { title: string; subtitle: string; value: number; setValue: (value: number) => void; image?: string }) { return <div className="receiver-card">{image ? <img src={image} alt="" /> : <span className="receiver-symbol" aria-hidden="true">{title.startsWith("App") ? "APP" : "SOS"}</span>}<b>{title}</b><small>{subtitle}</small><div><button type="button" onClick={() => setValue(Math.max(0, value - 1))}>−</button><output>{value}</output><button type="button" onClick={() => setValue(Math.min(500, value + 1))}>+</button></div></div>; }
