var MongoClient = require('mongodb').MongoClient;
var dbHost = DB_HOST = "localhost";
var dbPort = DB_PORT = 27017;

var whitelistDb = "whitelist";
var whitelistURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + whitelistDb;

var dashSettingsDb = "dashsettings";
var dashSettingsURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + dashSettingsDb;

var sensorsDb = "sensors";
var sensorsURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + sensorsDb;

MongoClient.connect(whitelistURL, function(err, db) {
    if (err) throw err;
    console.log("Whitelist database created!");
    db.close();
});

MongoClient.connect(dashSettingsURL, function(err, db) {
    if (err) throw err;
    console.log("Dashboard settings database created!");
    db.close();
});

MongoClient.connect(sensorsURL, function(err, db) {
    if (err) throw err;
    console.log("Sensor database created!");
    db.close();
});