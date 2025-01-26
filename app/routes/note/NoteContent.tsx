import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { useState } from "react";
import type { QuillFormat } from "~/backend/models/Note";
import ReactMarkDown from "react-markdown";

export default function NoteContent({ note }: { note: QuillFormat[] }) {
  const [format, setFormat] = useState("quill-to-html");

  const converter = new QuillDeltaToHtmlConverter(note, {
    encodeHtml: true,
    inlineStyles: {
      size: {
        small: "font-size: 0.75em;",
        large: "font-size: 1.5em;",
        huge: "font-size: 2.5em;",
      },
    },
  });

  // Format for QuillDeltaToHtmlConverter should look like this:
  // const deltaOps = [
  //   { insert: "This is my " },
  //   { attributes: { color: "#ff9900", bold: true }, insert: "cool" },
  //   { insert: " text!!!11\n" },
  // ];

  const html = converter.convert();

  function deltaToPlainText(delta: QuillFormat[]) {
    let plainText = "";
    if (Array.isArray(delta)) {
      delta.forEach((op) => {
        if (typeof op.insert === "string") {
          plainText += op.insert;
        }
      });
    } else if (typeof delta === "string") {
      plainText = delta;
    }
    return plainText;
  }

  return (
    <>
      <div className="flex justify-between items-center p-2 border-b">
        <p>Format:</p>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => setFormat("quill-to-html")}
            className={`w-fit p-2 border rounded-lg hover:border-gray-400 transition-all duration-300 ${
              format == "quill-to-html" ? "border-gray-400 shadow-md" : ""
            }`}
          >
            Quill-to-HTML
          </button>
          <button
            type="button"
            onClick={() => setFormat("md")}
            className={`w-fit p-2 border rounded-lg hover:border-gray-400 transition-all duration-300 ${
              format == "md" ? "border-gray-400 shadow-md" : ""
            }`}
          >
            md
          </button>
          <button
            type="button"
            onClick={() => setFormat("raw")}
            className={`w-fit p-2 border rounded-lg hover:border-gray-400 transition-all duration-300 ${
              format == "raw" ? "border-gray-400 shadow-md" : ""
            }`}
          >
            raw
          </button>
        </div>
      </div>

      {format == "quill-to-html" && (
        <div
          className={"note-body p-8 break-words"}
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      )}

      {format == "md" && (
        <div className={"note-body p-8 break-words"}>
          <ReactMarkDown>{deltaToPlainText(note)}</ReactMarkDown>
        </div>
      )}

      {format == "raw" && (
        <div className={"note-body p-8 break-words"}>
          {deltaToPlainText(note)}
        </div>
      )}
    </>
  );
}