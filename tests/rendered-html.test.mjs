import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the professional configurator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Communicatie configurator \| Firecom<\/title>/i);
  assert.match(html, /Communicatie/);
  assert.match(html, /Is een ATEX-toestel nodig\?/);
  assert.match(html, /Motorola R5/);
  assert.match(html, /2\.838,00/);
  assert.match(html, /Indicatieve investering/);
  assert.match(html, /ESPA 4\.4\.4/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps product pricing and safety guardrails explicit", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  for (const price of ["329.75", "435.95", "499.95", "804.9", "790.95", "1227.15", "1563.3"]) {
    assert.match(page, new RegExp(`price: ${price.replace(".", "\\.")}`));
  }
  assert.match(page, /één ATEX-productfamilie/);
  assert.match(page, /Complete repeateroplossing/);
  assert.match(page, /SLR5500_PACKAGE_PRICE = 5500/);
  assert.match(page, /PROGRAMMING_PRICE = 25/);
  assert.match(page, /REPEATER_INSTALLATION_PRICE = 950/);
  assert.match(page, /ESPA_STANDARD_PRICE = 1500/);
  assert.match(page, /ESPA_CONNECTED_PRICE = 3000/);
  assert.match(page, /plaatsing binnen 12 meter/);
  assert.match(page, /webapplicatie/);
  assert.match(page, /RDI_ONE_TIME = 219/);
  assert.match(page, /LITE/);
  assert.match(page, /UITGEBREID/);
  assert.match(page, /Live totaal excl\. btw/);
  assert.match(layout, /Communicatie configurator/);
});
