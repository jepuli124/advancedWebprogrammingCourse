

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
    let textLength = Math.floor(Math.random() * 10);
    while (someText.length < textLength){
        someText += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    
    maintext.innerHTML = "Some text about this breed: \n" + someText;

    let imgcontainer = document.createElement("div");
    imgcontainer.className = "img-container";

    let imgdataFetched = await fetch('https://dog.ceo/api/breed/' + text + '/images/random');
    let wikidataFetched = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+ text +'?redirect=false')

    let wikidata = await wikidataFetched.json();
    let imgdata = await imgdataFetched.json();

    let dogImg = document.createElement("img");
    dogImg.className = "wiki-img";

    //console.log(wikidata);

    if (wikidata.extract.length > 10) {
       maintext.innerHTML = wikidata.extract;
    }
 
    dogImg.alt = "dogImage";
    dogImg.src = imgdata.message;

    imgcontainer.appendChild(dogImg);
    contentDiv.appendChild(maintext);
    contentDiv.appendChild(imgcontainer);
    headDiv.appendChild(headtext);
    headDiv.appendChild(contentDiv);
    containerDiv.appendChild(headDiv);

    let ogbody = document.getElementById("ogbody");
    ogbody.appendChild(containerDiv);

}

