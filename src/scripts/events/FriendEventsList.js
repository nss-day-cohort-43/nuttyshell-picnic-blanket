import { FriendEvent } from './FriendEvent.js'
import { getFriendsEvents, useFriendsEvents } from './EventsProvider.js'

export const FriendEventsList = () => {
    getFriendsEvents()
    .then(_ => {
        const friendsEvents = useFriendsEvents()
        debugger;
    })
}