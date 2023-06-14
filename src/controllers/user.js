import User from "../models/user.js";
import Product from "../models/product.js";
export const getUserProfile = async (req, res) => {
  try {
    const populateOptions = [
      {
        path: "cart.productId",
        select: "name price image",
      },
    ];

    const user = await User.findById(req.user._id).populate(populateOptions);

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin người dùng" });
    }

    return res
      .status(200)
      .json({ message: "Lấy thông tin người dùng thành công!", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userDate = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, userDate, {
      new: true,
    });

    return res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công!",
      updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cập nhật tài khoản thất bại!", error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      throw new Error("Missing inputs");
    }

    const user = await User.findById(userId).select("cart");

    const alreadyProductIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (alreadyProductIndex !== -1) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, cộng dồn số lượng
      user.cart[alreadyProductIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới
      user.cart.push({ productId, quantity });
    }

    const response = await user.save();

    return res
      .status(200)
      .json({ message: "Add to cart success!", updateUser: response });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;

    const user = await User.findById(userId).select("cart");

    const newCart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    const response = await User.findByIdAndUpdate(
      userId,
      { cart: newCart },
      { new: true }
    );
    return res.status(200).json({
      message: "Remove product in cart success!",
      updateUser: response,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const comment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, description } = req.body;

    const product = await Product.findById(productId);
    console.log(product)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.comments.push({ userId, description });

    await product.save();

    return res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};