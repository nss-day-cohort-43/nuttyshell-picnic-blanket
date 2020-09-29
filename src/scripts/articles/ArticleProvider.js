import {getFriends, useFriends} from "../friends/FriendProvider.js"

let articles = []
let friendArticles = []

//fetches all of the users articles
export const getArticles = () => {
    const userId = sessionStorage.getItem("activeUser")
    return fetch(`http://localhost:8088/articles?userId=${userId}`)
    .then(response => response.json())
    .then(
        parsedArticles => {
            articles = parsedArticles
        }
    )
}

//sorts articles by most recent and returns a copy of the array
export const useArticles = () => {
    function compare(a, b) {
        const articleA = a.dateAdded
        const articleB = b.dateAdded
      
        let comparison = 0;
        if (articleA > articleB) {
          comparison = 1;
        } else if (articleA < articleB) {
          comparison = -1;
        }
        return comparison *-1;
      }
      
    articles.sort(compare);
    return articles.slice()
}

//saves a new article to the API
export const saveArticle = articleObj => {
    return fetch("http://localhost:8088/articles", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(articleObj)
    })
    .then(getArticles)
}

//removes an article from the api
export const deleteArticle = articleId => {
    return fetch(`http://localhost:8088/articles/${articleId}`, {
        method: "DELETE",
    })
    .then(getArticles)
}

//saves an article edit to the api
export const editArticle = (articleObj, articleId) => {
    return fetch(`http://localhost:8088/articles/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articleObj)
  })
}

//fetches articles of a users friends
export const getFriendArticles = (friends) => {
  //defines what to add to URL to search multiple friends
  const urlCode = (friendObj) => {
    return `userId=${friendObj.userId}`
  }
  //joins all friends for URL with &
  let userIdURL = friends.map(friend => {
    return urlCode(friend)
  }).join("&")
  
  //fetches and returns all articles by all friends
  return fetch(`http://localhost:8088/articles?_expand=user&${userIdURL}`)
  .then(response => response.json())
  .then(parsedArticles => {
    friendArticles = parsedArticles
  })
}

//creates a copy of all friend articles
export const useFriendArticles = () => {
  return friendArticles.slice()
}