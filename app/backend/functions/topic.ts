import { type HydratedDocument } from "mongoose";
import { type ITopic, Topic } from "../models/Topic";
import Study, { type IStudy } from "../models/Study";
import { data } from "react-router";

export async function getAllTopics(id: string) {
  try {
    const study: IStudy | null = await Study.findById(id).populate("topics");

    if (study == null) {
      throw new Error("Nothing found.");
    }
    // const topic: HydratedDocument<ITopic>[] = await Topic.find({});

    return study.topics as HydratedDocument<ITopic>[] | [];
  } catch (err) {
    console.error(err);
    throw data(
      {
        message: "Couldn't get all topics.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function findTopicById(id: string) {
  try {
    const topic: ITopic | null = await Topic.findOne({
      _id: id,
    }).lean<ITopic>(); // after chaining .lean(): topic is not of type HydratedDocument anymore as it strips of the automatically added mongoose document

    return topic;
  } catch (err) {
    console.error(err);
    throw data(
      {
        message: "Couldn't find specific topic.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function createTopic(
  formData: FormData,
  param: string,
  id: string
) {
  try {
    const topic: HydratedDocument<ITopic> = new Topic({
      name: formData.get("name"),
    });

    await topic.save();

    await Study.findByIdAndUpdate(
      id,
      { $push: { topics: topic._id } },
      { new: true }
    );
  } catch (err) {
    console.error(err);
    throw data(
      {
        message: "Couldn't create topic.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function deleteTopic(id: string) {
  const study = await Study.findOne({ topics: id });
  try {
    await Topic.findByIdAndDelete(id);
  } catch (err) {
    console.error(err);
    throw data(
      {
        message: "Couldn't delete topic.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
  // TODO: redirect(`/${study.name}?id=${study._id}`);
}
