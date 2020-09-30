import { getEventWeather, useEventWeather, getEventCurrentWeather, useEventCurrentWeather } from './EventsProvider.js'


//renders the weather for all events that it is possible for
export const EventWeather = (events) => {
    events.forEach(event => {
        //get the event date and current date in days
        const eventDate = Math.floor(Date.parse(event.startDate) / (1000*60*60*24))
        const currentDate = new Date()
        const currentDateDays = Math.floor(currentDate.getTime()/ (1000*60*60*24))
        //check that the event date is within 5 days of the current date and not in the past
        if(eventDate - currentDateDays <= 5 && eventDate - currentDateDays >= 0){
            //if the event is within 5 days, get the temperature for that day
            getEventWeather(event)
            .then(_ => {
                //render the weather using the fetched temperature
                const temp = useEventWeather()
                const eventWeather = document.getElementById(`event-weather-${event.id}`)
                eventWeather.innerHTML = `${temp}&#730;F`
            })
        }
        //if the event is not within 5 days get its current temp
        else {
            getEventCurrentWeather(event)
            .then(_ => {
                const temp = useEventCurrentWeather()
                const eventWeather = document.getElementById(`event-weather-${event.id}`)
                eventWeather.innerHTML = `Cannot display of temperature at this date.  Current temp: ${temp}&#730;F`
            })
        }
    })
}