const auth = require("../lib/authentication");
const socials = require("../controllers/social.server.controllers");

module.exports = function(app) {
    
    app.route("/users/:user_id")
        .get(socials.get_user);

    app.route("/users/:user_id/follow")
        .post(auth.checkAuthentication, socials.follow_user)
        .delete(auth.checkAuthentication, socials.unfollow_user);

    app.route("/search")
        .get(socials.search_user);

}