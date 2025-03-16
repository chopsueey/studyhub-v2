import { findNoteBySlug, patchNote } from "~/backend/functions/note";
import type { Route } from "./+types/edit-note";
import QuillEditor from "~/components/QuillEditor";
import { redirect } from "react-router";

export async function loader({ params }: Route.LoaderArgs) {
  const note = await findNoteBySlug(params.noteSlug);
  note._id = note._id.toString(); // convert to string, because the Mongoose-ObjectId does not exist in JSON (it will create a buffer, we do not want that)
  return { note };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { studySlug, topicSlug, noteSlug } = params;
  const formData = await request.formData();
  const updatedNote = formData.get("updatedNote");
  // const topic = await findTopicBySlug(params.topicSlug);

  if (updatedNote && typeof updatedNote == "string") { // FormData entries can also be files, so need to check for type string to make typescript happy
    const response = await patchNote(updatedNote);
  } else {
    console.log("@: edit-note.tsx > FormDataEntryValue is a file.")
  }
  return redirect(`/studies/${studySlug}/topic/${topicSlug}/${noteSlug}`); // you have to return the redirect function for it to work
}

export default function EditNote({ loaderData }: Route.ComponentProps) {
  const { note } = loaderData;

  if (!note) {
    return (
      <div>
        <h1>This note does not exist anymore.</h1>
      </div>
    );
  }
  return (
    <div className="max-w-screen-md m-auto flex justify-center">
      <QuillEditor action="edit" note={note} />
    </div>
  );
}
