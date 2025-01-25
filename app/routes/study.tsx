import slug from "slug";
import { data, Link, useParams } from "react-router";
import CreateForm from "~/components/CreateForm";
import { getAllTopics } from "~/backend/functions/topic";
import type { Route } from "./+types/study";
// import { getAllTopics } from "~/backend/functions/topic";

export async function loader({ params }: Route.LoaderArgs) {
  const topics = await getAllTopics(params.studySlug);
  return { topics };
}
export default function Study({ loaderData }: Route.ComponentProps) {
  const { topics } = loaderData;
  const { studySlug } = useParams();

  if (!studySlug) {
    throw data(
      { message: "No studyID param provided in URL." },
      { status: 404 }
    );
  }

  if (topics == null) {
    throw data({ message: "Study does not exist." }, { status: 404 });
  }
  return (
    <main className="space-y-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between">
        <h1>{studySlug.toUpperCase()}</h1>
        {/* <Dialog action="delete" id={id} study={study} /> */}
      </div>

      <h2>Topics:</h2>
      {topics.length < 1 && (
        <div>This study doesn&apos;t have any topics yet.</div>
      )}

      <div className="flex space-y-2 flex-col">
        {topics.length > 0 &&
          topics.map((topic) => (
            <Link
              key={topic._id}
              to={{
                pathname: `/studies/${studySlug}/topic/${slug(topic.name)}`,
              }}
            >
              <div className="border w-fit p-2 rounded-lg hover:bg-slate-300">
                <p>{topic.name}</p>
              </div>
            </Link>
          ))}
      </div>

      <CreateForm what="topic" />
    </main>
  );
}
