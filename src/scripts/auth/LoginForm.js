const contentTarget = document.querySelector(".auth")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("userAuthenticated", e => {
    // If a user is authenticated, remove any code from the current content target
    // This provides free space for the dashboard to render
    contentTarget.innerHTML = ""
})

eventHub.addEventListener("click", e => {
    // listens for the click of the "log in" button
    if (e.target.id === "login--btn") {
        const username = document.querySelector("#login--username").value // Grab current input for username

        return fetch(`http://localhost:8088/users?username=${username}`) // search database for user of that username
            .then(response => response.json())
            .then(users => {
                // If a user is returned with the current username, 
                // store the valid user in session storage
                if (users.length > 0) {
                    const user = users[0]
                    sessionStorage.setItem("activeUser", user.id)
                    // Tell the login and registration forms that a user is authenticated 
                    // so their HTML elements can be removed.
                    eventHub.dispatchEvent(new CustomEvent("userAuthenticated"))
                }
            })
    }
    // listens for the click of the "register new account" button
    else if (e.target.id === "create-new-account-btn") {

        // Send out new event that will render the register account form in the
        // place of the login form.
        eventHub.dispatchEvent(new CustomEvent("registerNewAccount"))
    }
})

// This function renders the Login form
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

// Import the following function in another file to be able to render the LoginForm from that file
export const LoginForm = () => {
    render()
}

eventHub.addEventListener("userAuthenticated", e => {
    //if a user is authenticated, remove any code from the current content target
    //this provides free space for the dashboard to render
    contentTarget.setAttribute("style", "display: none;")
})