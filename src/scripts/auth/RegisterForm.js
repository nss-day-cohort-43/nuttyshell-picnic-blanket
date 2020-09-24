const contentTarget = document.querySelector(".auth")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("userAuthenticated", e => {
    // If a user is authenticated, remove any code from the current content target
    // This provides free space for the dashboard to render
    contentTarget.innerHTML = ""
})

// Listens for the event sent from the "register new account" button in the log in form
eventHub.addEventListener("registerNewAccount", e => {
    // replace login form with the form to register a new account
    RegisterForm(); 
})


eventHub.addEventListener("click", e => {
    // Listen for click of the "register" button in the register form
    if (e.target.id === "register--btn") {

        // Capture any current inputs in the form's input fields
        const username = document.querySelector("#register--username").value
        const email = document.querySelector("#register--email").value
        const zipcode = document.querySelector("#register--zipcode").value

        // If none of the current inputs captured are empty, proceed
        if (username !== "" && email !== "" && zipcode !== "") {
            // Does the user exist?
            // 1. Get all users with the username captured from the current username field
            fetch(`http://localhost:8088/users?username=${username}`) 
            .then(response => response.json())
            .then(users => {
                // 2. If the array of identical usernames returned is empty, 
                //    then the current username is available
                if (users.length === 0) {
                    fetch("http://localhost:8088/users", {
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            // 3. Post and save new user information to the API
                            "username": username,
                            "email": email,
                            "zipcode": zipcode
                        })
                    })
                        .then(response => response.json())
                        .then((newUser) => {
                            // 4. New user is authenticated and saved in the current session storage
                            sessionStorage.setItem("activeUser", newUser.id)
                            // 5. Tell the login and registration forms that a user is authenticated 
                            //    so their HTML elements can be removed.
                            eventHub.dispatchEvent(new CustomEvent("userAuthenticated"))
                        })

                }
                else {
                    // If the current captured username matches one that already exists
                    window.alert("Username already exists!  😭")
                }
            })
        }
    }
})

// This function renders the Registration form
const render = () => {
    contentTarget.innerHTML = `
    <section class="auth--register">
        <section class="register">
            <input type="text" id="register--username" class="input-box" placeholder="Enter your username">
            <input type="text" id="register--email" class="input-box" placeholder="Enter your email address">
            <input type="text" id="register--zipcode" class="input-box" placeholder="Enter your Zip Code">
            <button type="button" id="register--btn">Register</button>
        </section>
    </section>
    `
}

// Import the following function in another file to be able to render the RegisterForm from that file
export const RegisterForm = () => {
    render()
}