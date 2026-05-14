import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readProjectFile = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("check script runs every quality gate and fails if any gate fails", async () => {
  const packageJson = JSON.parse(await readProjectFile("package.json"));

  assert.equal(packageJson.scripts.check, "node scripts/run-checks.js");

  const { checks, runChecks } = await import("../scripts/run-checks.js");
  const calls = [];
  const exitCode = runChecks(
    ({ script }) => {
      calls.push(script);
      return script === "typecheck" ? 1 : 0;
    },
    { error() {}, log() {} },
  );

  assert.deepEqual(
    checks.map(({ script }) => script),
    ["lint", "typecheck", "knip", "test"],
  );
  assert.deepEqual(calls, ["lint", "typecheck", "knip", "test"]);
  assert.equal(exitCode, 1);
});

test("pages deployment runs tests and checks before building", async () => {
  const workflow = await readProjectFile(".github/workflows/static.yml");
  const installIndex = workflow.indexOf("run: npm ci");
  const testIndex = workflow.indexOf("run: npm test");
  const checkIndex = workflow.indexOf("run: npm run check");
  const buildIndex = workflow.indexOf("run: NODE_ENV=production npm run build");

  assert.ok(installIndex !== -1);
  assert.ok(testIndex > installIndex);
  assert.ok(checkIndex > testIndex);
  assert.ok(buildIndex > checkIndex);
});

test("font assets use root-relative public paths", async () => {
  const typography = await readProjectFile("src/styles/typography.css");
  const layout = await readProjectFile("src/layouts/Layout.astro");

  assert.match(
    typography,
    /url\("\/vaticanus-font\/misc\/Vaticanus-cc60\.woff2"\) format\("woff2"\)/,
  );
  assert.match(
    typography,
    /url\("\/fonts\/Vaticanus-G3yVG\.ttf"\) format\("truetype"\)/,
  );
  assert.match(typography, /font-display: optional;/);
  assert.match(layout, /href="\/vaticanus-font\/misc\/Vaticanus-cc60\.woff2"/);
  assert.match(layout, /type="font\/woff2"/);
});

test("layout exposes a crawlable meta description", async () => {
  const layout = await readProjectFile("src/layouts/Layout.astro");
  const indexPage = await readProjectFile("src/pages/index.astro");
  const description =
    "Random Tantrum builds HTTP and LLM systems for small businesses while publishing Collxn, HanaYou, and ashryan.io.";

  assert.match(layout, /description = "Random Tantrum builds HTTP and LLM/);
  assert.match(layout, /<meta name="description" content={description} \/>/);
  assert.match(indexPage, new RegExp(`description="${description}"`));
});

test("robots.txt is generated as a static Astro route", async () => {
  const packageJson = JSON.parse(await readProjectFile("package.json"));
  const { prerender, GET } = await import("../src/pages/robots.txt.js");

  assert.equal(packageJson.scripts.dev, "astro dev");
  assert.equal(packageJson.scripts.build, "astro build");
  assert.equal(prerender, true);

  const previousNodeEnv = process.env.NODE_ENV;

  try {
    process.env.NODE_ENV = "production";
    const productionResponse = GET({
      site: new URL("https://www.randomtantrum.com"),
    });

    assert.equal(
      productionResponse.headers.get("Content-Type"),
      "text/plain; charset=utf-8",
    );
    assert.equal(
      await productionResponse.text(),
      "User-agent: *\nAllow: /\nSitemap: https://www.randomtantrum.com/sitemap-index.xml\n",
    );

    process.env.NODE_ENV = "development";
    const developmentResponse = GET({
      site: new URL("https://www.randomtantrum.com"),
    });

    assert.equal(
      await developmentResponse.text(),
      "User-agent: *\nDisallow: /\n",
    );
  } finally {
    if (previousNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = previousNodeEnv;
    }
  }
});
