import { saveEvent } from './EventsProvider.js'


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

export const EventForm = () => {
    render()
}

const eventHub = document.querySelector('.container')

eventHub.addEventListener("click", event => {
    if(event.target.id === "event-form-submit"){
        const title = document.querySelector('#event-form-title').value
        const date = document.querySelector('#event-form-date').value
        const city = document.querySelector('#event-form-city').value
        const state = document.querySelector('#event-form-state').value
        const zip = document.querySelector('#event-form-zip').value

        if(title !== "" && date !== "" && city !== "" && state !== "" && zip !== "")
        {
            const userId = sessionStorage.getItem("activeUser")

            const currentDate = new Date()

            const newEvent = {
                "userId": parseInt(userId),
                "name": title,
                "startDate": date,
                "eventCity": city,
                "eventState": state,
                "eventZip": zip,
                "dateAdded": currentDate
            }

            saveEvent(newEvent)
        }
        else{
            window.alert("Please fill out all fields")
        }
        

    }
})