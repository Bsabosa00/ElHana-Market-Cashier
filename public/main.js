window.onload = function () {

    // ✅ التاريخ
    document.getElementById("date").innerText =
    new Date().toLocaleDateString("ar-EG") + " " +
    new Date().toLocaleTimeString("ar-EG");

    // ✅ رقم الفاتورة
    document.getElementById("invoiceNumber").innerText =
    "INV-" + Math.floor(Math.random() * 100000);

    // ✅ تحميل الداتا القديمة
    const savedData = localStorage.getItem("invoiceData");

    if (savedData) {
        document.getElementById("billBody").innerHTML = savedData;
    }

    updateTotals();
};

function collectInvoice() {
    const rows = document.querySelectorAll("#billBody tr");

    let items = [];
    let subTotal = 0;

    rows.forEach(row => {
        const item = {
            code: row.cells[0].innerText,
            name: row.cells[1].innerText,
            qty: parseFloat(row.cells[2].innerText),
            price: parseFloat(row.cells[3].innerText.replace(/[^\d.]/g, "")),
            total: parseFloat(row.cells[4].innerText.replace(/[^\d.]/g, ""))
        };

        subTotal += item.total;
        items.push(item);
    });

    const tax = subTotal * 0.14;
    const discount = parseFloat(document.getElementById("discountInput").value) || 0;
    const grandTotal = subTotal + tax - discount;

    return {
        invoiceNumber: document.getElementById("invoiceNumber").innerText,
        items,
        subTotal,
        tax,
        discount,
        grandTotal
    };
}


function saveInvoice() {
    const btn = document.querySelector(".save-btn");

    btn.innerText = "جاري الحفظ...";
    btn.disabled = true;

    const invoice = collectInvoice();

    fetch("/api/invoices", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(invoice)
    })
    .then(res => res.json())
    .then(data => {
        btn.innerText = "تم الحفظ ✅";
        setTimeout(() => {
            btn.innerText = "حفظ الفاتورة 💾";
            btn.disabled = false;
        }, 2000);
    });
}

function formatCurrency(value) {
    return "EGP " + value.toLocaleString("en-US", {
        minimumFractionDigits: 2
    });
}

function addItem() {
    const code = document.getElementById("itemCode").value || "---";
    const name = document.getElementById("itemName").value;
    const price = parseFloat(document.getElementById("itemPrice").value);
    const qty = parseFloat(document.getElementById("itemQty").value);

    if (!name || isNaN(price) || isNaN(qty) ||  price <= 0 || qty <= 0) {
        alert("من فضلك أدخل بيانات صحيحة");
        return;
    }

    const total = price * qty;

    const row = `
        <tr>
            <td>${code}</td>
            <td>${name}</td>
            <td>${qty}</td>
            <td>${formatCurrency(price)}</td>
            <td>${formatCurrency(total)}</td>
            <td class="delete-column">
                <button class="delete-btn" onclick="deleteRow(this)">
                    X
                </button>
            </td>
        </tr>
    `;

    document.getElementById("billBody").innerHTML += row;

    saveData();
    updateTotals();

    document.getElementById("itemCode").value = "";
    document.getElementById("itemName").value = "";
    document.getElementById("itemPrice").value = "";
    document.getElementById("itemQty").value = "";
}

function deleteRow(btn) {
    btn.parentElement.parentElement.remove();
    saveData();
    updateTotals();
}

function clearAll() {
    document.getElementById("billBody").innerHTML = "";
    saveData();
    updateTotals();
}

function updateTotals() {
    let subTotal = 0;

    const rows = document.querySelectorAll("#billBody tr");

    rows.forEach(row => {
        const total =
        parseFloat(row.cells[4].innerText.replace(/[^\d.]/g, "")) || 0;

        subTotal += total;
    });

    const tax = subTotal * 0.14;
    const discount =
    parseFloat(document.getElementById("discountInput").value) || 0;

    const grandTotal = subTotal + tax - discount;

    document.getElementById("subTotal").innerText =
    formatCurrency(subTotal);

    document.getElementById("tax").innerText =
    formatCurrency(tax);

    document.getElementById("discount").innerText =
    formatCurrency(discount);

    document.getElementById("grandTotal").innerText =
    formatCurrency(grandTotal);
}

function saveData() {
    localStorage.setItem(
        "invoiceData",
        document.getElementById("billBody").innerHTML
    );
}

window.onload = function () {
    const savedData = localStorage.getItem("invoiceData");

    if (savedData) {
        document.getElementById("billBody").innerHTML = savedData;
    }

    updateTotals();
};

document.getElementById("discountInput").addEventListener("input",
updateTotals
);


