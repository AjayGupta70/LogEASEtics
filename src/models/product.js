const mongoose = require("mongoose");

// schema is the structure for collection
const productSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true,
        unique: true
    },
    sourceAddress: {
        type: String,
        required: true
    },
    destinationAddress: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    remaining:{
        type: Number,
        required: true
    },
    sourceURL:{
        type: String,
        required: true
    },
    destinationURL:{
        type: String,
        required: true
    },
    pickOtp:{
        type: String,
        required: true
    },
    dropOtp:{
        type: String,
        required: true
    },
    isPicked:{
        type: Number,
        required: true
    },
    productWeight:{
        type: Number,
        required: true 
    },
    productVolume:{
        type: Number,
        required: true 
    },
    isDelivered:{
        type: Number,
        required: true
    }
})

// Product is collection name

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;

// module.exports = mongoose.model("Users", userModel);

