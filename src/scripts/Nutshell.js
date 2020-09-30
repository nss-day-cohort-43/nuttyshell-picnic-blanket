import {chatFeed, publicMessagesStarter} from './publicMessages/MessageBox.js'
import {renderTasksInitial} from "./tasks/TaskList.js"
import { EventList } from './events/EventsList.js'
import {renderArticlesInitial} from "./articles/ArticleList.js"
import { renderFriendsInitial } from './friends/FriendList.js'
import {renderWeatherInitial} from './weather/Weather.js'

//like renderTasks, renderArticles, renderEvents, etc
export const Nutshell = () => {
    // Render all your UI components here

    //render the event list
    
    //like renderTasks, renderArticles, renderEvents, etc
    //import render for all components here
    renderFriendsInitial()
    renderWeatherInitial()
    publicMessagesStarter()
    renderTasksInitial()
    renderArticlesInitial()
    EventList();
    chatFeed()
}
