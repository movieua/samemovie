let api_key = "0a8d9dffda0d47ca644842bc8aedaf1c";
let actorList;
let films = [];
onmessage = function (e) {
  actorList = e.data;
  getFilms(actorList);
};

function getFilms(list) {
  let promisesObj = [];

  for (let actor of list) {
    promisesObj.push(makeRequest(actor));
  }

  Promise.all(promisesObj).then((res) => showList(res));
}

function makeRequest(actor) {
  return fetch(
    `https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=${api_key}&language=en-US`
  )
    .then((resObj) => resObj.json())
    .then((res) => res);
}

function showList(res) {
  console.log(res);

  for (let actor of res) {
    films.push(actor.cast);
  }

  console.log(films);

  findCommonFilms(films);
}

function findCommonFilms(actorFilms) {
  const result = [];
  const nameCounts = {};

  actorFilms.forEach((films) => {
    films.forEach((obj) => {
      const id = obj.id;
      if (!nameCounts[id]) {
        nameCounts[id] = 1;
      } else {
        nameCounts[id]++;
      }
      if (nameCounts[id] === actorFilms.length && !result.includes(obj)) {
        result.push(obj);
      }
    });
  });

  console.log(result)
  postMessage(result)
}
