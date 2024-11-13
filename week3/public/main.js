if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
  }
  

function initializeCode() {
    let info = document.getElementById("userForm");
    let getU = document.getElementById("getUsers");
    info.addEventListener("submit", async function(){
        event.preventDefault();
        let name = document.getElementById("name");
        let email = document.getElementById("email");
        // console.log(name.value)
        // console.log(email.value)
        console.log(await fetch("/users", { 
            method: "POST",
            body: JSON.stringify({
            name: name.value,
            email: email.value
            }),
            headers: {
            "Content-type": "application/json; charset=UTF-8"
            }
        })); // https://www.freecodecamp.org/news/javascript-post-request-how-to-send-an-http-post-request-in-js/
      })
    // getU.addEventListener("onmousedown", function(){
    //     console.log("got here");
    //     console.log(fetch("/users"))
    // })
    
}

async function buttonclick(){

    let incomingData = await fetch("/users")
    let users = incomingData.json()
    //let users2 = JSON.parse(incomingData)
    console.log(users.body);
    //console.log(users2);

    let list = document.getElementById("userList") 

    // for (let index = 0; index < users.length; index++) {
    //     let listPart = document.createElement("li")
    //     listPart = users[index].name + " - " + users[index].email;
    //     list.appendChild(listPart);
    // }

}