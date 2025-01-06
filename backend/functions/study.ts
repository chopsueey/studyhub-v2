import { type IStudy } from "../models/Study";
import Study from "../models/Study";

export async function getAllStudies() {
  try {
    const study: IStudy[] | null = await Study.find({}).lean<IStudy[]>(); // after chaining .lean(): study is not of type HydratedDocument anymore as it strips of the automatically added mongoose document

    return study;
  } catch (err) {
    console.error(err);
    throw new Error(`Ooops...There was an error on the server: ${err}`);
  }
}

export async function findStudyById(id: string) {
  try {
    const study: IStudy | null = await Study.findOne({
      _id: id,
    }).lean<IStudy>();

    return study;
  } catch (err) {
    console.error(err);
    throw new Error(`Ooops...There was an error on the server: ${err}`);
  }
}

export async function createStudy(formData: FormData) {
  const name = formData.get("name") as string;
  if (name.trim().length < 3) {
    throw new Error("Study name should be atleast 3 characters long.");
  }
  try {
    const study: IStudy = new Study({
      name: name,
    });

    await study.save();

    return;
  } catch (err) {
    console.log(err);
    throw new Error(`Ooops...There was an error on the server: ${err}`);
  }
}

export async function deleteStudy(id: string) {
  try {
    await Study.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error(`Ooops...There was an error on the server: ${err}`);
  }
  // TODO: call redirect("/"); in the action function
}
