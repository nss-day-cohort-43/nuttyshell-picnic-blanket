//import render for all components here
import {renderTasksInitial} from "./tasks/TaskList.js"
import {renderFriendsInitial} from "./friends/FriendList.js"
//like renderTasks, renderArticles, renderEvents, etc

export const Nutshell = () => {
    renderFriendsInitial()
    renderTasksInitial()
    
}