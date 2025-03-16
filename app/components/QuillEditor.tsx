import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import type { INote } from "~/backend/models/Note";
import { Form, useParams, useSubmit } from "react-router";

export default function QuillEditor({
  action,
  note,
}:
  | {
      action: "create";
      note?: INote;
    }
  | {
      action: "edit";
      note: INote;
    }) {
  const { studySlug, topicSlug, noteSlug } = useParams();
  const submit = useSubmit();

  const { quill, quillRef } = useQuill();

  if (action == "edit" && quill && note) {
    quill.setContents(note.content);
  }

  async function createNote(formData: FormData) {
    let requestBody;
    const name = formData.get("name");

    if (quill) {
      const content = JSON.stringify(quill.getContents());
      const backToObject = JSON.parse(content);
      backToObject.topicSlug = topicSlug;
      backToObject.name = name;
      requestBody = JSON.stringify(backToObject);

      await fetch(`/studies/${studySlug}/topic/${topicSlug}/create-note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
    }
  }

  async function patchNote() {
    if (quill && note) {
      const content = JSON.stringify(quill.getContents());
      const toObject = JSON.parse(content);
      toObject._id = note._id;

      const formData = new FormData();
      const updatedNoteAsString: string = JSON.stringify(toObject);
      formData.append("updatedNote", updatedNoteAsString);

      submit(formData, { method: "PATCH" }); // submit the formData to the current route -> triggers the action function on /edit-note
    }
  }

  useEffect(() => {
    if (action == "create" && quill) {
      quill.setText("Start your epic...");
    }
  });

  return (
    <>
      <div className="w-full space-y-4">
        <div className="border">
          <div ref={quillRef} />
        </div>
        {action == "create" && (
          // TODO: Trigger the action function on .../create-note path
          <Form
            method="POST"
            // action={`/studies/${studySlug}/topic/${topicSlug}/create-note`} should work automatically, as each Form is rendered only on the specific path
            className="space-y-2 flex flex-col w-fit"
          >
            <div className="space-x-2 w-fit p-2 bg-slate-200 rounded-lg">
              <label htmlFor="name">Title:</label>
              <input
                className="border rounded-lg p-1"
                name="name"
                type="text"
                required
                minLength={3}
                pattern="^(?=.*\S{3,}).*$"
              />
            </div>
            <button
              className="w-fit px-4 py-2 mt-4 rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
              type="submit"
            >
              Save
            </button>
          </Form>
        )}
        {action == "edit" && (
          <button
            onClick={patchNote}
            className="w-fit px-4 py-2 ml-auto mt-4 rounded-lg bg-green-500 text-white font-semibold shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-300"
          >
            Update
          </button>
        )}
      </div>
    </>
  );
}

// useEffect(() => {
//   if (quill) {
//     quill.on("text-change", (delta, oldDelta, source) => {
//       console.log(quill.getText());
//       console.log(quill.getContents());
//       // console.log(quill.root.innerHTML);
//       // console.log(quillRef.current.firstChild.innerHTML);
//     });
//   }
// }, [quill]);
