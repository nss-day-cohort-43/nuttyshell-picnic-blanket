
//return html for a friend event
export const FriendEvent = (event) => {
    return `
        <div id="${event.startDate}--${event.id}" class="event-card event-card-${event.id}">
            <h3 id="event-owner-${event.id}">${event.user.username}:</h3>
            <h4 id="event-name-${event.id}">${event.name}</h4>
            <div id="event-date-${event.id}">Date: ${event.startDate}</div>
            <div id="event-location-${event.id}">Location: ${event.eventCity}, ${event.eventState} ${event.eventZip}</div>
            <button type="button" id="event-weather-btn-${event.id}">Show Weather</button>
            <div class="event-weather-container no-display" id="event-weather-${event.id}"></div>
        </div>
    `
}