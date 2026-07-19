export type AlarmDirection = "protect" | "rf" | "hybrid";
export type MaintenanceKey = "none" | "lite" | "basis" | "uitgebreid";

export const ALARM_PRICES = {
  appYearLicense: 85,
  deviceYearLicense: 85,
  devicePurchase: 300,
  pagerWithCharger: 200,
  simpleBaseStation: 2500,
  extendedCentralEquipment: 4000,
  extendedTransmitter: 3500,
} as const;

export const ALARM_MAINTENANCE: Record<MaintenanceKey, { name: string; price: number; response: string; summary: string[] }> = {
  none: { name: "Geen contract", price: 0, response: "Reguliere planning", summary: ["Onderhoud op nacalculatie", "€ 105 per uur"] },
  lite: { name: "LITE", price: 1000, response: "Binnen 24 kantooruren", summary: ["Voorrang in de planning", "Calamiteitenvoorraad", "€ 105 per onderhoudsuur"] },
  basis: { name: "BASIS", price: 1500, response: "Binnen 4 uur", summary: ["Hogere prioriteit", "Calamiteitenvoorraad", "Avond- en weekendservice"] },
  uitgebreid: { name: "UITGEBREID", price: 2000, response: "Binnen 2 uur", summary: ["Hoogste prioriteit", "Calamiteitenvoorraad", "24/7 dienstverlening"] },
};

export type AlarmCalculationInput = {
  reliability: number;
  independentOfTelecom: boolean;
  applications: string[];
  locations: number;
  buildings: number;
  appUsers: number;
  devices: number;
  pagers: number;
  transmitters: number;
  espa: boolean;
  dashboard: boolean;
  atex: boolean;
  maintenance: MaintenanceKey;
};

export function calculateAlarmConfiguration(input: AlarmCalculationInput) {
  const rfRequired = input.reliability >= 3 || input.independentOfTelecom || input.pagers > 0 || input.espa || input.applications.includes("Bedrijfsbrandweer");
  const lteRequired = input.appUsers > 0 || input.devices > 0 || input.locations > 1;
  const direction: AlarmDirection = rfRequired && lteRequired ? "hybrid" : rfRequired ? "rf" : "protect";
  const includesRf = direction === "rf" || direction === "hybrid";
  const transmitterCount = includesRf ? Math.max(1, input.transmitters, input.buildings > 1 ? input.buildings : 1) : 0;
  const extendedRf = includesRf && (transmitterCount >= 2 || input.espa || input.dashboard || input.buildings > 1 || direction === "hybrid");
  const rfCentral = includesRf ? (extendedRf ? ALARM_PRICES.extendedCentralEquipment : ALARM_PRICES.simpleBaseStation) : 0;
  const rfTransmitters = extendedRf ? transmitterCount * ALARM_PRICES.extendedTransmitter : 0;
  const pagersOnQuote = input.atex && input.pagers > 0;
  const pagerTotal = pagersOnQuote ? 0 : input.pagers * ALARM_PRICES.pagerWithCharger;
  const devicePurchaseTotal = input.devices * ALARM_PRICES.devicePurchase;
  const knownInvestment = rfCentral + rfTransmitters + pagerTotal + devicePurchaseTotal;
  const licenseYearly = input.appUsers * ALARM_PRICES.appYearLicense + input.devices * ALARM_PRICES.deviceYearLicense;
  const maintenanceYearly = ALARM_MAINTENANCE[input.maintenance].price;
  const knownYearly = licenseYearly + maintenanceYearly;

  return {
    direction,
    includesRf,
    extendedRf,
    transmitterCount,
    rfCentral,
    rfTransmitters,
    pagersOnQuote,
    pagerTotal,
    devicePurchaseTotal,
    knownInvestment,
    licenseYearly,
    maintenanceYearly,
    knownYearly,
  };
}
