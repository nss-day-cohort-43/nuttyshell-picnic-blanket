import {getPublicMessages, usePublicMessages, savePublicMessage} from './MessageProvider.js'
import {messageWriter} from './Message.js'
import {getFriends, useFriends, getUsers, useUsers, saveFriend} from '../friends/FriendProvider.js'

const eventHub = document.querySelector(".container")
const userId = sessionStorage.getItem("activeUser");

let myFriendsArray = [];
let allUsers = [];

//Listen for the send message button to be clicked
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value;
    if (isClicked === "postPublicMessageBtn") {
        // Retrieve the entered message from the message input
        const newMessage = document.querySelector("#newPublicMessage").value
        const userId = sessionStorage.getItem("activeUser")
        // If the message doesnt start with @, it is safe to assume it is a public message
        if (newMessage.startsWith("@") === false) {
            //Create the obeject to be sent to the database
            const message = {
                private: false,
                userId: parseInt(userId),
                userReceive: null,
                message: newMessage,
                dateSent: Date.now(),
                read: true
            }
            //Send the object to the database
            savePublicMessage(message)
            .then(document.querySelector("#newPublicMessage").value = "")
        } 
        else {
            if (newMessage.startsWith("@") === true) {
                // Seperate the first set of chars from the string, which will be @username
                const [userFind, content] = newMessage.split(" ")
                // Remove the leading @
                const recipient = userFind.substring(1)
                // Get users friends
                getFriends()
                .then(() => {
                    // Create an array to work with
                    const allFriends = useFriends()
                    // Create an array for comparisons
                    let friendsArray = []
                    // Push usernames of friends to friends array for comparisons
                    allFriends.map((friend) => {
                        friendsArray.push(friend.user.username)
                    })
                    // Do this if "recipient" is a friend
                    if (friendsArray.includes(recipient)) {
                        //Retrieve the recipients entire object
                        const receiver = allFriends.find((friend) => {
                            return friend.user.username === recipient
                        })
                        //Create the obeject to be sent to the database
                        const message = {
                            private: true,
                            userId: parseInt(userId),
                            userReceive: receiver.userId,
                            message: newMessage,
                            dateSent: Date.now(),
                            read: true
                        }
                        //Send the object to the database
                        savePublicMessage(message)
                    }
                })  
            }
        }
    }
    // Listen for click of the button to add a user as a friend from public messages
    else if(event.target.id.startsWith("save-friend-from-message-btn")){
        const [prefix, id] = event.target.id.split("--"); // capture the id of the other username
        //toggleRenderAddFriendDropdown(id);
        const userToFriend = allUsers.find(user => {
            return user.id == id
        }); 
        
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
        removeAddButtons(userToFriend.id);
    
    }
})


//Create the section where public messages will be rendered
export const publicMessagesStarter = () => {
    // debugger
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
        myFriendsArray = useFriends();
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
export async function messagesRender() {
    //Get an array of fetched messages to use
    let messages = await getPublicMessages()
    //Set the destination for where individual messages should be rendered
    const contentTarget = document.querySelector(".rendered-public-messages")
    //For each message in our array, write HTML using the data from it
    const showMessages = async () => {
        return Promise.all(messages.map(messageObj => messageWriter(messageObj)))
    }
    showMessages().then(result => {
        
        contentTarget.innerHTML = result.join("")
    })
     // Target element where rendered messages are
    const element = document.querySelector(".rendered-public-messages");
    // Keep rendered messages window scrolled to the bottom
    element.scrollTop = element.scrollHeight;
}

//fetches, renders, and reconnects every second to simulate real time chat
export async function chatFeed() {
    await getPublicMessages();
    messagesRender()
    await new Promise(resolve => setTimeout(resolve, 1000));
    await chatFeed();
}


// --------- adding a friend by message ---------- 
export const publicMessageUsername = (otherUser) => {
    if(isUserUnfamiliar(otherUser)){
        // If the other username is unfamiliar, return ClickableUsername
        return `
            <h5 class="public-message-username" id="normalUsername--${otherUser.id}">${otherUser.username}</h5>
            <div class="addNewFriendFromMessage">
                <button type="button" name="add-friend-btn-${otherUser.id}" class="addFriendBtn" id="save-friend-from-message-btn--${otherUser.id}">+</button>
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
    if(targetUser.id != userId){
    // targetUser is the specifc username belonging to a public chat message
    // Is the username the same as any of active user's existing friends?
        const isFriend = myFriendsArray.find(friend => friend.user.username === targetUser.username)
        if(!isFriend){
            //console.log("Message username is not a friend of active user");
            // If targetUser is not one of the active user's friends, return true
            return true;
        }
        else{
            //console.log("Message username is a friend of active user");
            return false;
        }
    }
    else{
        //console.log("Message username is me, active user");
        return false;
    }
}

// This function removes all the "add-friend-btn" buttons relating to a specific username
// once the username has been added as a friend
const removeAddButtons = (otherUserId) => {
    let buttonTarget = document.getElementsByName(`add-friend-btn-${otherUserId}`);
    // buttonTarget is an array of DOM elements, in this case a list of all the 
    // messages made by a certain user
    buttonTarget.forEach(btn => {
        btn.setAttribute("style", "display: none;");
    })
}

eventHub.addEventListener("friendStateChanged", event => {
    // Friend State updated, refresh friends
    console.log("FRIENDS CHANGED");
    //toggleRenderAddFriendDropdown()
})