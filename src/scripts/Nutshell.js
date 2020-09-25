import {publicMessagesStarter} from './publicMessages/MessageBox.js'
import {renderTasksInitial} from "./tasks/TaskList.js"
import { EventList } from './events/EventsList.js'
import {renderArticlesInitial} from "./articles/ArticleList.js"

//like renderTasks, renderArticles, renderEvents, etc
export const Nutshell = () => {
    // Render all your UI components here

    //render the event list
    EventList();
    //like renderTasks, renderArticles, renderEvents, etc
    //import render for all components here
    publicMessagesStarter()
    renderTasksInitial()
    renderArticlesInitial()
}
