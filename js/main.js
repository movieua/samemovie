let actor_name = document.querySelector("#actor_name");
let add_btn = document.querySelector("#add");
let match_btn = document.querySelector("#match");
let clear_btn = document.querySelector("#clear");
let datalist = document.querySelector("#actorsList");
let loader = document.querySelector("#loader");
let languageVariants = document.getElementsByName("lang");
let languageForm = document.querySelector("#languageForm");
let actorsContainer = document.querySelector("#actorsContainer");
let filmResults = document.querySelector("#filmResults");



let actorsList = [];
let showList = [];

let api_key = "90eb3126e63be5a94312f2ed0feef42b";
let worker;
let language = "en";

for (let variant of languageVariants) {
  variant.onchange = changeLanguage;
}

actor_name.oninput = function () {
  checkIfChoosed();

  loader.style.visibility = "visible";
  datalist.innerHTML = "";
  if (worker != undefined) {
    worker.postMessage("abort request")
    worker.terminate();
    worker = undefined;
  }

  worker = new Worker("./js/worker.js");
  worker.postMessage([actor_name.value, language]);
  worker.onmessage = function (e) {
    console.log(e.data);
    createOptionList(e.data);
  };
};

function checkIfChoosed() {
  if (actorsList.length == 1) {
    datalist.innerHTML = "";
  }
}

function changeLanguage() {
  actor_name.value = "";
  language = languageForm.lang.value;
  console.log(language);
}

function createOptionList(actorsListAnswer) {
  loader.style.visibility = "hidden";
  datalist.innerHTML = "";
  actorsList = actorsListAnswer;

  actorsList.forEach((actor) => {
    let option = document.createElement("option");
    option.setAttribute("value", actor.name);

    option.dataset.actorId = actor.id;
    option.onclick = function () {
      console.log("ABC");
      console.log(this);
    };
    datalist.append(option);
  });
}

add_btn.onclick = function () {
  
    

  if (actorsList.length == 0) {
    alert("Person is not found(!");
  }else if(actorsList.length != 1){
    checkIfOne()
  } else {
    searchPerson(actorsList[0]);
  }

  actor_name.value = ""
};

function checkIfOne(){
  let options = document.querySelectorAll("datalist option")

  for(let i=0; i < options.length; i++){
    console.log(`Option - ${options[i].value}; input - ${actor_name.value}`)
    if(options[i].value == actor_name.value){
      searchPerson(actorsList[i]);
      return
    }
  }

  alert("Choose actor");
}

function searchPerson(actor) {
  let exists = false;

  if (showList.length == 0) {
    exists = false;
  } else {
    for (let item of showList) {
      if (item.id == actor.id) {
        exists = true;
      }
    }
  }

  if (exists) {
    alert("This actor is already choosen");
  } else {
    showList.push(actor);
    showActors(showList)
  }

  datalist.innerHTML = ""
}



function showActors(actorsList) {
    let imageAdress;
    actorsContainer.innerHTML = "";

  for (let actor of actorsList) {    
    if(actor.profile_path){
        imageAdress = "https://image.tmdb.org/t/p/w500" + actor.profile_path;
    } else {
        imageAdress = "No_Image_Available.jpg";
    }
     
    let actorElem = document.createElement("div");

    actorElem.className = "actor_elem card col-md-2 col-6";

    actorElem.innerHTML = `
    <div class="card-body">
        <h6 class="card-title">${actor.name}</h6>
        <button onclick="removeActorFromList(${actor.id})" type="button" class="btn-close btn-sm remove_actor"></button>
    </div>
     <img class="card-img-bottom" src="${imageAdress}">
    `;
    actorsContainer.append(actorElem);
  }
}

function removeActorFromList(id){
    showList = showList.filter((actor)=>actor.id != id);
    showActors(showList)

}

match_btn.onclick = function(){
    if(showList.length == 0){
        alert("No actors!!!")
    }else if (showList.length == 1){
        alert("Only one actor!!!")
    }
    else {
        matchActors(showList);
    }
}

function matchActors(list){
    let worker2 = new Worker("./js/worker2.js");

    worker2.postMessage(list);

    worker2.onmessage = function(e){
        console.log(e.data);
        showCommonFilms(e.data)
    }

}

function showCommonFilms(resultList){
    filmResults.style.display = "flex"
    if(resultList.length == 0){
        filmResults.innerHTML += "No matches"
    }
    else {
        showMatches(resultList)
    }
}


function showMatches(list){
    filmResults.innerHTML = "<h2>RESULT</h2>";

    let imageAdress;    

    for (let film of list) {
        if(film.poster_path){
            imageAdress = "https://image.tmdb.org/t/p/w500" + film.poster_path;
        } else {
            imageAdress = "No_Image_Available.jpg";
        }
        
        let filmElem = document.createElement("div");
    
        filmElem.className = "film_elem card col-md-2 col-6";
    
        filmElem.innerHTML = `
        <div class="card-body">
            <h6 class="card-title">${film.title}</h6>
        </div>
         <img class="card-img-bottom" src="${imageAdress}">
        `;
        filmResults.append(filmElem);
      }
}

clear_btn.onclick = function(){
    showList = [];
    actorsContainer.innerHTML = "";
    filmResults.innerHTML = "";
    filmResults.style.display = "none";

}