const posts = require("../controllers/post.server.controllers");
const auth = require("../lib/authentication");

module.exports = function(app) {

    app.route("/posts")
        .post(auth.checkAuthentication, posts.add_post);

    app.route("/posts/:post_id")
        .get(posts.get_post)
        .patch(auth.checkAuthentication, posts.update_post)
        .delete(auth.checkAuthentication, posts.delete_post);

    app.route("/posts/:post_id/like")
        .post(auth.checkAuthentication, posts.add_like)
        .delete(auth.checkAuthentication, posts.remove_like);
}