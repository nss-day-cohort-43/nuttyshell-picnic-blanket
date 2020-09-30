import {deletePublicMessage, editPublicMessage, usePublicMessages} from './MessageProvider.js'
import {publicMessagesStarter, messagesRender} from './MessageBox.js' 

const eventHub = document.querySelector(".container")

// Listen for clicks on individual messages and respond accordingly
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
    const [prefix, messageID] = event.target.id.split("-")
    const messages = usePublicMessages()
    const matchingMessage = messages.find((message) => {
        return message.id === parseInt(messageID)
    })
    const editBox = document.querySelector(".editPublicMessage")
    // If user pressed the delete icon
    if (isClicked === "public-message-delete") {
        deletePublicMessage(messageID)
    }
    // If user pressed the edit icon
    else {
        // Check to see if you pressed edit
        if (isClicked ==="public-message-edit") {
            // Check to see if an edit area already exists
            if (editBox) {
                // Get the id of the message edit message box so message be re-rendered
                const findID = editBox.id
                // Split the string and pull out just the message ID
                const [prefix, foundID] = findID.split("-")
                // Find target to replace original message
                const oldMessageBox = document.querySelector(`#public-message-content-${foundID}`)
                // Find the original message
                const oldMessageFinder = messages.find((message) => {
                    return message.id === parseInt(foundID)
                })
                // Pull just the message from the object
                const oldMessage = oldMessageFinder.message
                // Clear out the edit box
                editBox.innerHTML = ""
                // Put the old message content back in the box where it was before the attempted editing second message
                oldMessageBox.innerHTML = oldMessage
                // Send the message ID of the new edit target to the editPrep function for the editing area
                editPrep(messageID)
            }
            else {
                // Send message ID to the editPrep function for the editing area
                editPrep(messageID)
            }
        }
        else {
            // If user saves the updated message
            if (isClicked === "editMessageSave"){
                const [prefix, messageID] = event.target.id.split("-")
                editBuilder(messageID)
                document.querySelector(".composePublicMessage-edit").innerHTML = ""
            }
            else {
                if (isClicked === "editCancel") {
                    document.querySelector(".composePublicMessage-edit").innerHTML = ""
                    messagesRender()
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
    const contentTarget = document.querySelector(`.composePublicMessage-edit`)
    // Ensure only one message is edited at a time by checking to see if a message is currently being edited
    if (contentTarget) {
        // If a message is being edited, clear that so the new one can be edited instead
        contentTarget.innerHTML = ""
    }
    // Create the HTML area
    contentTarget.innerHTML += `
        <div class="editPublicMessage" id="editPublicMessage-${messageID}">
            <input id="edit-message-input" type="text" value="${matchingMessage.message}">
            <div class="editMessageSave" id="editMessageSave-${messageID}">💾</div>
            <div class="editCancel">❌</div>
            
        </div>
        `
}

// Return the HTML to be rendered for users individual messages
export async function messageWriter (message) {
    const activeUser = parseInt(sessionStorage.getItem("activeUser"))
    // Check and continue only if message is public
    if (message.private === false) {
        // Allow users to edit their own messages
        if (message.userId === activeUser) {
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
        else {
            return `<div class="public-message" id="public-message-${message.id}">${message.user.username}: ${message.message}</div>`
        }
    }
    else {
        // Render private message for recipients eyes only
        if (message.private === true && message.userReceive === activeUser && message.userId !== activeUser) {
            return `<div class="public-message" id="public-message-${message.id}">${message.user.username}: 🤫 ${message.message}</div>`
        }
        else {
            // Render private message for recipients eyes only with abilite to edit
            if (message.private === true && message.userReceive !== activeUser && message.userId === activeUser) {
                return `<div class="public-message" id="public-message-${message.id}">
                            ${message.user.username}: <div id="public-message-content-${message.id}"> 🤫 ${message.message}</div>
                            <div class="public-message-edit" id="editPublicMessage-${message.id}">
                                ✏️
                            </div>
                            <div class="public-message-delete" id="deletePublicMessage-${message.id}">
                                ❌
                            </div>
                        </div>`
            }
        }
    }
}