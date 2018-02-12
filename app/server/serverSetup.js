var MongoClient = require('mongodb').MongoClient;
var databaseHost = "localhost";
var databasePort = 27017;

var databaseName = "dashboard";
var databaseURL = 'mongodb://' + databaseHost + ':' + databasePort + '/' + databaseName;

MongoClient.connect(databaseURL, function(err, db) {
    if (err) throw err;
    console.log("Connected to Dashboard Database");
    var dbo = db.db("dashboard");
    dbo.createCollection("whitelist", function(err, res) {
        if (err) throw err;
        console.log("Whitelist collection created!");
        db.close();
    });
});

var adminEmail = "admin@admin.com";
var adminAccess = "admin";
MongoClient.connect(databaseURL, function(err, db) {
    if (err) throw err;
    var dbo = db.db("dashboard");
    var newObj = { email: adminEmail, access: adminAccess };
    console.log("Object to insert:")
    console.log(newObj);
    dbo.collection("whitelist").insertOne(newObj, function(err, res) {
        if (err) throw err;
        console.log("Default admin inserted");
        db.close();
    });
});

MongoClient.connect(databaseURL, function(err, db) {
    if (err) throw err;
    var dbo = db.db("dashboard");
    dbo.createCollection("dashsettings", function(err, res) {
        if (err) throw err;
        console.log("Dashboard settings collection created!");
        db.close();
    });
});

MongoClient.connect(databaseURL, function(err, db) {
    if (err) throw err;
    var dbo = db.db("dashboard");
    dbo.createCollection("sensors", function(err, res) {
        if (err) throw err;
        console.log("Sensor collection created!");
        db.close();
    });
});