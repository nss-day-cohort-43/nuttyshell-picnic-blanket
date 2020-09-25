import {deletePublicMessage, editPublicMessage, usePublicMessages} from './MessageProvider.js'

const eventHub = document.querySelector(".container")

//Listen for clicks on individual messages and respond accordingly
eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
    //If user pressed the delete icon
    if (isClicked === "public-message-delete") {
        const [prefix, messageID] = event.target.id.split("-")
       deletePublicMessage(messageID)
    }
    //If user pressed the edit icon
    else {
        if (isClicked ==="public-message-edit") {
            const [prefix, messageID] = event.target.id.split("-")
            editPrep(messageID)
        }
        else {
            if (isClicked === "editMessageSave"){
                const [prefix, messageID] = event.target.id.split("-")
                editBuilder(messageID)


            }
            
        }
        }
    })





const editBuilder = (messageID) => {
    const messages = usePublicMessages()
    const matchingMessage = messages.find((message) => {
        return message.id === parseInt(messageID)
    })
    const newMessageRetrieve = document.querySelector("#edit-message-input").value
    matchingMessage.message = newMessageRetrieve
    editPublicMessage(matchingMessage)
}



const editPrep = (messageID) => {
    const messages = usePublicMessages()
    const matchingMessage = messages.find((message) => {
        return message.id === parseInt(messageID)
    })
    const contentTarget = document.querySelector(".composePublicMessage-edit")
    contentTarget.innerHTML += `
        <input id="edit-message-input" type="text" value="${matchingMessage.message}">
        <button class="editMessageSave" id="editMessageSave-${messageID}">Save</button>
        `
    //const newMessageRetrieve = document.querySelector("#edit-message-input").value
    //console.log(newMessageRetrieve)
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