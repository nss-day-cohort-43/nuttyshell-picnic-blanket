import {getPublicMessages, usePublicMessages, savPublicMessage} from './MessageProvider.js'
import {messageWriter} from './Message.js'

const eventHub = document.querySelector(".container")


eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
    if (isClicked === "postPublicMessageBtn") {
        const newMessage = document.querySelector("#newPublicMessage").value
        const userId = sessionStorage.getItem("activeUser")
        console.log(userId)
        const message = {
            private: false,
            userId: parseInt(userId),
            userReceive: null,
            message: newMessage,
            dateSent: Date(),
            read: true
        }
        savPublicMessage(message)
        


    }
})

//Create the section where public messages will be rendered
export const publicMessagesStarter = () => {
    //Set the destination where this section will be rendered
    const contentTarget = document.querySelector(".dashboard")
    //Inject this section into the above destination
    contentTarget.innerHTML = `
        <section class="public-messages-box">
            <h2 class="publicMessagesTitle"> Public Messages</h2>
            <div class="rendered-public-messages"></div>
            <div class="composePublicMessage">
                <input type="text" id="newPublicMessage">
                <button class="postPublicMessageBtn">Send</button>
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
        //For each message in our array, write this HTML using the data from it
        const showMessages = messages.map((message) => {
            contentTarget.innerHTML += messageWriter(message)
        })
    })
}
