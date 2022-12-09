'use strict';

/* 1. show map using Leaflet library. (L comes from the Leaflet library) */

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);


// global variables
let number = 0;
const apiurl = 'http://127.0.0.1:5000/';

const globalGoals = [];
const airportMarkers = L.featureGroup().addTo(map);
const playerLocation = L.marker([0, 0]);
let playerLoc = 'EFHK'
let continent = 'EU'
let transport = 'airplane'
let country = 'FI'

// icons
const blueIcon = L.divIcon({className: 'blue-icon'});

const bolivarIcon = L.icon({
    iconUrl: 'img/bolivar_airplane.png',
    iconSize: [120, 90], // size of the icon
    iconAnchor: [60, 45], // point of the icon which will correspond to marker's location
    popupAnchor: [-25, -50] // point from which the popup should open relative to the iconAnchor
});

// form for player name
document.querySelector('#player-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    const playerName = document.querySelector('#player-input').value;
    document.querySelector('#player-modal').classList.add('hide');
    gameSetup(`${apiurl}game?player=${playerName}&loc=${playerLoc}&continent=${continent}&transport=${transport}&country=${country}`);
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
    document.querySelector('#distance').innerHTML = status.distance.toFixed(1);
    document.querySelector('#time').innerHTML = status.travel_time.toFixed(1);
    // Should we add here more data about player's current status? Like distance? Time?
}

// function to show weather at selected airport
function showWeather(data) {
    document.querySelector('#airport-name').innerHTML = `${data.location.name}`;
    document.querySelector('#airport-temp').innerHTML = `${data.weather.temp}°C`;
    document.querySelector('#weather-icon').src = data.weather.icon;
    document.querySelector('#airport-conditions').innerHTML = data.weather.description;
    document.querySelector('#wind').innerHTML = `${data.weather.wind.speed}m/s`;
}

// function to check if any goals have been reached
function checkGoals(playerGoals) {
    if (playerGoals.length > 0) {
        for (let goal of playerGoals) {
            if (!globalGoals.includes(goal.goalid)) {
                document.querySelector('.goal').classList.remove('hide');
            }
        }
    }
}

// function to update goal data and goal table in UI
function updateGoals(goals) {
    document.querySelector('#goals').innerHTML = '';
    for (let goal of goals) {
        const div = document.createElement('div');
        div.classList.add('goal-item');
        const img = document.createElement("img");
        img.src = goal.icon;
        img.alt = `goal name: ${goal.name}`;
        const p = document.createElement('p');
        p.innerHTML = goal.description;
        div.appendChild(img)
        div.appendChild(p)
        if (goal.reached) {
            div.classList.add('active');
            globalGoals.includes(goal.goalid) || globalGoals.push(goal.goalid);
        }
        document.querySelector('#goals').append(div)
    }
}

// function to check if game is over
async function checkGameOver(data) {
    if (data.player_status.co2_budget <= 0) {
        document.querySelector('#gameover-modal').classList.remove('hide');
    } else if (data.player_status.goals.length >= 8) {
        if (data.player_status.to_topten) {
            await build_top_ten();
            const toptenModal = document.querySelector('#topten-modal');
            const congrats = document.querySelector('#congrats');
            const p = document.createElement("p");
            p.innerHTML = 'NICE FLYING THERE!! U MADE IT TO THE TOP10!!';
            congrats.appendChild(p);
            toptenModal.classList.remove('hide');
        } else {
            await build_top_ten();
            const toptenModal = document.querySelector('#topten-modal');
            const congrats = document.querySelector('#congrats');
            const p = document.createElement("p");
            p.innerHTML = 'You almost had it to the topten. Fly again.';
            congrats.appendChild(p);
            toptenModal.classList.remove('hide');
        }
    }
}

