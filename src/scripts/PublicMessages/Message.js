// Return the HTML to be rendered for individual messages
export const messageWriter = message => {
    return `<div class="public-message">${message.user.username}: ${message.message}</div>`
}
