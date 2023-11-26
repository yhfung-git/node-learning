const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Product = sequelize.define("product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
});

module.exports = Product;

// const db = require("../utils/database");

// const Cart = require("./cart");

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?)",
//       [this.title, this.imageUrl, this.description, this.price]
//     );
//   }

// save() {
//   getProductFromFile((products) => {
//     let updatedProductPrice = 0;
//     if (this.id) {
//       const existingProductIndex = products.findIndex((product) => {
//         return product.id === this.id;
//       });
//       const updatedProducts = [...products];
//       const newProductPrice = this.price;
//       const oldProductPrice = updatedProducts[existingProductIndex].price;
//       updatedProductPrice = +(newProductPrice - oldProductPrice);
//       updatedProducts[existingProductIndex] = this;
//       if (updatedProductPrice !== 0) {
//         Cart.updateProductPrice(this.id, updatedProductPrice);
//       }
//       fs.writeFile(
//         productDataPath,
//         JSON.stringify(updatedProducts),
//         (err) => {
//           console.log(err);
//         }
//       );
//     } else {
//       this.id = Date.now().toString();
//       products.push(this);
//       fs.writeFile(productDataPath, JSON.stringify(products), (err) => {
//         console.log(err);
//       });
//     }
//   });
// }

//   static fetchAll() {
//     return db.execute("SELECT * FROM products");
//   }

//   static findById(id) {
//     return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
//   }

//   static deleteById(id) {
//     getProductFromFile((products) => {
//       const product = products.find((product) => {
//         return product.id === id;
//       });
//       // Only keep the elements which return true
//       const updatedProducts = products.filter((product) => {
//         return product.id !== id;
//       });
//       fs.writeFile(productDataPath, JSON.stringify(updatedProducts), (err) => {
//         if (!err) {
//           Cart.deleteProduct(id, product.price);
//         } else {
//           console.log(err);
//         }
//       });
//     });
//   }
// };
