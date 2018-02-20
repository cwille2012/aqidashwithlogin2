var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    user: process.env.EMAIL_USER || 'dashboardreset@gmail.com',
    password: process.env.EMAIL_PASS || 'buster5buster5',
    ssl: true
});

EM.dispatchResetPasswordLink = function(account, callback) {
    EM.server.send({
        from: process.env.EMAIL_FROM || 'CCC-USA <dashboardreset@gmail.com>',
        to: account.email,
        subject: 'Password Reset',
        text: 'Please follow the link below to reset your password.',
        attachment: EM.composeEmail(account)
    }, callback);
}

EM.composeEmail = function(o) {
    var link = 'https://nodejs-login.herokuapp.com/reset-password?e=' + o.email + '&p=' + o.pass;
    var html = "<html><body>";
    html += "Hello " + o.name + ",<br><br>";
    html += "Your username is <b>" + o.user + "</b><br><br>";
    html += "<a href='" + link + "'>Click here to reset your password</a><br><br>";
    html += "</body></html>";
    return [{ data: html, alternative: true }];
}