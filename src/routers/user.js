import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import {
  getUserProfile,
  updateUserProfile,
  updateCart,
  deleteCart,
} from "../controllers/user.js";

const router = Router();

router.get("/user/profile", authenticate, getUserProfile);
router.put("/user/update", authenticate, updateUserProfile);
router.put("/cart", authenticate, updateCart);
router.delete("/cart/:id", authenticate, deleteCart);

export default router;
