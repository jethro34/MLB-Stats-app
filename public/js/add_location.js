// add_location.js

// get objects to modify
let addLocationForm = document.getElementById('add-location-form-ajax');

// modify objects needed
addLocationForm.addEventListener("submit", function (e) {
    
    // prevent form from submitting
    e.preventDefault();

    // get form fields to get data from
    let inputLocStadium = document.getElementById("input-location-stadium");
    let inputLocCity = document.getElementById("input-location-city");
    let inputLocState = document.getElementById("input-location-state");

    // get values from form fields
    let locStadiumValue = inputLocStadium.value;
    let locCityValue = inputLocCity.value;
    let locStateValue = inputLocState.value;

    // put data we want to send in a JS object
    let locData = {
        stadium: locStadiumValue,
        city: locCityValue,
        state: locStateValue,
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // add new entry to table
            addRowToTable(xhttp.response);

            // clear input fields for next transaction
            inputLocStadium.value = "";
            inputLocCity.value = "";
            inputLocState.value = "";
            
        } else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.");
        };
    };

    // send request and wait for response
    xhttp.send(JSON.stringify(locData));
});

// create & add last entry added from a Str representing a single entry
addRowToTable = (locData) => {

    // get a reference to current table on page
    let currentTable = document.getElementById("locations-table");

    // change Str to JS Obj
    let newRowContents = JSON.parse(locData);

    // create a row and 7 cells
    let newHTMLRow = document.createElement("TR");
    let editCell = document.createElement("TD");
    let locIdCell = document.createElement("TD");
    let locStadiumCell = document.createElement("TD");
    let locCityCell = document.createElement("TD");
    let locStateCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // fill cells with correct data
    let editButton = document.createElement("button");  // create button & add it to cell
    editButton.innerHTML = "Edit";
    editButton.onclick = function() {
        fillContractToUpdate(newRowContents.contract_id);
    };
    editCell.appendChild(editButton);

    locIdCell.innerText = newRowContents.location_id;
    locStadiumCell.innerText = newRowContents.stadium;
    locCityCell.innerText = newRowContents.city;
    locStateCell.innerText = newRowContents.state;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteLocation(newRowContents.location_id);
    };
    deleteCell.appendChild(deleteButton);

    // add cells to row
    newHTMLRow.appendChild(editCell);
    newHTMLRow.appendChild(locIdCell);
    newHTMLRow.appendChild(locStadiumCell);
    newHTMLRow.appendChild(locCityCell);
    newHTMLRow.appendChild(locStateCell);
    newHTMLRow.appendChild(deleteCell);

    // add a row attribute so deleteRow func can find a newly added row
    newHTMLRow.setAttribute('data-value', newRowContents.location_id);

    // add row to table
    currentTable.appendChild(newHTMLRow);
};