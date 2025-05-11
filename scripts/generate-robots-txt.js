import fs from "fs";
import path from "path";

const publicDir = path.join(process.cwd(), "public");
const robotsTxtPath = path.join(publicDir, "robots.txt");

const prodRobotsContent = `User-agent: *
Allow: /
Sitemap: https://www.randomtantrum.com/sitemap-index.xml`;

const nonProdRobotsContent = `User-agent: *
Disallow: /`;

let content;

if (process.env.NODE_ENV === "production") {
  content = prodRobotsContent;
  console.log("Generating production robots.txt");
} else {
  content = nonProdRobotsContent;
  console.log(
    `Generating non-production robots.txt (NODE_ENV: ${process.env.NODE_ENV})`
  );
}

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(robotsTxtPath, content);
console.log(`Successfully wrote robots.txt to ${robotsTxtPath}`);
