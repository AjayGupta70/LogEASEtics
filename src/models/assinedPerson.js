const mongoose = require("mongoose");
const Product = require("./product");
const user = require("./register");

var schema = mongoose.Schema;
// schema is the structure for collection

const assignPerson = new mongoose.Schema({
    product: {
        type:String,
        required:true,
        unique:true
    },
    person: {
        type:String,
        required:true,
        unique:true
    }
})

const ProductAssigned = new mongoose.model("AssinedPerson", assignPerson);

module.exports = ProductAssigned;