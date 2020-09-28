import defaultExport from "../Settings.js"


let userZip
let userWeather = []

export const getWeather = () => {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?zip=${userZip[0].zipcode},US&units=imperial&appid=${defaultExport.weatherKey}`)
    .then(response => response.json())
    .then(
        parsedWeather => {
            userWeather = parsedWeather
        }
    )
}

export const getUserZip = () => {
    const userId = parseInt(sessionStorage.getItem("activeUser"))
    //fetch user zip code
    return fetch(`http://localhost:8088/users?id=${userId}`)
    .then(response => response.json())
    .then(
        parsedUser => {
            userZip = parsedUser
        }
    )
}

export const useWeather = () => {
    return userWeather
}