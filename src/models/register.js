const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

// defining mongoose.Schema

const travellerSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    middlename:{
        type:String
        // required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    gender:{   // isme thoda dikkat hai
        type:String,
        required:true,
        // unique:true
    },
    DLNumber:{
        type:String,
        required:true,
        unique:true
    },
    issueDate:{
        type:String,
        required:true
    },
    validity:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true  
        }
    }]
})

travellerSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({_id:this._id.toString()}, "hellothisiskeyforjsonwebtokenthankyou");
        // console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        res.send(error);
        console.log(error);
    }
}

// create Collection

const Register = new mongoose.model("Register", travellerSchema);

module.exports = Register;