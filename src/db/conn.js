const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/travellerRegister", {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log(`connection successful`);
}).catch((e)=>{
    console.log(e);
    
})