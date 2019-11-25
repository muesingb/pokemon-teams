/** Variables */
const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main')
let trainers = []

//Get all trainers info
fetch(TRAINERS_URL)
  .then(response => response.json())
  .then(data => {
    trainers = data
    data.forEach(trainer => {
        addTrainerCard(trainer)
    });
  })

//Add trainer cards
function addTrainerCard(trainer) {
  trainerHTML = `
  <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
    <button class="addPoke" data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
        ${addPokemon(trainer)}
    </ul>
</div>
`
    main.insertAdjacentHTML('beforeend', trainerHTML)
};

function addPokemon(trainer) {
    let pokemonHTML = "";
    trainer.pokemons.forEach(pokemon => {
        pokemonHTML += `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
    })
    return pokemonHTML
};

//Add Pokemon to page and db if they have space on their team. Event listener
main.addEventListener('click', function(event){
    if (event.target.className === "addPoke") {
        let trainerAddPokemon = parseInt(event.target.dataset.trainerId)
            fetch(POKEMONS_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "trainer_id": trainerAddPokemon
                })
            })
                .then(response => response.json())
                .then(json => {
                    let parentList = event.target.parentElement.querySelector('ul')
                    //make new li html element with json data, then add to parentList
                })
        } else if (event.target.className === "release") { //remove pokemon when click release button
            let deletePokeId= parseInt(event.target.dataset.pokemonId)
            fetch(POKEMONS_URL, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "id": deletePokeId
                })
            })
                .then(response => response.json())
                .then(json => {
                    console.log(json)
                })
        }
});