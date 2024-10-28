if(document.readyState !== "loading") {
    initializeCode();
  } else {
    document.addEventListener("DOMContentLoaded", function() {
        initializeCode();
    })
  }
  

  


function initializeCode() {
    let array = ['hound', 'boxer', 'husky', 'shiba', 'borzoi']
    for (let index = 0; index < array.length; index++) {
        const text = array[index];
        wikiItem(text);
    }
    



}

async function wikiItem(text){
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    
    let containerDiv = document.createElement("div");
    containerDiv.className = "container";

    let headDiv = document.createElement("div");
    headDiv.className = "wiki-item";

    let headtext = document.createElement("h1");
    headtext.className = "wiki-header";
    headtext.innerHTML = "Breed X";

    let contentDiv = document.createElement("div");
    contentDiv.className = "wiki-content";

    let maintext = document.createElement("p");
    maintext.className = "wiki-text";

    let someText = '';
    let textLength = Math.floor(Math.random() * 100);
    while (someText.length < textLength){
        someText += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    maintext.innerHTML = "Some text about this breed: \n" + someText;

    let imgcontainer = document.createElement("div");
    imgcontainer.className = "img-container";

    let imgdata = await fetchDataPOST('https://dog.ceo/api/breed/' + text + '/images/random');
    let wikidata = await fetchDataPOST('https://en.wikipedia.org/api/rest_v1/page/summary/'+ text +'?redirect=false')
    let dogImg = document.createElement("img");
    dogImg.className = "wiki-img";

    if (wikidata.extract.length > 10) {
        maintext.innerHTML = wikidata.extract;
    }
 
    dogImg.alt = "dogImage";
    dogImg.src = imgdata;

    imgcontainer.appendChild(dogImg);
    contentDiv.appendChild(maintext);
    contentDiv.appendChild(imgcontainer);
    headDiv.appendChild(headtext);
    headDiv.appendChild(contentDiv);
    containerDiv.appendChild(headDiv);

    let ogbody = document.getElementById("ogbody");
    ogbody.appendChild(containerDiv);

}

const fetchDataPOST = async (url) => { // copied from my introduction to webprogramming course week 6 
    const response = await fetch(url, 
      {
         method: "POST",
         headers: {"content-type": "application/json"},
         body: JSON.stringify(jsonBody)
        })
    if(!response.ok){ 
        console.log("no response (post)");
        return null; }
    const data = await response.json();
    return data;
}


// function fetchData(text){
//     fetch('https://dog.ceo/api/breed/' + text + '/images/random')
//     .then(response => response.json())
//     .then(data => {
//       updateSchedule(data);
//       });
  
  
//   }