const path = require("path");
const fs = require("fs");

const dirPath = require("../utils/path");
const productDataPath = path.join(dirPath, "data", "products.json");

const Cart = require("./cart");

const getProductFromFile = (cb) => {
  fs.readFile(productDataPath, (err, fileContent) => {
    if (err) {
      console.log(err);
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductFromFile((products) => {
      let updatedProductPrice = 0;
      if (this.id) {
        const existingProductIndex = products.findIndex((product) => {
          return product.id === this.id;
        });
        const updatedProducts = [...products];
        const newProductPrice = this.price;
        const oldProductPrice = updatedProducts[existingProductIndex].price;
        updatedProductPrice = +(newProductPrice - oldProductPrice);
        updatedProducts[existingProductIndex] = this;
        if (updatedProductPrice !== 0) {
          Cart.updateProductPrice(this.id, updatedProductPrice);
        }
        fs.writeFile(
          productDataPath,
          JSON.stringify(updatedProducts),
          (err) => {
            console.log(err);
          }
        );
      } else {
        this.id = Date.now().toString();
        products.push(this);
        fs.writeFile(productDataPath, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductFromFile(cb);
  }

  static findById(id, cb) {
    getProductFromFile((products) => {
      const product = products.find((product) => {
        return product.id === id;
      });
      cb(product);
    });
  }

  static deleteById(id) {
    getProductFromFile((products) => {
      const product = products.find((product) => {
        return product.id === id;
      });
      // Only keep the elements which return true
      const updatedProducts = products.filter((product) => {
        return product.id !== id;
      });
      fs.writeFile(productDataPath, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        } else {
          console.log(err);
        }
      });
    });
  }
};
