
const activeUserId = sessionStorage.getItem("activeUser");
const eventHub2 = document.querySelector(".header");

export const LogoutBtn = () => {
    const logoutTarget = document.querySelector(".logout");

    
    logoutTarget.innerHTML = `<button type="button" id="logout-btn-${activeUserId}">Logout</button>`;
}

eventHub2.addEventListener("click", event => {
    if(event.target.id === `logout-btn-${activeUserId}`){
        eventHub2.dispatchEvent(new CustomEvent("userLogout"));
    }
})







