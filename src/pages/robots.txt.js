export const prerender = true;

const fallbackSite = "https://www.randomtantrum.com";

export const GET = ({ site }) => {
  const isProduction = process.env.NODE_ENV === "production";
  const sitemapUrl = new URL("sitemap-index.xml", site ?? fallbackSite);
  const content = isProduction
    ? `User-agent: *
Allow: /
Sitemap: ${sitemapUrl.href}
`
    : `User-agent: *
Disallow: /
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
