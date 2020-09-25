import {deletePublicMessage} from './MessageProvider.js'

const eventHub = document.querySelector(".container")

eventHub.addEventListener("click", event => {
    const isClicked = event.target.classList.value
    if (isClicked === "public-message-delete") {
        const [prefix, messageID] = event.target.id.split("-")
       deletePublicMessage(messageID)
    }
})

// Return the HTML to be rendered for others individual messages
export const othersMessageWriter = message => {
    return `<div class="public-message">${message.user.username}: ${message.message}</div>`
}

// Return the HTML to be rendered for users individual messages
export const myMessageWriter = message => {
    return `<div class="public-message">${message.user.username}: ${message.message} <div class="public-message-delete" id="deletePublicMessage-${message.id}">❌</div></div>`
}