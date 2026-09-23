import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),                           // トップページ (/)
  route("demo", "routes/demo.tsx"),                   // デモページ (/demo)
  route("genkoyoshi-editor", "routes/genkoyoshi-editor.tsx"), // 原稿用紙エディタ (/genkoyoshi-editor)
  route("oral-exam-questions", "routes/oral-exam-questions.tsx"), // 口頭試験音声ハブ (/oral-exam-questions)
] satisfies RouteConfig;