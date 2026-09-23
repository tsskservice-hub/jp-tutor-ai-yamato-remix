const BASE_URL = "https://jptutoraiyamato.com";

export async function loader({ request }: { request: Request }) {
  const staticPages = [
    "",
    "/demo",
    "/about",
    "/genkoyoshi-editor",
    "/oral-exam-questions",
  ];

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (path) => `  <url>
    <loc>${BASE_URL}${path}</loc>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xmlContent, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}