const db = require("../../database");


const addNewPost = (post, userid, done) => {
    const sql = "INSERT INTO posts (text, date_published, author_id) VALUES (?, ?, ?)";

    let values = [post.text, Date.now(), userid];

    db.run(sql, values, function (err) {
        if (err) return done(err);
        return done(null, this.lastID);
    })

}


const getSinglePost = (post_id, done) => {
    const sql = `SELECT p.post_id, p.date_published, p.text, u.user_id, u.first_name, u.last_name, u.username 
                FROM posts p, users u 
                WHERE p.post_id = ? 
                AND p.author_id == u.user_id`;

    db.get(sql, [post_id], function (err, post_details) {
        if (err) return done(err);
        if (!post_details) return done(404);

        const sql = `SELECT u.user_id, u.first_name, u.last_name, u.username 
                    FROM users u, likes l 
                    WHERE l.post_id = ? 
                    AND l.user_id == u.user_id`; //Select all users who have liked post

        const likes = []; //array to store likes
        db.each( //for each row of the database
            sql,
            [post_id], //with this post_id
            (err, row) => {
                if (err) return done(err)
                likes.push({ //store details of each person who liked post in likes array
                    user_id: row.user_id,
                    first_name: row.first_name,
                    last_name: row.last_name,
                    username: row.username
                })
            },
            (err, num_rows) => { //executed after finished
                if (err) return done(err);

                return done(null, { //returns full details of the post, author and likes
                    post_id: post_details.post_id,
                    timestamp: post_details.date_published,
                    text: post_details.text,
                    author: {
                        user_id: post_details.user_id,
                        first_name: post_details.first_name,
                        last_name: post_details.last_name,
                        username: post_details.username
                    },
                    likes: likes
                })
            }
        )

    })
}

const updatePost = (post_id, user_id, new_text, done) => {

    const sql = `SELECT post_id, author_id 
                FROM posts 
                WHERE post_id = ?`

    db.get(sql, [post_id], (err, validate) => {

        if (err) return done(err);
        if (validate.author_id != user_id) return done(403)
        if (!validate) return done(404);

        const sql = `UPDATE posts SET text=? WHERE post_id=?`;

        db.run(sql, [new_text, post_id], (err) => {
            return done(err);
        })
    })
}

/*
* Validates whether the user has permissions
*/

const deletePost = (post_id, user_id, done) => {

    const sql = `SELECT post_id, author_id 
                FROM posts 
                WHERE post_id = ?`

    db.get(sql, [post_id], (err, validate) => {

        if (err) return done(err);
        if (!validate) return done(404);
        if (validate.author_id != user_id) return done(403);

        const sql = "DELETE FROM posts WHERE post_id=?";

        db.run(sql, [post_id], function (err) {
            if (err) return done(err);
            return done(null);
        })
    })
}

const addLike = (post_id, user_id, done) => {

    const sql = `SELECT post_id FROM posts WHERE post_id = ?`

    db.get(sql, [post_id], (err, post) => {
        if (err) return done(err);
        if (!post) return done(404);

        const sql = "SELECT post_id, user_id FROM likes WHERE post_id = ? AND user_id = ?"

        db.get(sql, [post_id, user_id], (err, validate) => { //Check if user has already liked post
            if (err) return done(err);
            console.log(validate);
            console.log(post_id, user_id);
            if (validate) return done(403);

            const sql = "INSERT INTO likes (post_id, user_id) VALUES (?,?)"

            db.run(sql, [post_id, user_id], function (err) {
                if (err) return done(err);
                return done(null);
            })
        })

    })


}

const removeLike = (post_id, user_id, done) => {

    const sql = `SELECT post_id FROM posts WHERE post_id = ?`

    db.get(sql, [post_id], (err, post) => {
        if (err) return done(err);
        if (!post) return done(404);

        const sql = "SELECT post_id, user_id FROM likes WHERE post_id = ? AND user_id = ?"

        db.get(sql, [post_id, user_id], (err, validate) => {

            if (err) return done(err);
            if (!validate) return done(403);

            const sql = "DELETE FROM likes WHERE post_id=? AND user_id=?"

            db.run(sql, [post_id, user_id], function (err) {
                if (err) return done(err)
                return done(null);

            })
        })
    })
}

module.exports = {
    addNewPost: addNewPost,
    getSinglePost: getSinglePost,
    updatePost: updatePost,
    deletePost: deletePost,
    addLike: addLike,
    removeLike: removeLike
}
