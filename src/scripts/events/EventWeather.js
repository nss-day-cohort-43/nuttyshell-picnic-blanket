import { getEventWeather, useEventWeather } from './EventsProvider.js'

export const EventWeather = (events) => {
    events.forEach(event => {
        const eventDate = Math.floor(event.startDate / (1000*60*60*24))
        const currentDate = new Date()
        const currentDateDays = Math.floor(currentDate.getTime()/ (1000*60*60*24))
        if(eventDate - currentDateDays <= 5){
            getEventWeather(event)
            .then(_ => {
                const temp = useEventWeather()
                const eventCard = document.getElementById(`${event.startDate}`)
                eventCard.innerHTML += `<button type="button" id="event-weather-btn-${event.id}">Show Weather</button>
                                        <div class="event-weather-container hidden" id="event-weather-${event.id}">${temp}</div>
                `
            })
        }
    })
}