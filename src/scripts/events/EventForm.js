import { saveEvent } from './EventsProvider.js'

//render the event form to the dom
const render = () => {
    const contentTarget = document.querySelector('.events-form')
    contentTarget.innerHTML = `
        <label for="title">Title:</label><br>
        <input type="text" id="event-form-title" name="title"><br>
        <label for="date">Date:</label><br>
        <input type="date" id="event-form-date" name="date"><br>
        <label for="city">City:</label><br>
        <input type="text" id="event-form-city" name="city"><br>
        <label for="state">State:</label><br>
        <input type="text" id="event-form-state" name="state"><br>
        <label for="zip">Zipcode:</label><br>
        <input type="text" id="event-form-zip" name="zip"><br>
        <button type="button" id="event-form-submit">Save Event</button>
    `
}

//export for rendering
export const EventForm = () => {
    render()
}

//listen for click event
const eventHub = document.querySelector('.container')

eventHub.addEventListener("click", event => {
    //check if click was on the form submit
    if(event.target.id === "event-form-submit"){
        //get values from submitted form
        const title = document.querySelector('#event-form-title').value
        const date = document.querySelector('#event-form-date').value
        const city = document.querySelector('#event-form-city').value
        const state = document.querySelector('#event-form-state').value
        const zip = document.querySelector('#event-form-zip').value

        //check that all fields have been filled in
        if(title !== "" && date !== "" && city !== "" && state !== "" && zip !== "")
        {
            //get the current user
            const userId = sessionStorage.getItem("activeUser")

            //get the current date in miliseconds
            const currentDate = new Date()
            const currentDateMil = currentDate.getTime()

            //create an event with submitted values
            const newEvent = {
                "userId": parseInt(userId),
                "name": title,
                "startDate": date,
                "eventCity": city,
                "eventState": state,
                "eventZip": zip,
                "dateAdded": currentDateMil
            }
            //save the event
            saveEvent(newEvent)
        }
        //if any of the fields haven't been filled, show a window alert
        else{
            window.alert("Please fill out all fields")
        }
        

    }
})