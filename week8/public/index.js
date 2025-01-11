if(document.readyState !== "loading") {
    initializeCode();
    loadTopics();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
        loadTopics();
    })
  }
  

async function initializeCode() {
  await fetch("/", { 
      method: "GET",
      headers: {
      "Content-type": "application/json"
      }
  }); 

  if(localStorage.getItem("token") !== null){
    console.log("this got true")
    createTopicForm()
  }

  let logout = document.getElementById("logout");
  logout.addEventListener("click", async (event) => {
      localStorage.removeItem("token")
      window.location.href = "register.html"
    })

  let submit = document.getElementById("submit")
  submit.addEventListener("click", async (event) => {
    event.preventDefault()
    let Dpassword = document.getElementById("password")
    let Demail = document.getElementById("email")
    let password2 = Dpassword.value
    let email2 = Demail.value
    console.log("Submit button: ", password2, email2)
    
    incomingData = await fetch("/api/user/login", { 
      method: "POST",
      body: JSON.stringify({
        password: password2,
        email: email2
      }),
      headers: {
      "Content-type": "application/json"
      }
    }); 
    if(incomingData.ok){
      let data = await incomingData.json() 
      localStorage.removeItem("username")
      localStorage.removeItem("token")
      localStorage.setItem("username", data.username)
      localStorage.setItem("token", data.token)
      createTopicForm()
    }
    
    })

  let form = document.getElementById("loginForm")
  form.addEventListener("submit", async (event) => {
    event.preventDefault()
    let Dpassword = document.getElementById("password")
    let Demail = document.getElementById("email")
    let password2 = Dpassword.value
    let email2 = Demail.value
    console.log("Submit button: ", password2, email2)
    
    incomingData = await fetch("/api/user/login", { 
      method: "POST",
      body: JSON.stringify({
        password: password2,
        email: email2
      }),
      headers: {
      "Content-type": "application/json"
      }
    }); 
    if(incomingData.ok){
      let data = await incomingData.json() 
      localStorage.removeItem("username")
      localStorage.removeItem("token")
      localStorage.setItem("username", data.username)
      localStorage.setItem("token", data.token)
      createTopicForm()
    }
    
    })
}

function createTopicForm(){
  console.log("createTopicForm is run")
  let formDiv = document.getElementById("topicForm");
  formDiv.innerHTML = ""

  let inputField = document.createElement("input");
  let textarea = document.createElement("input");
  let button = document.createElement("input");

  inputField.type = "text"
  textarea.type = "text"
  button.type = "submit"

  inputField.id = "topicTitle"
  textarea.id = "topicText"
  button.id = "postTopic"

  textarea.className = "materialize-textarea"
  button.className = "btn waves-effect waves-light"

  button.innerText = "button"

  formDiv.appendChild(inputField)
  formDiv.appendChild(textarea)
  formDiv.appendChild(button)

  formDiv.addEventListener("submit", async (event) => {
    event.preventDefault()
    let titleField = document.getElementById("topicTitle");
    let textField = document.getElementById("topicText");
    let token = localStorage.getItem("token")
    
    console.log("token: ", token)

    await fetch("/api/topic", { 
      method: "POST",
      body: JSON.stringify({
        title: titleField.value,
        content: textField.value,
        username: localStorage.getItem("username")
      }),
      headers: {
      "Content-type": "application/json",
      "authorization": `Bearer ${token}`
      }
    })
    loadTopics()
  })

  button.addEventListener("click", async (event) => {
    let titleField = document.getElementById("topicTitle");
    let textField = document.getElementById("topicText");
    let token = localStorage.getItem("token")
    
    console.log("token: ", token)

    await fetch("/api/topic", { 
      method: "POST",
      body: JSON.stringify({
        title: titleField.value,
        content: textField.value,
        username: localStorage.getItem("username")
      }),
      headers: {
      "Content-type": "application/json",
      "authorization": `Bearer ${token}`
      }
    })
    loadTopics()
  })
}

async function loadTopics(){
  console.log("loading topics")
  let topicDiv = document.getElementById("topics");
  topicDiv.innerHTML = ""

  // let uselessButton = document.createElement("button")
  // uselessButton.id = "deleteTopic"
  // topicDiv.appendChild(uselessButton)

  // let uselessDiv = document.createElement("div")
  // uselessDiv.classList.add("card")
  // uselessDiv.classList.add("z-depth-2")
  // uselessDiv.classList.add("hoverable")
  // uselessDiv.classList.add("grey")
  // uselessDiv.classList.add("lighten-2") 

  // topicDiv.appendChild(uselessDiv)

  // uselessButton.addEventListener("click", async (event) => {
  //   uselessButton.remove()
  //   uselessDiv.remove()
  //   })

  let incomingData = await fetch("/api/topics", { 
      method: "GET",
      headers: {
        "Content-type": "application/json"
      }
  }); 

  let data = await incomingData.json()
  console.log(data)

  for (let index = 0; index < data.topics.length; index++) {
    const element = data.topics[index];
    
    let div = document.createElement("div")
    let innerDiv = document.createElement("div")
    let innerinnerDiv = document.createElement("div")

    let span = document.createElement("span")
    let p1 = document.createElement("p")
    let p2 = document.createElement("p")

    let deleteButton = document.createElement("button")

    span.innerText = element.title
    p1.innerText = element.content
    p2.innerText = element.username + element.createdAt

    deleteButton.id = "deleteTopic"
    div.id = element._id

    div.classList.add("card")
    div.classList.add("z-depth-2")
    div.classList.add("hoverable")
    div.classList.add("grey")
    div.classList.add("lighten-2")
    
    innerDiv.className = "card-content"
    span.className = "card-title"
    p2.className = "grey-text text-darken-2"
    innerinnerDiv.className = "card-action"
    deleteButton.className = "btn waves-effect waves-light"
    deleteButton.innerText = "delete"
    deleteButton.type = "submit"

    innerinnerDiv.appendChild(deleteButton)

    innerDiv.appendChild(span)
    innerDiv.appendChild(p1)
    innerDiv.appendChild(p2)

    div.appendChild(innerinnerDiv)
    div.appendChild(innerDiv)

    topicDiv.appendChild(div)

    deleteButton.addEventListener("click", async (event) => {
      let token = localStorage.getItem("token")
      let incomingData = await fetch(`/api/topic/${div.id}`, { 
        method: "DELETE",
        headers: {
        "Content-type": "application/json",
        "authorization": `Bearer ${token}`
        }
      }); 

      if(!incomingData.ok){
        let data = await incomingData.json()
        alert(data.message)
      } else {
        div.remove()
      }
    })
  }
}