import Category from "../models/category.js";
import { cateSchema } from "../schemas/category.js";

// Lấy tất cả danh mục
export const getCategories = async (req, res) => {
  try {
    const {
      _page = 1,
      _limit = 10,
      _sort = "createdAt",
      _order = "asc",
      _embed,
      _searchText,
    } = req.query;

    const query = _searchText
      ? {
          $text: {
            $search: _searchText,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        }
      : {};

    const myCustomLabels = {
      docs: "data",
    };

    const options = {
      page: _page,
      limit: _limit,
      sort: {
        [_sort]: _order === "desc" ? -1 : 1,
      },
      customLabels: myCustomLabels,
    };

    const populateOptions = _embed
      ? [{ path: "productId", select: "name" }]
      : [];

    const categories = await Category.paginate(query, {
      ...options,
      populate: populateOptions,
    });

    if (categories.length === 0) {
      return res.status(404).json({ message: "Không có danh mục nào!" });
    }

    return res.json({
      message: "Lấy danh sách danh mục thành công!",
      categories,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Lấy danh mục theo id
export const getCategory = async (req, res) => {
  try {
    const { _embed } = req.query;

    const populateOptions = _embed
      ? [
          {
            path: "productId",
            select: "name",
            // populate: { path: "categoryId", select: "name" },
          },
        ]
      : [];

    const category = await Category.findById(req.params.id).populate(
      populateOptions
    );

    if (!category) {
      return res.status(404).json({ message: "Không có danh mục nào!" });
    }

    return res.json({
      message: "Lấy danh mục thành công!",
      category,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Thêm danh mục
export const createCategory = async (req, res) => {
  try {
    const { error } = cateSchema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ errors });
    }

    const category = await Category.create(req.body);

    if (!category) {
      return res.status(400).json({ message: "Thêm danh mục thất bại!" });
    }

    return res.json({ message: "Thêm danh mục thành công!", category });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Sửa danh mục
export const updateCategory = async (req, res) => {
  try {
    const { error } = cateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ errors });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!category) {
      return res.status(400).json({ message: "Sửa danh thất mục bại!" });
    }

    return res.json({ message: "Sửa danh mục thành công!", category });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(400).json({ message: "Xóa danh mục thất bại!" });
    }

    return res.json({ message: "Xóa danh mục thành công!", category });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
