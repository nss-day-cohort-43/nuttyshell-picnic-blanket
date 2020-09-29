import { FriendEvent } from './FriendEvent.js'
import { getFriendsEvents, useFriendsEvents } from './EventsProvider.js'

export const FriendEventsList = () => {
    getFriendsEvents()
    .then(_ => {
        const friendsEvents = useFriendsEvents()
        const contentTarget = document.querySelector('.friends-events-list')
        contentTarget.innerHTML = `
            <h3>Friends Events</h3>
            ${friendsEvents.map(event => {
                return FriendEvent(event)
            })}
        `
    })
}