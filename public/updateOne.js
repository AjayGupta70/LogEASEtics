
// this file is now depriciated ...since all the code has been transfered in app.js


// const express = require('express');
// const app = express();
// const  http = require('http');
// const server = http.createServer(app);
// // const  io = require('socket.io')(server);

// app.use(express.static(__dirname + "/public"));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));

// var helpers = require('handlebars-helpers')();

function deliver(uid) {

    const MongoClient = require("mongodb").MongoClient;
    const url = 'mongodb://localhost:27017/';
    const databasename = "travellerRegister";   // Database name
    MongoClient.connect(url).then((client) => {

        const connect = client.db(databasename);

        // Connect to collection
        const collection = connect
            .collection("products");

        // Update one collection
        collection.updateOne(
            { "productID": uid },
            { $set: { "remaining": 0 } }
        );


        console.log("update successful");
    }).catch((err) => {

        // Handling the error
        console.log(err.Message);
    })


}


module.exports = deliver;
// module.exports.DEFAULT_PORT = 80;


