import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().required().min(4).messages({
    "string.min": "Name phải có ít nhất {#limit} ký tự!",
    "string.empty": "Name không được để trống!",
    "any.required": "Trường name là bắt buộc!",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống!",
    "string.email": "Email không đúng định dạng!",
    "any.required": "Trường email là bắt buộc!",
  }),
  password: Joi.string().required().min(6).messages({
    "string.min": "Password phải có ít nhất {#limit} ký tự!",
    "string.empty": "Password không được để trống!",
    "any.required": "Trường password là bắt buộc!",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password không khớp!",
    "any.required": "Trường confirm password là bắt buộc!",
  }),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email không được để trống!",
    "string.email": "Email không đúng định dạng!",
    "any.required": "Trường email là bắt buộc!",
  }),
  password: Joi.string().required().min(6).messages({
    "string.min": "Password phải có ít nhất {#limit} ký tự!",
    "string.empty": "Password không được để trống!",
    "any.required": "Trường password là bắt buộc!",
  }),
});
