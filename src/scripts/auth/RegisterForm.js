const contentTarget = document.querySelector(".auth")
const eventHub = document.querySelector(".container")

eventHub.addEventListener("userAuthenticated", e => {
    contentTarget.innerHTML = ""
})

eventHub.addEventListener("registerNewAccount", e => {
    //debugger;
    RegisterForm();
})


eventHub.addEventListener("click", e => {
    if (e.target.id === "register--btn") {
        const username = document.querySelector("#register--username").value
        const email = document.querySelector("#register--email").value
        const zipcode = document.querySelector("#register--zipcode").value

        if (username !== "" && email !== "" && zipcode !== "") {
            // Does the user exist?
            fetch(`http://localhost:8088/users?username=${username}`)
            .then(response => response.json())
            .then(users => {
                if (users.length === 0) {
                    fetch("http://localhost:8088/users", {
                        "method": "POST",
                        "headers": {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "username": username,
                            "email": email,
                            "zipcode": zipcode
                        })
                    })
                        .then(response => response.json())
                        .then((newUser) => {
                            sessionStorage.setItem("activeUser", newUser.id)

                            eventHub.dispatchEvent(new CustomEvent("userAuthenticated"))
                        })

                }
                else {
                    window.alert("Username already exists!  😭")
                }
            })
        }
    }
})


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

export const RegisterForm = () => {
    render()
}