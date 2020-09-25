import { FriendHTML } from "./Friend.js"
import { getFriends, useFriends } from "./FriendProvider.js"

const eventHub = document.querySelector(".container");
const activeUser = sessionStorage.getItem("activeUser"); // get the active user

// renders current user's friends when first opening Nutshell
export const renderFriendsInitial = () => {
    console.log("activeUser", activeUser);
    getFriends()
    .then(() => {
        const friends = useFriends();
        const friendsContentTarget = document.querySelector(".dashboard")
        friendsContentTarget.innerHTMl = `
            <section class="myFriends">
                <h1 class="myFriendsTitle">Friends</h1>
                <div id="addFriend">
                    <button type="button" id="addNewFriend-btn">Add a Friend</button>
                    <div id="addFriendByUsername"></div>
                </div>
                <div class="friendsList">
                    ${
                        friends.map(friend => {
                            return FriendHTML(friend)
                        }).join("")
                    }
                </div>
        `
    })
    
}

// This function will show the form to add a friend by their username
const renderAddFriendForm = () => {
    const contentTarget = document.getElementById("addFriendByUsername");
    contentTarget.innerHTML = `
        <div class="addFriend-form">
            <input type="text" placeholder="Enter a username" name="usernameSearch">
            <button type="submit" id="saveFriendBtn">Save Friend</button>
        </div>
    `
}




//toggleAddFriendForm() will toggle between showing and hiding the add-friend-form

// When the "Add a Friend" button is in an unpressed state and then pressed
//      call this function and the form will render.

// When the "Add a Friend" button is in a pressed state and then pressed
//      call this function and the form will be removed. 

const toggleAddFriendForm = () => {
    const contentTarget = document.getElementById("addFriendByUsername")
    if(document.querySelector("addFriend-form")){
        // If the addFriendForm exists, remove it
        contentTarget.innerHTML = "";
    }
    else {
        // If the addFriendForm does not exist, render it
        renderAddFriendForm();
    }
}

eventHub.addEventListener("click", event => {
    if(event.target.id === "addNewFriend-btn"){
        toggleAddFriendForm();
    }
})
