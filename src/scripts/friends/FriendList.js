import { FriendHTML } from "./Friend.js"
import { getFriends, useFriends, getUsers, useUsers, saveFriend, deleteFriend, getFriendship, useFriendship } from "./FriendProvider.js"

const eventHub = document.querySelector(".container");
const userId = sessionStorage.getItem("activeUser"); // get the active user

let validUsers = [];    // array of all valid users
let friendsArray = [];  // store array of all friend objects for friends of the current user

// renders current user's friends when first opening Nutshell
export const renderFriendsInitial = () => {
    const friendsContentTarget = document.querySelector(".dashboard")
    friendsContentTarget.innerHTML += `
        <section id="myFriends">
            <h2 class="myFriendsTitle">Friends</h2>
            <div id="addFriend">
                <button type="button" id="addNewFriend-btn">Add a Friend</button>
                <div id="addFriendByUsername"></div>
            </div>
            <div id="friendsContainer"></div>
        </section>
    `
    getFriends() // fetch all of the current user's friends
    .then(() => {
        friendsArray = useFriends();
        makeFriendList(friendsArray);
    })
    .then(() => {
        // fetch usernames of all valid users and store them in an array 
        fetchValidUsernames(); 
    })
}

// get and store a copy of the usernames of all verified Nutshell users
const fetchValidUsernames = () => {
    getUsers()
    .then(() => {
        validUsers = useUsers();
    })
}


// create and render the list of friends
const makeFriendList = (friends) => {
    const friendsTarget = document.getElementById("friendsContainer");
    friendsTarget.innerHTML = `
        <div class="friendsList">
        ${
            friends.map(friend => {
                return FriendHTML(friend)
            }).join("")
        }
        </div>
    `
}

// This function will show the form to add a friend by their username
const renderAddFriendForm = () => {
    //const contentTarget = document.getElementById("addFriendByUsername");
    return `
        <div class="addFriend-form">
            <input type="text" class="friend-search-box" placeholder="Enter a username" name="usernameSearch">
            <p class="invalid-username-warning"></p>
            <button type="button" id="saveFriend-btn">Save Friend</button>
        </div>
    `;
}

//toggleAddFriendForm() will toggle between showing and hiding the add-friend-form

// When the "Add a Friend" button is in an unpressed state and then pressed
//      call this function and the form will render.

// When the "Add a Friend" button is in a pressed state and then pressed
//      call this function and the form will be removed. 

const toggleAddFriendForm = () => {
    const contentTarget = document.getElementById("addFriendByUsername")
    const formTarget = document.querySelector(".addFriend-form")
    const addFriendBtnTarget = document.getElementById("addNewFriend-btn")

    if(formTarget){
        // If the addFriendForm exists, remove it
        contentTarget.innerHTML = "";
        //lighten the "addNewFriend-btn" button
        addFriendBtnTarget.setAttribute("style", "background-color:rgb(239, 239, 239); border-width:1px; border-radius:2px;");
    }
    else {
        // If the addFriendForm does not exist, render it
        contentTarget.innerHTML += `${renderAddFriendForm()}`;
        // darken the "addNewFriend-btn" button
        addFriendBtnTarget.setAttribute("style", "background-color:lightgrey; border-width:1px; border-radius:2px;");
    }

}


// This event listener listens for clicks of the:
//  - "addNewFriend-btn" button
//  - "saveFriend-btn" button
//  - "deleteFriend-btn" button

eventHub.addEventListener("click", event => {
    if(event.target.id === "addNewFriend-btn"){
        toggleAddFriendForm(); // open or close the add friend form when "add new friend" button is pressed
    }
    else if(event.target.id.startsWith("deleteFriend-btn--")){
        const [prefix, id, friendUserId] = event.target.id.split("--");
        //deletes relationship 1 to 2
        deleteFriend(id)
        //deletes relationship 2 to 1
        getFriendship(friendUserId)
        .then(()=> {
            const relationship = useFriendship()
            const relationshipId = relationship.id
            deleteFriend(relationshipId)
        })
    }
    else if(event.target.id === "saveFriend-btn"){
        const inputUsername = document.querySelector(".friend-search-box");
        const warningTarget = document.querySelector(".invalid-username-warning");
        const trimmedInput = inputUsername.value.trim();
        const userId = sessionStorage.getItem("activeUser");
        // If username entered is not an empty string
        if(trimmedInput !== ""){

            // Check if username entered is valid
            // Use a .find() to find the specific username entered by the current user
            // --------- EACH USERNAME SHOULD BE UNIQUE! ---------
            let targetUser = validUsers.find(user => {
                return user.username === trimmedInput; // returns the matching user object
            })

            // If a valid username was entered, and
            // If username entered is NOT the same as current user's
            if(targetUser){
                if(targetUser.id !== parseInt(userId)){

                    // Is username entered = any of current user's existing friends?
                    if(friendsArray.find(friend => friend.user.username === targetUser.username)){
                        warningTarget.innerHTML = `You and this person are already friends!`;
                    }
                    else{
                        // The username is not the current user's or one of the current user's friends
                        // The username is also valid and not blank
                        // Add the friend

                        // Create two new friend objects representing the friendship between 
                        // the current user and the username they entered and saved

                        // TODO: Implement a friend request system

                        // "id" of each friend object is auto-updated upon POST
                        const friendship_currentUserToFriend = {
                            userId: parseInt(userId),
                            friendUserId: targetUser.id,
                            accepted: true
                        };

                        const friendship_friendToCurrentUser = {
                            userId: targetUser.id,
                            friendUserId: parseInt(userId),
                            accepted: true
                        };

                        warningTarget.innerHTML = "";                   // clear any present warning message
                        saveFriend(friendship_currentUserToFriend);     // save new friend
                        saveFriend(friendship_friendToCurrentUser);     // save new friend
                        inputUsername.input = "";                       // clear input
                        toggleAddFriendForm();                          // close addFriend form
                    }
                }
                else{
                    warningTarget.innerHTML = `Cannot add yourself as a friend`;
                }
            }
            // If an invalid username was entered, display warning and keep input
            else if(!targetUser){
                warningTarget.innerHTML = `${trimmedInput} is not a valid username`;
            }
        }
        // If no username entered, show warning of empty input
        else {
            inputUsername.value = ""; // clear input
            warningTarget.innerHTML = `Please type another user's username`;

        }
    }
})

eventHub.addEventListener("friendStateChanged", event => {
    // Friend State updated, refresh friends
    getFriends() // fetch all of the current user's friends
    .then(() => {
        friendsArray = useFriends();
        makeFriendList(friendsArray);
    })
    .then(() => {
        // fetch usernames of all valid users and store them in an array 
        fetchValidUsernames(); 
    })
})