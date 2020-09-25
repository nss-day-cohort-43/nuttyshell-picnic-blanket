import {deletePublicMessage, editPublicMessage, usePublicMessages} from './MessageProvider.js'

const eventHub = document.querySelector(".container")

// Listen for clicks on individual messages and respond accordingly
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
    // If user pressed the delete icon
    if (isClicked === "public-message-delete") {
        const [prefix, messageID] = event.target.id.split("-")
       deletePublicMessage(messageID)
    }
    // If user pressed the edit icon
    else {
        if (isClicked ==="public-message-edit") {
            // Pull the message ID from the element ID
            const [prefix, messageID] = event.target.id.split("-")
            // Send message ID to the editPrep function for the editing area
            editPrep(messageID)
        }
    else {
        // If user saves the updated message
        if (isClicked === "editMessageSave"){
            const [prefix, messageID] = event.target.id.split("-")
            editBuilder(messageID)
        }
        else {
            if (isClicked === "editCancel") {
                console.log("nevermind")
            }
        }
    }
       

    }
})

// Edit object that will be updated with new information
const editBuilder = (messageID) => {
    // Get an array of messages for comparison
    const messages = usePublicMessages()
    // Find the correct message based of the ID
    const matchingMessage = messages.find((message) => {
        return message.id === parseInt(messageID)
    })
    // Retrieve the updated message the user has input
    const newMessageRetrieve = document.querySelector("#edit-message-input").value
    // Update the message object with the updated message
    matchingMessage.message = newMessageRetrieve
    // send the updated object to be pushed to the api
    editPublicMessage(matchingMessage)
}

// Render the area of the form where the message will be edited
const editPrep = (messageID) => {
    // Get an array of messages for comparison
    const messages = usePublicMessages()
    // Find the correct message based of the ID
    const matchingMessage = messages.find((message) => {
        return message.id === parseInt(messageID)
    })
    // Declare where our HTML will be injected
    const contentTarget = document.querySelector(`#public-message-content-${messageID}`)
    // Ensure only one message is edited at a time by checking to see if a message is currently being edited
    if (contentTarget) {
        // If a message is being edited, clear that so the new one can be edited instead
        contentTarget.innerHTML = ""
    }
    // Create the HTML area
    contentTarget.innerHTML += `
        <div class="editPublicMessage">
            <input id="edit-message-input" type="text" value="${matchingMessage.message}">
            <button class="editMessageSave" id="editMessageSave-${messageID}">Save</button>
            <button class="editCancel">Cancel</button>
        </div>
        `
}

// Return the HTML to be rendered for others individual messages
export const othersMessageWriter = message => {
    return `<div class="public-message" id="public-message-${message.id}">${message.user.username}: ${message.message}</div>`
}

// Return the HTML to be rendered for users individual messages
export const myMessageWriter = message => {
    return `<div class="public-message" id="public-message-${message.id}">
                ${message.user.username}: <div id="public-message-content-${message.id}">${message.message}</div>
                <div class="public-message-edit" id="editPublicMessage-${message.id}">
                    ✏️
                </div>
                <div class="public-message-delete" id="deletePublicMessage-${message.id}">
                    ❌
                </div>
                
            </div>
    `
}