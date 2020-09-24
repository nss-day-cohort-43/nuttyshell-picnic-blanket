const contentTarget = document.querySelector(".auth")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("userAuthenticated", e => {
    contentTarget.innerHTML = ""
})

eventHub.addEventListener("click", e => {
    if (e.target.id === "login--btn") {
        const username = document.querySelector("#login--username").value

        return fetch(`http://localhost:8088/users?username=${username}`)
            .then(response => response.json())
            .then(users => {
                if (users.length > 0) {
                    const user = users[0]
                    sessionStorage.setItem("activeUser", user.id)
                    eventHub.dispatchEvent(new CustomEvent("userAuthenticated"))
                }
            })
    }
    else if (e.target.id === "create-new-account-btn") {
        eventHub.dispatchEvent(new CustomEvent("registerNewAccount"))
    }
})


const render = () => {
    contentTarget.innerHTML += `
    <section class="auth--login">
        <section class="login">
            <input type="text" id="login--username" class="input-box" placeholder="Enter your username">
            <button id="login--btn">Log In</button>
            <p>Don't already have an account?</p>
            <button type="button" id="create-new-account-btn">Register new account</button>
        </section>
    </section>
    `
}

export const LoginForm = () => {
    render()
}
