var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

var MongoClient = require('mongodb').MongoClient;
var dbHost = DB_HOST = "localhost";
var dbPort = DB_PORT = 27017;

var databaseName = "dashboard";
var databaseURL = 'mongodb://' + dbHost + ':' + dbPort + '/' + databaseName;

module.exports = function(app) {

    //******************//
    //Data POST Handlers//
    //******************//

    app.post('/data', function(req, res) {
        MongoClient.connect(databaseURL, function(err, db) {
            if (err) throw err;
            var dbo = db.db("dashboard");
            var newObj = req.body;
            console.log("Data received:");
            console.log(newObj);
            // dbo.collection("data").insertOne(newObj, function(err, res) {
            //     if (err) throw err;
            //     console.log("Insert successful");
            //     db.close();
            // });
        });
        //check new data to see if a new sensor id is added
        res.status(200).send('ok');
    });

    //***************//
    //Account Loading//
    //***************//

    app.get('/', function(req, res) {
        if (req.session.user != null) {
            res.redirect('/dashboard');
        } else {
            // check if user credentials are saved
            if (req.cookies.user == undefined || req.cookies.pass == undefined) {
                res.render('login', { title: 'Please Login To Your Account' });
            } else {
                // attempt auto login
                AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
                    if (o != null) {
                        req.session.user = o;
                        res.redirect('/dashboard');
                    } else {
                        res.render('login', { title: 'Please Login To Your Account' });
                    }
                });
            }
        }
    });

    app.get('/control', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.render('control', {
                title: 'Control Panel',
                countries: CT,
                udata: req.session.user
            });
        }
    });

    app.get('/signup', function(req, res) {
        res.render('signup', { title: 'Signup', countries: CT });
    });

    app.get('/reset-password', function(req, res) {
        var email = req.query["e"];
        var passH = req.query["p"];
        AM.validateResetLink(email, passH, function(e) {
            if (e != 'ok') {
                res.redirect('/');
            } else {
                // save the users email in a session instead of sending to client
                req.session.reset = { email: email, passHash: passH };
                res.render('reset', { title: 'Reset Password' });
            }
        })
    });

    //**********************//
    //Dashboard HTML Loading//
    //**********************//

    app.get('/dashboard', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/index.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/map', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/map.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/graphs', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/graphs.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/tables', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/tables.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/alarms', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/alarms.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/sensors/temperature', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/sensors-temperature.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/sensors/humidity', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/sensors-humidity.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/sensors/so3', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/sensors-so3.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/sensors/co', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/sensors-co.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/sensors/no2', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/sensors-no2.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/sensors/o3', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/sensors-o3.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/settings/accounts', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/settings-accounts.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/settings/alarms', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/settings-alarms.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/settings/dashboard', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/settings-dashboard.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('/settings/sensors', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/views/html/settings-sensors.html', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    //*********************//
    //Account POST Handlers//
    //*********************//

    app.post('/', function(req, res) {
        AM.manualLogin(req.body['user'], req.body['pass'], function(e, o) {
            if (!o) {
                res.status(400).send(e);
            } else {
                req.session.user = o;
                if (req.body['remember-me'] == 'true') {
                    res.cookie('user', o.user, { maxAge: 900000 });
                    res.cookie('pass', o.pass, { maxAge: 900000 });
                }
                res.status(200).send(o);
            }
        });
    });

    app.post('/control', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            AM.updateAccount({
                id: req.session.user._id,
                name: req.body['name'],
                email: req.body['email'],
                pass: req.body['pass'],
                country: req.body['country']
            }, function(e, o) {
                if (e) {
                    res.status(400).send('error-updating-account');
                    var alarmText = String("could not update account: " + req.body['email'] + " " + e);
                    var alarmStatus = "info";
                    logAlarm(alarmText, alarmStatus);
                } else {
                    req.session.user = o;
                    // update user login cookies if they exist
                    if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                        res.cookie('user', o.user, { maxAge: 900000 });
                        res.cookie('pass', o.pass, { maxAge: 900000 });
                    }
                    var alarmText = String("user account updated: " + req.body['email']);
                    var alarmStatus = "info";
                    logAlarm(alarmText, alarmStatus);
                    res.status(200).send('ok');
                }
            });
        }
    });

    app.post('/logout', function(req, res) {
        res.clearCookie('user');
        res.clearCookie('pass');
        req.session.destroy(function(e) { res.status(200).send('ok'); });
    })

    app.post('/signup', function(req, res) {
        AM.addNewAccount({
            name: req.body['name'],
            email: req.body['email'],
            user: req.body['user'],
            pass: req.body['pass'],
            country: req.body['country']
        }, function(e) {
            if (e) {
                res.status(400).send(e);
                var alarmText = String("new user signup failed: " + req.body['email'] + " " + e);
                var alarmStatus = "info";
                logAlarm(alarmText, alarmStatus);
            } else {
                res.status(200).send('ok');
                var alarmText = String("new user signup: " + req.body['email']);
                var alarmStatus = "info";
                logAlarm(alarmText, alarmStatus);
            }
        });
    });

    app.post('/lost-password', function(req, res) {
        // look up user account by email
        AM.getAccountByEmail(req.body['email'], function(o) {
            if (o) {
                EM.dispatchResetPasswordLink(o, function(e, m) {
                    // this callback takes a moment to return //
                    // TODO add an ajax loader to give user feedback //
                    if (!e) {
                        res.status(200).send('ok');
                        var alarmText = String("reset password email sent to: " + req.body['email']);
                        var alarmStatus = "info";
                        logAlarm(alarmText, alarmStatus);
                    } else {
                        for (k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
                        var alarmText = String("error sending password reset email to: " + req.body['email']);
                        var alarmStatus = "info";
                        logAlarm(alarmText, alarmStatus);
                    }
                });
            } else {
                res.status(400).send('email-not-found');
            }
        });
    });

    app.post('/reset-password', function(req, res) {
        var nPass = req.body['pass'];
        // retrieve the user's email from the session to lookup their account and reset password //
        var email = req.session.reset.email;
        // destory the session immediately after retrieving the stored email //
        req.session.destroy();
        AM.updatePassword(email, nPass, function(e, o) {
            if (o) {
                res.status(200).send('ok');
                var alarmText = String("user updated password successfully: " + email);
                var alarmStatus = "info";
                logAlarm(alarmText, alarmStatus);
            } else {
                res.status(400).send('unable to update password');
                var alarmText = String("updating user password failed: " + email);
                var alarmStatus = "info";
                logAlarm(alarmText, alarmStatus);
            }
        })
    });

    app.post('/users/remove', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            var userAccess = req.session.user.access;
            var command = req.body.command;
            var accountID = req.body.userID;
            if (command == "remove") {
                if ((userAccess == "admin") || (userAccess == "manager")) {
                    AM.deleteAccount(accountID, function(e, obj) {
                        if (!e) {
                            res.status(200).send('ok');
                            //console.log("removed user: " + accountID);
                            var alarmText = String("removed user: " + accountID);
                            var alarmStatus = "info";
                            logAlarm(alarmText, alarmStatus);
                        } else {
                            res.status(400).send('could not delete user');
                            //console.log("could not remove user: " + accountID);
                            var alarmText = String("could not remove user: " + accountID);
                            var alarmStatus = "info";
                            logAlarm(alarmText, alarmStatus);
                        }
                    });
                } else {
                    res.status(400).send('not authorized');
                    //console.log('Unauthorized user (' + req.session.user.email + ') tried to remove user: ' + accountID);
                    var alarmText = String('unauthorized user (' + req.session.user.email + ') tried to remove user: ' + accountID);
                    var alarmStatus = "info";
                    logAlarm(alarmText, alarmStatus);
                }
            }
        }
    });

    //***********************//
    //Dashboard POST Handlers//
    //***********************//

    app.post('/dashsettings', function(req, res) {
        if (req.session.user == null) {
            res.status(400).send('not authorized');
        } else {
            //console.log("POST to dashboard settings received from: " + req.session.user.email);
            //console.log(req.body);
            var updateEmail = String(req.session.user.email);
            //Change default settings in database
            if (req.body.field == "defaultColor") {
                MongoClient.connect(databaseURL, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("node-login");
                    var dbquery = { email: updateEmail };
                    var newvalue = { $set: { defaultColor: String(req.body.value) } };
                    dbo.collection("accounts").updateOne(dbquery, newvalue, function(err, res) {
                        if (err) throw err;
                        //console.log("Update successful");
                        var alarmText = String(updateEmail + " updated navbar color");
                        var alarmStatus = "info";
                        logAlarm(alarmText, alarmStatus);
                        db.close();
                    });
                });
            } else if (req.body.field == "defaultNavbarPos") {
                MongoClient.connect(databaseURL, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("node-login");
                    var dbquery = { email: updateEmail };
                    var newvalue = { $set: { defaultNavbarPos: String(req.body.value) } };
                    dbo.collection("accounts").updateOne(dbquery, newvalue, function(err, res) {
                        if (err) throw err;
                        //console.log("Update successful");
                        var alarmText = String(updateEmail + " updated navbar position");
                        var alarmStatus = "info";
                        logAlarm(alarmText, alarmStatus);
                        db.close();
                    });
                });
            } else {
                //error
                console.log('Error, parameter not found');
            }
            var responseText = JSON.stringify(req.body);
            res.status(200).send(responseText);


        }
    });

    app.post('/whitelist', function(req, res) {
        if (req.session.user == null) {
            res.status(400).send('not authorized');
        } else {
            //console.log("POST to whitelist received from: " + req.session.user.email);
            if (req.body.command == "add") {
                var receivedEmail = String(req.body.email);
                var receivedAccess = String(req.body.access);
                MongoClient.connect(databaseURL, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("dashboard");
                    var newObj = { email: receivedEmail, access: receivedAccess };
                    //console.log("Data to insert:");
                    //console.log(newObj);
                    dbo.collection("whitelist").insertOne(newObj, function(err, res) {
                        if (err) throw err;
                        //console.log("Insert successful");
                        var alarmText = String(receivedEmail + " added to whitelist as " + access);
                        var alarmStatus = "info";
                        logAlarm(alarmText, alarmStatus);
                        db.close();
                    });
                });
            } else if (req.body.command == "remove") {
                var receivedEmail = String(req.body.email);
                MongoClient.connect(databaseURL, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("dashboard");
                    var dbquery = { email: receivedEmail };
                    dbo.collection("whitelist").deleteOne(dbquery, function(err, obj) {
                        if (err) throw err;
                        //console.log("Address deleted");
                        var alarmText = String(receivedEmail + " removed from whitelist");
                        var alarmStatus = "info";
                        logAlarm(alarmText, alarmStatus);
                        db.close();
                    });
                });
            } else {
                //console.log("Invalid or no command specified");
                var alarmText = String("could not remove user from whitelist");
                var alarmStatus = "info";
                logAlarm(alarmText, alarmStatus);
            }
            var responseText = JSON.stringify(req.body);
            res.status(200).send(responseText);
        }
    });

    app.post('/sensors', function(req, res) {
        if (req.session.user == null) {
            res.status(400).send('not authorized');
        } else {
            //console.log("POST to sensors received: from: " + req.session.user.email);
            //console.log(req.body);
            var alarmText = String(req.session.user.email + " updated sensor information");
            var alarmStatus = "info";
            logAlarm(alarmText, alarmStatus);
            var responseText = JSON.stringify(req.body);
            res.status(200).send(responseText);
            console.log("Sensor modifications not supported yet");
        }
    });

    //************//
    //GET Handlers//
    //************//

    app.get('/whitelist', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            MongoClient.connect(databaseURL, function(err, db) {
                if (err) throw err;
                var dbo = db.db("dashboard");
                dbo.collection("whitelist").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    var whitelist = result;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(whitelist));
                    db.close();
                });
            });
        }
    });

    app.get('/users', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            AM.getAllRecords(function(e, accounts) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                for (var account in accounts) {
                    accounts[account]['pass'] = 'hidden';
                }
                res.end(JSON.stringify(accounts));
            })
        }
    });

    app.get('/sensors', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            //temporary object data, replace with database table
            var sensorData = new Object({
                "B8:27:EB:CE:93:69": {
                    "name": "Sensor 2",
                    "group": "Test Group 2",
                    "location": "Melbourne",
                    "long": "-80.6081",
                    "lat": "28.0836",
                    "status": "danger"
                },
                "B8:27:EB:DA:8F:F5": {
                    "name": "Sensor 1",
                    "group": "Test Group 1",
                    "location": "Orlando",
                    "long": "-81.4712688539999",
                    "lat": "28.5224150600001",
                    "status": "ok"
                },
                "B8:27:EB:97:19:1E": {
                    "name": "Sensor 3",
                    "group": "Test Group 1",
                    "location": "Orlando",
                    "long": "-81.4076",
                    "lat": "28.2920",
                    "status": "ok"
                }
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sensorData));
        }
    });

    app.get('/alarms/all', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            MongoClient.connect(databaseURL, function(err, db) {
                if (err) throw err;
                var dbo = db.db("dashboard");
                dbo.collection("alarms").find({}).toArray(function(err, result) {
                    if (err) throw err;
                    var alarms = result;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(alarms));
                    db.close();
                });
            });
        }
    });

    app.get('/alarms/danger', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            MongoClient.connect(databaseURL, function(err, db) {
                if (err) throw err;
                var dbo = db.db("dashboard");
                dbo.collection("alarms").find({ ststus: "danger" }).toArray(function(err, result) {
                    if (err) throw err;
                    var alarms = result;
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(alarms));
                    db.close();
                });
            });
        }
    });

    //***********************//
    //Mobile App GET Handlers//
    //***********************//

    app.get('/app/sensors', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.end(JSON.stringify("list of sensors for mobile"));
        }
    });

    app.get('/app/data', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.end(JSON.stringify("consolidated data to be sent to mobile"));
        }
    });

    //*********//
    //404 Catch//
    //*********//

    app.get('/bundle.js', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.sendFile(__dirname + '/bundle.js', (err, html) => {
                if (err) {
                    res.end("Not found");
                }
            });
        }
    });

    app.get('*', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.render('404', { title: 'Page Not Found' });
        }
    });

};

function logAlarm(alarmText, alarmStatus) {
    if (alarmStatus === undefined) {
        alarmStatus = "info";
    }
    MongoClient.connect(databaseURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dashboard");
        var alarmTime = String(new Date().today() + " " + new Date().timeNow());
        var epochTime = String((new Date).getTime());
        var newObj = { epoch: epochTime, time: alarmTime, text: String(alarmText), status: String(alarmStatus) };
        //console.log(newObj);
        console.log("[" + alarmStatus + "] [" + alarmTime + "] " + alarmText);
        dbo.collection("alarms").insertOne(newObj, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });

}

// For todays date;
Date.prototype.today = function() {
    return (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "/" + ((this.getDate() < 10) ? "0" : "") + this.getDate() + "/" + this.getFullYear();
}

// For the time now
Date.prototype.timeNow = function() {
    return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
}