import defaultExport from "../Settings.js"
import { getFriends, useFriends } from '../friends/FriendProvider.js'

//variable that holds the events
let events = []
//variable to hold the max temperature of the day of an event
let maxTemp = 0
//variable to hold the min tempaerature of the day of an event
let minTemp = 0
//variable to hold the weather
let weather = ""
//variable to hold current temp at an event location
let currentTemp = 0
//variable to hold current weather at an event location
let currentWeather = ""
//variable to store friends events
let friendsEvents = []
//variable that holds events with expanded users
let expandedEvents = []

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
        //if there are forecasts for the event date, get the max and min temp for that day
        if(viableForecasts.length !== 0){
            const temps = viableForecasts.map(forecast => {
                return forecast.main.temp
            })
            maxTemp = Math.max(...temps)
            minTemp = Math.min(...temps)

            const noonForecast = viableForecasts.find(forecast => {
                return forecast.dt_txt.includes("12:00:00")
            })
            weather = noonForecast.weather[0].description
        }
        //if there are no forecasts for the event date, set temp to 0
        else{
            maxTemp = 0
            minTemp = 0
            weather = ""
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
            currentWeather = parsedWeather.weather[0].description
        }
    )
}

//return the value of currentWeather
export const useEventCurrentWeather = () => {
    return currentWeather
}

//return the value of currentWeather
export const useEventCurrentTemp = () => {
    return currentTemp
}

//return the stored weather
export const useEventWeather = () => {
    return weather
}

//return the stored maxTemp
export const useEventMaxTemp = () => {
    return maxTemp
}

export const useEventMinTemp = () => {
    return minTemp
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

//get array of current users friends events
export const getFriendsEvents = () => {
    //fetch events with expanded users
    return fetch(`http://localhost:8088/events?_expand=user`)
    .then(response => response.json())
    .then(parsedResponse => {
        expandedEvents = parsedResponse
    })
    //get the friends of the current user
    .then(getFriends)
    .then(_ => {
        //get all the friends ids of the current user
        const friendsIds = useFriends().map(friend => {
            return friend.userId
        })
        //filter out events that do not belong to a friend
        friendsEvents = expandedEvents.filter(event => {
            return friendsIds.includes(event.userId)
        })
    })
}


//return copy of friendsEvents
export const useFriendsEvents = () => {
    return friendsEvents.slice()
}
