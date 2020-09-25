//import render for all components here
import {renderTasksInitial} from "./tasks/TaskList.js"
import { EventList } from './events/EventsList.js'

//like renderTasks, renderArticles, renderEvents, etc
export const Nutshell = () => {
    // Render all your UI components here

    //render the event list
    EventList();
    renderTasksInitial()

}
