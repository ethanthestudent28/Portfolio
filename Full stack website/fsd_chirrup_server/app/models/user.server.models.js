const crypto = require("crypto");
const db = require("../../database");

//Authentication

const getHash = (password, salt) => {
    return crypto.pbkdf2Sync(password, salt, 100000, 256, "sha256").toString("hex");
};

/*
* Checks whether inputted username and password is correct and returns the id
* of correct user if it is
*/

const authenticateUser = (username, password, done) => {
    const sql = ("SELECT user_id, password, salt FROM users WHERE username = ?")

    db.get(sql, [username], (err, row) => {
        if (err) return done(err);
        if (!row) return done(404); //user doesn't exist

        if (row.salt === null) row.salt = "";
        let salt = Buffer.from(row.salt, "hex");

        if (row.password === getHash(password, salt)) {
            return done(false, row.user_id)
        } else {
            return done(404)
        }
    })
}

//User methods

/*
* Creates a salt and a hash from the password, inserts the user details into the db with the
* hashed password and then returns the user id of new user
*/

const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    const sql = `SELECT username FROM users WHERE username = ?`
    db.get(sql, [user.username], function (err, username) {

        if (username) return done(400);
        const sql = `INSERT INTO users (first_name, last_name, username, password, salt)
                VALUES (?,?,?,?,?)`;
        let values = [user.first_name, user.last_name, user.username, hash, salt.toString("hex")];

        db.run(sql, values, function (err) {
            if (err) return done(err);
            return done(null, this.lastID);
        });
    })
};


/*
* Checks whether user has a session token and returns and error if not
*/

const getToken = (id, done) => {

    const sql = "SELECT session_token FROM users WHERE user_id = ?";

    db.get(sql, [id], (err, row) => {

        if (err) return done(err);
        if (!row) return done(404);
        return done(null, row.session_token);

    })
};

/*
* Creates a random token for user and stores in database under their id
*/

const setToken = (id, done) => {

    let token = crypto.randomBytes(16).toString("hex");
    const sql = "UPDATE users SET session_token=? WHERE user_id = ?";

    db.run(sql, [token, id], (err) => {
        return done(err, token);
    })
};

/*
* Removes the session token for a user 
*/ 

const removeToken = (token, done) => {
    const sql = "UPDATE users SET session_token = null WHERE session_token = ?";

    db.run(sql, [token], (err) => {
        return done(err);
    })
};

/*
* Checks whether a token is available for user and returns the user id from it
*/

const getIdFromToken = (token, done) => {
    const sql = "SELECT user_id FROM users WHERE session_token = ?"

    db.get(sql, [token], function (err, id) {
        if (err) return done(err);
        if (!id) return done(404);
        return done(null, id.user_id);
    })
};

module.exports = {
    addNewUser: addNewUser,
    authenticateUser: authenticateUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getIdFromToken: getIdFromToken
}