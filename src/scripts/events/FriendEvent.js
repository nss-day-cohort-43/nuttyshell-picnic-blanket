
//return html for a friend event
export const FriendEvent = (event) => {
    return `
    <div id="${event.startDate}--${event.id}" class="event-card event-card-${event.id}">
        <h3 id="event-name-${event.id}">${event.name}</h3>
        <div id="event-date-${event.id}">Date: ${event.startDate}</div>
        <div id="event-location-${event.id}">Location: ${event.eventCity}, ${event.eventState} ${event.eventZip}</div>
    </div>
    `
}