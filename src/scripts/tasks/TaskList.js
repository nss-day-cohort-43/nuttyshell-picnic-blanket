import {getTasks, useTasks, saveTask, deleteTask} from "./TaskProvider.js"
import {Task} from "./Task.js"

const eventHub = document.querySelector(".container")
const userId = sessionStorage.getItem("activeUser")

export const renderTasksInitial = () => {
    eventHub.innerHTML += `<div class="tasks">
        <div class="task-form"></div>
        <div class="task-list"></div>
    </div>`
    getTasks()
    .then(useTasks)
    .then(()=> {
        const myTasks = useTasks()
        renderTaskForm()
        render(myTasks)
    })
}

const render = (tasks) => {
    const taskTarget = document.querySelector(".task-list")
    let taskListHTML = tasks.map(task => {
        return Task(task)
    }).join("<br>")
    taskTarget.innerHTML = taskListHTML
}

const renderTaskForm = () => {
    const taskTarget = document.querySelector(".task-form")
    taskTarget.innerHTML += `<div>New Task</div>
        <textarea id="task-text" placeholder="Enter task info...</textarea>
        <div id="expectedCompletionDate">placeholder for calendar</div>
        <button id="saveTask">Save New Task</button>
    `
}

eventHub.addEventListener("click", e => {
    if(e.target.id === "saveTask"){
        const taskContent = document.querySelector("#task-text")
        const taskDate = document.querySelector("#expectedCompletionDate")
        if(taskContent.value !== "0" && taskDate.value !== "0"){
            const newTask = {
                userId: userId,
                task: taskContent.value,
                expectedCompletionDate: taskDate.value,
                status: false
            }
            saveTask(newTask)
        } else{
            window.alert("Input New Task")
        }

    } else if(e.target.id.startsWith("deleteTask--")){

    } else if(e.target.id.startsWith("editTask--")){

    }
})