import {getPublicMessages, usePublicMessages, savePublicMessage} from './MessageProvider.js'
import {myMessageWriter, othersMessageWriter} from './Message.js'
import {getFriends, useFriends, getUsers, useUsers, saveFriend} from '../friends/FriendProvider.js'

const eventHub = document.querySelector(".container")
const userId = sessionStorage.getItem("activeUser");

let friendsArray = [];
let allUsers = [];

//Listen for the send message button to be clicked
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value;
    console.log("isClicked:", isClicked);
    console.log("target.id: ", event.target.id);
    if (isClicked === "postPublicMessageBtn") {
        const newMessage = document.querySelector("#newPublicMessage").value
        //Create the obeject to be sent to the database
        const message = {
            private: false,
            userId: parseInt(userId),
            userReceive: null,
            message: newMessage,
            dateSent: Date(),
            read: true
        }
        //Send the object to the database
        savePublicMessage(message)
    }
    // Listen for click to open dropdown menu for adding a user as a friend from public messages
    else if(event.target.id.startsWith("save-friend-from-message-btn")){
        const [prefix, id] = event.target.id.split("--"); // capture the id of the other username
        console.log("prefix: ", prefix);
        console.log("id: ", id);
        console.log("allUsers: ", allUsers)
        //toggleRenderAddFriendDropdown(id);
        const userToFriend = allUsers.find(user => {
            return user.id == id
        }); 
        console.log(userToFriend);
        // find the user in the list of all users with the same ID as the id on the public message

        // create the friendship between active user and userToFriend
        const friendship_currentUserToOtherUser = {
            userId: parseInt(userId),
            friendUserId: userToFriend.id,
            accepted: true
        };

        const friendship_otherUserToCurrentUser = {
            userId: userToFriend.id,
            friendUserId: parseInt(userId),
            accepted: true
        };

        saveFriend(friendship_currentUserToOtherUser);     // save new friend
        saveFriend(friendship_otherUserToCurrentUser);     // save new friend
        toggleRenderAddFriendDropdown(userToFriend.id)     // close addFriend form
    
    }
})

//Create the section where public messages will be rendered
export const publicMessagesStarter = () => {
    //Set the destination where this section will be rendered
    document.querySelector(".dashboard").innerHTML += `<div class="public-messages"></div>`
    const contentTarget = document.querySelector(".public-messages")
    //Inject this section into the above destination
    contentTarget.innerHTML = `
        <section class="public-messages-box">
            <h2 class="publicMessagesTitle"> Public Messages</h2>
            <div class="rendered-public-messages"></div>
            <div class="composePublicMessage">
                <input type="text" id="newPublicMessage">
                <button class="postPublicMessageBtn">Send</button>
                <div class="composePublicMessage-edit"></div>
            </div>
        </section>
        `
    //Begin filling that section with individual messages
    getFriends() // fetch all of the current user's friends
    .then(() => {
        friendsArray = useFriends();
        messagesRender();
    })
    .then(() => {
        // fetch usernames of all valid users and store them in an array 
        fetchValidUsers(); 
    })
}

// get and store a copy of the usernames of all verified Nutshell users
const fetchValidUsers = () => {
    getUsers()
    .then(() => {
        allUsers = useUsers();
    })
}

//Place each individual message into the box reserved for public messages
const messagesRender = () => {
    console.log("Rendering Messages");
    // Fetch updated friends
    //fetchFriends()
    //fetchValidUsers()
    //Fetch updated messages and then only continue when that step has completed
    getPublicMessages()
    .then(() => {
        //Get an array of fetched messages to use
        const messages = usePublicMessages()
        //Set the destination for where individual messages should be rendered
        const contentTarget = document.querySelector(".rendered-public-messages")
        contentTarget.innerHTML = ""; // clear any leftover things.
        //For each message in our array, write HTML using the data from it
        const showMessages = messages.map((message) => {
            //If message was created by logged in user, use this code which allows deleting
            if (message.userId === parseInt(sessionStorage.getItem("activeUser"))) {
                contentTarget.innerHTML += myMessageWriter(message)
            }
            //If message was NOT created by logged in user, use this code
            else {
                contentTarget.innerHTML += othersMessageWriter(message)
            }
        })
        console.log("showMessages: ", showMessages);
    })
}


// --------- adding a friend by message ---------- 
export const publicMessageUsername = (otherUser) => {
    if(isUserUnfamiliar(otherUser)){
        // If the other username is unfamiliar, return ClickableUsername
        return `
            <h5 class="public-message-username" id="normalUsername--${otherUser.id}">${otherUser.username}</h5>
            <div class="addNewFriendFromMessage">
                <button type="button" class="addFriendBtn show" id="save-friend-from-message-btn--${otherUser.id}">+</button>
            </div>
        `          
    }
    else{
        return `
            <h5 class="public-message-username" id="normalUsername--${otherUser.id}">${otherUser.username}</h5>
        `
    }
}

export const isUserUnfamiliar = (targetUser) => {
    console.log(targetUser);
    if(!targetUser.id == userId){
    // targetUser is the specifc username belonging to a public chat message
    // Is the username the same as any of active user's existing friends?
        const isFriend = friendsArray.find(friend => friend.user.username === targetUser.username)
        if(!isFriend){
            console.log("Message username is not a friend of active user");
            // If targetUser is not one of the active user's friends, return true
            return true;
        }
        else{
            console.log("Message username is a friend of active user");
            return false;
        }
    }
    else{
        console.log("Message username is me, active user");
        return false;
    }
}

// This function toggles between showing and hiding the dropdown each time the button is clicked
const toggleRenderAddFriendDropdown = (otherUserId) => {
    console.log("TOGGGGGGGLE");
    console.log("otherUser: ", otherUserId);
    const buttonTarget = document.getElementById(`save-friend-from-message-btn--${otherUserId}`);
    console.log("buttonTarget: ", buttonTarget)
    buttonTarget.classList.remove("show");
}

eventHub.addEventListener("friendStateChanged", event => {
    // Friend State updated, refresh friends
    console.log("FRIENDS CHANGED");
    //toggleRenderAddFriendDropdown()
})