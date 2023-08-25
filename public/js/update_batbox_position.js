// update_batbox_position.js

function toggleBBhPFormsVisibility(switchStr) {
	let searchBatBoxPosFormContainer = document.getElementById("search-batbox-pos-form-container");
	let addBatBoxPosFormContainer = document.getElementById("add-batbox-pos-form-container");
	let updateBatBoxPosFormContainer = document.getElementById("update-batbox-pos-form-container");
	searchBatBoxPosFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	addBatBoxPosFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	updateBatBoxPosFormContainer.style.display = switchStr === 'updateON' ? "block" : "none";
};

function fillBBhPtoUpdate(bBoxIDnPos) {

	// get Update Form & fields contents to be pre-populated
	let batBoxPosToUpdatePos = document.getElementById("update-batbox-pos-pos");
	let batBoxPosToUpdateBbID = document.getElementById("update-batbox-pos-batbox-id");

	// get Batter Boxscores has Positions Table row selected for update from matching bat_boxscore_id and position
	let selectedRow = document.querySelector(`#batbox-positions-table tr[data-value="${bBoxIDnPos}"]`);
  
	if (selectedRow) {
		// populate Update Form fields with corresponding data from selected row
		batBoxPosToUpdateBbID.innerText = selectedRow.getElementsByTagName("TD")[1].innerText;
		batBoxPosToUpdatePos.value = selectedRow.getElementsByTagName("TD")[2].innerText;
		
		// once update fields are pre-populated, toggle visibility of form containers
		toggleBBhPFormsVisibility('updateON');

		updateBatBoxPos(bBoxIDnPos);			// proceed to update
	};
};

function updateBatBoxPos(bBoxIDnPos) {

	// get objects to modify
	let updateBatBoxHasPosForm = document.getElementById('update-batbox-position-form-ajax');

	// modify the objects we need
	updateBatBoxHasPosForm.addEventListener("submit", function (e) {
	
		// prevent form from submitting
		e.preventDefault();

		// get form fields to get data from
    	let updatePosition = document.getElementById("update-batbox-pos-pos");

		// get values from form fields
    	let positionValue = updatePosition.value;

		// put data to send in a JS object
    	const [batBoxscoreId, oldPositionValue] = bBoxIDnPos.split('-');
		let bbhpData = {
			bat_boxscore_id: batBoxscoreId,
			oldPosition: oldPositionValue,
			position: positionValue
		};

		// set up AJAX request
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "/update-batbox-position-ajax", true);
		xhttp.setRequestHeader("Content-type", "application/json");

		// tell AJAX request how to resolve
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

				// once submitted the update, toggle visibility of form containers back
				toggleBBhPFormsVisibility('updateOFF');

				// update entry in the table
				updateRow(xhttp.response);

				// clear values for next transaction
        		updatePosition.value = "";

			} else if (xhttp.readyState == 4 && xhttp.status != 200) {
				console.log("There was an error with the input.")
			};
		};

		// send request and wait for response
		xhttp.send(JSON.stringify(bbhpData));

	}, {once: true});	// trigger event listener once = prevent multiple submissions of form
};

function updateRow(updatedBBhProw) {
  let parsedData = JSON.parse(updatedBBhProw);

	// get row to update by getting matching row in Batter Boxscores has Positions table
	let rowToUpdate = document.querySelector(`#batbox-positions-table tr[data-value="${parsedData.bat_boxscore_id}-${parsedData.oldPosition}"]`);
	if (rowToUpdate) {

		// update data-value
		const newBatBoxHasPosID = `${parsedData.bat_boxscore_id}-${parsedData.position}`;
		rowToUpdate.setAttribute("data-value", newBatBoxHasPosID);

		// update edit button function argument to new (bat_boxscore_id + position)
		let editCell = rowToUpdate.getElementsByTagName("TD")[0];
		let editButton = editCell.querySelector("button");
		if (editButton) {
			editButton.removeAttribute("onclick");
			editButton.onclick = function() {
				fillBBhPtoUpdate(newBatBoxHasPosID);
      		};
    	};

		// get target cells in row
    	let positionCell = rowToUpdate.getElementsByTagName("TD")[2];

		// update delete button function argument to new (bat_boxscore_id + position)
		let deleteCell = rowToUpdate.getElementsByTagName("TD")[3];
		let deleteButton = deleteCell.querySelector("button");
		if (deleteButton) {
			deleteButton.removeAttribute("onclick");
			deleteButton.onclick = function() {
				deleteBatBoxHasPos(newBatBoxHasPosID);
			};
		};

		// reassign position attribute updated value
    	positionCell.innerText = parsedData.position;
    };
};
