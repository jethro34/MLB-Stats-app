// add_player.js

// get objects to modify
let addPlayerForm = document.getElementById('add-player-form-ajax');

// modify the objects we need
addPlayerForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields to get data from
    let inputLastName = document.getElementById("input-player-lname");
    let inputFirstName = document.getElementById("input-player-fname");
    let inputDOB = document.getElementById("input-player-dob");
    let inputIsPitcher = document.querySelector('input[name="input-player-pitcher"]:checked');
    let inputHand = document.querySelector('input[name="input-player-hand"]:checked');

    // get values from form fields
    let lastNameValue = inputLastName.value;
    let firstNameValue = inputFirstName.value;
    let dobValue = inputDOB.value;             // if not selected will have value "0000-00-00"
    let isPitcherValue = inputIsPitcher ? inputIsPitcher.value : null;  // NULL if unchecked
    let handValue = inputHand ? inputHand.value : null;                 // NULL if unchecked

    // put data to send in a JS object
    let pData = {
        last_name: lastNameValue,
        first_name: firstNameValue,
        dob: dobValue,
        is_pitcher: isPitcherValue,
        hand: handValue
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new player to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputLastName.value = '';
            inputFirstName.value = '';
            inputDOB.value = '';
            inputIsPitcher.checked = false;     // uncheck radio buttons
            inputHand.checked = false;

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(pData));
});

// create & add a row from a Str representing a single entry from Players
addRowToTable = (pData) => {
    
    // get a reference to current table on page
    let currentTable = document.getElementById("players-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(pData);

    // create a row and 8 cells
    let newHTMLRow = document.createElement("TR");
    let editCell = document.createElement("TD");
    let playerIdCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let dobCell = document.createElement("TD");
    let pitcherCell = document.createElement("TD");
    let handCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill cells with input data
    let editButton = document.createElement("button");  // create button & add it to cell
    editButton.innerHTML = "Edit";
    editButton.onclick = function() {
        fillPlayerToUpdate(newRowContents.player_id);
    };
    editCell.appendChild(editButton);

    playerIdCell.innerText = newRowContents.player_id;
    lastNameCell.innerText = newRowContents.last_name;
    firstNameCell.innerText = newRowContents.first_name;
    dobCell.innerText = newRowContents.dob_str;
    pitcherCell.innerText = newRowContents.pitcher;
    handCell.innerText = newRowContents.hand;

    let deleteButton = document.createElement("button"); // create button & add it to cell
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deletePlayer(newRowContents.player_id);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to row 
    newHTMLRow.appendChild(editCell);
    newHTMLRow.appendChild(playerIdCell);
    newHTMLRow.appendChild(lastNameCell);
    newHTMLRow.appendChild(firstNameCell);
    newHTMLRow.appendChild(dobCell);
    newHTMLRow.appendChild(pitcherCell);
    newHTMLRow.appendChild(handCell);
    newHTMLRow.appendChild(deleteCell);
    
    // add a row attribute so deleteRow func can find newly added rows
    newHTMLRow.setAttribute('data-value', newRowContents.player_id);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};