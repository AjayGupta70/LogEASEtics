// test test
const express = require('express');
const app = express();
const http = require('http');
const open = require("open");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("../src/middleware/auth");
// const server = http.createServer(app); 

const exphbs = require('express-handlebars').engine;  // version 6

app.use(express.static(__dirname + "/public")); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// update the database
// Handlebars setting
const up = require("./../public/updateOne.js");


// let login = false; //must be false, using true for testing purpose
var userID = "";
var lnk = "";

app.set("view engine", "hbs");
app.engine('hbs', exphbs({
    layoutsDir: __dirname + './../templates/views',
    partialsDir: __dirname + './../templates/partials',
    extname: 'hbs',
    defaultLayout: false,
    helpers: {
        isdefined: value => {
            return value != 0;
        },
        place: ud => {
            userID = ud;
        },
        usrd: () => {
            return userID
        },
        loud: (string) => {
            return string.toUpperCase();
        },
        isC: value => {
            return value === 1;
        },
        // isLogin

    }

}));

// Handlebars.registerHelper('loud', function(string) {
//    return string.toUpperCase();
// });

// direct call to database conn.js
require("./db/conn");
const Register = require("./models/register");
const Product = require("./models/product");
const assingnedPer = require("./models/assinedPerson");
const userLog = require("./models/userLog");
const req = require('express/lib/request');
const ProductAssigned = require('./models/assinedPerson');

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

// app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
// test line START
// app.engine('hbs', handlebars.engine);
// hbs.registerPartials(path.join(__dirname, "../", "/templates/partials"));
// app.use(express.static(path.join(__dirname , "../" , "/public")));
// test lines END

//simple routing starts
app.get("/", (req, res) => {
    login = false;
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/about", (req, res) => {
    // console.log(`Got the cookie ${req.cookies.jwt}`);
    if (req.cookies.jwt) {
        // var nav = "{{navbarafter}}";
        res.render("about", { "nav": "navbarafter" });
    } else {
        // var nav = "{{navbar}}";
        res.render("about", { "nav": "navbar" });
    }
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/afterLog", auth, (req, res) => {
    // if (login) {

    res.render("afterLog", { "uID": userID });
    // }
    // else {
    //     res.send("please login first");
    // }
});
app.get("/logout", auth, async(req, res) => {
    try {
        res.clearCookie("jwt");
        // console.log(req);
        console.log("logout successfully");
        // console.log(req);
        await req.user.save();
        res.render("index");
    } catch (error) {
        res.status(500).send(error);
    }
})
//routing simple ends ...........................

//logical routing starts........=>

// create a new user in database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (password === confirmPassword) {
            const registerTraveler = new Register({
                firstname: req.body.firstname,
                middlename: req.body.middlename,
                lastname: req.body.lastname,
                email: req.body.email,
                phone: req.body.phone,
                gender: req.body.gender,
                DLNumber: req.body.DLNumber,
                issueDate: req.body.issueDate,
                validity: req.body.validity,
                password: req.body.password,
                confirmPassword: req.body.confirmPassword
            })
            const token = await registerTraveler.generateAuthToken();

            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 3000000),
                httpOnly: true,
                // secure:true,
            });

            const registered = await registerTraveler.save();
            console.log("the page part " + registered);
            res.status(201).render("login");
        }
        else {
            res.send("password is not matching");
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

//login verification

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;


        const usermail = await Register.findOne({ email: email });
        // res.send(usermail);

        const token = await usermail.generateAuthToken();
        // console.log("the token part " + token);

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3000000),
            httpOnly: true,
            // secure:true,
        });
        // console.log(`Got the cookie ${req.cookies.jwt}`);
        if (password === usermail.password) {
            login = true;
            userID = usermail.email;
            res.status(201).render("afterLog", { "uID": userID });
        } else {
            res.send("invalid credentials");
            // res.render("invalid")
        }
    } catch (e) {
        res.status(400).send("invalid credentials");
        // res.render("invalid")
    }
});

// original below
// app.get("/products", (req, res)=>{
//     res.render("products", {});
// });
// Original above

