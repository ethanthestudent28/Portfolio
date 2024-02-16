const socials = require("../models/social.server.models");
const users = require("../models/user.server.models");

const get_user = (req,res) => {
    let user_id = parseInt(req.params.user_id);

    socials.getUser(user_id, (err, user_info) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);
        return res.status(200).send(user_info);
    })
}

const follow_user = (req,res) => {
    let user_id = parseInt(req.params.user_id);
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, follower_id) => {
        if(err) return res.sendStatus(err);

        socials.followUser(user_id, follower_id, (err) => {
            if(err == 404) return res.sendStatus(404);
            if(err == 403) return res.status(403).send("You have already followed this user");
            if(err) return res.sendStatus(500);
            return res.sendStatus(200);
        })
    })
}

const unfollow_user = (req,res) => {
    let user_id = parseInt(req.params.user_id);
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, follower_id) => {
        if(err) return res.sendStatus(err);

        socials.unfollowUser(user_id, follower_id, (err) => {
            if(err == 404) return res.sendStatus(404);
            if(err == 403) return res.status(403).send("You cannot unfollow a user that you are not following");
            if(err) return res.sendStatus(500);
            return res.sendStatus(200);
        })
    })
}

const search_user = (req,res) => {
    let query = req.query.q;
    if(!query) query = "";

    socials.searchUser(query, (err, user) => {
        if(err == 400) return res.sendStatus(400);
        if(err) return res.sendStatus(500);
        return res.status(200).send(user);
    })

}

module.exports = {
    get_user: get_user,
    follow_user: follow_user,
    unfollow_user: unfollow_user,
    search_user: search_user
};