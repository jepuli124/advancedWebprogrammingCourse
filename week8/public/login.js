if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
  }
  

function initializeCode() {
    let offerForm = document.getElementById("loginForm");
    offerForm.addEventListener("submit", async function(event){
        event.preventDefault();
        let DEmail = document.getElementById("email");
        let DPass = document.getElementById("password");


        let incomingData = await fetch("/api/user/login", { 
            method: "POST",
            body: JSON.stringify({
                email: DEmail.value,
                password: DPass.value
                }),
            headers: {
            "Content-type": "application/json"
            }
        }); 
        let data = await incomingData.json()
        console.log("data received", data)
        if (data.token){
            localStorage.setItem("token", data.token)
            let incomingData = await fetch("/api/private", { 
                method: "GET",
                headers: {
                    "authorization": `Bearer ${data.token}`
                }
            }); 
            if(!incomingData.ok){
                window.location.href = "login.html"
            }
            else{
                window.location.href = "index.html"
            }
            
        }
        DEmail.value = ""
        DPass.value = ""

      })
}
