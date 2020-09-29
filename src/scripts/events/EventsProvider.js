import defaultExport from "../Settings.js"
import { getFriends, useFriends } from '../friends/FriendProvider.js'

//variable that holds the events
let events = []
//variable to hold the temperature of an event
let temp = 0
//variable to hold current temp at an event location
let currentTemp = 0
//variable to store friends events
let friendsEvents = []
//variable to hold users
let users = []

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
        const viableForecasts = forecasts.filter(forecast => {
            return forecast.dt_txt.includes(event.startDate)
        })
        //if there are forecasts for the event date, get the max temp for that day
        if(viableForecasts.length !== 0){
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

//function that fetches the current weather at a given events location
export const getEventCurrentWeather = (event) => {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${event.eventZip},US&units=imperial&appid=${defaultExport.weatherKey}`)
    .then(response => response.json())
    .then(
        parsedWeather => {
            currentTemp = parsedWeather.main.temp
        }
    )
}

//return the value of currentTemp
export const useEventCurrentWeather = () => {
    return currentTemp
}

//return the stored temp
export const useEventWeather = () => {
    return temp
}

//edit a given event, update the events array, and dispatch custom event
export const editEvent = (event) => {
    return fetch(`http://localhost:8088/events/${event.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event)
    })
    .then(getEvents)
    .then(dispatchEventChangeEvent)
}

//fetch array of current users friends events
export const getFriendsEvents = () => {
    return fetch(`http://localhost:8088/users?_embed=events&_embed=friends`)
    .then(response => response.json())
    .then(parsedResponse => {
        users = parsedResponse
    })
    .then(getFriends)
    .then(_ => {
        debugger;
        const friendsIds = useFriends().map(friend => {
            return friend.userId
        })
        const friendsUsers = users.filter(user => {
            return friendsIds.includes(user.id)
        })
        friendsUsers.forEach(user => {
            user.events.forEach(event => {
                friendsEvents.push(event)
            })
        })
    })
}


//return copy of friendsEvents
export const useFriendsEvents = () => {
    return friendsEvents.slice()
}