// replacing original ... adding for fetching
app.get("/products", auth, (req, res) => {
    const wheels = req.query.wheels;
    // console.log(wheels);
    // if (login) {
    const MongoClient = require("mongodb").MongoClient;
    const url = 'mongodb://localhost:27017/';
    const databasename = "travellerRegister";   // Database name
    MongoClient.connect(url).then(async (client) => {
        try {
            const connect = client.db(databasename);

            // Connect to collection
            const collect = connect
                .collection("assinedPerson");

            try {
                const data = await assingnedPer.findOne({ person: userID });
                if (data === null) {
                    // console.log("data is coming out to be null and user is " + userID);
                    if (userID !== "") {
                        // Product.find({}).sort({'productWeight': 1});
                        // console.log(data + " ihsrhog " + userID);
                        if(wheels==="Wheeler2"){Product.find({productWeight: {$lt: 10}, productVolume: {$lt: 50}}, function (err, docs) {
                            if (err) throw err;
                            res.render("products", { "productList": docs });
                        }).lean();
                        // .sort({productWeight:togg})
                    }
                    else{
                        Product.find({}, function (err, docs) {
                            if (err) throw err;
                            res.render("products", { "productList": docs });
                        }).lean();
                        // .sort({productWeight:togg})
                    }
                        // .lean is used here to resolve own property error of handlebars  
                    }
                } else {
                    // const proDet = await Product.findOne({productID : data.product});
                    const lnkMap = await Product.findOne({ productID: data.product });
                    // const llnk = await Product.findOne({productID:pid});
                    lnk = lnkMap.destinationURL;
                    // console.log(lnk);
                    let prid = "";
                    prid = lnkMap.productID;
                    // console.log("haha you are here : " + prid);
                    // if (lnk) {
                    //     open(lnk);
                    // }
                    if (lnkMap.isPicked === 1) {

                        let sr = "Drop";
                        let btnn = "cancel";
                        lnk = lnkMap.destinationURL;
                        res.render("pickInstructon", {

                            "pid": data.product,
                            "mapUrl": lnk,
                            "cont": sr,
                            "btnn": btnn,
                            "isc": 0
                        })
                    }
                    else {
                        let sr = "Pick";
                        let btnn = "cancel";
                        res.status(201).render("pickInstructon", {
                            "pid": prid,
                            "mapUrl": lnk,
                            "cont": sr,
                            "btnn": btnn,
                            "isc": 1
                        });
                    }
                }
            } catch (e) { console.log(e); }

        } catch (e) { console.log(e) }
    }
    )
    // }
    // else {
    //     // if(toShow)
    //     res.send("please login first");
    // }

});

app.get("/product/srt", (req, res)=>{
    const wheels = req.query.wheels;

    if(wheels==="Wheeler2"){Product.find({productWeight:2}, function (err, docs) {
        if (err) throw err;
        res.render("products", { "productList": docs });
    }).lean(); 
    }})

app.get("/products/st", auth, async (req, res) => {
    const pid = req.query.prid;
    // console.log(pid);


    const MongoClient = require("mongodb").MongoClient;
    const url = 'mongodb://localhost:27017/';
    const databasename = "travellerRegister";   // Database name
    MongoClient.connect(url).then(async (client) => {
        try {
            const connect = client.db(databasename);

            // Connect to collection
            const collection = connect
                .collection("products");
            var myquery = { productID: pid };
            // Update one collection
            collection.updateOne(
                myquery,
                { $set: { productID: pid, remaining: 0 } }
            );
            const llnk = await collection.findOne({ productID: pid });
            lnk = llnk.destinationURL;
            const isAssined = await assingnedPer.findOne({ product: pid });
            if (isAssined === null) {
                const assignedP = new assingnedPer({
                    product: pid,
                    person: userID
                });
                const asnd = await assignedP.save();
            }
            // toShow = false;
            console.log(pid + " updated successfully");
            // const flnk = async ()=>{

            // if (lnk) {
            //     open(lnk);
            // }
            // return lnk;
            // } 
            // console.log(lnk);
            let sr = "Pick";
            let bt = "cancel";
            // console.log(pid + " " + sr);
            res.status(201).render("pickInstructon", {
                "pid": pid,
                "mapUrl": lnk,
                "cont": sr,
                "btnn": bt,
                "isc": 1
            }
            );
            // db.close();
        } catch (err) {
            console.log(err);
        }
    }).catch((err) => {

        // Handling the error
        console.log(err.Message);
    })

})


const getID = () => {
    return userID;
}

