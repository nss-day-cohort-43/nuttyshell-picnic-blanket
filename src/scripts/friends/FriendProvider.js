let friends = [];

export const getFriends = () => {
    debugger;
    const usrId = sessionStorage.getItem("activeUser")
    console.log("usrId: ",usrId)
    fetch(`http://localhost:8088/friends?userId=${usrId}`)
    .then(response => response.json())
    .then(
        parsedRelationships => {
            console.log("Here!")
            //const currentUserFriends = parsedRelationships.filter(friend => friend.userId === usrId )
            //friends = currentUserFriends
            friends = parsedRelationships
        }
    )
}

export const useFriends = () => {
    return friends.slice();
}