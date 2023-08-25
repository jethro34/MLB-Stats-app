// add_bat_boxscore.js

// get objects we need to modify
let addBat_BoxscoreForm = document.getElementById('add-bboxscore-form-ajax');

// modify objects needed
addBat_BoxscoreForm.addEventListener("submit", function (e) {
    
    // prevent the form from submitting
    e.preventDefault();

    // get form fields we need to get data from
    let inputBBGame = document.getElementById("input-bboxscore-game");
    let inputBBPlayer = document.getElementById("input-bboxscore-player");
    let inputBBStart = document.querySelector("input[name='input-bboxscore-is_starter']:checked");
    let inputBBAB = document.getElementById("input-bboxscore-at_bats");
    let inputBBH = document.getElementById("input-bboxscore-hits");
    let inputBBR = document.getElementById("input-bboxscore-runs");
    let inputBBE = document.getElementById("input-bboxscore-errors");
    let inputBBSO = document.getElementById("input-bboxscore-strikeouts");
    let inputBBBB = document.getElementById("input-bboxscore-walks");

    // get values from form fields
    let bBGameValue = inputBBGame.value;
    let bBPlayerValue = inputBBPlayer.value;
    let bBStartValue = inputBBStart.value;
    let bBABValue = inputBBAB.value;
    let bBHValue = inputBBH.value;
    let bBRValue = inputBBR.value;
    let bBEValue = inputBBE.value;
    let bBSOValue = inputBBSO.value;
    let bBBBValue = inputBBBB.value;

    // put data to send in a JS Object
    let bbData = {
        game_id: bBGameValue,
        player_id: bBPlayerValue,
        is_starter: bBStartValue,
        at_bats: bBABValue,
        hits: bBHValue,
        runs: bBRValue,
        errors: bBEValue,
        strikeouts: bBSOValue,
        walks: bBBBValue
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-bat_boxscore-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new entry to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputBBGame.value = "";
            inputBBPlayer.value = "";
            inputBBStart.value = "";
            inputBBAB.value = "";
            inputBBH.value = "";
            inputBBR.value = "";
            inputBBE.value = "";
            inputBBSO.value = "";
            inputBBBB.value = "";
            
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(bbData));
});

// create & add last entry added from a Str representing a single entry
addRowToTable = (bbData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("batter_boxscores-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(bbData);

    // create a row and 7 cells
    let newHTMLRow = document.createElement("TR");
    let bbIdCell = document.createElement("TD");
    let bbGameCell = document.createElement("TD");
    let bbPlayerCell = document.createElement("TD");
    let bbStartCell = document.createElement("TD");
    let bbABCell = document.createElement("TD");
    let bbHCell = document.createElement("TD");
    let bbRCell = document.createElement("TD");
    let bbECell = document.createElement("TD");
    let bbSOCell = document.createElement("TD");
    let bbBBCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill cells with correct data
    bbIdCell.innerText = newRowContents.bat_boxscore_id;
    bbGameCell.innerText = newRowContents.game_id;
    bbPlayerCell.innerText = newRowContents.player_id;
    bbStartCell.innerText = newRowContents.is_starter;
    bbABCell.innerText = newRowContents.at_bats;
    bbHCell.innerText = newRowContents.hits;
    bbRCell.innerText = newRowContents.runs;
    bbECell.innerText = newRowContents.errors;
    bbSOCell.innerText = newRowContents.strikeouts;
    bbBBCell.innerText = newRowContents.walks;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteBatBoxscore(newRowContents.bat_boxscore_id);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to row
    newHTMLRow.appendChild(bbIdCell);
    newHTMLRow.appendChild(bbGameCell);
    newHTMLRow.appendChild(bbPlayerCell);
    newHTMLRow.appendChild(bbStartCell);
    newHTMLRow.appendChild(bbABCell);
    newHTMLRow.appendChild(bbHCell);
    newHTMLRow.appendChild(bbRCell);
    newHTMLRow.appendChild(bbECell);
    newHTMLRow.appendChild(bbSOCell);
    newHTMLRow.appendChild(bbBBCell);
    newHTMLRow.appendChild(deleteCell);

    // add a row attribute so deleteRow func can find a newly added row
    newHTMLRow.setAttribute('data-value', newRowContents.bat_boxscore_id);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};