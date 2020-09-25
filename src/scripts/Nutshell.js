import {publicMessagesStarter} from './publicMessages/MessageBox.js'
import {renderTasksInitial} from "./tasks/TaskList.js"

export const Nutshell = () => {
    // Render all your UI components here
    publicMessagesStarter()
    //like renderTasks, renderArticles, renderEvents, etc
    renderTasksInitial()
//import render for all components here