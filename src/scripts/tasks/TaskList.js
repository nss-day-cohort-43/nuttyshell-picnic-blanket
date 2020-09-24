import {getTasks, useTasks, saveTask, deleteTask, editTask} from "./TaskProvider.js"
import {Task} from "./Task.js"

//defines main eventHub
const eventHub = document.querySelector(".dashboard")
//defines active user to get relevant data from API
const userId = sessionStorage.getItem("activeUser")

//renders tasks when first loading Nutshell
export const renderTasksInitial = () => {
    //adds tasks container to main container
    eventHub.innerHTML += `<div class="tasks">
        <div class="task-form"></div>
        <div class="task-list"></div>
    </div>`
    //gets user's tasks from api
    getTasks()
    .then(useTasks)
    .then(()=> {
        const myTasks = useTasks()
        //renders form for adding new tasks
        renderTaskForm()
        //renders task list
        render(myTasks)
    })
}

//defines what tasks to render and how
const render = (tasks) => {
    //defines content location in which the task list will render
    const taskTarget = document.querySelector(".task-list")
    //iterates over all tasks for the user and HTML list w/ checkboxes for complete true/false
    let taskListHTML = tasks.map(task => {
        return Task(task)
    }).join("<br>")
    //places task HTML list in content location
    taskTarget.innerHTML = taskListHTML
}

//renders form for adding new tasks
const renderTaskForm = () => {
    //defines content target for form
    const taskTarget = document.querySelector(".task-form")
    //defines inner HTML for the form
    taskTarget.innerHTML = `<div>New Task</div>
        <textarea id="task-text" placeholder="Enter task info..."></textarea><br>
        <label for="completionDate">Expected Completion Date:</label><br>
        <input type="date" id="completionDate" name="completionDate"><br>
        <button id="saveTask">Save New Task</button>
    `
}

//adds and eventListener to eventHub for specific events
eventHub.addEventListener("click", e => {
    //specifies click on saveTask button
    if(e.target.id === "saveTask"){
        //defines content and date that will be saved
        const taskContent = document.querySelector("#task-text")
        const taskDate = document.querySelector("#completionDate")
        //verifies that neither of the fields are empty
        if(taskContent.value !== "0" && taskDate.value !== "0"){
            //defines object that will be saved into api
            const newTask = {
                userId: parseInt(sessionStorage.getItem("activeUser")),
                task: taskContent.value,
                expectedCompletionDate: taskDate.value,
                status: false
            }
            //runs saveTask and re-renders the task list
            saveTask(newTask)
            .then(()=>{
                const tasks = useTasks()
                render(tasks)
            })
        //gives user warning message if task text or date is not filled out
        } else{
            window.alert("Input New Task & Date")
        }
    //specifies what will happen on deleteTask button click
    } else if(e.target.id.startsWith("deleteTask--")){
        const [prefix, id] = e.target.id.split("--")
        //defines what task to delete
        const taskId = id
        //deletes task from API and re-renders task list
        deleteTask(id)
        .then(getTasks)
        .then(()=>{
            const tasks = useTasks()
            render(tasks)
        })
    }
    //edit will be added here
})

//listens for change event in task checkboxes
eventHub.addEventListener("change", e=> {
    if(e.target.id.startsWith("check--")){
        //splits and defines task id
        const [prefix, id] = e.target.id.split("--")
        //defines the checkbox
        const _selector = document.querySelector(`input[id="check--${id}"]`)
        //checks if relevant checkbox is checked
        if(_selector.checked === true){
            //defines edited task to overwrite old
            //changes completion status to true
            const editedTask = {
                id: id,
                userId: parseInt(sessionStorage.getItem("activeUser")),
                task: document.querySelector(`#check--${id}`).value,
                expectedCompletionDate: document.querySelector(`.date-${id}`).textContent,
                status: true
            }
            //places edited task info into api
            editTask(editedTask, parseInt(id))
        }
        //if the user unchecks the completion box, the completion status
        //will be updated to false
        else{
            //defines edited task to overwrite old
            const editedTask = {
                id: id,
                userId: parseInt(sessionStorage.getItem("activeUser")),
                task: document.querySelector(`#check--${id}`).value,
                expectedCompletionDate: document.querySelector(`.date-${id}`).textContent,
                status: false
            }
            //places edited task info in api
            editTask(editedTask, parseInt(id))
        }
    }
})

