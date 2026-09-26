import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const baseUrl = "https://jptutoraiyamato.com";
  
  // 実際に表示させたいURLのリストに書き換える
  const routes = [
    { route: "", priority: "1.0" },
    { route: "/demo", priority: "0.8" },
    { route: "/genkoyoshi-editor", priority: "0.8" },     // 追加
    { route: "/oral-exam-questions", priority: "0.8" },  // 追加
    // ※ about は削除
  ];

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(
      (item) => `
    <url>
      <loc>${baseUrl}${item.route}</loc>
      <priority>${item.priority}</priority>
    </url>
  `
    )
    .join("")}
</urlset>`.trim();

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "charset": "UTF-8",
    },
  });
}