const feed = require("../models/feed.server.models");
const users = require("../models/user.server.models")

const get_feed = (req, res) => {
    let token = req.get("X-Authorization")
    console.log(token);
    if(!token) {
        feed.getStandardFeed((err, feed) => {
            if(err) return res.sendStatus(err);
            return res.Status(200).send(feed);
        }) 
    }else if(token){
        users.getIdFromToken(token, (err, user_id) => {
            if(err) return res.sendStatus(err);
            feed.getLoginFeed(user_id, (err, feed) => {
                if(err) return res.sendStatus(err);
                return res.Status(200).send(feed);
            })
        })
    }


}

module.exports = {
    get_feed: get_feed
}