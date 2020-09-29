import { FriendEvent } from './FriendEvent.js'
import { getFriendsEvents, useFriendsEvents } from './EventsProvider.js'

export const FriendEventsList = () => {
    //get the events of the users friends
    getFriendsEvents()
    .then(_ => {
        const friendsEvents = useFriendsEvents()

        //set render the friends events list
        const contentTarget = document.querySelector('.friends-events-list')
        //for each event, create the HTML for that event using FriendEvent()
        contentTarget.innerHTML = `
            <h3>Friends Events</h3>
            ${friendsEvents.map(event => {
                return FriendEvent(event)
            })}
        `
    })
}