const path = require("path");
const fs = require("fs");

const dirPath = require("../utils/path");
const productDataPath = path.join(dirPath, "data", "products.json");

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
      if (this.id) {
        const existingProductIndex = products.findIndex((product) => {
          return product.id === this.id;
        });
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
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
};
