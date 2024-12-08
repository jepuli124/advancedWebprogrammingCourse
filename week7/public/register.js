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

    console.log(DEmail.value, DPass.value)
    
    let incomingData = await fetch("/api/user/register", { 
      method: "POST",
      body: JSON.stringify({
      email: DEmail.value,
      password: DPass.value
      }),
      headers: {
      "Content-type": "application/json"
      }
    });
    if(incomingData.ok){
      window.location.href = "login.html"
    }
    console.log(await incomingData.json())
    DEmail.value = ""
    DPass.value = ""
    })
}
