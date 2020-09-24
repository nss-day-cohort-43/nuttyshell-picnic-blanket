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