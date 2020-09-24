let events = []

export const getEvents = () => {
    return fetch('http://localhost:8088/events')
    .then(response => response.json())
    .then(parsedResponse => {
        events = parsedResponse
    })
}

export const useEvents = () => {
    return events.slice()
}