app.post("/pickInstructon/srccOtp", auth, async (req, res) => {
    const srcOtp = req.body.SrcOtp;
    const prood = req.query.priod;
    const prt = req.query.part;
    //mark
    const prddet = await Product.findOne({ productID: prood });
    if (prt === "Pick") {
        if (srcOtp === prddet.pickOtp && prddet.isPicked === 0) {

            const MongoClient = require("mongodb").MongoClient;
            const url = 'mongodb://localhost:27017/';
            const databasename = "travellerRegister";   // Database name
            MongoClient.connect(url).then(async (client) => {
                try {
                    const connect = client.db(databasename);

                    // Connect to collection
                    const collection = connect
                        .collection("products");
                    var qry = { isPicked: 0 };
                    // Update one collection
                    collection.updateOne(
                        qry,
                        { $set: { productID: prood, isPicked: 1 } }
                    );
                    let sr = "Drop";
                    lnk = prddet.destinationURL;
                    res.render("pickInstructon", {

                        "pid": prood,
                        "mapUrl": lnk,
                        "cont": sr,
                        "isc": 0

                    })

                } catch (err) {
                    console.log(err);
                }
            }).catch((err) => {

                // Handling the error
                console.log(err.Message);
            })
        }

        else if (srcOtp !== prddet.pickOtp) {
            res.send("invalid OTP");
        }
        else if (prddet.isPicked === 1) {
            let sr = "Drop";
            lnk = prddet.destinationURL;
            res.render("pickInstructon", {

                "pid": prood,
                "mapUrl": lnk,
                "cont": sr

            })
        }
    } else {
        if (srcOtp === prddet.dropOtp && prddet.isDelivered === 0) {

            const MongoClient = require("mongodb").MongoClient;
            const url = 'mongodb://localhost:27017/';
            const databasename = "travellerRegister";   // Database name
            MongoClient.connect(url).then(async (client) => {
                try {
                    const connect = client.db(databasename);

                    // Connect to collection
                    const collection = connect
                        .collection("products");
                    var sry = { isDelivered: 0 };
                    // Update one collection
                    collection.updateOne(
                        sry,
                        { $set: { productID: prood, isDelivered: 1 } }
                    );

                    // hello_moto
                    const usrdet = await assingnedPer.findOne({ product: prood });
                    const delyLog = new userLog({
                        userId: usrdet.person,
                        productID: prood,
                        sourceAddress: prddet.sourceAddress,
                        destinationAddress: prddet.destinationAddress,
                        productName: prddet.productName,
                        customerName: prddet.customerName,
                        email: prddet.email,
                        phone: prddet.phone,
                        status: "delivered",
                    })

                    const registered = await delyLog.save();

                    const del = await assingnedPer.deleteOne({ product: prood });

                    res.send("hurray!!! delivered");

                } catch (err) {
                    console.log(err);
                }
            }).catch((err) => {

                // Handling the error
                console.log(err.Message);
            })
        }

        else if (srcOtp !== prddet.dropOtp) {
            res.send("invalid OTP");
        }
        else if (prddet.isDelivered === 1) {
            res.send("hurray!!! delivered");
        }
    }
})

app.get("/userLog/st", auth, (req, res) => {
    const usrr = req.query.usrr;
    const MongoClient = require("mongodb").MongoClient;
    const url = 'mongodb://localhost:27017/';
    const databasename = "travellerRegister";   // Database name
    MongoClient.connect(url).then(async (client) => {
        try {
            const connect = client.db(databasename);

            // Connect to collection
            const collect = connect
                .collection("assinedPerson");

            try {
                userLog.find({ userId: usrr }, function (err, docs) {
                    if (err) throw err;
                    res.render("userLog", { "usrlog": docs });
                }).lean();
                // .lean is used here to resolve own property error of handlebars  
            } catch (e) { console.log(e); }

        } catch (e) { console.log(e) }
    }
    )
});

app.get("/pickInstructon/sts", auth, async (req, res) => {
    const prood = req.query.prid;
    //sehhh
    const prddet = await Product.findOne({ productID: prood });

    const MongoClient = require("mongodb").MongoClient;
    const url = 'mongodb://localhost:27017/';
    const databasename = "travellerRegister";   // Database name
    MongoClient.connect(url).then(async (client) => {
        try {
            const connect = client.db(databasename);

            // Connect to collection
            const collection = connect
                .collection("products");
            var qttry = { productID: prood };
            // Update one collection
            collection.findOneAndUpdate(
                qttry,
                { $set: { isPicked: 0 }, $set: { remaining: 1 } }, {
                new: true,
            }
            );
            const delPrd = await assingnedPer.deleteOne({ product: prood });

            //idhar aao
            res.render("afterLog", { "uID": userID });

        } catch (err) {
            console.log(err);
        }
    }).catch((err) => {

        // Handling the error
        console.log(err.Message);
    })

});


app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})

