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
            const [prefix, messageID] = event.target.id.split("-")
            editPrep(messageID)
        }
        else {
            // If user saves the updated message
            if (isClicked === "editMessageSave"){
                const [prefix, messageID] = event.target.id.split("-")
                editBuilder(messageID)
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
    const contentTarget = document.querySelector(".composePublicMessage-edit")
    // Create the HTML area
    contentTarget.innerHTML += `
        <input id="edit-message-input" type="text" value="${matchingMessage.message}">
        <button class="editMessageSave" id="editMessageSave-${messageID}">Save</button>
        `
}

// Return the HTML to be rendered for others individual messages
export const othersMessageWriter = message => {
    return `<div class="public-message">${message.user.username}: ${message.message}</div>`
}

// Return the HTML to be rendered for users individual messages
export const myMessageWriter = message => {
    return `<div class="public-message">
                ${message.user.username}: ${message.message}
                <div class="public-message-delete" id="deletePublicMessage-${message.id}">
                    ❌
                </div>
                <div class="public-message-edit" id="editPublicMessage-${message.id}">
                    ✏️
                </div>
            </div>
    `
}