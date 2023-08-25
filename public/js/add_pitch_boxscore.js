// ad_pitch_boxscore.js

// get objects to modify
let addPitch_BoxscoreForm = document.getElementById('add-pboxscore-form-ajax');

// modify objects needed
addPitch_BoxscoreForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields to get data from
    let inputPBGame = document.getElementById("input-pboxscore-game");
    let inputPBPlayer = document.getElementById("input-pboxscore-player");
    let inputPBStart = document.querySelector("input[name='input-pboxscore-is_starter']:checked");
    let inputPBInnings = document.getElementById("input-pboxscore-innings");
    let inputPBER = document.getElementById("input-pboxscore-ER");
    let inputPBH = document.getElementById("input-pboxscore-H");
    let inputPBCount = document.getElementById("input-pboxscore-count");
    let inputPBStrikes = document.getElementById("input-pboxscore-strikes");
    let inputPBBalls = document.getElementById("input-pboxscore-balls");
    let inputPBK = document.getElementById("input-pboxscore-K");
    let inputPBBB = document.getElementById("input-pboxscore-BB");
    let inputPBWin = document.querySelector("input[name='input-pboxscore-is_winner']:checked");
    let inputPBLoss = document.querySelector("input[name='input-pboxscore-is_loser']:checked");
    let inputPBSave = document.querySelector("input[name='input-pboxscore-is_save']:checked");

    // get values from form fields
    let pBGameValue = inputPBGame.value;
    let pBPlayerValue = inputPBPlayer.value;
    let pBStartValue = inputPBStart.value;
    let pBInningsValue = inputPBInnings.value;
    let pBERValue = inputPBER.value;
    let pBHValue = inputPBH.value;
    let pBCountValue = inputPBCount.value;
    let pBStrikesValue = inputPBStrikes.value;
    let pBBallsValue = inputPBBalls.value;
    let pBKValue = inputPBK.value;
    let pBBBValue = inputPBBB.value;
    let pBWinValue = inputPBWin.value;
    let pBLossValue = inputPBLoss.value;
    let pBSaveValue = inputPBSave.value;


    // put data to send in a JS object
    let pbData = {
        game_id: pBGameValue,
        player_id: pBPlayerValue,
        is_starting_p: pBStartValue,
        innings_pitched: pBInningsValue,
        earned_runs: pBERValue,
        hits_allowed: pBHValue,
        pitch_count: pBCountValue,
        strike_pitches: pBStrikesValue,
        ball_pitches: pBBallsValue,
        strikeouts_given: pBKValue,
        walks_given: pBBBValue,
        is_winner: pBWinValue,
        is_loser: pBLossValue,
        is_save: pBSaveValue,
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-pitch_boxscore-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new entry to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputPBGame.value = "";
            inputPBPlayer.value = "";
            inputPBStart.value = "";
            inputPBInnings.value = "";
            inputPBER.value = "";
            inputPBH.value = "";
            inputPBCount.value = "";
            inputPBStrikes.value = "";
            inputPBBalls.value = "";
            inputPBK.value = "";
            inputPBBB.value = "";
            inputPBWin.value = "";
            inputPBLoss.value = "";
            inputPBSave.value = "";
            
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(pbData));
});

// create & add last entry added from a Str representing a single entry
addRowToTable = (pbData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("pitcher_boxscores-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(pbData);

    // create a row and 7 cells
    let newHTMLRow = document.createElement("TR");
    let pbIdCell = document.createElement("TD");
    let pbGameCell = document.createElement("TD");
    let pbPlayerCell = document.createElement("TD");
    let pbStartCell = document.createElement("TD");
    let pbIPCell = document.createElement("TD");
    let pbERCell = document.createElement("TD");
    let pbHCell = document.createElement("TD");
    let pbCountCell = document.createElement("TD");
    let pbStrikesCell = document.createElement("TD");
    let pbBallsCell = document.createElement("TD");
    let pbKCell = document.createElement("TD");
    let pbBBCell = document.createElement("TD");
    let pbWinCell = document.createElement("TD");
    let pbLossCell = document.createElement("TD");
    let pbSaveCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill cells with correct data
    pbIdCell.innerText = newRowContents.pitch_boxscore_id;
    pbGameCell.innerText = newRowContents.game_id;
    pbPlayerCell.innerText = newRowContents.player_id;
    pbStartCell.innerText = newRowContents.is_starting_p;
    pbIPCell.innerText = newRowContents.innings_pitched;
    pbERCell.innerText = newRowContents.earned_runs;
    pbHCell.innerText = newRowContents.hits_allowed;
    pbCountCell.innerText = newRowContents.pitch_count;
    pbStrikesCell.innerText = newRowContents.strike_pitches;
    pbBallsCell.innerText = newRowContents.ball_pitches;
    pbKCell.innerText = newRowContents.strikeouts_given;
    pbBBCell.innerText = newRowContents.walks_given;
    pbWinCell.innerText = newRowContents.is_winner;
    pbLossCell.innerText = newRowContents.is_loser;
    pbSaveCell.innerText = newRowContents.is_save;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deletePitchBoxscore(newRowContents.pitch_boxscore_id);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to the row
    newHTMLRow.appendChild(pbIdCell);
    newHTMLRow.appendChild(pbGameCell);
    newHTMLRow.appendChild(pbPlayerCell);
    newHTMLRow.appendChild(pbStartCell);
    newHTMLRow.appendChild(pbIPCell);
    newHTMLRow.appendChild(pbERCell);
    newHTMLRow.appendChild(pbHCell);
    newHTMLRow.appendChild(pbCountCell);
    newHTMLRow.appendChild(pbStrikesCell);
    newHTMLRow.appendChild(pbBallsCell);
    newHTMLRow.appendChild(pbKCell);
    newHTMLRow.appendChild(pbBBCell);
    newHTMLRow.appendChild(pbWinCell);
    newHTMLRow.appendChild(pbLossCell);
    newHTMLRow.appendChild(pbSaveCell);
    newHTMLRow.appendChild(deleteCell);

    // add a row attribute so deleteRow func can find a newly added row
    newHTMLRow.setAttribute('data-value', newRowContents.pitch_boxscore_id);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};