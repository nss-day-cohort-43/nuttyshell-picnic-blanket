import { getEvents, useEvents } from './EventsProvider.js'
import { Event } from './Event.js'
import { EventForm } from './EventForm.js'
import { EventWeather } from './EventWeather.js'
import { FriendEventsList } from './FriendEventsList.js'

const dashboard = document.querySelector('.dashboard')

//Actually render events to the dom
const render = () => {
    //grab the userId, get the user's events, then render those events to the dom
    getEvents()
    .then(_ => {
        const events = useEvents()
        const contentElement = document.querySelector('.events-list')
        //call Event() for each event object to create the html
        contentElement.innerHTML = `
            
            ${events.map(event => {
                return Event(event)
            }).sort().join("")}
        `
        //add next-event class to next chronological event
        const nextEvent = document.querySelector(".event-card")
        if(nextEvent){
            nextEvent.classList.add("next-event")
        }
        //render the weather for events
        EventWeather(events)
    })
}

//render initial list of events when Nutshell runs
export const EventList = () => {
    //set up html elements for rendering
    dashboard.innerHTML += `
        <div class="events-container">
            <h2>My Events</h2>
            <button type="button" id="event-form-display-button">Add new event</button>
            <form class="events-form">
            </form>
            <div class="events-list">
            </div>
            <div class="friends-events-list">
            </div>
        </div>
    `
    //render the list of friends events
    FriendEventsList()
    //render the event list
    render()
}

//listen for when the event state has changed
const eventHub = document.querySelector('.container')

eventHub.addEventListener('eventStateChanged', event => {
    //render the eventlist
    render()
})

//listen for if the friend state has changed
eventHub.addEventListener('friendStateChanged', event => {
    //render the friends event list
    FriendEventsList()
})

//listen for click event
eventHub.addEventListener('click', event => {
    //check that the event form button was clicked
    if(event.target.id === "event-form-display-button"){
        //render the event form and hide the display form button
        EventForm()
        event.target.classList.add('no-display')

        //hide all edit event forms that are not already hidden
        const allEditForms = document.getElementsByClassName('event-edit-form')
        for(var i = 0; i < allEditForms.length; i++){
            if(!(allEditForms[i].classList.contains('no-display'))){
                allEditForms[i].classList.add('no-display')
            }
        }

        //make sure all event cards are showing
        const allEventCards = document.getElementsByClassName('event-card')
        for(var i = 0; i < allEventCards.length; i++){
            if(allEventCards[i].classList.contains('no-display')){
                allEventCards[i].classList.remove('no-display')
            }
        }
    }
})