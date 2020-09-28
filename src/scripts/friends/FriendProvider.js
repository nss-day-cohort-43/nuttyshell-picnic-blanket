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
    // where the userId = friendId -- get all users that are friends with that friendId
    return fetch(`http://localhost:8088/friends?_expand=user&friendId=${userId}`) 
    .then(response => response.json())
    .then(
        parsedRelationships => { // parsedRelationships is an array of objects!
            friends = parsedRelationships
        }
    )
}

export const useFriends = () => friends.slice();

// -------------------- Get just one friendship ------------------

export const getFriendship = (friendId) => {
    const userId = sessionStorage.getItem("activeUser");
    return fetch(`http://localhost:8088/friends?&friendId=${friendId}&userId=${userId}`)
    .then(response => response.json())
    .then(
        parsedFriendAToB => {
            friendship[0] = parsedFriendAToB
        }
    )
    .then(
        fetch(`http://localhost:8088/friends?&friendId=${userId}&userId=${friendId}`)
        .then(response => response.json())
        .then(
            parsedFriendBToA => {
                friendship[1] = parsedFriendBToA
            }
        )
    )
}

export const useFriendship = () => friendship.slice();

// ------------------------ Get all users ----------------------------

export const getUsers = () => {
    return fetch(`http://localhost:8088/users?`)
    .then(response => response.json())
    .then(
        parsedUsers => { // parsedUsers is an array of user objects
            console.log("ParsedUsers: ", parsedUsers);
            users = parsedUsers; // array of user objects
            console.log("users: ", users);
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
export const deleteFriend = (id1, id2) => {
    return fetch(`http://localhost:8088/friends?&friendId=${id1}&userId=${id2}`, {
        method: "DELETE",
    })
    .then(getFriends)
    .then(dispatchFriendStateChangeEvent)
}