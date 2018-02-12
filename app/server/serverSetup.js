var MongoClient = require('mongodb').MongoClient;
var databaseHost = "localhost";
var databasePort = 27017;

var databaseName = "dashboard";
var databaseURL = 'mongodb://' + databaseHost + ':' + databasePort + '/' + databaseName;

MongoClient.connect(databaseURL, function(err, db) {
    if (err) throw err;
    console.log("Dashboard database created!");
    var dbo = db.db("dashboard");
    dbo.createCollection("whitelist", function(err, res) {
        if (err) throw err;
        console.log("Whitelist collection created!");
    });
    dbo.createCollection("dashsettings", function(err, res) {
        if (err) throw err;
        console.log("Dashboard settings collection created!");
    });
    dbo.createCollection("sensors", function(err, res) {
        if (err) throw err;
        console.log("Sensor collection created!");
    });
    db.close();
});