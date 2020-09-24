import {getTasks, useTasks, saveTask, deleteTask} from "./TaskProvider.js"
import {Task} from "./Task.js"

const eventHub = document.querySelector(".container")

export const renderTasksInitial = () => {
    eventHub.innerHTML += `<div class="tasks"></div>`
    getTasks()
    .then(useTasks)
    .then(()=> {
        const myTasks = useTasks()
        render(myTasks)
    })
}

const render = (tasks) => {
    const taskTarget = document.querySelector(".tasks")


}

const 