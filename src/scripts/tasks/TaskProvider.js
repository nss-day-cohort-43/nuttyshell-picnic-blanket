let tasks = []

export const getTasks = () => {
    const userId = sessionStorage.getItem("activeUser")
    return fetch(`http://localhost:8088/tasks?userId=${userId}`)
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
    .then(getTasks)
}

export const deleteTask = taskId => {
    return fetch(`http://localhost:8088/tasks/${taskId}`, {
        method: "DELETE",
    })
    .then(getTasks)
}

export const editTask = (taskObj, taskId) => {
    return fetch(`http://localhost:8088/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(taskObj)
  })
  .then(getTasks)
}