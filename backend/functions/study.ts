import type { HydratedDocument } from "mongoose";
import { type IStudy, Study } from "../models/Study";

export async function getAllStudies() {
  try {
    const study: HydratedDocument<IStudy>[] = await Study.find({});

    return study;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function findStudyById(id: string) {
  try {
    const study: IStudy | null = await Study.findOne({
      _id: id,
    }).lean<IStudy>(); // after chaining .lean(): study is not of type HydratedDocument anymore as it strips of the automatically added mongoose document

    return study;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

export async function createStudy(formData: FormData) {
  const name = formData.get("name") as string;
  if (name.trim().length < 3) {
    throw new Error("Study name should be atleast 3 characters long.");
  }
  try {
    const study: HydratedDocument<IStudy> = new Study({
      name: name,
    });

    await study.save();

    return;
  } catch (err) {
    console.log(err);
    return undefined;
  }
}

export async function deleteStudy(id: string) {
  try {
    await Study.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return;
  }
  // TODO: call redirect("/"); in the action function 
}
