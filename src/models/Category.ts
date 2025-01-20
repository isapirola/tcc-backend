import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  userId: mongoose.Schema.Types.ObjectId;
}

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
