if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
  }
  

function initializeCode() {
    let info = document.getElementById("todoForm");
    let search = document.getElementById("searchForm")
    info.addEventListener("submit", async function(){
        event.preventDefault();
        let Dname = document.getElementById("userInput");
        let name = Dname.value
        let DTodos = document.getElementById("todoInput");
        let todos = DTodos.value
        // console.log(name.value)
        // console.log(email.value)
        let confirmation = document.getElementById("confirmation");
        let incomingData = await fetch("/add", { 
            method: "POST",
            body: JSON.stringify({
            name: name,
            todos: todos
            }),
            headers: {
            "Content-type": "application/json"
            }
        }); // https://www.freecodecamp.org/news/javascript-post-request-how-to-send-an-http-post-request-in-js/
        let confData = await incomingData.json()
        confirmation.innerHTML = confData.msg;
        Dname.value = ""
        DTodos.value = ""
      })
    
    search.addEventListener("submit", async function(){
        event.preventDefault();
        let Dname = document.getElementById("searchInput");
        let name = Dname.value
        // console.log(name.value)
        // console.log(email.value)
        let todoList = document.getElementById("todoList");
        todoList.innerHTML = ''
        let incomingData = await fetch("/user/" + name); 
        let data = await incomingData.json()
        console.log(data)
        if(data.todos !== undefined){
            for (let index = 0; index < data.todos.length; index++) {
                let listPart = document.createElement("li")
                let listLink = document.createElement("a")

                listPart.innerHTML = data.todos[index];
                listPart.className = "delete-task"

                listLink.href = ""

                //listPart.addEventListener("onclick", elementDeletion())
                listPart.appendChild(listLink)
                todoList.appendChild(listPart);
            }
            let deletebutton = document.getElementById("deleteUser");
            deletebutton.style = "display: block"; //https://www.w3schools.com/howto/howto_js_toggle_hide_show.asp
        } else {
            let confirmation = document.getElementById("confirmation");
            confirmation.innerHTML = data.msg;
        }
        
      })

    
}

async function buttonclick(){
    let name = document.getElementById("searchInput");
    console.log(name.value)
    let incomingData = await fetch("/delete", { 
        method: "DELETE",
        body: JSON.stringify({
        name: name.value,
        }),
        headers: {
        "Content-type": "application/json"
        }
    });
    let data = await incomingData.json()
    let confirmation = document.getElementById("confirmation");
    confirmation.innerHTML = data.msg;
    let todoList = document.getElementById("todoList");
    todoList.innerHTML = ''
    let deletebutton = document.getElementById("deleteUser");
    deletebutton.style = "display: none"
    
      //https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript?page=2&tab=scoredesc#tab-top
}

async function elementDeletion() {
    console.log("works")
}