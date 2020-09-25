let articles = []
let friendsArticles = []

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

export const getfriendsArticles = () => {
    const userId = sessionStorage.getItem("activeUser")
    let relationships = []
    let relationshipsAdded = []
    fetch(`http://localhost:8088/friends?_expand=user&userId=${userId}`)
    .then(response => response.json())
    .then(
        parsedRelationships => {
            relationships = parsedRelationships
        }
    )
    .then(fetch(`http://localhost:8088/friends?userAdded=${userId}`))
    .then(response => response.json())
    .then(
        parsedRelationships => {
            relationshipsAdded = parsedRelationships
        }
    )
}

export const useArticles = () => {
    return articles.slice()
}

export const useFriendArticles = () => {
    return friendsArticles.slice()
}

export const saveArticles = articleObj => {
    return fetch("http://localhost:8088/articles", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body:JSON.stringify(articleObj)
    })
    .then(getArticles)
}

export const deleteArticle = articleId => {
    return fetch(`http://localhost:8088/tasks/${articleId}`, {
        method: "DELETE",
    })
    .then(getArticles)
}



export const editArticle = (articleObj, articleId) => {
    return fetch(`http://localhost:8088/article/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articleObj)
  })
}