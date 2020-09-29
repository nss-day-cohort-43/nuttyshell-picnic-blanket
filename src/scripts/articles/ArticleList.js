import {getArticles, useArticles, saveArticle, deleteArticle, editArticle, getFriendArticles, useFriendArticles} from "./ArticleProvider.js"
import {Article, FriendArticle} from "./Article.js"
import {getFriends, useFriends} from "../friends/FriendProvider.js"

//defines main eventHub
const eventHub = document.querySelector(".dashboard")
//defines active user to get relevant data from API
const userId = sessionStorage.getItem("activeUser")

//renders articles when first loading Nutshell
export const renderArticlesInitial = () => {
    //adds articles container to main container
    eventHub.innerHTML += `<div class="articles">
        <div class="myArticleContainer">
            <h2>Your Articles</h2>
            <div class="article-add"></div>
            <div class="composeArticle-edit"></div>
            <div class="article-list"></div>
        </div>
        <div class="friend-articles-list"></div>
    </div>`
    //gets user's articles from api
    getArticles()
    .then(useArticles)
    .then(getFriends)
    .then(()=> {
        const myArticles = useArticles()
        //renders form for adding new articles
        renderArticleAddButton()
        //renders articles list
        render(myArticles)
            const friends = useFriends()
            if(friends.length !== 0){
            //gets articles from your friends
            getFriendArticles(friends)
            .then(()=> {
                const articles = useFriendArticles()
                renderFriendArticles(articles)
            })
            } else {
                const articleFriendTarget = document.querySelector(".friend-articles-list")
                articleFriendTarget.innerHTML = `<h2>Friend Articles</h2>`
            }
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
    //places article HTML list in content location
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

//renders a button that when clicked will display creating new article form
const renderArticleAddButton = () => {
    const articleTarget = document.querySelector(".article-add")
    articleTarget.innerHTML +=`<button id="newArticle">Create New Article</button><div class="article-form"></div>`
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
    } else if(e.target.id === "newArticle" && e.target.textContent === "Create New Article"){
        renderArticleForm()
        e.target.textContent = "Hide Article Form"
    } else if(e.target.id === "newArticle" && e.target.textContent === "Hide Article Form"){
        e.target.textContent = "Create New Article"
        const contentHide = document.querySelector(".article-form")
        contentHide.innerHTML = ""
    //brings up editing boxes when edit is clicked on a article
    } else if(e.target.id.startsWith("editArticle--")){
        const [prefix, id] = e.target.id.split("--")
        editPrep(id)
    //saves and re-renders edited article, removes edit box
    } else if (e.target.id.startsWith("editArticleSave")){
        const [prefix, id] = e.target.id.split("--")
        editBuilder(id)
        const articles = useArticles()
        render(articles)
        const hideTarget = document.querySelector(".composeArticle-edit")
        hideTarget.innerHTML = ""
    }
})

// Render the area of the form where the article will be edited
const editPrep = (articleId) => {
    // Get an array of articles for comparison
    const articles = useArticles()
    // Find the correct article based of the ID
    const matchingArticle = articles.find((article) => {
        return article.id === parseInt(articleId)
    })
    // Declare where our HTML will be injected
    const contentTarget = document.querySelector(".composeArticle-edit")
    // Ensure only one article is edited at a time by checking to see if a article is currently being edited
    if (contentTarget) {
        // If a article is being edited, clear that so the new one can be edited instead
        contentTarget.innerHTML = ""
    }
    // Create the HTML area
    contentTarget.innerHTML += `
        <div class="composearticle-space">
            Edit:<input id="edit-article-url" type="text" value="${matchingArticle.url}"><br>
            <input id="edit-article-title" type="text" value="${matchingArticle.title}"><br>
            <input id="edit-article-synopsis" type="text" value="${matchingArticle.synopsis}"><br>
            <button class="editArticleSave" id="editArticleSave--${articleId}">Save</button>
        </div>
        `
}

// Edit object that will be updated with new information
const editBuilder = (articleId) => {
    // Get an array of articles for comparison
    const articles = useArticles()
    // Find the correct articles based of the ID
    const matchingArticle = articles.find((article) => {
        return article.id === parseInt(articleId)
    })
    const articleUrl = document.querySelector("#edit-article-url")
    const articleTitle = document.querySelector("#edit-article-title")
    const articleSynopsis = document.querySelector("#edit-article-synopsis")
    
    // Retrieve the updated article the user has input
    const newArticleRetrieve = {
        url: articleUrl.value,
        title: articleTitle.value,
        synopsis: articleSynopsis.value
    }
    // Update the article object with the updated article
    matchingArticle.url = newArticleRetrieve.url
    matchingArticle.title = newArticleRetrieve.title
    matchingArticle.synopsis = newArticleRetrieve.synopsis

    // send the updated object to be pushed to the api
    editArticle(matchingArticle, articleId)
}

//renders all friend articles
export const renderFriendArticles = (articleArray) => {
    //defines content location in which the article list will render
    const articleFriendTarget = document.querySelector(".friend-articles-list")
    //iterates over all articles for the user and HTML list
    let articleFriendListHTML = `<h2>Friend Articles</h2>${articleArray.map(article => {
        return FriendArticle(article)
    }).join("<br>")}`
    //places article HTML list in content location
    articleFriendTarget.innerHTML = articleFriendListHTML
}

//eventHub for outside events
const eventHub2 = document.querySelector(".container")

//rerenders friend articles when add/delete
eventHub2.addEventListener("friendStateChanged", event => {
    // Friend State updated, refresh friends
    getFriends() // fetch all of the current user's friends
    .then(useFriends)
    .then(() => {
        const friends = useFriends()
        if(friends.length !== 0){
            //gets articles from your friends
            getFriendArticles(friends)
            .then(()=> {
                const articles = useFriendArticles()
                renderFriendArticles(articles)
            })
        }
        //erases the remaining articles if you have no friends
        else{
            const articleFriendTarget = document.querySelector(".friend-articles-list")
            articleFriendTarget.innerHTML = "<h2>Friend Articles</h2>"
        }
    })
})