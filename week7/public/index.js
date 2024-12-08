if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
  }
  

async function initializeCode() {
    await fetch("/", { 
        method: "GET",
        headers: {
        "Content-type": "application/json"
        }
    }); 
    if(localStorage.getItem("token") == null){
        window.location.href = "login.html"
    }

    let logout = document.getElementById("logout");
    logout.addEventListener("click", async function(event){
        localStorage.removeItem("token")
        window.location.href = "login.html"
      })

}