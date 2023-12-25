const PDFDocument = require("pdfkit");

const generateInvoice = async (config) => {
  try {
    const { order, orderId, totalPrice } = config;
    const doc = new PDFDocument();

    // Subject: Invoice
    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("Invoice", { align: "center" })
      .moveDown(2);

    // Order ID, Date and User info
    doc
      .font("Helvetica")
      .fontSize(14)
      .text(`Order ID: #${orderId}`)
      .fontSize(14)
      .text(`Invoice date: ${new Date().toLocaleString()}`)
      .fontSize(14)
      .text(
        `Invoice to: ${order.user.lastName.toUpperCase()} ${
          order.user.firstName
        }`
      )
      .moveDown();

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

    // Subject: Your Order
    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .text("Your order", { align: "center" })
      .moveDown();

    // Products
    order.products.forEach((p, index) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(16)
        .text(`${index + 1}. ${p.product.title}`, {
          align: "left",
          indent: 40,
        })
        .font("Helvetica")
        .fontSize(12)
        .text(`Product ID: #${p.product._id}`, { align: "left", indent: 60 })
        .fontSize(12)
        .text(`Description: ${p.product.description}`, {
          align: "left",
          indent: 60,
        })
        .fontSize(12)
        .text(`Quantity: ${p.quantity}`, { align: "left", indent: 60 })
        .fontSize(12)
        .text(`Unit: $${p.product.price}`, {
          align: "left",
          indent: 60,
        })
        .fontSize(12)
        .text(`Total: $${p.product.price * p.quantity}`, {
          align: "left",
          indent: 60,
        })
        .moveDown();
    });

    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke().moveDown();

    // Total Price
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text(`Total Price: $${totalPrice}`, { align: "right" });

    return doc;
  } catch (err) {
    throw err;
  }
};

module.exports = generateInvoice;
