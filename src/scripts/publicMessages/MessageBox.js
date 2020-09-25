import {getPublicMessages, usePublicMessages, savePublicMessage} from './MessageProvider.js'
import {myMessageWriter, othersMessageWriter} from './Message.js'

const eventHub = document.querySelector(".container")

//Listen for the send message button to be clicked
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
    if (isClicked === "postPublicMessageBtn") {
        const newMessage = document.querySelector("#newPublicMessage").value
        const userId = sessionStorage.getItem("activeUser")
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
    messagesRender()
}

//Place each individual message into the box reserved for public messages
const messagesRender = () => {
    //Fetch updated messages and then only continue when that step has completed
    getPublicMessages()
    .then(() => {
        //Get an array of fetched messages to use
        const messages = usePublicMessages()
        //Set the destination for where individual messages should be rendered
        const contentTarget = document.querySelector(".rendered-public-messages")
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
    })
}
