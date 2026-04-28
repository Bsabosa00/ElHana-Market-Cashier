const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoice");

// 🟢 create invoice
router.post("/", async (req, res) => {
    try {
        const invoice = new Invoice(req.body);
        await invoice.save();
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟢 get all invoices
router.get("/", async (req, res) => {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
});

// 🔴 delete
router.delete("/:id", async (req, res) => {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;