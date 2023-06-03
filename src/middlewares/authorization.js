export const authorization = async (req, res, next) => {
    try {
      const user = req.user;
      // Kiểm tra xem user có phải admin hay không
      if (!(user.role === "admin")) {
        return res.status(401).json({
          message: "Bạn không có quyền thực hiện chức năng này!",
        });
      }
      next();
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  };
  