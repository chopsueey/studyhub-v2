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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value);
  };

  return (
    <>
      <div className="flex justify-end pt-2">
        <select
          name="format-selector"
          id="format-selector"
          value={format}
          onChange={handleSelectChange}
          className="w-fit p-1 border rounded-lg hover:border-gray-400 transition-all duration-300 cursor-pointer"
        >
          <option value="quill-to-html">Quill-to-HTML</option>
          <option value="markdown">Markdown</option>
          <option value="raw">Raw</option>
        </select>
      </div>

      {format == "quill-to-html" && (
        <div
          className="note-body py-2 break-words"
          dangerouslySetInnerHTML={{ __html: html }}
        ></div>
      )}

      {format == "markdown" && (
        <div className="note-body py-2 break-words">
          <ReactMarkDown>{deltaToPlainText(note)}</ReactMarkDown>
        </div>
      )}

      {format == "raw" && (
        <div className="note-body py-2 break-words">
          {deltaToPlainText(note)}
        </div>
      )}
    </>
  );
}
