export const Article = (articleObj) => {
        return `<a href="${articleObj.url}" target="_blank" class="article-site">${articleObj.title}</a><br>
        <div class="article-synopsis-${articleObj.id}">${articleObj.synopsis}</div><br>
        <button id="deleteArticle--${articleObj.id}">Delete</button>
        <button id="editArticle--${articleObj.id}">Edit</button>`
}
    