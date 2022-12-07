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
let playerPrevLoc = ''
let continent = 'EU'
let transport = 'airplane'

// icons
const blueIcon = L.divIcon({className: 'blue-icon'});
const greenIcon = L.divIcon({className: 'green-icon'});

// form for player name
document.querySelector('#player-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    const playerName = document.querySelector('#player-input').value;
    document.querySelector('#player-modal').classList.add('hide');
    gameSetup(`${apiurl}game?player=${playerName}&loc=${playerLoc}&continent=${continent}&transport=${transport}`);
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
function showWeather(data) {
    document.querySelector('#airport-name').innerHTML = `Weather at ${data.location.name}`;
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
function checkGameOver(data) {
    if (data.player_status.co2_budget <= 0) {
        alert(`Game Over. ${globalGoals.length} goals reached.`);
        if (data.player_status.to_topten) {
            build_top_ten();
            const toptenModal = document.querySelector('#topten-modal');
            const p = document.createElement("p");
            p.innerHTML = 'NICE FLYING THERE!! U MADE IT TO THE TOP10!!';
            toptenModal.appendChild(p);
            toptenModal.classList.remove('hide');
        }
        return false;
    } else if (data.player_status.goals.length >= 8) {
        alert('You won the game');
        if (data.player_status.to_topten) {
            build_top_ten();
            const toptenModal = document.querySelector('#topten-modal');
            const p = document.createElement("p");
            p.innerHTML = 'NICE FLYING THERE!! U MADE IT TO THE TOP10!!';
            toptenModal.appendChild(p);
            toptenModal.classList.remove('hide');
        }
    } else {
        return true;
    }
}

// function to set all buttons to default style
function clearButtons(target, style1, style2) {
    const elements = document.getElementsByClassName(`${target}`)
    for (let e of elements) {
        e.classList.replace(style1, style2);
    }
}

// function to build topten10 table
async function build_top_ten() {
    const data = await getData(`${apiurl}topten`);
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
        map.flyTo([data.location.latitude, data.location.longitude]);
        await sleep(1500);
        map.flyTo([data.continent[0], data.continent[1]], 2);
        await sleep(1500);
        for (let coordinates of data.player_status.flight_coords) {
            map.flyTo([coordinates[0], coordinates[1]], 5);
            playerLocation.setLatLng([coordinates[0], coordinates[1]]);
            await sleep(25);
        }
    } else {
        playerLocation.setLatLng([data.location.latitude, data.location.longitude]);
        playerLocation.setIcon(greenIcon);
        playerLocation.addTo(map);
        map.flyTo([data.location.latitude, data.location.longitude]);
        await sleep(1500);
        map.flyTo([data.continent[0], data.continent[1]], 2);
        await sleep(1500);
    }
    playerLocation.bindPopup(`You are here: <b>${data.location.name}</b>`);
    playerLocation.setIcon(greenIcon);
    playerLocation.openPopup();
}

// function to set up game
// this is the main function that creates the game and calls the other functions
async function gameSetup(url) {
    try {
        document.querySelector('.goal').classList.add('hide');
        airportMarkers.clearLayers();
        const gameData = await getData(url);
        console.log(gameData);
        playerLoc = gameData.location.ident;
        continent = gameData.continent[2];

        showWeather(gameData);
        updateStatus(gameData.player_status);
        if (!checkGameOver(gameData)) return

        await moveMarker(gameData);

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
                    gameSetup(`${apiurl}flyto?loc=${airport.ident}&prevloc=${playerLoc}&continent=${continent}&transport=${transport}`);
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

// event listeners for transport buttons
document.querySelector('#airplane').addEventListener('click', function (evt) {
    clearButtons('transport-item', 'button-yellow', 'button-white');
    transport = evt.currentTarget.value;
    evt.currentTarget.classList.replace('button-white', 'button-yellow')
    gameSetup(`${apiurl}flyto?loc=${playerLoc}&prevloc=${playerPrevLoc}&continent=${continent}&transport=${transport}`);
});

document.querySelector('#fighter').addEventListener('click', function (evt) {
    clearButtons('transport-item', 'button-yellow', 'button-white');
    transport = evt.currentTarget.value;
    evt.currentTarget.classList.replace('button-white', 'button-yellow');
    gameSetup(`${apiurl}flyto?loc=${playerLoc}&prevloc=${playerPrevLoc}&continent=${continent}&transport=${transport}`);
});

document.querySelector('#helicopter').addEventListener('click', function (evt) {
    clearButtons('transport-item', 'button-yellow', 'button-white');
    transport = evt.currentTarget.value;
    evt.currentTarget.classList.replace('button-white', 'button-yellow');
    gameSetup(`${apiurl}flyto?loc=${playerLoc}&prevloc=${playerPrevLoc}&continent=${continent}&transport=${transport}`);
});

document.querySelector('#glider').addEventListener('click', function (evt) {
    clearButtons('transport-item', 'button-yellow', 'button-white');
    transport = evt.currentTarget.value;
    evt.currentTarget.classList.replace('button-white', 'button-yellow');
    gameSetup(`${apiurl}flyto?loc=${playerLoc}&prevloc=${playerPrevLoc}&continent=${continent}&transport=${transport}`);
});

document.querySelector('#balloon').addEventListener('click', function (evt) {
    clearButtons('transport-item', 'button-yellow', 'button-white');
    transport = evt.currentTarget.value;
    evt.currentTarget.classList.replace('button-white', 'button-yellow');
    gameSetup(`${apiurl}flyto?loc=${playerLoc}&prevloc=${playerPrevLoc}&continent=${continent}&transport=${transport}`);
});

document.querySelector('#topten-button').addEventListener('click', build_top_ten())
document.querySelector('#topten-close').addEventListener('click', function () {
    document.querySelector('#topten-modal').classList.add('hide');
});

const continentMenu = document.querySelector('#continent-menu');
continentMenu.addEventListener('change', function () {
    continent = continentMenu.value;
    gameSetup(`${apiurl}flyto?loc=${playerLoc}&continent=${continent}&transport=${transport}`);
});




