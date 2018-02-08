var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

module.exports = function(app) {

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
            })
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(sensorData));
        }
    });


};