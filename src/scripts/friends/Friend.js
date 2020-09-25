
export const FriendHTML = (friendObj) => {
    return `
        <div class="friendList-item" id="friendId--${friendObj.id}">
            <p class="friendList-item-name">${friendObj.friendId.username}</p>
            <div class="friendList-item-actions">
                <button type="button" class="deleteFriend-btn">Delete</button>
            </div>
        </div>
    `
}