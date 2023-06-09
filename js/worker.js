let api_key="0a8d9dffda0d47ca644842bc8aedaf1c";
let actor_name;
let finishedArray = [];
let allActors;
let sortedArr;
let arrForUse;
let language;

onmessage = function(e){
    const abortController = new AbortController();
    if(e == "abort request"){
        abortController.abort();
    }
    actor_name = e.data[0];
    language = e.data[1]
    fetch(`https://api.themoviedb.org/3/search/person?api_key=${api_key}&known_for_department=Acting&language=${language}&page=1&include_adult=false&query=${actor_name}`,
    { signal: abortController.signal })
    .then(resObj=>resObj.json())
    .then(res=>showResult(res))      
}



function showResult(res){

    let promisesObj = []
    
    let pagesNumber = res.total_pages;
    console.log(pagesNumber)


    for(let i = 1; i <= pagesNumber; i++){
        promisesObj.push(makeRequest(i))
    }

    Promise.all(promisesObj)
            .then(res => showList(res));
}

function makeRequest(number){
  return  fetch(`https://api.themoviedb.org/3/search/person?api_key=${api_key}&language=en-US&page=${number}&include_adult=false&query=${actor_name}`)
    .then(resObj=>resObj.json())
    .then(res=>res)

}

function showList(res){
    for(let i = 0; i < res.length; i++){
        finishedArray = finishedArray.concat(res[i].results)
    }

    
    allActors = finishedArray;

    sortActors(allActors)
}

function sortActors(allActorsArray){
    sortedArr = allActorsArray.sort((a,b)=>b.popularity - a.popularity)
    if(sortedArr.length > 5){
        arrForUse = sortedArr.slice(0, 6)
    }
    else {
        arrForUse = sortedArr;
    }
    postMessage(arrForUse)
}