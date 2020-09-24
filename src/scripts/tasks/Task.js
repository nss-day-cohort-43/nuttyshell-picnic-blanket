export const Task = (taskObj) => {
    if(taskObj.status === false){
        return `<input type="checkbox" id="${taskObj.id}" name="task${taskObj.id}" value="${taskObj.task}">
        <label for="task${taskObj.id}">${taskObj.task}</label><br>`
    } else{
        return `<input type="checkbox" id="${taskObj.id}" name="task${taskObj.id}" value="${taskObj.task}" checked>
        <label for="task${taskObj.id}">${taskObj.task}</label><br>`
    }
}