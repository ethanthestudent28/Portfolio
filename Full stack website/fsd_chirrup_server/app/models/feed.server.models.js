const db = require("../../database");
const post = require("../models/post.server.models");

const getLoginFeed = (user_id, done) => {
    const sql = `SELECT follower_id
                FROM followers
                WHERE user_id = ?`

    const posts = [];
    const followers = [];
    db.each(sql, [user_id], (err, follower) => {
        if(err) return done(err);
        followers.push(follower.follower_id);
        
    },
    (err) => {
        if(err) return done(err);
        const sql = `SELECT p.post_id
                    FROM posts p, users u
                    WHERE u.user_id = ?`

        followers.forEach((follow) => {
            db.each(sql, [follow], (err, post_id) => {
                if(err) return done(err)
                post = post.getSinglePost(post_id)
                posts.push(post);
            })

        }, (err) => {
            if(err) return done(err);
            const sql = `SELECT p.post_id
                        FROM posts p, users u
                        WHERE u.user_id = ?`

            db.each(sql, [user_id], (err, post_id) => {
                if(err) return done(err);
                post = post.getSinglePost(post_id)
                posts.push(post);
            }, (err) => {
                if(err) return done(err);
                return done(null, posts);
            })

        })
    })

}

const getStandardFeed = (done) => {
    

}

module.exports = {
    getLoginFeed: getLoginFeed,
    getStandardFeed: getStandardFeed
}