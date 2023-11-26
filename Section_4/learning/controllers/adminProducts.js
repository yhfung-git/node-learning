const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/product-list", {
        pageTitle: "Admin Products",
        products: products,
        path: "/admin/product-list",
        productCSS: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formCSS: true,
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  Product.create({
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
  })
    .then((result) => {
      console.log("Product Created!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const productId = req.params.productId;
  Product.findByPk(productId)
    .then((product) => {
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
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  const { productId, title, imageUrl, description, price } = req.body;
  try {
    await Product.update(
      {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
      },
      { where: { id: productId } }
    );
    console.log("Product Updated!");
    res.redirect("/admin/product-list");
  } catch (err) {
    console.log(err);
  }
  // An alternative way to update

  // Product.findByPk(productId)
  //   .then((product) => {
  //     (product.title = title),
  //       (product.imageUrl = imageUrl),
  //       (product.description = description),
  //       (product.price = price);
  //     return product.save();
  //   })
  //   .then((result) => {
  //     console.log("Product Updated!");
  //     res.redirect("/admin/product-list");
  //   })
  //   .catch((err) => console.log(err));
};

exports.postDeleteProduct = async (req, res, next) => {
  const productId = req.body.productId;
  try {
    await Product.destroy({ where: { id: productId } });
    console.log("Product Destroyed!");
    res.redirect("/admin/product-list");
  } catch (err) {
    console.log(err);
  }
  // An alternative way to delete

  // Product.findByPk(productId)
  //   .then((product) => {
  //     return product.destroy();
  //   })
  //   .then((result) => {
  //     console.log("Product Destroyed!");
  //     res.redirect("/admin/product-list");
  //   })
  //   .catch((err) => console.log(err));
};
