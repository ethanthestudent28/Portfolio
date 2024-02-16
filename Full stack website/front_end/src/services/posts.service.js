const getPost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id)
    .then((response) => {
        if(response.status === 200){
            return response.json();
        }else{
            throw "Something went wrong"
        }
    })
    .then((resJson) => {
        return resJson;
    })
    .catch((error) => {
        console.log("Err", error)
        return Promise.reject(error)
    })
}

const addPost = (post) => {
    return fetch("http://localhost:3333/posts",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "text": post
        })
    })
    .then((response) => {
        if(response.status === 201) {
            return response.json();
        }else if(response.status === 401) {
            throw "Unauthorised"
        }else {
            throw "Something went wrong"
        }
    })
    .then((resJson) => {
        return resJson;
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err);
    })
}

const deletePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id,
    {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200) {
            return
        }else if(response.status === 401){
            throw "Unauthorised"
        }else if(response.status === 403){
            throw "You can only delete your own posts"
        }else {
            throw "Something went wrong"
        }
    })
    .catch((err) => {
        console.log("Err", err);
        return Promise.reject(err);
    })
}

const updatePost = (post_id, new_post) => {
    return fetch("http://localhost:3333/posts/" + post_id,
    {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": localStorage.getItem("session_token")
        },
        body: JSON.stringify({
            "text": new_post
        })
    })
    .then((response) => {
        if(response.status === 200) {
            return
        }else if(response.status === 401) {
            throw "Unauthorised"
        }else if (response.status === 403) {
            throw "You can only update your own posts"
        }else{
            throw "Something went wrong"
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err);
    })
};

const likePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like",
    {
        method: "POST",
        headers: {
            "X-Authorization": localStorage.getItem("session_token")
        }
    }) 
    .then((response) => {
        if(response.status === 200) {
            return
        }else if(response.status === 401) {
            throw "Unauthorised"
        }else if(response.status === 403) {
            throw "You have already liked this post"
        }else {
            throw "Something went wrong"
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err);
    })
}

const unlikePost = (post_id) => {
    return fetch("http://localhost:3333/posts/" + post_id + "/like",
    {
        method: "DELETE",
        headers: {
            "X-Authorization": localStorage.getItem("session_token")
        }
    })
    .then((response) => {
        if(response.status === 200) {
            return
        }else if(response.status === 401) {
            throw "Unauthorised"
        }else if(response.status === 403) {
            throw "Cannot unlike post that hasnt been liked"
        }else {
            throw "Something went wrong"
        }
    })
    .catch((err) => {
        console.log("Err", err);
        return Promise.reject(err);
    })
}

export const postService = {
    getPost,
    deletePost,
    updatePost,
    addPost,
    likePost,
    unlikePost
}