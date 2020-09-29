import {getUserZip, getWeather, useWeather} from "./WeatherProvider.js"

//defines main eventHub
const eventHub = document.querySelector(".dashboard")
//defines active user to get relevant data from API
const userId = sessionStorage.getItem("activeUser")

//renders weather when first loading Nutshell
export const renderWeatherInitial = () => {
    //adds weather container to main container
    eventHub.innerHTML += `<div class="weather">
        <div class="current-weather"></div>
        <div class="weather-button"></div>
    </div>`
    //gets user's weather from api
    getUserZip()
    .then(getWeather)
    .then(useWeather)
    .then(()=> {
        const myWeather = useWeather()
        //renders button for adding updating weather
        renderUpdateWeatherButton()
        //renders weather
        render(myWeather)
    })
}

//renders current weather
const render = (weatherObj) => {
    const weatherTarget = document.querySelector(".current-weather")
    weatherTarget.innerHTML =`
        <h3 class="weatherHeader">Current Weather</h3>
        <div class="weather-description">${weatherObj.weather[0].main}</div>
        <div class="weather-temp">Temperature: ${weatherObj.main.temp} °F</div>
        <div class="weather-feeling">Feels Like: ${weatherObj.main.feels_like} °F</div>  
    `
}

//renders button that will allow for rendered weather to update
const renderUpdateWeatherButton = () => {
    const buttonTarget = document.querySelector(".weather-button")
    buttonTarget.innerHTML = `<button id="updateWeather">Update Weather</button>`
}

//when update weather button is clicked, the new weather will be fetched and rendered
eventHub.addEventListener("click", e=> {
    if(e.target.id === "updateWeather"){
        getUserZip()
        .then(getWeather)
        .then(useWeather)
        .then(renderUpdateWeatherButton)
        .then(()=>{
            const myWeather = useWeather()
            render(myWeather)
        })
    }
})