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
        let Dname = document.getElementById("name");
        let name = Dname.value
        let Demail = document.getElementById("email");
        let email = Demail.value
        // console.log(name.value)
        // console.log(email.value)
        console.log(await fetch("/users", { 
            method: "POST",
            body: JSON.stringify({
            name: name,
            email: email
            }),
            headers: {
            "Content-type": "application/json"
            }
        })); // https://www.freecodecamp.org/news/javascript-post-request-how-to-send-an-http-post-request-in-js/

        Dname.value = ""
        Demail.value = ""
      })
}

async function buttonclick(){

    let incomingData = await fetch("/users")
    let users = await incomingData.json()

    let list = document.getElementById("userList") 
    list.innerHTML = '';  //https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript?page=2&tab=scoredesc#tab-top
    console.log(users.users)
    for (let index = 0; index < users.users.length; index++) {
        let listPart = document.createElement("li")
        listPart.innerHTML = users.users[index].name + " - " + users.users[index].email;
        list.appendChild(listPart);
    }

}