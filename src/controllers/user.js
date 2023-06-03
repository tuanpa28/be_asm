import User from "../models/user.js";

export const getUserProfile = async (req, res) => {
  try {
    const { _expand } = req.query;

    const populateOptions = _expand
      ? [
          {
            path: "cart.productId",
            select: "name price",
          },
        ]
      : [];

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

    const alreadyProduct = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (alreadyProduct) {
      const response = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Add to cart success!", updateUser: response });
    } else {
      const response = await User.findByIdAndUpdate(
        userId,
        {
          $push: { cart: { productId, quantity } },
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ message: "Add to cart success!", updateUser: response });
    }
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
