import { getEvents, useEvents } from './EventsProvider.js'
import { Event } from './Event.js'

const dashboard = document.querySelector('.dashboard')

//Actually render events to the dom
const render = (events) => {
    const contentElement = document.querySelector('.events-list')
    contentElement.innerHTML = `
        <h2>Events</h2>
        ${events.map(event => {
            return Event(event)
        }).join("")}
    `
}

//render initial list of events when Nutshell runs
export const EventList = () => {

    //set up html elements for rendering
    dashboard.innerHTML += `
        <div class="events-container">
            <form class="events-form">
            </form>
            <div class="events-list">
            </div>
        </div>
    `

    //grab the userId from session storage, get their events, and render them to the dom
    const userId = sessionStorage.getItem('activeUser')
    getEvents(userId)
    .then(_ => {
        const events = useEvents()
        render(events)
    })
}