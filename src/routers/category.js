import { Router } from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.js";

import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

const router = Router();

// Lấy tất cả danh mục
router.get("/categories", getCategories);

// Lấy danh mục theo id
router.get("/categories/:id", getCategory);

// Thêm danh mục
router.post("/categories", authenticate, authorization ,createCategory);

// Sửa danh mục
router.put("/categories/:id", authenticate, authorization ,updateCategory);

// Xóa danh mục
router.delete("/categories/:id", authenticate, authorization ,deleteCategory);

export default router;
