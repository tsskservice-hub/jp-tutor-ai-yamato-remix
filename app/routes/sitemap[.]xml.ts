import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  // 例：公開しているURLのリスト（データベースやブログ記事の一覧から動的に取得することも可能）
  const baseUrl = "https://jptutoraiyamato.com";
  const posts = [
    { route: "", priority: "1.0" },
    { route: "/demo", priority: "0.8" },
    { route: "/about", priority: "0.8" },
    { route: "/oral-exam-questions", priority: "0.8" }, // 追加したページ
  ];

  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts
    .map(
      (post) => `
    <url>
      <loc>${baseUrl}${post.route}</loc>
      <priority>${post.priority}</priority>
    </url>
  `
    )
    .join("")}
</urlset>`.trim();

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      charset: "UTF-8",
    },
  });
}