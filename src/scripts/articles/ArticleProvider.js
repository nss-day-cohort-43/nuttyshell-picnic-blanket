let articles = []

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

export const useArticles = () => {
    function compare(a, b) {
        const bandA = a.dateAdded
        const bandB = b.dateAdded
      
        let comparison = 0;
        if (bandA > bandB) {
          comparison = 1;
        } else if (bandA < bandB) {
          comparison = -1;
        }
        return comparison *-1;
      }
      
    articles.sort(compare);
    return articles.slice()
}





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

export const deleteArticle = articleId => {
    return fetch(`http://localhost:8088/articles/${articleId}`, {
        method: "DELETE",
    })
    .then(getArticles)
}

export const editArticle = (articleObj, articleId) => {
    return fetch(`http://localhost:8088/articles/${articleId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(articleObj)
  })
}