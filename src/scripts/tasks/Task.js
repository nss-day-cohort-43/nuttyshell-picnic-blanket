export const Task = (taskObj) => {
    if(taskObj.status === false){
        return `<input type="checkbox" id="check--${taskObj.id}" name="task${taskObj.id}" value="${taskObj.task}">
        <label for="task${taskObj.id}">${taskObj.task}</label>
        <div class="date-${taskObj.id}">${taskObj.expectedCompletionDate}</div>
        <button id="deleteTask--${taskObj.id}">Delete</button>
        <button id="editTask--${taskObj.id}">Edit</button>`
    } else{
        return `<input type="checkbox" id="check--${taskObj.id}" name="task${taskObj.id}" value="${taskObj.task}" checked>
        <label for="task${taskObj.id}">${taskObj.task}</label>
        <div class="date-${taskObj.id}">${taskObj.expectedCompletionDate}</div>
        <button id="deleteTask--${taskObj.id}">Delete</button>
        <button id="editTask--${taskObj.id}">Edit</button>`
    }
}