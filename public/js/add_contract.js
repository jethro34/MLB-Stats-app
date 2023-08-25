// add_contract.js

// get objects to modify
let addContractForm = document.getElementById('add-contract-form-ajax');

// modify objects needed
addContractForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields to get data from
    let inputConTeam = document.getElementById("input-contract-team");
    let inputConPlayer = document.getElementById("input-contract-player");
    let inputConDate = document.getElementById("input-contract-date");
    let inputConLen = document.getElementById("input-contract-length");
    let inputConVal = document.getElementById("input-contract-value");

    // get values from form fields
    let conTeamValue = inputConTeam.value;
    let conPlayerValue = inputConPlayer.value;
    let conDateValue = inputConDate.value;
    let conLenValue = inputConLen.value;
    let conValValue = inputConVal.value;

    // put our data we want to send in a JS Object
    let cData = {
        team_name: conTeamValue,
        player_id: conPlayerValue,
        start_date: conDateValue,
        length_years: conLenValue,
        total_value: conValValue,
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-contract-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new entry to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputConTeam.value = "";
            inputConPlayer.value = "";
            inputConDate.value = "";
            inputConLen.value = "";
            inputConVal.value = "";
            
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(cData));
});

// create & add last entry added from a Str representing a single entry
addRowToTable = (cData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("contracts-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(cData);

    // create a row and 7 cells
    let newHTMLRow = document.createElement("TR");
    let editCell = document.createElement("TD");
    let conIdCell = document.createElement("TD");
    let conTeamCell = document.createElement("TD");
    let conPlayerCell = document.createElement("TD");
    let conDateCell = document.createElement("TD");
    let conLenCell = document.createElement("TD");
    let conValCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill cells with correct data
    let editButton = document.createElement("button");  // create button & add it to cell
    editButton.innerHTML = "Edit";
    editButton.onclick = function() {
        fillContractToUpdate(newRowContents.contract_id);
    };
    editCell.appendChild(editButton);

    conIdCell.innerText = newRowContents.contract_id;
    conTeamCell.innerText = newRowContents.team_name;
    conPlayerCell.innerText = newRowContents.player_name;
    conDateCell.innerText = newRowContents.start_date_str;
    conLenCell.innerText = newRowContents.length_years;
    conValCell.innerText = newRowContents.total_value;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteContract(newRowContents.contract_id);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to row
    newHTMLRow.appendChild(editCell);
    newHTMLRow.appendChild(conIdCell);
    newHTMLRow.appendChild(conTeamCell);
    newHTMLRow.appendChild(conPlayerCell);
    newHTMLRow.appendChild(conDateCell);
    newHTMLRow.appendChild(conLenCell);
    newHTMLRow.appendChild(conValCell);
    newHTMLRow.appendChild(deleteCell);

    // add a row attribute so deleteRow func can find a newly added row
    newHTMLRow.setAttribute('data-value', newRowContents.contract_id);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};