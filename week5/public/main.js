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
        let todo = DTodos.value
        // console.log(name.value)
        // console.log(email.value)
        let confirmation = document.getElementById("confirmation");
        let incomingData = await fetch("/add", { 
            method: "POST",
            body: JSON.stringify({
            name: name,
            todo: todo
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
        let incomingData = await fetch("/todos/" + name); 
        let data = await incomingData.json()
        console.log(data)
        if(data.todos !== undefined){
            for (let index = 0; index < data.todos.length; index++) {
                let listPart = document.createElement("li")
                let listLink = document.createElement("a")
                let listLabel = document.createElement("label")
                let listSpan = document.createElement("span")
                let listCheck = document.createElement("INPUT"); // https://www.w3schools.com/jsref/dom_obj_checkbox.asp
                
                listCheck.setAttribute("type", "checkbox");
                listCheck.id = "myCheckbox"
                listCheck.className = "checkBoxes"

                listPart.innerText = data.todos[index];
                listPart.className = "delete-task"
                listPart.id = `listPart${index}`
                //listLink.href = "javascript:console.log('clicked button');elementDeletion();return false;" // https://stackoverflow.com/questions/1070760/javascript-href-vs-onclick-for-callback-function-on-hyperlink

                listPart.addEventListener("click", (e) => {
                    elementDeletion(e)
                })
                
                listCheck.addEventListener("click", (e) => {
                    
                    event.stopPropagation() //help from jesse (he who cooks)
                    elementCheck(e, listCheck.parentNode.parentNode)
                })

                listSpan.appendChild(listLink)
                listLabel.appendChild(listSpan);
                listLabel.appendChild(listCheck);
                listPart.appendChild(listLabel);
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

async function elementDeletion(e) {
    let Dname = document.getElementById("searchInput");
    let name = Dname.value

    //let todo = "" //TODO

    let incomingData = await fetch("/update", { 
        method: "PUT",
        body: JSON.stringify({
        name: name,
        todo: e.target.innerText
        }),
        headers: {
        "Content-type": "application/json"
        }
    });

    let data = await incomingData.json()
    console.log(data.msg)
    if(data.msg == "Todo deleted successfully."){
        console.log("got here")
        let listPart = document.getElementById(e.target.id)
        listPart.remove()
    }
}

async function elementCheck(e, parentNode) {
    let Dname = document.getElementById("searchInput");
    let name = Dname.value

    //let todo = "" //TODO

    let incomingData = await fetch("/updateTodo", { 
        method: "PUT",
        body: JSON.stringify({
        name: name,
        todo: parentNode.innerText,
        checked: e.target.checked
        }),
        headers: {
        "Content-type": "application/json"
        }
    });

    let data = await incomingData.json()
    console.log(data.msg)
    if(data.msg == "Todo deleted successfully."){
        console.log("got here")
        let listPart = document.getElementById(e.target.id)
        listPart.remove()
    }
}