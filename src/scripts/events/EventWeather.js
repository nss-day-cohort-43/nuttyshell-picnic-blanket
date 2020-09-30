import { getEventWeather, useEventWeather, getEventCurrentWeather, useEventCurrentWeather,  useEventMaxTemp,  useEventMinTemp, useEventCurrentTemp } from './EventsProvider.js'


//renders the weather for all events that it is possible for
export const EventWeather = (events) => {
    events.forEach(event => {
        //get the event date and current date in days
        const eventDate = Math.floor(Date.parse(event.startDate) / (1000*60*60*24))
        const currentDate = new Date()
        const currentDateDays = Math.floor(currentDate.getTime()/ (1000*60*60*24))
        //check that the event date is within 5 days of the current date and not in the past
        if(eventDate - currentDateDays <= 5 && eventDate - currentDateDays >= 1){
            //if the event is within 5 days, get the temperature for that day
            getEventWeather(event)
            .then(_ => {
                //render the weather using the fetched temperature
                const weather = useEventWeather()
                const maxTemp = useEventMaxTemp()
                const minTemp = useEventMinTemp()
                const eventWeather = document.getElementById(`event-weather-${event.id}`)
                eventWeather.innerHTML = `${weather}<br>${minTemp}&#730;F/${maxTemp}&#730;F`
            })
        }
        //if the event is not within 5 days get its current temp
        else {
            getEventCurrentWeather(event)
            .then(_ => {
                const weather = useEventCurrentWeather()
                const temp = useEventCurrentTemp()
                const eventWeather = document.getElementById(`event-weather-${event.id}`)
                //display a differnt message depending if the event is today or not
                if(eventDate === currentDateDays){
                    eventWeather.innerHTML = `Current Weather:<br>${weather}<br>${temp}&#730;F`
                }
                else{
                    eventWeather.innerHTML = `Can only display current weather<br>${weather}<br>${temp}&#730;F`
                }
            })
        }
    })
}