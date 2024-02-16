const db = require("../../database");
posts = require("../models/post.server.models");

const getUser = (user_id, done) => {
    const sql = `SELECT user_id, first_name, last_name, username
                FROM users
                WHERE user_id = ?`

    db.get(sql, [user_id], (err, user_details) => {
        if (!user_details) return done(404);
        if (err) return done(err);

        let followers = `SELECT u.user_id, u.first_name, u.last_name, u.username
                        FROM users u, followers f
                        WHERE f.follower_id == u.user_id
                        AND f.user_id = ?`

        let followers_result = [];
        db.each(
            followers,
            [user_id],
            (err, row) => { 
                if (err) return done(err);
                followers_result.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })
            },
            (err) => {
                //continue

                //do following
                let following = `SELECT u.user_id, u.first_name, u.last_name, u.username
                                FROM users u, followers f
                                WHERE f.user_id == u.user_id
                                AND f.follower_id = ?`

                let following_result = [];
                db.each(
                    following,
                    [user_id],
                    (err, row) => {
                        if (err) return done(err);
                        following_result.push({
                            user_id: row.user_id,
                            first_name: row.first_name,
                            last_name: row.last_name,
                            username: row.username
                        })
                    },
                    (err) => {
                        //continue
                        let posts = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username 
                        FROM posts p, users u 
                        WHERE p.author_id = ? 
                        AND p.author_id == u.user_id`;

                        let posts_results = [];
                        db.each(posts,
                            [user_id],
                            (err, row) => {
                                if (err) return done(err);
                                posts_results.push({
                                    post_id: row.post_id,
                                    timestamp: row.date_published,
                                    text: row.text,
                                    author: {
                                        user_id: row.user_id,
                                        first_name: row.first_name,
                                        last_name: row.last_name,
                                        username: row.username
                                    },
                                })

                            },
                            (err) => {
                                let count = 0;
                                let posts = [];
                                posts_results.forEach((post) => {

                                    getLikes(post.post_id)
                                    .then(
                                        (likes) => {
                                            post["likes"] = likes;
                                            posts.push(post);
                                            count++;
                                            if (count === posts_results.length) {
                                                return done(null, {
                                                    user_id: user_details.user_id,
                                                    first_name: user_details.first_name,
                                                    last_name: user_details.last_name,
                                                    username: user_details.username,
                                                    followers: followers_result,
                                                    following: following_result,
                                                    posts: posts
                                                })
                                            }
                                        },
                                        (err) => {
                                            return done(err);
                                        }
                                    )
                                })
                            }
                        )
                    }
                )
            }
        )
    })
}


const getLikes = async (id) => {
    return new Promise((resolve, reject) => {

        let sql = `SELECT u.user_id, u.first_name, u.last_name, u.username 
            FROM users u, likes l 
            WHERE l.post_id = ? 
            AND l.user_id == u.user_id`;
        let likes_results = [];
        db.each(sql,
            [id],
            (err, row) => {
                if (err) return done(err);
                likes_results.push({
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })
            },
            (err) => {
                if (err) reject(err);
                resolve(likes_results);
            }
        )

    });

}

const followUser = (user_id, follower_id, done) => {

    const sql = `SELECT user_id 
                    FROM users
                    WHERE user_id = ?`

    db.get(sql, [user_id], (err, user) => {
        if (err) return done(err);
        if (!user) return done(404);


        const sql = `SELECT user_id, follower_id 
            FROM followers 
            WHERE user_id = ?
            AND follower_id = ?`

        db.get(sql, [user_id, follower_id], (err, row) => {
            if (err) return done(err);
            if (row) return done(403);


            const sql = `INSERT INTO followers (user_id, follower_id) VALUES(?,?)`

            db.run(sql, [user_id, follower_id], function (err) {
                if (err) return done(err);
                return done(null);
            })
        })
    })


}

const unfollowUser = (user_id, follower_id, done) => {

    const sql = `SELECT user_id 
                    FROM users
                    WHERE user_id = ?`

    db.get(sql, [user_id], (err, user) => {
        if (err) return done(err);
        if (!user) return done(404);


        const sql = `SELECT user_id, follower_id 
                FROM followers 
                WHERE user_id = ?
                AND follower_id = ?`

        db.get(sql, [user_id, follower_id], (err, row) => {
            if (!row) return done(403);
            if (err) return done(err);

            const sql = `DELETE FROM followers WHERE user_id = ? AND follower_id = ?`

            db.run(sql, [user_id, follower_id], function (err) {
                if (err) return done(err);
                return done(null);
            })
        })
    })
}

const searchUser = (query, done) => {
    const sql = `SELECT user_id, first_name, last_name, username
                FROM users
                WHERE first_name LIKE ?
                OR last_name LIKE ?
                OR username LIKE ?`
    const search = [];
    db.each(sql, ["%"+query+"%", "%"+query+"%", "%"+query+"%"], (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, []); 
        search.push({
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username
        })
    },
    (err, num_rows) => {
        if(err) return done(err);
        return done(null, search);
    })
}

module.exports = {
    getUser: getUser,
    followUser: followUser,
    unfollowUser: unfollowUser,
    searchUser: searchUser
}
