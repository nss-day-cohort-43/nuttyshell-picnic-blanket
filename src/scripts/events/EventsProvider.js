let events = []

export const getEvents = (user) => {
    return fetch(`http://localhost:8088/events?userId=${user}`)
    .then(response => response.json())
    .then(parsedResponse => {
        events = parsedResponse
    })
}

export const useEvents = () => {
    return events.slice()
}