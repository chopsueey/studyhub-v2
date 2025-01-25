import { useParams } from "react-router";
import type { Route } from "./+types/topic";
import { findTopicBySlug } from "~/backend/functions/topic";

export async function loader({ params }: Route.LoaderArgs) {
  const topic = await findTopicBySlug(params.topicSlug);
  return { topic };
}

export default function Topic({ loaderData }: Route.ComponentProps) {
  const { topic } = loaderData;
  const { topicSlug } = useParams();
  return <h1>Hello from {topic.name}</h1>;
}
