const users = require("../controllers/user.server.controllers");
const auth = require("../lib/authentication");

module.exports = function(app) {
    
    app.route("/users")
        .post(users.add_user);

    app.route("/login")
        .post(users.login);

    app.route("/logout")
        .post(auth.checkAuthentication, users.logout);
        
}