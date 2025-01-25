import mongoose from "mongoose";
import type { INote } from "./Note";
import type { BaseDocument } from "~/backend/types/mongoose";

export interface ITopic extends BaseDocument {
  name: string;
  slug: string;
  notes: INote[];
}

const TopicSchema = new mongoose.Schema<ITopic>({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

export default mongoose.models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
