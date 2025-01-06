import type { Document, Types } from "mongoose";

// Model interfaces should not directly extend the mongoose Document type, because it can lead to errors in queries,
// so I create a BaseDocument for basic properties to work with for TypeScript
export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
