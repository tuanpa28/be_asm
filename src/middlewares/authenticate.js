import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
dotenv.config();

export const authenticate = async (req, res, next) => {
  try {
    // Kiểm tra có thông tin token không
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Bạn phải đăng nhập để thực hiện hành động này!",
      });
    }

    // Lấy mã token
    const token = req.headers.authorization.split(" ")[1];

    const { _id } = jwt.verify(token, process.env.SECRET_KEY);
    // Tìm user từ id
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({
        message: "Tài khoản không hợp lệ!",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token đã hết hạn!" });
    }

    return res.status(401).json({ message: error.message });
  }
};
