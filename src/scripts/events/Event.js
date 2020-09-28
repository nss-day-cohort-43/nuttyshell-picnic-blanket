import { deleteEvent } from './EventsProvider.js'

//creates html for a given event
export const Event = (event) => {
    return `
        <div id="${event.startDate}" class="event-card">
            <h3>${event.name}</h3>
            <div>Date: ${(new Date(event.startDate)).toLocaleDateString()}</div>
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
    else if(event.target.id.startsWith("event-weather-btn-")){
        const [prefix, wather, btn, eventId] = event.target.id.split("-")
        const eventWeatherHTML = document.querySelector(`#event-weather-${eventId}`)
        if(eventWeatherHTML.classList.contains('hidden')){
            eventWeatherHTML.classList.remove('hidden')
            event.target.innerHTML = "Hide Weather"
        }
        else{
            eventWeatherHTML.classList.add('hidden')
            event.target.innerHTML = "Show Weather"
        }
    }
})