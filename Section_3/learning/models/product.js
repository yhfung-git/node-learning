const path = require("path");
const fs = require("fs");

const dirPath = require("../utils/path");
const productDataPath = path.join(dirPath, "data", "products.json");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    let products = [];
    fs.readFile(productDataPath, (err, fileContent) => {
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(productDataPath, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    fs.readFile(productDataPath, (err, fileContent) => {
      if (err) {
        console.log(err);
        return cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
