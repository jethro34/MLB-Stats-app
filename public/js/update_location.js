// update_location.js

function toggleLocationFormsVisibility(switchStr) {
	let addLocationFormContainer = document.getElementById("add-location-form-container");
	let updateLocationFormContainer = document.getElementById("update-location-form-container");
	addLocationFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	updateLocationFormContainer.style.display = switchStr === 'updateON' ? "block" : "none";
};

function fillLocationToUpdate(locationID) {

	// get Update Form & fields contents to be pre-populated
    let updateStadVal = document.getElementById("input-update-stadium");

	// get Locations Table row selected for update from matching locationID
	let selectedRow = document.querySelector(`#locations-table tr[data-value="${locationID}"]`);
	if (selectedRow) {
		// populate Update Form fields with corresponding data from selected row
		updateStadVal.value = selectedRow.getElementsByTagName("TD")[2].innerText;
		
		// once update fields are pre-populated, toggle visibility of form containers
		toggleLocationFormsVisibility('updateON');

		updateLocation(locationID);			// proceed to update
	};
};

function updateLocation(locationID) {

	// get objects to modify
	let updateLocationForm = document.getElementById('update-location-form-ajax');
	
	// modify the objects we need
	updateLocationForm.addEventListener("submit", function (e) {
	
		// prevent form from submitting
		e.preventDefault();

		// get form fields to get data from
        let inputUpdateStad = document.getElementById("input-update-stadium");

		// get values from form fields
		let idValue = `${locationID}`;
		let stadValue = inputUpdateStad.value;

		let uData = {
			location_id: idValue,
            stadium: stadValue
		};

		// set up AJAX request
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "/update-location-ajax", true);
		xhttp.setRequestHeader("Content-type", "application/json");

		// tell AJAX request how to resolve
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

				// once submitted the update, toggle visibility of form containers back
				toggleLocationFormsVisibility('updateOFF');

				// update entry in the table
				updateRow(xhttp.response);

				// clear values for next transaction
                inputUpdateStad.value = "";

			} else if (xhttp.readyState == 4 && xhttp.status != 200) {
				console.log("There was an error with the input.")
			};
		};

		// send request and wait for response
		xhttp.send(JSON.stringify(uData));
	});
};

function updateRow(data) {
  let parsedData = JSON.parse(data);

	// get updated row by getting matching row in Locations table
	let rowToUpdate = document.querySelector(`#locations-table tr[data-value="${parsedData.location_id}"]`);
	if (rowToUpdate) {
		let stadCell = rowToUpdate.getElementsByTagName("TD")[2];

		// reassign game updated values
	    stadCell.innerText = parsedData.stadium;
    };
};