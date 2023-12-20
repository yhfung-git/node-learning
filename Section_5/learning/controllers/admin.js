const Product = require("../models/product");
const User = require("../models/user");
const { handleValidationErrors } = require("../middleware/validation");
const errorHandler = require("../utils/error-handler");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render("admin/product-list", {
      pageTitle: "Admin Products",
      products: products,
      path: "/admin/product-list",
      productCSS: true,
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    editing: false,
    errorMessages: [],
    product: {},
  });
};

exports.postAddProduct = async (req, res, next) => {
  try {
    const { title, imageUrl, description, price } = req.body;

    if (!req.session.user && req.user.role !== "admin") {
      req.flash(
        "error",
        "Oops! It looks like you need admin privileges to access this page"
      );
      return res.redirect("/");
    }

    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "admin/add-product",
      "Add Product",
      "/admin/add-product",
      { editing: false }
    );

    if (!validationPassed) return;

    const newProduct = new Product({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
      userId: req.user._id,
    });

    const createdProduct = await newProduct.save();

    if (!createdProduct) {
      req.flash(
        "error",
        "Failed to add the product, please try again. If the issue persists, please contact us for assistance."
      );
      return res.redirect("/admin/add-product");
    }

    req.flash("success", "Product added successfully!");
    res.redirect("/admin/product-list");
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
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
      req.flash("error", "No product found");
      return res.redirect("/admin/product-list");
    }

    res.render("admin/edit-product", {
      pageTitle: `Edit ${product.title}`,
      path: "/admin/edit-product",
      formCSS: true,
      editing: editMode,
      product: product,
      errorMessages: [],
    });
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, imageUrl, description, price } = req.body;

    if (!req.session.user && req.user.role !== "admin") {
      req.flash(
        "error",
        "Oops! It looks like you need admin privileges to access this page"
      );
      return res.redirect("/");
    }

    // req, res, next, view, pageTitle, path, additionalOptions
    const validationPassed = await handleValidationErrors(
      req,
      res,
      next,
      "admin/edit-product",
      `Edit ${title}`,
      "/admin/edit-product",
      {
        editing: true,
        product: {
          title: title,
          imageUrl: imageUrl,
          description: description,
          price: price,
          _id: productId,
        },
      }
    );

    if (!validationPassed) return;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      req.flash(
        "error",
        "Failed to update the product, please try again. If the issue persists, please contact us for assistance."
      );
      return res.redirect(`/admin/edit-product/${productId}?edit=true`);
    }

    req.flash("success", "Product updated successfully!");
    res.redirect("/admin/product-list");
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;

    if (!req.session.user && req.user.role !== "admin") {
      req.flash(
        "error",
        "Oops! It looks like you need admin privileges to access this page"
      );
      return res.redirect("/");
    }

    const deletedProduct = await Product.findByIdAndDelete(prodId);

    if (!deletedProduct) {
      req.flash(
        "error",
        "Failed to delete the product, please try again. If the issue persists, please contact us for assistance."
      );
      return res.redirect("/admin/product-list");
    }

    // remove the product from all the users' cart
    await User.updateMany(
      { "cart.items.productId": prodId },
      { $pull: { "cart.items": { productId: prodId } } }
    );

    req.flash("success", "Product deleted successfully!");
    res.redirect("/admin/product-list");
  } catch (err) {
    // statusCode, errorMessage, next
    errorHandler(500, err, next);
  }
};
