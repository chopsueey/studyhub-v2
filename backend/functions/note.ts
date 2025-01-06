
import type { HydratedDocument } from "mongoose";
import type { INote, QuillEditorData } from "../models/Note";
import Note from "../models/Note";
import { Topic, type ITopic} from "../models/Topic";

export async function getAllNotes(id: string) {
  try {
    const topic: ITopic | null = await Topic.findById(id).populate("notes");

    if (topic == null) {
      throw new Error("Nothing found.");
    }

    return topic.notes as HydratedDocument<INote>[] | [];
    // const note: HydratedDocument<INote>[] = await Note.find({});
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function findNoteById(id: string) {
  try {
    const note: INote | null = await Note.findOne({
      _id: id,
    }).lean<INote>(); // after chaining .lean(): note is not of type HydratedDocument anymore as it strips of the automatically added mongoose document

    return note;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function findNoteByIdSerialized(id: string) {
  try {
    const note: INote | null = await Note.findOne({
      _id: id,
    }).lean<INote>(); // after chaining .lean(): note is not of type HydratedDocument anymore as it strips of the automatically added mongoose document

    if (note) {
      return {
        _id: id,
        name: note.name,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      };
    }

    return null;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function postNote(
  clientData: QuillEditorData & { topicId: string; name: string }
) {
  try {
    const note: HydratedDocument<INote> = new Note({
      name: clientData.name,
      content: clientData.ops,
    });

    await note.save();

    await Topic.findByIdAndUpdate(
      clientData.topicId,
      { $push: { notes: note._id } },
      { new: true }
    );

    return;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function patchNote(clientData: string) {
  const requestBody: QuillEditorData & { id: string } = await JSON.parse(
    clientData
  );

  try {
    await Note.findByIdAndUpdate(
      requestBody.id,
      { content: requestBody.ops },
      { new: true }
    );

    return;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function deleteNote(id: string) {
  try {
    await Note.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return;
  }
  // TODO: call redirect("/"); in the action function 
}
