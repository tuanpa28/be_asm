import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { signupSchema, signinSchema } from "../schemas/auth.js";
import dotenv from "dotenv";
dotenv.config();


// signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details?.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Kiểm tra email tồn tại
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({
      message: "Đăng ký thành công!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// signin
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details?.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    // Kiểm tra email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu!" });
    }

    // Tạo Token từ server
    const accessToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: 60 * 60,
    });

    user.password = undefined;

    res.status(200).json({
      user,
      accessToken,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

/**
 * Bước 1: Nhận request từ client gửi lên
 * Bước 2: Kiểm tra cú pháp của request
 * Bước 3: Kiểm tra xem email đã tồn tại trong db chưa? nếu tồn tại thì trả về thông báo
 * Bước 4: So sánh mật khẩu từ client gửi lên với mật khẩu trong db
 * Bước 5: Nếu mật khẩu không khớp thì trả về thông báo
 * Bước 6: Tạo token và trả về client bao gồm thông tin user và token
 */
