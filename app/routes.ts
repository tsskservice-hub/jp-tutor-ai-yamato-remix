import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),        // トップページ (/)
  route("demo", "routes/demo.tsx"), // デモページ (/demo)
] satisfies RouteConfig;