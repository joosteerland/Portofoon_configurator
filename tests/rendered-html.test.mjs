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
  assert.match(html, /<title>PortofoonPrijs — professionele Motorola-configurator<\/title>/i);
  assert.match(html, /Configureer de juiste/);
  assert.match(html, /Is ATEX of IECEx verplicht\?/);
  assert.match(html, /Motorola R5/);
  assert.match(html, /€ 435,95/);
  assert.match(html, /Openbare vanafprijs per portofoon/);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("keeps product pricing and safety guardrails explicit", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");

  for (const price of ["329.75", "435.95", "499.95", "804.9", "790.95", "1227.15", "1563.3"]) {
    assert.match(page, new RegExp(`price: ${price.replace(".", "\\.")}`));
  }
  assert.match(page, /Standaard R7-accessoires zijn niet uitwisselbaar/);
  assert.match(page, /SLR5500-infrastructuur/);
  assert.match(page, /Professionele UHF\/VHF-uitvoeringen zijn in Nederland vergunningsplichtig/);
  assert.match(page, /Prijsbenchmark gecontroleerd op 19 juli 2026/);
  assert.match(layout, /professionele Motorola-configurator/);
});
