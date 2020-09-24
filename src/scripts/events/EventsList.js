import { getEvents, useEvents } from './EventsProvider.js'
import { Event } from './Event.js'

const contentElement = document.querySelector('.events-container')

const render = (events) => {
    contentElement.innerHTML = `
        <h2>Events</h2>
        ${events.map(event => {
            return Event(event)
        }).join("")}
    `
}

export const EventList = () => {
    getEvents()
    .then(_ => {
        const events = useEvents()
        render(events)
    })
}