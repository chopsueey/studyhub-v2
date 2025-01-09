import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("studies", "./routes/studies.tsx"),
  route("studies/:studySlug", "./routes/study.tsx"),
] satisfies RouteConfig;
