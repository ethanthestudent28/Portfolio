const posts = require("../models/post.server.models");
const users = require("../models/user.server.models");
const Joi = require("joi");

const add_post = (req, res) => {
    const schema = Joi.object({
        text: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let post = Object.assign({}, req.body);
    let token = req.get("X-Authorization");
    
    users.getIdFromToken(token, (err, userid) => {

        posts.addNewPost(post, userid, (err, id) => {
            if(err) {
                return res.sendStatus(500);
            }else{
                return res.status(201).send({post_id: id});
            }
        })
    })
};

const get_post = (req,res) => { 
    let post_id = parseInt(req.params.post_id) //stores requests post id 
    
    posts.getSinglePost(post_id, (err, result) => { //sends post_id to model function to get posts details
        if(err == 404) return res.sendStatus(404)
        if(err) return res.sendStatus(500)

        return res.status(200).send(result)
    })
};

const update_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, id) => {

        posts.getSinglePost(post_id, (err, post) => {
            if(err == 404) return res.sendStatus(404);
            if(err) return res.sendStatus(500);
    
            const schema = Joi.object({
                "text": Joi.string().required()
            })
    
            const { error } = schema.validate(req.body);
            if(error) return res.status(400).send(error.details[0].message);
            
            posts.updatePost(post_id, id, req.body.text, (err) => {
                if(err == 403) return res.status(403).send("You can only update your own posts");
                if(err) return res.sendStatus(500);
                return res.sendStatus(200);
            })
        })

    })

    
};

const delete_post = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, id) => {

        posts.deletePost(post_id, id, (err) => {
            if(err == 404) return res.sendStatus(404);
            if(err == 403) return res.status(403).send("You can only delete your own posts");
            if(err) return res.sendStatus(500);
            return res.sendStatus(200);
    
        })
        
    })
    
};

const add_like = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, id) => {

        posts.addLike(post_id, id, (err) => {
            if(err == 404) return res.sendStatus(404);
            if(err == 403) return res.status(403).send("You have already liked this post");
            if(err) return res.sendStatus(err);
            return res.sendStatus(200);
        })
    })

    };

const remove_like = (req, res) => {
    let post_id = parseInt(req.params.post_id);
    let token = req.get("X-Authorization");

    users.getIdFromToken(token, (err, id) => {
        posts.removeLike(post_id, id, (err) => {
            if(err == 404) return res.sendStatus(404);
            if(err == 403) return res.status(403).send("You cannot unlike a post that you have not yet liked");
            return res.sendStatus(200);
        });
    })        
};


module.exports = {
    add_post: add_post,
    get_post: get_post,
    update_post: update_post,
    delete_post: delete_post,
    add_like: add_like,
    remove_like: remove_like,
};