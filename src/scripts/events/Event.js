import { deleteEvent } from './EventsProvider.js'

//creates html for a given event
export const Event = (event) => {
    return `
        <div class="event-card">
            <h3>${event.name}</h3>
            <div>Date: ${event.startDate}</div>
            <div>Location: ${event.eventCity}, ${event.eventState}</div>
            <button type="button" id="delete-event-${event.id}">Delete</button>
        </div>
    `
}

//listen for click event
const eventHub = document.querySelector('.container')
eventHub.addEventListener('click', event => {
    //check that a delete button was clicked
    if(event.target.id.startsWith("delete-event-")){
        const [prefix, filler, eventId] = event.target.id.split("-")
        deleteEvent(parseInt(eventId))
    }
})