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

export const editArticle = (articleObj, articleId) => {
    return fetch(`http://localhost:8088/tasks/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articleObj)
  })
}

export const getFriendArticles = () => {
  let articles = []
  getFriends()
  .then(useFriends)
  .then(() => {
    const friends = useFriends()
    const friendId = friends.map(friend => {
      return friend.userId
    })
    for(const id of friendId){
      return fetch(`http://localhost:8088/articles?userId=${id}`)
      .then(response => response.json())
      .then(
        parsedArticles => {
          articles.push(parsedArticles)
        }
      )
    }
  })
  .then(()=>{
    friendArticles = articles
    console.log(friendArticles)
  })
}

export const useFriendArticles = () => {
  return friendArticles.slice()
}