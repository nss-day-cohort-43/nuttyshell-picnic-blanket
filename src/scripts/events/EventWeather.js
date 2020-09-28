import { getEventWeather, useEventWeather } from './EventsProvider.js'

//renders the weather for all events that it is possible for
export const EventWeather = (events) => {
    events.forEach(event => {
        //get the event date and current date in days
        const eventDate = Math.floor(event.startDate / (1000*60*60*24))
        const currentDate = new Date()
        const currentDateDays = Math.floor(currentDate.getTime()/ (1000*60*60*24))
        //check that the event date is within 5 days of the current date
        if(eventDate - currentDateDays <= 5){
            //if the event is within 5 days, get the temperature for that day
            getEventWeather(event)
            .then(_ => {
                //render the weather using the fetched temperature
                const temp = useEventWeather()
                const eventCard = document.getElementById(`${event.startDate}`)
                eventCard.innerHTML += `<button type="button" id="event-weather-btn-${event.id}">Show Weather</button>
                                        <div class="event-weather-container hidden" id="event-weather-${event.id}">${temp}&#730;F</div>
                `
            })
        }
    })
}