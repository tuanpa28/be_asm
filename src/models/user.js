import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, minLength: 4, maxLength: 255 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cart: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    role: {
      type: String,
      default: "member",
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { timestamps: true, versionKey: false }
);

export default model("User", userSchema);
