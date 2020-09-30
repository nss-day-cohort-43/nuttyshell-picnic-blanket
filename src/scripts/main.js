import { LoginForm } from "./auth/LoginForm.js"
import { RegisterForm } from "./auth/RegisterForm.js"
import { Nutshell } from "./Nutshell.js"
import {LogoutBtn} from './auth/LogoutBtn.js'

//listen for user authentication either from the LoginForm or RegistrationForm
const eventHub = document.querySelector('.container')
const eventHub2 = document.querySelector('.header')

eventHub.addEventListener("userAuthenticated", event => {
    //run nuthsell if the user has been authenticated from either form
    Nutshell()
})

eventHub2.addEventListener("userLogout", event => {
    document.querySelector(".dashboard").innerHTML = ""; // clear dashboard
    document.querySelector(".logout").innerHTML = ""; // clear logout button
    sessionStorage.removeItem("activeUser"); // clear session storage
    LoginForm(); // show login form
})


//check if there is an active user and run Nutshell() if there is
//else render the LoginForm
//this will allow the UI to render on a page refresh
const activeUser = sessionStorage.getItem("activeUser")

if(activeUser){
    console.log("Dashboard show");
    const a = document.querySelector(".auth");
    console.log("a: ", a);
    
    a.innerHTML = ""; // clear auth section
    a.setAttribute("style", "display: none;");
    a.innerHTML = "";
    Nutshell();
}
else{
    document.querySelector(".auth").innerHTML = "";
    LoginForm();
}


/*
    1. Check if the user is authenticated by looking in session storage for `activeUser`
    2. If so, render the Nutshell component
    3. If not, render the login and registration forms
    4. Also, if the user authenticates, and the login form is initially shown
        ensure that the Nutshell component gets rendered
*/


