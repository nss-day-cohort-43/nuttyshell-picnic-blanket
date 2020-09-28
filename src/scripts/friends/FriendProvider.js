let friends = [];

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

export const useFriends = () => {
    return friends.slice();
}