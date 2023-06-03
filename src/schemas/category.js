import Joi from "joi";

export const cateSchema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().required(),
  productId: Joi.array(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});
