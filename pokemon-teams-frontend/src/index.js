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
    //EQUIVALENT ===> data.forEach(addTrainerCard)
  })

//Add trainer cards
function addTrainerCard(trainer) {
  trainerHTML = `
  <div class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
    <button class="addPoke" data-trainer-id="${trainer.id}">Add Pokemon</button>
    <ul>
        ${addPokemon(trainer).join('')}
    </ul>
</div>
`
    main.insertAdjacentHTML('beforeend', trainerHTML)
    //could also do main.innerHTML += trainerHTML
};

function addPokemon(trainer) {
    // let pokemonHTML = "";
    // trainer.pokemons.forEach(pokemon => {
    //     pokemonHTML += `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
    // })
    // return pokemonHTML

    return trainer.pokemons.map(function(pokemon) {
        return `<li>${pokemon.nickname} (${pokemon.species})<button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
    })
    //map will return a new array collecting the return values from its callback function
    //forEach just does some stuff and returns undefined
};

//Add Pokemon to page and db if they have space on their team. Event listener
main.addEventListener('click', function(event){
    if (event.target.className === "addPoke") {
        let numPokemon = event.target.closest('.card').querySelectorAll('li').length
        if (numPokemon < 6) {
            let trainerAddPokemon = parseInt(event.target.dataset.trainerId)
            fetch(POKEMONS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "trainer_id": trainerAddPokemon
                })
            })
                .then(response => response.json())
                .then(data => {
                    let parentList = event.target.parentElement.querySelector('ul')
                    //can also do event.target.closest('.card').querySelector('ul')
                    //make new li html element with json data, then add to parentList
                    let newPokeHTML = `<li>${data.nickname} (${data.species})<button class="release" data-pokemon-id="${data.id}">Release</button></li>`
                    //can also do parentList.innerHTML += newPokeHTML
                    parentList.insertAdjacentHTML('beforeend', newPokeHTML)
                })
            } else {
                alert("You can only have 6 pokemon per trainer. Please release some first.")
            }
    } else if (event.target.className === "release") {//remove pokemon when click release button
        let deletePokeId= parseInt(event.target.dataset.pokemonId)
        fetch(POKEMONS_URL + `/${deletePokeId}`, {
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                let pokemonListItem = event.target.closest('li')
                pokemonListItem.remove()
            })
    }
});