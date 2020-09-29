import { editEvent } from './EventsProvider.js'

//render the event edit form
export const EventEditForm = (eventId) => {

    //grab all the default values for the form
    const name = document.querySelector(`#event-name-${eventId}`).innerHTML
    const date = document.querySelector(`#event-date-${eventId}`).innerHTML.split(" ")[1]
    const [prefix, cityComma, state, zip] = document.querySelector(`#event-location-${eventId}`).innerHTML.split(" ")
    const city = cityComma.split(",")[0]

    //return the html for the event edit form
    return `
        <label for="title">Title:</label><br>
        <input type="text" id="event-edit-form-title-${eventId}" name="title" value="${name}"><br>
        <label for="date">Date:</label><br>
        <input type="date" id="event-edit-form-date-${eventId}" name="date" value="${date}"><br>
        <label for="city">City:</label><br>
        <input type="text" id="event-edit-form-city-${eventId}" name="city" value="${city}"><br>
        <label for="state">State:</label><br>
        <input type="text" id="event-edit-form-state-${eventId}" name="state" value="${state}"><br>
        <label for="zip">Zipcode:</label><br>
        <input type="text" id="event-edit-form-zip-${eventId}" name="zip" value="${zip}"><br>
        <button type="button" id="event-edit-form-submit-${eventId}">Update Event</button>
        <button type="button" id="event-edit-form-cancel-${eventId}">Cancel</button>
    `
}

//listen for click event
const eventHub = document.querySelector('.container')
eventHub.addEventListener('click', event => {
    //check if edit button was clicked
    if(event.target.id.startsWith("event-edit-form-submit-")){
        //get event id
        const [prefix, edit, form, submit, eventId] = event.target.id.split('-')

        //get submitted values from form
        const name = document.querySelector(`#event-edit-form-title-${eventId}`).value
        const date = document.querySelector(`#event-edit-form-date-${eventId}`).value
        const city = document.querySelector(`#event-edit-form-city-${eventId}`).value
        const state = document.querySelector(`#event-edit-form-state-${eventId}`).value
        const zip = document.querySelector(`#event-edit-form-zip-${eventId}`).value

        //check that all fields have been filled in
        if(name !== "" && date !== "" && city !== "" && state !== "" && zip !== "")
        {
            //get the current user
            const userId = sessionStorage.getItem("activeUser")

            //get the current date in miliseconds
            const currentDate = new Date()
            const currentDateMil = currentDate.getTime()

            //create an event with submitted values
            const newEvent = {
                "userId": parseInt(userId),
                "name": name,
                "startDate": date,
                "eventCity": city,
                "eventState": state,
                "eventZip": zip,
                "dateAdded": currentDateMil,
                "id": parseInt(eventId)
            }
            //edit the event
            editEvent(newEvent)
        }
        //if any of the fields haven't been filled, show a window alert
        else{
            window.alert("Please fill out all fields")
        }
    }
    else if(event.target.id.startsWith('event-edit-form-cancel-')){
        //get event id
        const [prefix, edit, form, cancel, eventId] = event.target.id.split('-')

        //get event card and event edit form
        const eventCard = document.querySelector(`.event-card-${eventId}`)
        const editForm = document.querySelector(`#event-edit-form-${eventId}`)

        //hide editForm and display eventCard
        eventCard.classList.remove('no-display')
        editForm.classList.add('no-display')
    }
})