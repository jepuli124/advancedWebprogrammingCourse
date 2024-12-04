if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
        loadOffers();
    })
  }
  

function initializeCode() {
    let offerForm = document.getElementById("offerForm");
    offerForm.addEventListener("submit", async function(event){
        event.preventDefault();
        let DTitle = document.getElementById("title");
        let DPrice = document.getElementById("price");
        let DDescription = document.getElementById("description");
        //let DImage = document.getElementById("image");
        const formData = new FormData(this)
        // formData.append("title", DTitle.value)
        // formData.append("description", DDescription.value)
        // formData.append("price", DPrice.value)
        let incomingData = await fetch("/upload", { 
            method: "POST",
            body: formData
        }); // https://www.freecodecamp.org/news/javascript-post-request-how-to-send-an-http-post-request-in-js/

        DTitle.value = ""
        DPrice.value = ""
        DDescription.value = ""
        loadOffers()
      })
}

async function loadOffers(){
  let incomingData = await fetch("/offers", {method: "get"});
  let data = await incomingData.json()
  let parentDiv = document.getElementById("offersContainer")
  parentDiv.innerHTML = ""
  for (let index = 0; index < data.length; index++) {
    let element = data[index];

    let childDiv = document.createElement("div")
    childDiv.className = 'offerDiv col s12 m6 l4'

    let subchildDiv1 = document.createElement("div")
    let subchildDiv2 = document.createElement("div")
    let subchildDiv3 = document.createElement("div")
    subchildDiv1.className = 'card hoverable'
    subchildDiv2.className = 'card-image'
    subchildDiv3.className = 'card-content'

    let title = document.createElement("span")
    let description = document.createElement("p")
    let price = document.createElement("p")
    let image = document.createElement("img")

    title.innerText = element.title
    description.innerText = element.description
    price.innerText = element.price
    image.src = "http://localhost:3000/" + element.imagePath

    title.className = 'card-title'
    image.className = 'responsive-img'



    subchildDiv2.appendChild(title)
    subchildDiv2.appendChild(image)

    subchildDiv3.appendChild(description)
    subchildDiv3.appendChild(price)

    subchildDiv1.appendChild(subchildDiv2)
    subchildDiv1.appendChild(subchildDiv3)
    childDiv.appendChild(subchildDiv1)
    
    parentDiv.appendChild(childDiv)
  }
}