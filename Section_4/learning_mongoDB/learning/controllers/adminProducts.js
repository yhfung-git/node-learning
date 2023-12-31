const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();

    res.render("admin/product-list", {
      pageTitle: "Admin Products",
      products: products,
      path: "/admin/product-list",
      productCSS: true,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    editing: false,
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, imageUrl, description, price } = req.body;
    const userId = req.user._id;

    const newProduct = new Product(title, imageUrl, description, price, userId);

    const createdProduct = await newProduct.save();

    if (!createdProduct) {
      console.log("Create Product Failed!");
      return res.redirect("/admin/add-product");
    }

    console.log("Product Created!");
    res.redirect("/admin/product-list");
  } catch (err) {
    console.error("Error creating/saving product:", err);
    // Handle the error appropriately (redirect to an error page, send an error response, etc.)
    // res.status(500).send("Internal Server Error");
  }
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      console.log("Not Edit Mode");
      return res.redirect("/admin/product-list");
    }

    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      console.log("Get Edit Product Failed!");
      return res.redirect("/admin/product-list");
    }

    res.render("admin/edit-product", {
      pageTitle: `Edit ${product.title}`,
      path: "/admin/edit-product",
      formCSS: true,
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, imageUrl, description, price } = req.body;
    const userId = req.user._id;

    const product = new Product(title, imageUrl, description, price, userId);

    const updatedProduct = await product.update(productId);

    if (!updatedProduct) {
      console.log("Update Product Failed!");
      return res.redirect("/admin/product-list");
    }

    console.log("Product Updated!");
    res.redirect("/admin/product-list");
  } catch (err) {
    console.log(err);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;

    const deletedProduct = await Product.destroy(productId);

    if (!deletedProduct) {
      console.log("Destroy Product Failed!");
      return res.redirect("/admin/product-list");
    }

    console.log("Product Destroyed!");
    res.redirect("/admin/product-list");
  } catch (err) {
    console.log(err);
  }
};
