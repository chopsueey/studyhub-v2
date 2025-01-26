import type { Route } from "./+types/topic";
import { findTopicBySlug } from "~/backend/functions/topic";
import { data, Link, useParams } from "react-router";
import type { INote } from "~/backend/models/Note";
import slug from "slug";

export async function loader({ params }: Route.LoaderArgs) {
  const topic = await findTopicBySlug(params.topicSlug);
  return { topic };
}

export default function Topic({ loaderData }: Route.ComponentProps) {
  const { studySlug } = useParams();
  const { topic } = loaderData;

  if (!topic) {
    throw data({ message: "Topic does not exist." }, { status: 404 });
  }

  return (
    <div className="space-y-8 max-w-screen-xl mx-auto ">
      <div className="flex justify-between">
        <h1>{topic.name.toUpperCase()}</h1>

        {/* <Dialog action="delete" id={topic._id} topic={topic} /> */}
      </div>
      <div className="flex space-y-2 space-y-reverse flex-wrap py-8 border-y">
        {studySlug && topic.notes.length > 0
          ? topic.notes.map((note) => (
              <NoteLink
                key={note._id}
                studySlug={studySlug}
                topicSlug={topic.slug}
                note={note}
              />
            ))
          : null}
      </div>

      <Link
        className="block w-fit px-4 py-2 mt-4 rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
        to={{
          pathname: `/studies/${studySlug}/topic/${topic.slug}/new-note`,
        }}
      >
        Create a new note
      </Link>
    </div>
  );
}

export function NoteLink({
  studySlug,
  topicSlug,
  note,
}: {
  studySlug: string;
  topicSlug: string;
  note: INote;
}) {
  return (
    <Link
      className="mr-4"
      to={`/studies/${studySlug}/topic/${topicSlug}/${slug(note.name)}`}
    >
      <div className="border rounded-lg w-fit px-4 py-4 pt-2 hover:border-black duration-200 space-y-2">
        <h2 className="font-bold">{note.name}</h2>
        <p className="text-xs bg-slate-200 rounded-full py-1 px-3 w-fit ml-auto">
          {String(
            note.createdAt.toLocaleString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          )}
        </p>
      </div>
    </Link>
  );
}
