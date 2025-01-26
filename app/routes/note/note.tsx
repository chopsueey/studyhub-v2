import { Pencil } from "lucide-react";
import { Link, useParams } from "react-router";
import Sidebar from "./Sidebar";
import NoteContent from "./NoteContent";
import { findNoteBySlug } from "~/backend/functions/note";
import type { Route } from "./+types/note";
import { promptAI } from "~/backend/functions/promptAI";

export async function loader({ params }: Route.LoaderArgs) {
  const note = await findNoteBySlug(params.noteSlug);
  return { note };
}

export async function action({ request, params }: Route.ActionArgs) {
  const note = await findNoteBySlug(params.noteSlug); // Is there a way to access the already loaded data from the loader function here? Instead of making another query?
  const noteContent = note.content;
  const formData = await request.formData();
  const option: number = Number(formData.get("option"));
  const response = await promptAI(option, noteContent);
  return response;
}

export default function Note({ loaderData, actionData }: Route.ComponentProps) {
  const { studySlug, topicSlug, noteSlug } = useParams();
  const { note } = loaderData;

  return (
    <div className="max-w-screen-md mx-auto p-8 border rounded-lg flex flex-col relative">
      <Sidebar />
      <div>
        <div className="flex flex-col justify-between border-b space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-5xl break-all">{note.name}</h1>
            <Link
              className="w-fit h-fit p-2 rounded-lg border hover:border-blue-600 inline-block shadow-sm hover:shadow-md transition-all duration-300"
              to={{
                pathname: `/studies/${studySlug}/topic/${topicSlug}/${noteSlug}/edit-note`,
              }}
            >
              <Pencil className="text-blue-600" />
            </Link>
          </div>
          <div className="mr-auto pb-4 flex space-x-2">
            <p className="text-xs bg-slate-200 rounded-full py-1 px-3 w-fit mt-auto ml-auto">
              {note.createdAt.toLocaleString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
            <p className="text-xs rounded-full py-1 px-3 w-fit mt-2 ml-auto">
              {note.updatedAt &&
                "Edited: " +
                  note.updatedAt?.toLocaleString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
            </p>
          </div>
        </div>

        <NoteContent note={note.content} />
      </div>

      {/* <Dialog action="delete" id={noteId} note={note.name} /> */}
    </div>
  );
}
