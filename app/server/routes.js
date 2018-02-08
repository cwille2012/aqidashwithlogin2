var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');

module.exports = function(app) {

    //***************//
    //Account Loading//
    //***************//

    app.get('/', function(req, res) {
        if (req.session.user != null) {
            // res.sendFile(__dirname + '/views/html/index.html', (err, html) => {
            //     if (err) {
            //         res.end("Not found");
            //     }
            // });
            res.redirect('/dashboard');
        } else {
            // check if user credentials are saved
            if (req.cookies.user == undefined || req.cookies.pass == undefined) {
                res.render('login', { title: 'Hello - Please Login To Your Account' });
            } else {
                // attempt auto login
                AM.autoLogin(req.cookies.user, req.cookies.pass, function(o) {
                    if (o != null) {
                        req.session.user = o;
                        res.redirect('/dashboard');
                    } else {
                        res.render('login', { title: 'Hello - Please Login To Your Account' });
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



    // app.get('/web/:page', function(req, res) {
    //     var pag = req.params.page;
    //     console.log(pag);
    //     if (req.session.user == null) {
    //         res.redirect('/');
    //     } else {
    //         res.sendFile(__dirname + '/views/html/' + pag, (err, html) => {
    //             if (err) {
    //                 res.end("Not found");
    //             }
    //         });
    //     }
    // });

    //*****************//
    //Dashboard Loading//
    //*****************//

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
                } else {
                    req.session.user = o;
                    // update user login cookies if they exist
                    if (req.cookies.user != undefined && req.cookies.pass != undefined) {
                        res.cookie('user', o.user, { maxAge: 900000 });
                        res.cookie('pass', o.pass, { maxAge: 900000 });
                    }
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
        if (true) { // if (req.body['email'] is in whitelist)
            AM.addNewAccount({
                name: req.body['name'],
                email: req.body['email'],
                user: req.body['user'],
                pass: req.body['pass'],
                country: req.body['country']
            }, function(e) {
                if (e) {
                    res.status(400).send(e);
                } else {
                    res.status(200).send('ok');
                }
            });
        } else {
            res.status(400).send('account not whitelisted');
        }
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
                    } else {
                        for (k in e) console.log('ERROR : ', k, e[k]);
                        res.status(400).send('unable to dispatch password reset');
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
            } else {
                res.status(400).send('unable to update password');
            }
        })
    });

    app.post('/delete', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            AM.deleteAccount(req.body.id, function(e, obj) {
                if (!e) {
                    res.clearCookie('user');
                    res.clearCookie('pass');
                    req.session.destroy(function(e) { res.status(200).send('ok'); });
                } else {
                    res.status(400).send('record not found');
                }
            });
        }
    });

    //***********************//
    //Dashboard POST Handlers//
    //***********************//


    //************//
    //GET Handlers//
    //************//

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



    //*********//
    //404 Catch//
    //*********//

    app.get('*', function(req, res) {
        if (req.session.user == null) {
            res.redirect('/');
        } else {
            res.render('404', { title: 'Page Not Found' });
        }
    });

};