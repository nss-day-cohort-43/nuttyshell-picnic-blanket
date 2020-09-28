let articles = []

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