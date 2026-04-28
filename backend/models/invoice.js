const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    code: String,
    name: String,
    price: Number,
    qty: Number,
    total: Number
});

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: String,
    customerName: {
        type: String,
        default: "عميل نقدي"
    },
    items: [itemSchema],
    subTotal: Number,
    tax: Number,
    discount: Number,
    grandTotal: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Invoice", invoiceSchema);