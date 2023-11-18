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
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductFromFile((products) => {
      products.push(this);
      fs.writeFile(productDataPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    getProductFromFile(cb);
  }
};
