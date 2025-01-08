import { data } from "react-router";
import { type IStudy } from "../models/Study";
import Study from "../models/Study";

export async function getAllStudies() {
  try {
    const study: IStudy[] | null = await Study.find({}).lean<IStudy[]>(); // after chaining .lean(): study is not of type HydratedDocument anymore as it strips of the automatically added mongoose document

    return study;
  } catch (err) {
    console.error(err);
    throw data(
      {
        message: "Couldn't get all studies.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function findStudyById(id: string) {
  try {
    const study: IStudy | null = await Study.findOne({
      _id: id,
    }).lean<IStudy>();

    if (!study) {
      throw data({ message: "Study not found" }, { status: 404 });
    }

    return study;
  } catch (err) {
    console.error(err);
    throw data(
      {
        message: "Couldn't find specific study.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function createStudy(formData: FormData) {
  const name = formData.get("name") as string;
  if (name.trim().length < 3) {
    throw data(
      {
        message: "Study name should be atleast 3 characters long.",
      },
      { status: 422 }
    );
  }

  try {
    const study: IStudy = new Study({
      name: name,
    });
    await study.save();

    return;
  } catch (err) {
    console.log(err);
    throw data(
      {
        message: "Couldn't create study.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function deleteStudy(id: string) {
  try {
    const study = await Study.findByIdAndDelete(id);

    if (!study) {
      throw data({ message: "Study not found" }, { status: 404 });
    }

    return;
  } catch (err) {
    console.log(err);
    throw data(
      {
        message: "Couldn't delete study.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
  // TODO: call redirect("/"); in the action function
}
