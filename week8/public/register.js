if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
  }
  

function initializeCode() {
  let offerForm = document.getElementById("registerForm");
  offerForm.addEventListener("submit", async function(event){
    event.preventDefault();
    let DEmail = document.getElementById("email");
    let DPass = document.getElementById("password");
    let DUsername = document.getElementById("username");
    let DIsAdmin = document.getElementById("isAdmin");

    console.log(DEmail.value, DPass.value)
    
    let incomingData = await fetch("/api/user/register", { 
      method: "POST",
      body: JSON.stringify({
      email: DEmail.value,
      password: DPass.value,
      username: DUsername.value,
      isAdmin: DIsAdmin.checked
      }),
      headers: {
      "Content-type": "application/json"
      }
    });
    if(incomingData.ok){
      data = await incomingData.json()
      localStorage.setItem("username", DUsername.value)
      window.location.href = "/"
    }

    DEmail.value = ""
    DPass.value = ""
    })
}
