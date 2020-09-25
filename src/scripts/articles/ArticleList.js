import {getArticles, useArticles, saveArticle, deleteArticle, editArticle} from "./ArticleProvider.js"
import {Article} from "./Article.js"

//defines main eventHub
const eventHub = document.querySelector(".dashboard")
//defines active user to get relevant data from API
const userId = sessionStorage.getItem("activeUser")

//renders articles when first loading Nutshell
export const renderArticlesInitial = () => {
    //adds articles container to main container
    eventHub.innerHTML += `<div class="articles">
        <div class="article-form"></div>
        <div class="article-list"></div>
        <div class="friend-articles-list"></div>
    </div>`
    //gets user's articles from api
    getArticles()
    .then(useArticles)
    .then(()=> {
        const myArticles = useArticles()
        //renders form for adding new articles
        renderArticleForm()
        //renders articles list
        render(myArticles)
    })
}

//defines what articles to render and how
const render = (articles) => {
    //defines content location in which the article list will render
    const articleTarget = document.querySelector(".article-list")
    //iterates over all articles for the user and HTML list
    let articleListHTML = articles.map(article => {
        return Article(article)
    }).join("<br>")
    //places task HTML list in content location
    articleTarget.innerHTML = articleListHTML
}

//renders form for adding new articles
const renderArticleForm = () => {
    //defines content target for form
    const articleTarget = document.querySelector(".article-form")
    //defines inner HTML for the form
    articleTarget.innerHTML = `<div>New Article</div>
        <textarea id="article-url" placeholder="Enter article url..."></textarea><br>
        <textarea id="article-title" placeholder="Enter article title..."></textarea><br>
        <textarea id="article-synopsis" placeholder="Enter article synopsis..."></textarea><br>
        <button id="saveArticle">Save New Article</button>
    `
}

//adds and eventListener to eventHub for specific events
eventHub.addEventListener("click", e => {
    //specifies click on saveArticle button
    if(e.target.id === "saveArticle"){
        //defines content and date that will be saved
        const articleUrl = document.querySelector("#article-url")
        const articleTitle = document.querySelector("#article-title")
        const articleSynopsis = document.querySelector("#article-synopsis")
        //verifies that none of the fields are empty
        if(articleUrl.value !== "0" && articleTitle.value !== "0" && articleSynopsis.value !== "0"){
            //defines object that will be saved into api
            const newArticle = {
                userId: parseInt(sessionStorage.getItem("activeUser")),
                title: articleTitle.value,
                url: articleUrl.value,
                synopsis: articleSynopsis.value,
                dateAdded: Date.now()
            }
            //runs saveArticle and re-renders the article list
            saveArticle(newArticle)
            .then(()=>{
                const articles = useArticles()
                render(articles)
            })
        //gives user warning message if any article field is empty
        } else{
            window.alert("Input New Article Info")
        }
    //specifies what will happen on deleteArticle button click
    } else if(e.target.id.startsWith("deleteArticle--")){
        //defines which article to delete
        const [prefix, id] = e.target.id.split("--")
        //deletes article from API and re-renders article list
        const articleId = parseInt(id)
        deleteArticle(articleId)
        .then(()=>{
            const articles = useArticles()
            render(articles)
        })
    }
    //edit will be added here
})

