// add_team.js

// get objects to modify
let addTeamForm = document.getElementById('add-team-form-ajax');

// modify objects needed
addTeamForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields we need to get data from
    let inputTeamName = document.getElementById("input-team-name");
    let inputDivision = document.querySelector('input[name="input-team-division"]:checked');
    let inputCoach = document.getElementById("input-team-coach");
    let inputGPlayed = document.getElementById("input-team-games-played");
    let inputGWon = document.getElementById("input-team-games-won");
    let inputGLost = document.getElementById("input-team-games-lost");
    let inputHomeField = document.getElementById("input-team-home-location");
    let inputStandings = document.getElementById("input-team-standings");

    // get values from form fields
    let teamNameValue = inputTeamName.value;
    let divisionValue = inputDivision.value;
    let coachValue = inputCoach.value;
    let gPlayedValue = inputGPlayed.value;
    let gWonValue = inputGWon.value;
    let gLostValue = inputGLost.value;
    let homeFieldValue = inputHomeField.value;
    let standingsValue = inputStandings.value;

    // put data to send in a JS object
    let tData = {
        team_name: teamNameValue,
        division: divisionValue,
        coach_last_name: coachValue,
        games_played: gPlayedValue,
        games_won: gWonValue,
        games_lost: gLostValue,
        home_field: homeFieldValue,
        standings: standingsValue
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-team-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new game to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputTeamName.value = "";
            inputDivision.value = "";
            inputDivision.checked = false;      // uncheck radio buttons
            inputCoach.value = "";
            inputGPlayed.value = "";
            inputGWon.value = "";
            inputGLost.value = "";
            inputHomeField.value = "";
            inputStandings.value = "";

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(tData));
});

// create & add a row from a Str representing a single entry from Teams
addRowToTable = (tData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("teams-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(tData);

    // create a row and 10 cells
    let newHTMLRow = document.createElement("TR");
    let standingsCell = document.createElement("TD");
    let editCell = document.createElement("TD");
    let teamNameCell = document.createElement("TD");
    let divisionCell = document.createElement("TD");
    let coachCell = document.createElement("TD");
    let gPlayedCell = document.createElement("TD");
    let gWonCell = document.createElement("TD");
    let gLostCell = document.createElement("TD");
    let homeFieldCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill the cells with input data
    let editButton = document.createElement("button"); // create button & add it to cell
    editButton.innerHTML = "Edit";
    editButton.onclick = function() {
        fillTeamToUpdate(newRowContents.team_name);
    };
    editCell.appendChild(editButton);

    standingsCell.innerText = newRowContents.standings;
    teamNameCell.innerText = newRowContents.team_name;
    divisionCell.innerText = newRowContents.division;
    coachCell.innerText = newRowContents.coach_last_name;
    gPlayedCell.innerText = newRowContents.games_played;
    gWonCell.innerText = newRowContents.games_won;
    gLostCell.innerText = newRowContents.games_lost;
    homeFieldCell.innerText = newRowContents.location_str;

    let deleteButton = document.createElement("button"); // create button & add it to cell
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteTeam(newRowContents.team_name);
    };
    deleteCell.appendChild(deleteButton);
    
    // add cells to row
    newHTMLRow.appendChild(editCell);
    newHTMLRow.appendChild(standingsCell);
    newHTMLRow.appendChild(teamNameCell);
    newHTMLRow.appendChild(divisionCell);
    newHTMLRow.appendChild(coachCell);
    newHTMLRow.appendChild(gPlayedCell);
    newHTMLRow.appendChild(gWonCell);
    newHTMLRow.appendChild(gLostCell);
    newHTMLRow.appendChild(homeFieldCell);
    newHTMLRow.appendChild(deleteCell);

    // add a row attribute so deleteRow func can find newly added rows
    newHTMLRow.setAttribute('data-value', newRowContents.team_name);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};