import {Nutshell} from '../Nutshell.js'

//Store Fetched Messages
let publicMessages = []

//Provide a copy of message array for use
export const usePublicMessages = () => {
    return publicMessages.slice()
}

//Fetch messages that are not set to private and embed the message creater within the returned object
export const getPublicMessages = () => {
    return fetch('http://localhost:8088/messages?private=false&messages&_expand=user')
        .then(response => response.json())
        .then(parsedNotes => {
            publicMessages = parsedNotes
        })
}

//Instert new messages into the database
export const savePublicMessage = message => {
    return fetch("http://localhost:8088/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    })
    //Wait for the database to update and then render everything again with newest data
    .then(() => {
        Nutshell()
    })
}


export const deletePublicMessage = messageID => {
    return fetch(`http://localhost:8088/messages/${messageID}`, {
        method: "DELETE"
    })
    //Wait for the database to update and then render everything again with newest data
    .then(() => {
        Nutshell()})

    }