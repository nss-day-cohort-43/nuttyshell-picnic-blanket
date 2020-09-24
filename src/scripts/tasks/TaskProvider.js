let tasks
const userId = sessionStorage.getItem("activeUser")
export const getTasks = () => {
    return fetch(`http://localhost:8088/database/tasks?userId=${userId}`)
    .then(response => response.json())
    .then(
        parsedTasks => {
            tasks = parsedTasks
        }
    )
}

export const useTasks = () => {
    return tasks.slice()
}

export const saveTask = taskObj => {
    return fetch("http://localhost:8088/tasks", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(taskObj)
    })
    .then((result) => {})
}

export const deleteTask = taskId => {
    return fetch(`http://localhost:8088/tasks/${taskId}`, {
        method: "DELETE",
        
    })
    .then(getTasks)
}