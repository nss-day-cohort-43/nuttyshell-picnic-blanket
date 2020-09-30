import { LoginForm } from "./auth/LoginForm.js"
import { RegisterForm } from "./auth/RegisterForm.js"
import { Nutshell } from "./Nutshell.js"

//listen for user authentication either from the LoginForm or RegistrationForm
const eventHub = document.querySelector('.container')

eventHub.addEventListener("userAuthenticated", event => {
    //run nuthsell if the user has been authenticated from either form
    Nutshell()
})


//check if there is an active user and run Nutshell() if there is
//else render the LoginForm
//this will allow the UI to render on a page refresh
const activeUser = sessionStorage.getItem("activeUser")

if(activeUser){
    const contentTarget = document.querySelector(".auth")
    contentTarget.setAttribute("style", "display: none;")
    Nutshell();
}
else{
    LoginForm();
}


/*
    1. Check if the user is authenticated by looking in session storage for `activeUser`
    2. If so, render the Nutshell component
    3. If not, render the login and registration forms
    4. Also, if the user authenticates, and the login form is initially shown
        ensure that the Nutshell component gets rendered
*/


