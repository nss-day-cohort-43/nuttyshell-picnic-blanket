import { FriendHTML } from "./Friend.js"
import { getFriends, useFriends, getUsers, useUsers, saveFriend } from "./FriendProvider.js"

const eventHub = document.querySelector(".container");
const activeUser = sessionStorage.getItem("activeUser"); // get the active user

let validUsers = [];

// renders current user's friends when first opening Nutshell
export const renderFriendsInitial = () => {
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
    getFriends() // fetch all of the current user's friends
    .then(() => {
        const friends = useFriends();
        makeFriendList(friends);
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
        toggleAddFriendForm(); // open or close the add friend form when "add new friend" button is pressed
    }
    else if(event.target.id === "saveFriendBtn"){
        const inputUsername = document.querySelector(".friend-search-box");
        // check if username is entered
        if(inputUsername.input !== ""){
            // If username entered is valid, send the friend a friend request and close the form

            // Use a .find() to find the specific username entered by the current user
            let targetUser = validUsers.find(user => {
                return user === inputUsername.input;
            })
            console.log("targetUser: ", targetUser);

            // Save your new friend:
            saveFriend(targetUser);
            // clear input
            inputUsername.input = ""
                toggleAddFriendForm();
            }
            else {
            }


        }
        else {
            // No username entered, do nothing

        }
    }
})
