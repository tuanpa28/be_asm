import { Schema, model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Product = new Schema(
  {
    name: { type: String, required: true, text: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: Object, required: true },
    description: { type: String, required: true },
    categoryId: { type: Types.ObjectId, ref: "Category", required: true },
    comments: [
      {
        userId: { type: Types.ObjectId, ref: "User" },
        description: String,
      },
    ],
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

Product.index({ name: "text" }); // đăng ký chỉ mục văn bản
Product.plugin(mongoosePaginate);

export default model("Product", Product);
