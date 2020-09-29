import {publicMessagesStarter, messagesRender} from './MessageBox.js'

// Store Fetched Messages
let publicMessages = []

// Provide a copy of message array for use
export const usePublicMessages = () => {
    return publicMessages.slice()
}

// Fetch messages and embed the message creater within the returned object
export const getPublicMessages = () => {
    return fetch('http://localhost:8088/messages?messages&_expand=user')
        .then(response => response.json())
        .then(parsedNotes => {
            publicMessages = parsedNotes
            return publicMessages
        })
}

// Insert new messages into the database
export const savePublicMessage = message => {
    // debugger
    return fetch("http://localhost:8088/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
    //Wait for the database to update and then render everything again with newest data
    .then(messagesRender)
}

// Delete a previously created public message
export const deletePublicMessage = messageID => {
    return fetch(`http://localhost:8088/messages/${messageID}`, {
        method: "DELETE"
    })
    //Wait for the database to update and then render everything again with newest data
    .then(messagesRender)
}

// Edit a previously created public message in the api
export const editPublicMessage = message => {
    return fetch(`http://localhost:8088/messages/${message.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
      })
      // Then render the updated messages
      .then(messagesRender)
    }