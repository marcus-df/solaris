const planetName = document.getElementById('planet-name');
const planetLatin = document.getElementById('planet-latin')
const planetDesc = document.getElementById('planet-desc');
const planetTemp = document.getElementById('planet-temp');
const planetCirc = document.getElementById('planet-circ');
const planetYear = document.getElementById('planet-year');
const planetRotation = document.getElementById('planet-rotation');
const planetMoons = document.getElementById('planet-moons');
const planetImage = document.getElementById('planet-image')

// Search field elements
const searchInput = document.getElementById('search-input');
const dlPlanets = document.getElementById('dl-planets');

// Buttons for pagination
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// Information from local storage, converted back to JSON
let planetObj = JSON.parse(window.localStorage.getItem('planet'));
let currPlanetID = planetObj.id;

let searchTerm;
let planetList;

// Updating page elements on load.
updatePage(planetObj);

function updatePage(planet) {
    // Setting page title to current planet
    document.title = `${planet.name} - Solaris`;

    // Applying planet data to HTML page.
    planetName.innerHTML = `${planet.name}`;
    planetLatin.innerHTML = `<em>${planet.latinName}</em>`;
    planetDesc.innerHTML = `${planet.desc}`;
    planetTemp.innerHTML = `<strong>Temperatur</strong> <br>Dag: ${planet.temp.day}°C <br>Natt: ${planet.temp.night}°C`;
    planetCirc.innerHTML = `<strong>Omkrets</strong> <br>${planet.circumference} km`;
    planetYear.innerHTML = `<strong>Årslängd</strong> <br>${planet.orbitalPeriod} jorddygn`;
    planetRotation.innerHTML = `<strong>Rotation:</strong> ${planet.rotation} jorddygn`;
    planetMoons.innerHTML = `<strong>Antal månar:</strong> ${planet.moons.length}`;
    // Images are named after the planets, e.g. img/venus.png
    planetImage.setAttribute('src', `img/${planet.name.toLowerCase()}.png`);

    // Disabling rotation for Saturn (a little buggy)
    if (planetImage.src.includes('img/saturnus.png')) {
        planetImage.style.animationName = "none";
        planetImage.style.transform = "rotate(60deg)";
    } else {
        planetImage.style.animationName = "rotate-planet";
    }
}

// Saves fetched data into global variable (planetList).
async function getAll() {
    let planets = await getData();
    planets = planets.bodies;
    planetList = await planets;
    updateSearch();
}

// Adding datalist options to search field.
function updateSearch() {
    planetList.forEach(planet => {
        let newOption = document.createElement("option");
        newOption.textContent = planet.name;
        newOption.value = planet.name;

        dlPlanets.appendChild(newOption);
    });
}

// Event listener and search function.
searchInput.addEventListener('keyup', async function (event) {
    if (event.key === "Enter") {
        searchTerm = searchInput.value.toLowerCase();
        planetList.forEach(planet => {
            let latinName = planet.latinName.toLowerCase();
            let name = planet.name.toLowerCase();
            if (name.includes(searchTerm) || latinName.includes(searchTerm)) {
                window.localStorage.setItem('planet', JSON.stringify(planet));
                window.location.href = "planet-page.html";
            } else if (searchTerm == "pluto") {
                window.location.href = "pluto.html";
            }
        });
    }
});

prevBtn.addEventListener('click', async () => {
    if (currPlanetID > 0) {
        currPlanetID = currPlanetID - 1;
        updatePage(planetList[currPlanetID]);
    }
});

nextBtn.addEventListener('click', async () => {
    if (currPlanetID < planetList.length - 1) {
        currPlanetID = currPlanetID + 1;
        updatePage(planetList[currPlanetID]);
    }
});

// Fetching data from API
async function getData() {
    let baseURL = "https://fathomless-shelf-54969.herokuapp.com/bodies";
    let key = "solaris-2ngXkR6S02ijFrTP";

    try {
        let response = await fetch(`${baseURL}`, {
            method: 'GET',
            headers: {
                'x-zocom': key
            }
        });

        let data = await response.json();
        return await data;

    } catch (err) {
        console.error(err);
    }
}

getAll();