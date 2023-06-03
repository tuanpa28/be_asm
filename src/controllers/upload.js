import cloudinary from "../config/cloudinary.js";

// Thêm ảnh
export const uploadImage = async (req, res) => {
  const files = req.files

  if (!Array.isArray(files)) {
    return res.status(400).json({ error: "No files were uploaded!" });
  }

  try {
    const uploadPromises = files?.map((file) => {
      // Sử dụng cloudinary api để upload file lên cloudinary
      return cloudinary.uploader.upload(file.path);
    });

    // Chờ cho tất cả các file đều được upload lên cloudinary
    const results = await Promise.all(uploadPromises);

    // Trả về kết quả một mảng các đối tượng chứa thông tin các file đã upload lên cloudinary
    const uploadedFiles = results.map((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
    }));

    return res.json({ urls: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Sửa ảnh
export const updateImage = async (req, res) => {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Error updating image" });
  }
};

// Xóa ảnh
export const deleteImage = async (req, res) => {
  const publicId = req.params.publicId;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return res.status(200).json({ message: "Xóa thành công!", result });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Error deleting image" });
  }
};
