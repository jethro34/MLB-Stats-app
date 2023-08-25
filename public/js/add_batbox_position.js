// add_batbox_position.js

// // get objects to modify
let addBatBoxPositionForm = document.getElementById('add-batbox-position-form-ajax');

// modify the objects we need
addBatBoxPositionForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields to get data from
    let inputBatBoxPosBoxID = document.getElementById("input-batbox-pos-boxid");
    let inputBatBoxPosPos = document.getElementById("input-batbox-pos-pos");

    // get values from form fields
    let batBoxPosBoxIdValue = inputBatBoxPosBoxID.value;
    let batBoxPosPosValue = inputBatBoxPosPos.value;

    // put data to send in a JS object
    let data = {
        bat_boxscore_id: batBoxPosBoxIdValue,
        position: batBoxPosPosValue
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-batbox-position-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new batter boxscore has position to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputBatBoxPosBoxID.value = '';
            inputBatBoxPosPos.value = '';

        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(data));
});


// Creates a single row from an Object representing a single record from Bat_Box_has_Pos
addRowToTable = (bbhpData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("batbox-positions-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(bbhpData);

    // to be used as row identifier
    const batBoxHasPosID = `${newRowContents.bat_boxscore_id}-${newRowContents.position}`;

    // create a row and 4 cells
    let newHTMLRow = document.createElement("TR");
    let editCell = document.createElement("TD");
    let batBoxPosBoxCell = document.createElement("TD");
    let batBoxPosPosCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // create edit button & insert in cell
    let editButton = document.createElement("button");  // create button & add it to cell
    editButton.innerHTML = "Edit";
    editButton.onclick = function() {
        fillBBhPtoUpdate(batBoxHasPosID);
    };
    editCell.appendChild(editButton);
    
    // fill cells with input data
    batBoxPosBoxCell.innerText = newRowContents.bat_boxscore_id;
    batBoxPosPosCell.innerText = newRowContents.position;
    
    // create delete button & insert in cell
    let deleteButton = document.createElement("button"); // create button & add it to cell
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteBatBoxHasPos(batBoxHasPosID);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to row
    newHTMLRow.appendChild(editCell);
    newHTMLRow.appendChild(batBoxPosBoxCell);
    newHTMLRow.appendChild(batBoxPosPosCell);
    newHTMLRow.appendChild(deleteCell);
    
    // add a row attribute so functions can find newly added rows
    newHTMLRow.setAttribute('data-value', batBoxHasPosID);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};