users = require("../models/user.server.models");

const checkAuthentication = function(req, res, next){
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, id) => {
        if (err || id === null) {
            return res.sendStatus(401);
        }
        next();
    });
    
    
}

module.exports = {
    checkAuthentication: checkAuthentication

}