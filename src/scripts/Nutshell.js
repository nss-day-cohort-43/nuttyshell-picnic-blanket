import {publicMessagesStarter} from './publicMessages/MessageBox.js'
import {renderTasksInitial} from "./tasks/TaskList.js"

export const Nutshell = () => {
    // Render all your UI components here
    //like renderTasks, renderArticles, renderEvents, etc
    //import render for all components here
    publicMessagesStarter()
    renderTasksInitial()
}