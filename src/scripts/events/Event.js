//creates html for a given event
export const Event = (event) => {
    return `
        <div class="event-card">
            <h3>${event.name}</h3>
            <div>Date: ${event.startDate}</div>
            <div>Location: ${event.eventCity}, ${event.eventState}</div>
        </div>
    `
}