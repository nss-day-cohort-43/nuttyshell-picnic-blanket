import {getPublicMessages, usePublicMessages, savePublicMessage} from './MessageProvider.js'
import {messageWriter} from './Message.js'
import {getFriends, useFriends} from '../friends/FriendProvider.js'

const eventHub = document.querySelector(".container")

//Listen for the send message button to be clicked
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
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
    messagesRender()
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
