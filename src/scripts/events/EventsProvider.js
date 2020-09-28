import {weatherKey} from '../Settings.js'

//variable that holds the events
let events = []
let temp = 0

//fetch events from the database using the current userId
export const getEvents = () => {
    const userId = sessionStorage.getItem('activeUser')
    return fetch(`http://localhost:8088/events?userId=${userId}`)
    .then(response => response.json())
    .then(parsedResponse => {
        events = parsedResponse
    })
}

//return the array of events
export const useEvents = () => {
    return events.slice()
}

//event that is dipatched whenever the state of the eventList is changed
const eventHub = document.querySelector(".container")

const dispatchEventChangeEvent = () => {
    const eventStateChangedEvent = new CustomEvent("eventStateChanged")

    eventHub.dispatchEvent(eventStateChangedEvent)
}

//post a new event to the database, get the updated events, then dispatch the custom event
export const saveEvent = event => {
    return fetch('http://localhost:8088/events', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    })
    .then(getEvents)
    .then(dispatchEventChangeEvent)
}

//delete the given event from the database, get the updated events, then dispatch the custom event
export const deleteEvent = eventId => {
    return fetch(`http://localhost:8088/events/${eventId}`, {
        method: "DELETE",
    })
    .then(getEvents)
    .then(dispatchEventChangeEvent)
}

export const getEventWeather = (event) => {
    return fetch(`api.openweathermap.org/data/2.5/forecast?zip=${event.eventZip},us&appid=${weatherKey}`)
    .then(response => response.json())
    .then(parsedResponse => {
        const forecasts = parsedResponse.list
        const eventDate = Math.floor(event.startDate / (1000*60*60*24))
        const viableForecasts = forecasts.filter(forecast => {
            const forecastDate = Math.floor(forecast.dt / (1000*60*60*24))
            return forecastDate - eventDate === 0
        })
        if(viableForecasts.length !== 0){
            const temps = viableForecasts.map(forecast => {
                return forecast.main.temp
            })
    
            const maxTemp = Math.max(temps)
            temp = maxTemp
        }
        else{
            temp = 0
        }
    })
}

export const useEventWeather = () => {
    return temp
}