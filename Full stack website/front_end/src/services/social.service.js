const getUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id)
    .then((response) => {
        if(response.status === 200) {
            return response.json();
        }else{
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

const followUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow",
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
            throw "Unauthorized"
        }else if(response.status === 403) {
            throw "Already following this user"
        }else {
            throw "Something went wrong"
        }
    })
    .catch((err) => {
        console.log("Err", err);
        return Promise.reject(err);
    })
}

const unfollowUser = (user_id) => {
    return fetch("http://localhost:3333/users/" + user_id + "/follow",
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
            throw "Unauthorized"
        }else if(response.status === 403) {
            throw "Cannot unfollow a user that you are not following"
        }else {
            throw "Something went wrong"
        }
    })
    .catch((err) => {
        console.log("Err", err)
        return Promise.reject(err)
    })
}

const search = (query) => {
    return fetch("http://localhost:3333/search?q=" + query)
    .then((response) => {
        if(response.status === 200) {
            return response.json();
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

export const socialService = {
    getUser,
    followUser,
    unfollowUser,
    search
}