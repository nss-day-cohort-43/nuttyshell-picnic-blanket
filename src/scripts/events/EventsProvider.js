import defaultExport from "../Settings.js"

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

//fetch the 5 day weather forecast for an events location
export const getEventWeather = (event) => {
    return fetch(`http://api.openweathermap.org/data/2.5/forecast?zip=${event.eventZip},us&appid=${defaultExport.weatherKey}&units=imperial`)
    .then(response => response.json())
    .then(parsedResponse => {
        const forecasts = parsedResponse.list
        //filter out the forecasts that do not fall on the same day as the event
        const eventDate = Math.floor(event.startDate / (1000*1000*60*60*24))
        const viableForecasts = forecasts.filter(forecast => {
            const forecastDate = Math.floor(forecast.dt / (1000*60*60*24))
            return forecastDate === eventDate
        })
        //if there are forecasts for the event date, get the max temp for that day
        if(viableForecasts.length !== 0){
            debugger;
            const temps = viableForecasts.map(forecast => {
                return forecast.main.temp
            })
    
            const maxTemp = Math.max(...temps)
            temp = maxTemp
        }
        //if there are no forecasts for the event date, set temp to 0
        else{
            temp = 0
        }
    })
}

//return the stored temp
export const useEventWeather = () => {
    return temp
}