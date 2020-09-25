import { getEvents, useEvents } from './EventsProvider.js'
import { Event } from './Event.js'
import { EventForm } from './EventForm.js'

const dashboard = document.querySelector('.dashboard')

//Actually render events to the dom
const render = () => {
    //grab the userId, get the user's events, then render those events to the dom
    const userId = sessionStorage.getItem('activeUser')
    getEvents(userId)
    .then(_ => {
        const events = useEvents()
        const contentElement = document.querySelector('.events-list')
        //call Event() for each event object to create the html
        contentElement.innerHTML = `
            <h2>Events</h2>
            ${events.map(event => {
                return Event(event)
            }).join("")}
        `
    })
}

//render initial list of events when Nutshell runs
export const EventList = () => {

    //set up html elements for rendering
    dashboard.innerHTML += `
        <div class="events-container">
            <h3>New Event</h3>
            <form class="events-form">
            </form>
            <div class="events-list">
            </div>
        </div>
    `
    //render the eventForm
    EventForm();
    //render the event list
    render()
}

//listen for when the event state has changed
const eventHub = document.querySelector('.container')

eventHub.addEventListener('eventStateChanged', event => {
    //render the eventlist
    render()
})