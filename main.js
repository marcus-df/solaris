const searchInput = document.getElementById('search-input');
const contentField = document.getElementById('content-field');
const dlPlanets = document.getElementById('dl-planets');

let searchTerm;

// Search function and event listener.
searchInput.addEventListener('keyup', async function (event) {
    if (event.key === "Enter") {
        searchTerm = searchInput.value.toLowerCase();
        let planets = await getData();
        planets = planets.bodies;
        planets.forEach(planet => {
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

async function getAll() {
    let planets = await getData();
    planets = planets.bodies;
    updateUI(planets);
}

function updateUI(planets) {
    planets.forEach(planet => {
        console.log(planet);

        let planetField = document.createElement('article');
        let image = document.createElement('img');
        let info = document.createElement('h2');

        planetField.classList.add('planet-field');

        image.setAttribute('src', `img/placeholder.png`);
        image.setAttribute('class', `img-object`);
        image.setAttribute('id', `${planet.name.toLowerCase()}`);
        info.innerHTML = `${planet.name}`;

        contentField.appendChild(planetField);
        planetField.appendChild(image);
        planetField.appendChild(info);

        planetField.addEventListener('click', () => {
            window.localStorage.setItem('planet', JSON.stringify(planet));
            window.location.href = "planet-page.html";
        })

        // Updating datalist for search field.
        let newOption = document.createElement("option");
        newOption.textContent = planet.name;
        newOption.value = planet.name;

        dlPlanets.appendChild(newOption);
    });

    setTimeout(replaceImg, 25);
}

function replaceImg() {
    let images = document.querySelectorAll('.img-object');
    images.forEach(image => {
        image.setAttribute('src', `img/${image.id}.png`);
    });
};

// Function to get data from API
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