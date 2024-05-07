const formSubmit = document.querySelector("form");
const errorMsg = document.querySelector(".errorMessage");
formSubmit.addEventListener("submit", async function (event) {
event.preventDefault();

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login_error");

try {
const response = await fetch(`http://localhost:5678/api/users/login`, {
method: "POST",
headers: {
Accept: "application/json",
"Content-Type": "application/json",
},
body: JSON.stringify({
email: emailInput.value,
password: passwordInput.value,
}),
});

if (response.status !== 200) {
    errorMsg.style.display = "block";
throw `Le mot de passe ou l'adresse mail est incorrect !`;
}

let user = await response.json();
window.sessionStorage.setItem("token", user.token); 
window.location.href = "./index.html";
} catch (error) {
loginError.innerText = error; 
}
});
