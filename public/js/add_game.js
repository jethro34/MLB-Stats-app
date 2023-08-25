// add_game.js

// get the objects we need to modify
let addGameForm = document.getElementById('add-game-form-ajax');

// modify the objects we need
addGameForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields we need to get data from
    let inputGameDate = document.getElementById("input-game-date");
    let inputGameLoc = document.getElementById("input-game-location");
    let inputAwayTeam = document.getElementById("input-game-awayt");
    let inputAwayScore = document.getElementById("input-game-awayt-score");
    let inputHomeTeam = document.getElementById("input-game-homet");
    let inputHomeScore = document.getElementById("input-game-homet-score");
    let inputAwayWin = document.querySelector('input[name="input-game-away-winner"]:checked');

    // get values from form fields
    let gameDateValue = inputGameDate.value;
    let gameLocValue = inputGameLoc.value;
    let awayTeamValue = inputAwayTeam.value;
    let awayScoreValue = inputAwayScore.value;
    let homeTeamValue = inputHomeTeam.value;
    let homeScoreValue = inputHomeScore.value;
    let awayWinnerValue = inputAwayWin.value;

    // put data to send in a JS object
    let gData = {
        date: gameDateValue,
        away_team: awayTeamValue,
        away_score: awayScoreValue,
        home_team: homeTeamValue,
        home_score: homeScoreValue,
        location_id: gameLocValue,
        is_away_winner: awayWinnerValue
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-game-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new game to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputGameDate.value = "";
            inputAwayTeam.value = "";
            inputAwayScore.value = "";
            inputHomeTeam.value = "";
            inputHomeScore.value = "";
            inputGameLoc.value = "";
            inputAwayWin.value = "";
            inputAwayWin.checked = false;       // uncheck radio buttons
            
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(gData));
});

// create & add a row from a Str representing a single entry from Games
addRowToTable = (gData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("games-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(gData);

    // create a row and 10 cells
    let newHTMLRow = document.createElement("TR");
    let editCell = document.createElement("TD");
    let gameIdCell = document.createElement("TD");
    let gameDateCell = document.createElement("TD");
    let gameLocCell = document.createElement("TD");
    let awayTeamCell = document.createElement("TD");
    let awayScoreCell = document.createElement("TD");
    let homeTeamCell = document.createElement("TD");
    let homeScoreCell = document.createElement("TD");
    let winnerCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill cells with input data
    let editButton = document.createElement("button"); // create button & add it to cell
    editButton.innerHTML = "Edit";
    editButton.onclick = function() {
        fillGameToUpdate(newRowContents.game_id);
    };
    editCell.appendChild(editButton);

    gameIdCell.innerText = newRowContents.game_id;
    gameDateCell.innerText = newRowContents.date;
    gameLocCell.innerText = newRowContents.location;
    gameLocCell.setAttribute('data-loc-id', newRowContents.location_id);
    awayTeamCell.innerText = newRowContents.away_team;
    awayScoreCell.innerText = newRowContents.away_score;
    homeTeamCell.innerText = newRowContents.home_team;
    homeScoreCell.innerText = newRowContents.home_score;
    winnerCell.innerText = newRowContents.winner;

    let deleteButton = document.createElement("button"); // create button & add it to cell
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteGame(newRowContents.game_id);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to the row
    newHTMLRow.appendChild(editCell);
    newHTMLRow.appendChild(gameIdCell);
    newHTMLRow.appendChild(gameDateCell);
    newHTMLRow.appendChild(gameLocCell);
    newHTMLRow.appendChild(awayTeamCell);
    newHTMLRow.appendChild(awayScoreCell);
    newHTMLRow.appendChild(homeTeamCell);
    newHTMLRow.appendChild(homeScoreCell);
    newHTMLRow.appendChild(winnerCell);
    newHTMLRow.appendChild(deleteCell);

    // add a row attribute so deleteRow func can find newly added rows
    newHTMLRow.setAttribute('data-value', newRowContents.game_id);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};