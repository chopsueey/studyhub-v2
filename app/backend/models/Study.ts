import mongoose from "mongoose";
import type { ITopic } from "./Topic";
import type { BaseDocument } from "~/backend/types/mongoose";

export interface IStudy extends BaseDocument {
  name: string;
  topics: ITopic[];
}

const StudySchema = new mongoose.Schema<IStudy>({
  name: {
    type: String,
    required: true,
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
});

export default mongoose.models.Study || mongoose.model<IStudy>("Study", StudySchema);
