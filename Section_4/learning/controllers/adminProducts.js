const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { id, title, imageUrl, description, price } = req.body;
  const product = new Product(id, title, imageUrl, description, price);
  product
    .save()
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findById(productId, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: `Edit ${product.title}`,
      path: "/admin/edit-product",
      formCSS: true,
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  );
  updatedProduct.save();
  res.redirect("/admin/product-list");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products]) => {
      res.render("admin/product-list", {
        pageTitle: "Admin Product List",
        products: products,
        path: "/admin/product-list",
        productCSS: true,
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId);
  res.redirect("/admin/product-list");
};
