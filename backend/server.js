const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ ربط الفولدر public
app.use(express.static("../public"));

// ✅ هنا بقى نحط الكود بتاعك 👇
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/../public/index.html");
});

// routes
app.use("/api/invoices", require("./routes/invoiceRoutes"));

// اتصال الداتابيز
mongoose.connect("mongodb://127.0.0.1:27017/cashierDB")
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

// تشغيل السيرفر
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});