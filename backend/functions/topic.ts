import { type HydratedDocument } from "mongoose";
import { type ITopic, Topic } from "../models/Topic";
import { type IStudy, Study } from "../models/Study";

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
    return [];
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
    return undefined;
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
    console.log(err);
    return undefined;
  }
}

export async function deleteTopic(id: string) {
  const study = await Study.findOne({ topics: id });
  try {
    await Topic.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    return;
  }
  // TODO: redirect(`/${study.name}?id=${study._id}`);
}
