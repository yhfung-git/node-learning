const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await req.user.getProducts();

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

    await req.user.createProduct({
      title: title,
      imageUrl: imageUrl,
      description: description,
      price: price,
    });

    console.log("Product Created!");
    res.redirect("/admin/product-list");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res, next) => {
  // Find only the products of the current logged-in user, product.userId === req.user.id
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }

    const productId = req.params.productId;
    const products = await req.user.getProducts({ where: { id: productId } });
    const product = products[0];
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
  } catch (err) {
    console.log(err);
  }
  // An alternative way to get Edit

  // Product.findByPk(productId)
  //   .then((product) => {
  //     if (!product) {
  //       return res.redirect("/");
  //     }
  //     res.render("admin/edit-product", {
  //       pageTitle: `Edit ${product.title}`,
  //       path: "/admin/edit-product",
  //       formCSS: true,
  //       editing: editMode,
  //       product: product,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postEditProduct = async (req, res, next) => {
  try {
    const { productId, title, imageUrl, description, price } = req.body;

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
  try {
    const productId = req.body.productId;

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
