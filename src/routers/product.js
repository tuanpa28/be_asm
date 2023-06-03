import { Router } from "express";
import {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
} from "../controllers/product.js";

import { authenticate } from "../middlewares/authenticate.js";
import { authorization } from "../middlewares/authorization.js";

const router = Router();

// Lấy tất cả sản phẩm
router.get("/products", getProducts);

// Lấy sản phẩm theo id
router.get("/products/:id", getProduct);

// Thêm sản phẩm
router.post("/products", authenticate, authorization ,addProduct);

// Sửa sản phẩm
router.put("/products/:id", authenticate, authorization ,editProduct);

// Xóa sản phẩm
router.delete("/products/:id", authenticate, authorization ,deleteProduct);

export default router;
