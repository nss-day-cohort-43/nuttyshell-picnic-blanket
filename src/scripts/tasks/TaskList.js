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
        <h2>Your Tasks</h2>
        <div class="task-add"></div>
        <div class="composeTask-edit"></div>
        <div class="task-list"></div>
    </div>`
    //gets user's tasks from api
    getTasks()
    .then(useTasks)
    .then(()=> {
        const myTasks = useTasks()
        //renders button for adding new tasks
        renderTaskAddButton()
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

//renders a button that when clicked will display creating new task form
const renderTaskAddButton = () => {
    const taskTarget = document.querySelector(".task-add")
    taskTarget.innerHTML +=`<button id="newTask">Create New Task</button><div class="task-form"></div>`
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
    //when create new task button is clicked, it will render or hide task addition form
    } else if(e.target.id === "newTask" && e.target.textContent === "Create New Task"){
        renderTaskForm()
        e.target.textContent = "Hide Task Form"
    } else if(e.target.id === "newTask" && e.target.textContent === "Hide Task Form"){
        e.target.textContent = "Create New Task"
        const contentHide = document.querySelector(".task-form")
        contentHide.innerHTML = ""
    //brings up editing boxes when edit is clicked on a task
    } else if(e.target.id.startsWith("editTask--")){
        const [prefix, id] = e.target.id.split("--")
        editPrep(id)
    }
    //saves and re-renders edited task, removes edit box
    else if (e.target.id.startsWith("editTaskSave")){
        const [prefix, id] = e.target.id.split("--")
        editBuilder(id)
        const tasks = useTasks()
        render(tasks)
        const hideTarget = document.querySelector(".composeTask-edit")
        hideTarget.innerHTML = ""
    }
})

// Render the area of the form where the task will be edited
const editPrep = (taskId) => {
    // Get an array of tasks for comparison
    const tasks = useTasks()
    // Find the correct task based of the ID
    const matchingTask = tasks.find((task) => {
        return task.id === parseInt(taskId)
    })
    // Declare where our HTML will be injected
    const contentTarget = document.querySelector(".composeTask-edit")
    // Ensure only one task is edited at a time by checking to see if a task is currently being edited
    if (contentTarget) {
        // If a task is being edited, clear that so the new one can be edited instead
        contentTarget.innerHTML = ""
    }
    // Create the HTML area
    contentTarget.innerHTML += `
        <div class="composeTask-space">
            Edit:<input id="edit-task-input" type="text" value="${matchingTask.task}"><br>
            <label for="completionDate">Expected Completion Date:</label><br>
            <input type="date" id="edit-completionDate" name="completionDate" value="${matchingTask.expectedCompletionDate}"><br>
            <button class="editTaskSave" id="editTaskSave--${taskId}">Save</button>
        </div>
        `
}

// Edit object that will be updated with new information
const editBuilder = (taskId) => {
    // Get an array of tasks for comparison
    const tasks = useTasks()
    // Find the correct tasks based of the ID
    const matchingTask = tasks.find((task) => {
        return task.id === parseInt(taskId)
    })
    const taskContent = document.querySelector("#edit-task-input")
    const taskDate = document.querySelector("#edit-completionDate")
    // Retrieve the updated task the user has input
    const newTaskRetrieve = {
        task: taskContent.value,
        expectedCompletionDate: taskDate.value
    }
    // Update the task object with the updated task
    matchingTask.task = newTaskRetrieve.task
    matchingTask.expectedCompletionDate = newTaskRetrieve.expectedCompletionDate

    // send the updated object to be pushed to the api
    editTask(matchingTask, taskId)
}

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

