import Product from "../models/product.js";
import Category from "../models/category.js";
import { proSchema } from "../schemas/product.js";

// Lấy tất cả sản phẩm
export const getProducts = async (req, res) => {
  try {
    const {
      _page = 1,
      _limit = 12,
      _sort = "createdAt",
      _order = "asc",
      _expand,
      _searchText,
      _minPrice,
      _maxPrice,
    } = req.query;

    let query = {};
    if (_searchText) {
      query = {
        $text: {
          $search: _searchText,
          $caseSensitive: false,
          $diacriticSensitive: false,
        },
      };
    } else if (_minPrice && _maxPrice) {
      query = {
        price: { $gte: _minPrice, $lte: _maxPrice },
      };
    }

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

    const populateOptions = _expand
      ? [{ path: "categoryId", select: "name" }]
      : [];

    const products = await Product.paginate(query, {
      ...options,
      populate: populateOptions,
    });

    if (products.length === 0)
      return res.status(404).json({ message: "Không có sản phẩm nào!" });

    return res.json({
      message: "Lấy danh sách sản phẩm thành công!",
      products,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Lấy sản phẩm theo id
export const getProduct = async (req, res) => {
  try {
    const { _expand } = req.query;

    const populateOptions = _expand
      ? [
          {
            path: "categoryId",
            select: "name",
            // populate: { path: "productId", select: "name" },
          },
        ]
      : [];

    const product = await Product.findById(req.params.id).populate(
      populateOptions
    );

    if (!product) return res.json({ message: "Không tìm thấy sản phẩm!" });

    return res.json({
      message: "Lấy sản phẩm thành công!",
      product,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Thêm sản phẩm
export const addProduct = async (req, res) => {
  try {
    const { error } = proSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ errors });
    }

    const product = await Product.create(req.body);
    await Category.findByIdAndUpdate(product.categoryId, {
      $addToSet: { productId: product._id },
    });

    if (!product) return res.json({ message: "Thêm sản phẩm thất bại!" });

    return res.json({ message: "Thêm sản phẩm thành công!", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Sửa sản phẩm
export const editProduct = async (req, res) => {
  try {
    const { error } = proSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({ errors });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body);

    if (!product) return res.json({ message: "Sửa sản phẩm thất bại!" });

    await Category.findByIdAndUpdate(product?.categoryId, {
      $pull: { productId: product?._id },
    });
    await Category.findByIdAndUpdate(req.body.categoryId, {
      $addToSet: { productId: req.body._id },
    });
    const newProduct = await Product.findById(product?._id);

    return res.json({
      message: "Sửa sản phẩm thành công!",
      product: newProduct,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(400).json({ message: "Xóa sản phẩm thất bại!" });

    await Category.findByIdAndUpdate(product?.categoryId, {
      $pull: { productId: product?._id },
    });

    return res.json({ message: "Xóa sản phẩm thành công!", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
