import { EventEditForm } from './EventEditForm.js'
import { deleteEvent } from './EventsProvider.js'

//creates html for a given event
export const Event = (event) => {
    return `
        <div id="${event.startDate}--${event.id}" class="event-card event-card-${event.id}">
            <h3 id="event-name-${event.id}">${event.name}</h3>
            <div id="event-date-${event.id}">Date: ${event.startDate}</div>
            <div id="event-location-${event.id}">Location: ${event.eventCity}, ${event.eventState} ${event.eventZip}</div>
            <button type="button" id="delete-event-${event.id}">Delete</button>
            <button type="button" id="edit-event-${event.id}">Edit</button>
            <button type="button" id="event-weather-btn-${event.id}">Show Weather</button>
            <div class="event-weather-container no-display" id="event-weather-${event.id}"></div>
        </div>
        <form id="event-edit-form-${event.id}" class="event-edit-form no-display">
        </form>
    `
}

//listen for click event
const eventHub = document.querySelector('.container')
eventHub.addEventListener('click', event => {
    //check that a delete button was clicked
    if(event.target.id.startsWith("delete-event-")){
        //delete the event that the delete button was clicked for
        const [prefix, filler, eventId] = event.target.id.split("-")
        deleteEvent(parseInt(eventId))
    }
    //check if the weather button was clickded
    else if(event.target.id.startsWith("event-weather-btn-")){
        //toggle between the no-display class for the weather component
        const [prefix, wather, btn, eventId] = event.target.id.split("-")
        const eventWeatherHTML = document.querySelector(`#event-weather-${eventId}`)
        if(eventWeatherHTML.classList.contains('no-display')){
            eventWeatherHTML.classList.remove('no-display')
            event.target.innerHTML = "Hide Weather"
        }
        else{
            eventWeatherHTML.classList.add('no-display')
            event.target.innerHTML = "Show Weather"
        }
    }
    //check if edit button was clicked
    else if(event.target.id.startsWith("edit-event-")){
        //get event id
        const [edit, eventPrefix, eventId] = event.target.id.split('-')
        //get event card element and event edit form
        const eventCard = document.querySelector(`.event-card-${eventId}`)
        const editForm = document.querySelector(`#event-edit-form-${eventId}`)

        //hide all other edit event forms that are not already hidden
        const allEditForms = document.getElementsByClassName('event-edit-form')
        for(var i = 0; i < allEditForms.length; i++){
            if(allEditForms[i].id != editForm.id && !(allEditForms[i].classList.contains('no-display'))){
                allEditForms[i].classList.add('no-display')
            }
        }

        //make sure all other event cards are showing
        const allEventCards = document.getElementsByClassName('event-card')
        for(var i = 0; i < allEventCards.length; i++){
            if(allEventCards[i].id != editForm.id && allEventCards[i].classList.contains('no-display')){
                allEventCards[i].classList.remove('no-display')
            }
        }

        //either hide the event card or the event form
        if(editForm.classList.contains('no-display')){
            //render the actual form with default vaules
            editForm.innerHTML = EventEditForm(eventId)
            //display the form and hide the event card
            editForm.classList.remove('no-display')
            eventCard.classList.add('no-display')
        }
        else{
            editForm.classList.add('no-display')
            eventCard.classList.remove('no-display')
        }

        
    }
})