const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    qrcode: String,
    barcode: String,
    price: Number,
    quantity: Number,
    date: { type: Date, default: Date.now }
  });

const Transactions = mongoose.model('Transactions', transactionSchema);

module.exports = Transactions;