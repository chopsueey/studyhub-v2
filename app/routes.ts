import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("studies", "./routes/studies.tsx"),
  route("studies/:studySlug", "./routes/study.tsx"),
  route("studies/:studySlug/topic/:topicSlug", "./routes/topic.tsx"),
  route(
    "studies/:studySlug/topic/:topicSlug/:noteSlug",
    "./routes/note/note.tsx"
  ),
  route(
    "studies/:studySlug/topic/:topicSlug/:noteSlug/edit-note",
    "./routes/note/edit-note.tsx"
  ),
] satisfies RouteConfig;
