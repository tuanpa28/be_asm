import { Router } from "express";
import multer from "multer";
import { uploadImage, updateImage, deleteImage } from "../controllers/upload.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "node_react",
    // format: "png",
  },
});

const upload = multer({ storage });

router.post("/images/upload", upload.array("image", 5), uploadImage);
router.put("/images/:publicId", upload.array("image", 5), updateImage);
router.delete("/images/:publicId", deleteImage);

export default router;
