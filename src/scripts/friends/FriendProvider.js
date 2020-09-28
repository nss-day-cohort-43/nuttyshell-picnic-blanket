let friends = [];
let users = [];


const eventHub = document.querySelector(".container");
// Let the applicaiton know the friend object state was changed
const dispatchFriendStateChangeEvent = () => {
    const friendStateChangedEvent = new CustomEvent("friendStateChanged")

    eventHub.dispatchEvent(friendStateChangedEvent)
}

export const getFriends = () => {
    const usrId = sessionStorage.getItem("activeUser")

    // Fetch the friends of the current user
    // where the userId = friendId -- get all users that are friends with that friendId
    return fetch(`http://localhost:8088/friends?_expand=user&friendId=${usrId}`) 
    .then(response => response.json())
    .then(
        parsedRelationships => { // parsedRelationships is an array of objects!
            friends = parsedRelationships
        }
    )
}

export const useFriends = () => friends.slice();

export const getUsers = () => {
    return fetch(`http://localhost:8088/users?`)
    .then(response => response.json())
    .then(
        parsedUsers => { // parsedUsers is an array of user objects
            console.log("ParsedUsers: ", parsedUsers);
            // return an array of just the uernames
            let usernames = parsedUsers.map(user => {
                console.log("user.username: ", user.username);
                if(user.username !== ""){
                    // If the user has a username of at least one character
                    return user.username
                }
            });
            users = usernames; // only get the usernames of each user
            console.log("users: ", users);
        }
    )
}

export const useUsers = () => users.slice();

// save the added friend to the friends object in the api
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