// function to build topten10 table
async function build_top_ten() {
    const data = await getData(`${apiurl}topten`);
    const congrats = document.querySelector('#congrats');
    congrats.innerHTML = '';
    let i = 1;
    const table = document.querySelector('#topten-table');
    table.innerHTML = '';
    const tr3 = document.createElement("tr");
    const td3 = document.createElement("td");
    td3.innerHTML = '#';
    tr3.appendChild(td3);
    const td4 = document.createElement("td");
    td4.innerHTML = 'Name';
    tr3.appendChild(td4);
    const td5 = document.createElement("td");
    td5.innerHTML = 'Score';
    tr3.appendChild(td5);
    table.appendChild(tr3)

    for (let player of data) {
        const tr = document.createElement("tr");
        const placeNumber = document.createElement('td');
        placeNumber.innerHTML = i.toString();
        tr.appendChild(placeNumber);
        const td = document.createElement("td");
        td.innerHTML = player[1];
        tr.appendChild(td);
        const td2 = document.createElement("td");
        td2.innerHTML = player[2];
        tr.appendChild(td2);
        table.appendChild(tr);
        i++;
    }
    const toptenModal = document.querySelector('#topten-modal')
    document.querySelector('#topten-button').addEventListener('click', function () {
        toptenModal.classList.remove('hide');
        location.href = "#top";
    });
}

// function to wait for a while
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function to move marker to target coordinates
async function moveMarker(data) {
    if (data.player_status.flight_coords.length > 1) {
        map.flyTo([data.continent[0], data.continent[1]], 3);
        await sleep(2000);
        for (let coordinates of data.player_status.flight_coords) {
            map.flyTo([coordinates[0], coordinates[1]], 5);
            playerLocation.setLatLng([coordinates[0], coordinates[1]]);
            await sleep(25);
        }
    } else {
        playerLocation.setLatLng([data.location.latitude, data.location.longitude]);
        playerLocation.setIcon(bolivarIcon);
        playerLocation.addTo(map);
        map.flyTo([data.location.latitude, data.location.longitude]);
        playerLocation.setIcon(bolivarIcon);
        playerLocation.openPopup();
        map.flyTo([data.continent[0], data.continent[1]], 3);
    }
    playerLocation.bindPopup(`You are here: <b>${data.location.name}</b>`);
    playerLocation.openPopup();
}

function tranportButtons() {
    const buttons = document.querySelectorAll(".button-transport");
    for (let button of buttons) {
        button.addEventListener(`click`, function (evt) {
            buttons.forEach(i => i.classList.remove('active'));
            transport = evt.currentTarget.value;
            this.classList.toggle('active');
        });
    }
}

function continentButtons() {
    const buttons = document.querySelectorAll(".button-world");
    for (let button of buttons) {
        button.addEventListener(`click`, function (evt) {
            buttons.forEach(i => i.classList.remove('active'));
            continent = evt.currentTarget.value;
            this.classList.toggle('active');
        });
    }
}

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup(url) {
    try {
        document.querySelector('.goal').classList.add('hide');
        document.querySelector('#gameover-modal').classList.add('hide');
        airportMarkers.clearLayers();
        const gameData = await getData(url);
        console.log(gameData);
        playerLoc = gameData.location.ident;
        continent = gameData.continent[2];

        continentButtons();
        tranportButtons();
        await moveMarker(gameData);
        updateStatus(gameData.player_status);
        showWeather(gameData);
        checkGameOver(gameData);

        if (gameData.airports.length < 1) {
            alert("No airports found. Remember: Landing spots for balloon are only found in North-America and some in Europe.");
        } else {
            for (let airport of gameData.airports) {
                const marker = L.marker([airport.latitude, airport.longitude]).addTo(map);
                airportMarkers.addLayer(marker)
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
                    gameSetup(`${apiurl}flyto?loc=${airport.ident}&prevloc=${playerLoc}&continent=${continent}&transport=${transport}&country=${country}`);
                });
            }
        }
        checkGoals(gameData.player_status.goals);
        updateGoals(gameData.goals);
    } catch
        (error) {
        console.log(error);
    }
}

// event listener to hide goal splash
document.querySelector('.goal').addEventListener('click', function (evt) {
    evt.currentTarget.classList.add('hide');
});

// event listener for search button
document.querySelector('#search-button').addEventListener('click', function () {
    gameSetup(`${apiurl}refresh?loc=${playerLoc}&continent=${continent}&transport=${transport}`)
});

// event listener for topten
document.querySelector('#topten-button').addEventListener('click', build_top_ten())
document.querySelector('#topten-close').addEventListener('click', function () {
    document.querySelector('#topten-modal').classList.add('hide');
});

// event listener for gameover screen
document.querySelector('#gameover-newgame').addEventListener('click', function () {
    document.querySelector('#gameover-modal').classList.add('hide');
    location.reload();
});







