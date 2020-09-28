import { FriendHTML } from "./Friend.js"
import { getFriends, useFriends } from "./FriendProvider.js"

const eventHub = document.querySelector(".container");
const activeUser = sessionStorage.getItem("activeUser"); // get the active user

// renders current user's friends when first opening Nutshell
export const renderFriendsInitial = () => {
    console.log("activeUser", activeUser);
    const friendsContentTarget = document.querySelector(".dashboard")
    friendsContentTarget.innerHTML += `
        <section id="myFriends">
            <h1 class="myFriendsTitle">Friends</h1>
            <div id="addFriend">
                <button type="button" id="addNewFriend-btn">Add a Friend</button>
                <div id="addFriendByUsername"></div>
            </div>
        </section>
    `
    getFriends()
    .then(() => {
        const friends = useFriends();
        makeFriendList(friends);
    })
}

const makeFriendList = (friends) => {
    const friendsTarget = document.getElementById("myFriends");
    friendsTarget.innerHTML += `
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
            <button type="button" id="saveFriendBtn">Save Friend</button>
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

    if(formTarget){
        // If the addFriendForm exists, remove it
        contentTarget.innerHTML = "";
    }
    else {
        // If the addFriendForm does not exist, render it
        contentTarget.innerHTML += `${renderAddFriendForm()}`;
    }

}

eventHub.addEventListener("click", event => {
    if(event.target.id === "addNewFriend-btn"){
        toggleAddFriendForm();
    }
    else if(event.target.id === "saveFriendBtn"){
        console.log("Save FRIEND!!")
        const input = document.querySelector(".friend-search-box");
        // check if username is entered
        if(input.input !== ""){
            console.log(input.input);
            console.log("Someone entered something")
            // If username entered is valid, send the friend a friend request and close the form
            // TODO: Check if username entered is valid
            // and send the friend a friend request

            /* if (username is valid) {
                - Send friend request to the friend
                - clear input box content
                - close addFriend form: */
                toggleAddFriendForm();
                /*
            }
            else {
                - display below input box that username is not valid
                - keep content in input box
            }

            */

        }
        else {
            // No username entered, do nothing
            console.log("nothing")

        }
    }
})
