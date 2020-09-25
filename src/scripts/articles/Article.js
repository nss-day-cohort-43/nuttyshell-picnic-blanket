export const Article = (articleObj) => {
        return `<a href="${articleObj.url}" target="_blank" class="article-site">${articleObj.title}</a><br>
        <div class="article-synopsis-${articleObj.id}">${articleObj.synopsis}</div><br>
        <button id="deleteTask--${articleObj.id}">Delete</button>
        <button id="editTask--${articleObj.id}">Edit</button>`
}
    