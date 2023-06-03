import { Schema, model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const Category = new Schema(
  {
    name: { type: String, required: true },
    productId: [{ type: Types.ObjectId, ref: "Product", required: true }],
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

Category.index({ name: "text" }); // đăng ký chỉ mục văn bản
Category.plugin(mongoosePaginate);

// Trước khi xóa category, cập nhật lại categoryId của các sản phẩm thuộc category này thành uncategory
Category.pre("findOneAndDelete", async function (next) {
  try {
    // Lấy model Product từ biến đã import
    const Product = model("Product");
    const filter = this.getFilter(); // Lấy điều kiện tìm kiếm hiện tại của truy vấn
    const categoryId = this.getQuery().$set?.categoryId; // Lấy giá trị mới của trường categoryId nếu có
    const update = {
      categoryId: categoryId ?? "uncategorized", // Cập nhật categoryId mới hoặc "uncategorized" nếu không có giá trị mới
    };

    await Product.updateMany(
      {
        categoryId: filter._id, // Tìm các sản phẩm cùng categoryId
      },
      update // Cập nhật categoryId mới
    );

    next();
  } catch (err) {
    next(err);
  }
});

export default model("Category", Category);
