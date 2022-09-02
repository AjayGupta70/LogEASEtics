const mongoose = require("mongoose");

// schema is the structure for collection
const logUser = new mongoose.Schema({
    userId:{
        type: String,
        requires: true
    },
    productID:{
        type: String,
        required:true
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
        required: true,
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
    status:{
        type: String,
        required: true
    }
})

// Product is collection name

const loguser = new mongoose.model("logUser", logUser);

module.exports = loguser;