import { NextResponse } from "next/server";

type QuoteRequest = {
  companyName?: string;
  contactName?: string;
  email?: string;
  website?: string;
  configuration?: Record<string, unknown>;
};

const clean = (value: unknown, maxLength = 500) => typeof value === "string" ? value.trim().slice(0, maxLength) : "";
const escapeHtml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const formatValue = (value: unknown): string => {
  if (Array.isArray(value)) return value.length ? value.map(String).join(", ") : "Geen";
  if (typeof value === "boolean") return value ? "Ja" : "Nee";
  if (typeof value === "number") return new Intl.NumberFormat("nl-NL", { maximumFractionDigits: 2 }).format(value);
  return String(value ?? "—");
};

const labels: Record<string, string> = {
  model: "Model", variant: "Uitvoering", sku: "SKU", quantity: "Aantal portofoons",
  unitPrice: "Stuksprijs excl. btw", radioSubtotal: "Subtotaal portofoons excl. btw",
  systemTotal: "Indicatief systeemtotaal excl. btw", atex: "ATEX", atexHazard: "ATEX-risico",
  atexZone: "ATEX-zone", atexGroup: "Gasgroep", temperatureClass: "Temperatuurklasse",
  display: "Display", environment: "Werkomgeving", channels: "Kanalen", safety: "Veiligheid",
  noise: "Geluidsniveau", band: "Frequentieband", permit: "Vergunning", charger: "Lader",
  battery: "Accu", extensions: "Uitbreidingen", repeater: "SLR5500-pakket",
  repeaterMount: "Repeatermontage", backupPower: "Noodstroom", siteConnect: "IP Site Connect",
  quoteItems: "Nog te offreren onderdelen",
};

export async function POST(request: Request) {
  try {
    const body = await request.json() as QuoteRequest;
    const companyName = clean(body.companyName, 120);
    const contactName = clean(body.contactName, 120);
    const email = clean(body.email, 254).toLowerCase();
    const website = clean(body.website, 200);
    const configuration = body.configuration && typeof body.configuration === "object" ? body.configuration : {};

    if (website) return NextResponse.json({ message: "Je aanvraag is ontvangen." });
    if (!companyName || !contactName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ message: "Vul je bedrijfsnaam, naam en een geldig e-mailadres in." }, { status: 400 });
    }

    const domain = clean(process.env.FRESHDESK_DOMAIN, 255).replace(/^https?:\/\//, "").replace(/\/$/, "");
    const apiKey = process.env.freshdesk_api;
    const groupName = clean(process.env.FRESHDESK_GROUP_NAME, 100) || "Sales";
    const ticketTag = clean(process.env.FRESHDESK_TICKET_TAG, 100) || "configurator";
    if (!domain || !apiKey) {
      return NextResponse.json({ message: "De offertefunctie wordt nog veilig gekoppeld. Probeer het later opnieuw." }, { status: 503 });
    }

    const authorization = `Basic ${btoa(`${apiKey}:X`)}`;
    const groupsResponse = await fetch(`https://${domain}/api/v2/groups?per_page=100`, {
      headers: { Authorization: authorization, Accept: "application/json" },
    });
    if (!groupsResponse.ok) throw new Error(`Freshdesk-groepen konden niet worden geladen (${groupsResponse.status}).`);
    const groups = await groupsResponse.json() as Array<{ id: number; name: string }>;
    const salesGroup = groups.find((group) => group.name.localeCompare(groupName, "nl", { sensitivity: "base" }) === 0);
    if (!salesGroup) throw new Error(`Freshdesk-groep ${groupName} is niet gevonden.`);

    const rows = Object.entries(configuration)
      .filter(([key]) => key in labels)
      .map(([key, value]) => `<tr><th style="text-align:left;padding:6px 12px 6px 0;vertical-align:top">${escapeHtml(labels[key])}</th><td style="padding:6px 0">${escapeHtml(formatValue(value))}</td></tr>`)
      .join("");
    const model = clean(configuration.model, 100) || "portofoonoplossing";
    const quantity = typeof configuration.quantity === "number" ? configuration.quantity : "";
    const description = `<h2>Nieuwe aanvraag via de portofoonconfigurator</h2><p><strong>Bedrijf:</strong> ${escapeHtml(companyName)}<br><strong>Contactpersoon:</strong> ${escapeHtml(contactName)}<br><strong>E-mail:</strong> ${escapeHtml(email)}</p><h3>Ingevulde configuratie</h3><table>${rows}</table><p><em>De getoonde bedragen zijn indicatief, exclusief btw en vormen geen offerte.</em></p>`;

    const ticketResponse = await fetch(`https://${domain}/api/v2/tickets`, {
      method: "POST",
      headers: { Authorization: authorization, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        name: contactName,
        email,
        subject: `Offerteaanvraag configurator · ${companyName} · ${quantity}× ${model}`,
        description,
        status: 2,
        priority: 1,
        group_id: salesGroup.id,
        tags: [ticketTag],
      }),
    });
    if (!ticketResponse.ok) throw new Error(`Freshdesk-ticket kon niet worden aangemaakt (${ticketResponse.status}).`);

    return NextResponse.json({ message: "Bedankt! Je configuratie is naar Firecom Sales gestuurd. Een specialist neemt contact met je op." });
  } catch (error) {
    console.error("Quote request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ message: "De aanvraag kon nu niet worden verzonden. Probeer het later opnieuw." }, { status: 500 });
  }
}
