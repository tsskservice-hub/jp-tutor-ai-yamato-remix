import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const baseUrl = "https://jptutoraiyamato.com";

  // 動的にページ一覧を取得する場合はここで配列に追加、またはDB/APIから取得
  const pages = ["", "/about", "/services"];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.xml.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
    <url>
      <loc>${baseUrl}${page}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <priority>${page === "" ? "1.0" : "0.8"}</priority>
    </url>
  `;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      Encoding: "UTF-8",
    },
  });
};