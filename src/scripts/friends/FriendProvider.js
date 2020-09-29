let friends = [];
let users = [];

let friendship = [];


const eventHub = document.querySelector(".container");
// Let the applicaiton know the friend object state was changed
const dispatchFriendStateChangeEvent = () => {
    const friendStateChangedEvent = new CustomEvent("friendStateChanged")

    eventHub.dispatchEvent(friendStateChangedEvent)
}

// --------------- Get all friends of current user -----------------

export const getFriends = () => {
    const userId = sessionStorage.getItem("activeUser")

    // Fetch the friends of the current user
    // where the userId = friendUserId -- get all users that are friends with that friendUserId
    return fetch(`http://localhost:8088/friends?_expand=user&friendUserId=${userId}`) 
    .then(response => response.json())
    .then(
        parsedRelationships => { // parsedRelationships is an array of objects!
            friends = parsedRelationships
        }
    )
}

export const useFriends = () => friends.slice();

// -------------------- Get just one friendship ------------------

export const getFriendship = (friendUserId) => {
    const userId = sessionStorage.getItem("activeUser");
    return fetch(`http://localhost:8088/friends?friendUserId=${friendUserId}&userId=${userId}`)
    .then(response => response.json())
    .then(
        parsedFriendAToB => {
            friendship = parsedFriendAToB[0]
        }
    )
}

export const useFriendship = () => {
    return friendship
}

    
// ------------------------ Get all users ----------------------------

export const getUsers = () => {
    return fetch(`http://localhost:8088/users?`)
    .then(response => response.json())
    .then(
        parsedUsers => { // parsedUsers is an array of user objects
            users = parsedUsers; // array of user objects
        }
    )
}

export const useUsers = () => users.slice();



// ---------- Save the added friend to the friends object in the api
export const saveFriend = (friend) => {
    return fetch('http://localhost:8088/friends', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(friend)
    })
    .then(getFriends)
    .then(dispatchFriendStateChangeEvent)
}

// ----------- Delete a selected friend from your friends in the api
export const deleteFriend = id => {
    return fetch(`http://localhost:8088/friends/${id}`, {
        method: "DELETE",
    })
    .then(getFriends)
    .then(dispatchFriendStateChangeEvent)
}