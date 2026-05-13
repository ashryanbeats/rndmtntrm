import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const indexSource = await readFile(
  new URL("../src/pages/index.astro", import.meta.url),
  "utf8",
);

const properties = [
  {
    name: "Collxn",
    url: "https://www.collxn.com/",
    description: "daily vinyl collection rediscovery",
  },
  {
    name: "HanaYou",
    url: "https://www.hanayou.studio/",
    description: "Kyoto ikebana classes and guides",
  },
  {
    name: "ashryan.io",
    url: "https://www.ashryan.io/",
    description: "product leadership and writing",
  },
];

test("home page references each active property", () => {
  for (const property of properties) {
    assert.match(indexSource, new RegExp(`href="${property.url}"`));
    assert.match(indexSource, new RegExp(`>${property.name}<`));
    assert.match(indexSource, new RegExp(property.description));
  }
});

test("property links open externally without exposing the opener", () => {
  const externalLinkCount = [
    ...indexSource.matchAll(/target="_blank"\s+rel="noopener"/g),
  ].length;

  assert.equal(externalLinkCount, properties.length);
});
