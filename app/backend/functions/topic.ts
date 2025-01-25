import { type HydratedDocument } from "mongoose";
import Topic, { type ITopic } from "../models/Topic";
import Study, { type IStudy } from "../models/Study";
import { data } from "react-router";

export async function getAllTopics(studySlug: string) {
  try {
    const study: IStudy | null = await Study.findOne({
      name: studySlug,
    })
      .populate("topics")
      .lean<IStudy>(); // always chain .lean(), if not it can lead to unexpected bugs

    if (study == null) {
      return null;
    }

    const topics = study.topics.map((topic) => ({
      ...topic,
      _id: topic._id.toString(),
    }));

    return topics;
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

// template for updating many documents
// export async function addSlugField() {
//   try {
//     const topics = await Topic.find({});

//     const bulkOps = topics.map((topic) => {
//       const slugged = slug(topic.name, {lower: true});
//       return {
//         updateOne: {
//           filter: { _id: topic._id },
//           update: { $set: { slug: slugged } },
//         },
//       };
//     });

//     if (bulkOps.length > 0) {
//       const result = await Topic.bulkWrite(bulkOps);
//       console.log(`Updated ${result.modifiedCount} documents with slug fields.`);
//     } else {
//       console.log("No documents found to update.");
//     }
//   } catch (error) {
//     console.error("Error adding slug field:", error);
//   }
// }

export async function findTopicBySlug(topicSlug: string) {
  try {
    const topic: ITopic | null = await Topic.findOne({
      slug: topicSlug,
    })
      .lean<ITopic>() // after chaining .lean(): topic is not of type HydratedDocument anymore as it strips of the automatically added mongoose document
      .populate("notes");

    if (!topic) {
      throw data({ message: "Topic not found" }, { status: 404 });
    }

    topic.notes = topic.notes.map((note) => ({
      ...note,
      _id: note._id.toString(),
    }));

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
      // TODO: Add slugified name to slug field. Slugs should be unique too.
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
