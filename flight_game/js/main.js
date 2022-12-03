'use strict';
/* 1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);


// global variables
const apiurl = 'http://127.0.0.1:5000/';
let continent = 'EU'
const globalGoals = [];
const airportMarkers = L.featureGroup().addTo(map);
const startLoc = 'EFHK'

// icons
const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

// form for player name
document.querySelector('#player-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    const playerName = document.querySelector('#player-input').value;
    document.querySelector('#player-modal').classList.add('hide');
    gameSetup(`${apiurl}game?player=${playerName}&loc=${startLoc}&continent=${continent}&transport=airplane`);
})

// function to fetch data from API
async function getData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Invalid server input!');
    const data = await response.json();
    return data
}

// function to update game status
function updateStatus(status) {
    document.querySelector('#player-name').innerHTML = `Player: ${status.name}`;
    document.querySelector('#score').innerHTML = status.score;
    document.querySelector('#budget').innerHTML = status.co2_budget;
    // Should we add here more data about player's current status? Like distance? Time?
}

// function to show weather at selected airport
function showWeather(airport) {
    document.querySelector('#airport-name').innerHTML = `Weather at ${airport.name}`;
    document.querySelector('#airport-temp').innerHTML = `${airport.weather.temp}°C`;
    document.querySelector('#weather-icon').src = airport.weather.icon;
    document.querySelector('#airport-conditions').innerHTML = airport.weather.description;
    document.querySelector('#wind').innerHTML = `${airport.weather.wind.speed}m/s`;
}

// function to check if any goals have been reached
function checkGoals(meetsGoals) {
    if (meetsGoals.length > 0) {
        for (let goal of meetsGoals) {
            if (!globalGoals.includes(goal)) {
                document.querySelector('.goal').classList.remove('hide');
                location.href = '#goals'
            }
        }
    }
}

// function to update goal data and goal table in UI
function updateGoals(goals) {
    document.querySelector('#goals').innerHTML = '';
    for (let goal of goals) {
        const li = document.createElement("li");
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const figcaption = document.createElement("figcaption");
        img.src = goal.icon;
        img.alt = `goal name: ${goal.name}`;
        figcaption.innerHTML = goal.description;
        figure.append(img);
        figure.append(figcaption);
        li.append(figure);
        if (goal.reached) {
            li.classList.add('done');
            globalGoals.includes(goal.goalid) || globalGoals.push(goal.goalid);
        }
        document.querySelector('#goals').append(li)
    }
}

// function to check if game is over
function checkGameOver(budget) {
    if (budget <= 0) {
        alert(`Game Over. ${globalGoals.length} goals reached.`);
        return false;
    }
    return true;
}
let number = 0;

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup(url) {
    try {
        let continentMenu = document.querySelector('#continent-menu');
        continentMenu.replaceWith(continentMenu.cloneNode(true));
        continentMenu = document.querySelector('#continent-menu');
        continentMenu.options[number].selected = "selected";

        document.querySelector('.goal').classList.add('hide');
        airportMarkers.clearLayers();
        const gameData = await getData(url);
        console.log(gameData);

        updateStatus(gameData.player_status);

        const playerLocation = L.marker([gameData.location.latitude, gameData.location.longitude]).addTo(map);
        airportMarkers.addLayer(playerLocation);
        map.flyTo([gameData.location.latitude, gameData.location.longitude], 2);
        playerLocation.bindPopup(`You are here: <b>${gameData.location.name}</b>`);
        playerLocation.setIcon(greenIcon);
        playerLocation.openPopup();

        continentMenu = document.querySelector('#continent-menu');
                continentMenu.addEventListener('change', function () {
                        number = continentMenu.selectedIndex;
                        continent = continentMenu.value;
                        gameSetup(`${apiurl}flyto?loc=${gameData.location.ident}&continent=${continent}&transport=airplane`);
                });

        // Event listener for Transport

        for (let airport of gameData.airports) {
            const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
            airportMarkers.addLayer(marker)

            // Function for weather call here!
            // Check for goals here!
            // Check if game is over here!

            marker.setIcon(blueIcon);
            const popupContent = document.createElement("div");
            const h4 = document.createElement('h4');
            h4.innerHTML = airport.name;
            popupContent.append(h4);
            const goButton = document.createElement("button");
            goButton.classList.add('button');
            goButton.innerHTML = 'Fly here';
            popupContent.append(goButton);
            const p = document.createElement("p");
            p.innerHTML = `Distance ${airport.distance}km`;
            popupContent.append(p);
            marker.bindPopup(popupContent);
            goButton.addEventListener('click', function () {
                gameSetup(`${apiurl}flyto?loc=${airport.ident}&continent=${continent}&transport=airplane`);
            });
        }
    } catch
        (error) {
        console.log(error);
    }
}

// event listener to hide goal splash
document.querySelector('.goal').addEventListener('submit', function (evt) {
    evt.currentTarget.classList.add('hide');
});

