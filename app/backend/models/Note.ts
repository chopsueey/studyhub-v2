import type { BaseDocument } from "~/backend/types/mongoose";
import mongoose from "mongoose";

export interface QuillFormat {
  insert?: string;
  attributes?: { [key: string]: unknown };
  retain?: number;
  delete?: number;
}

export interface INote extends BaseDocument {
  name: string;
  slug: string;
  content: QuillFormat[];
}

export interface QuillEditorData {
  ops: QuillFormat[];
}

const DeltaJSONSchema = new mongoose.Schema<QuillFormat>(
  {
    insert: { type: String },
    attributes: { type: Map, of: mongoose.Schema.Types.Mixed },
    retain: { type: Number },
    delete: { type: Number },
  },
  { _id: false }
);

const ContentSchema = new mongoose.Schema<INote>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    content: {
      type: [DeltaJSONSchema],
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", ContentSchema);
