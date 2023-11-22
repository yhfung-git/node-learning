const path = require("path");
const fs = require("fs");

const dirPath = require("../utils/path");
const cartDataPath = path.join(dirPath, "data", "carts.json");

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Read the previous cart data from the file
    fs.readFile(cartDataPath, (err, fileContent) => {
      // Initializing an empty cart with default values
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyzing the cart => Finding the index of the existing product and getting the existing product based on the index
      const existingProductIndex = cart.products.findIndex((product) => {
        return product.id === id;
      });
      const existingProduct = cart.products[existingProductIndex];
      // Initializing a variable to store the updated product
      let updatedProduct;
      // Add new product / Update existing product
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty += 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      // Updating the total price of the cart by adding the product price
      cart.totalPrice += +productPrice;
      // Writing the updated cart back to the file
      fs.writeFile(cartDataPath, JSON.stringify(cart), (err) => {
        // Logging an error if there is any
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(cartDataPath, (err, fileContent) => {
      if (err) {
        return;
      }
      const cartProducts = { ...JSON.parse(fileContent) };
      const product = cartProducts.products.find((product) => {
        return product.id === id || null;
      });
      if (product == null) {
        return;
      }
      const productQty = product.qty;
      cartProducts.products = cartProducts.products.filter((product) => {
        return product.id !== id;
      });
      cartProducts.totalPrice -= +(productPrice * productQty).toFixed(2);
      fs.writeFile(cartDataPath, JSON.stringify(cartProducts), (err) => {
        console.log(err);
      });
    });
  }

  static updateProductPrice(id, productPrice) {
    fs.readFile(cartDataPath, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart = { ...JSON.parse(fileContent) };
      const cartProductIndex = cart.products.findIndex((product) => {
        return product.id === id;
      });
      const cartProduct = cart.products[cartProductIndex];
      if (cartProduct) {
        const productQty = cartProduct.qty;
        cart.totalPrice += +(productPrice * productQty).toFixed(2);
        fs.writeFile(cartDataPath, JSON.stringify(cart), (err) => {
          console.log(err);
        });
      }
    });
  }

  static getCart(cb) {
    fs.readFile(cartDataPath, (err, fileContent) => {
      const cart = JSON.parse(fileContent);
      err ? cb(null) : cb(cart);
    });
  }
};
