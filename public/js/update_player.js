// update_player.js

function togglePlayerFormsVisibility(switchStr) {
	let searchPlayerFormContainer = document.getElementById("search-player-form-container");
	let addPlayerFormContainer = document.getElementById("add-player-form-container");
	let updatePlayerFormContainer = document.getElementById("update-player-form-container");
	searchPlayerFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	addPlayerFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	updatePlayerFormContainer.style.display = switchStr === 'updateON' ? "block" : "none";
};

function fillPlayerToUpdate(playerID) {

	// get Update Form & fields contents to be pre-populated
	let playerToUpdateLastN = document.getElementById("input-update-player-lname");
	let playerToUpdateFirstN = document.getElementById("input-update-player-fname");
	let playerToUpdateDOB = document.getElementById("input-update-player-dob");
	let playerToUpdatePitcherYes = document.getElementById("update-pitcher-yes");
	let playerToUpdatePitcherNo = document.getElementById("update-pitcher-no");
	let playerToUpdateLeft = document.getElementById("update-lefty");
	let playerToUpdateRight = document.getElementById("update-righty");

	// get Players Table row selected for update from matching playerID
	let selectedRow = document.querySelector(`#players-table tr[data-value="${playerID}"]`);
	if (selectedRow) {
		// populate Update Form fields with corresponding data from selected row
		playerToUpdateLastN.value = selectedRow.getElementsByTagName("TD")[2].innerText;
		playerToUpdateFirstN.value = selectedRow.getElementsByTagName("TD")[3].innerText;
		playerToUpdateDOB.value = selectedRow.getElementsByTagName("TD")[4].innerText;
    	// assign radio buttons from value of is_pitcher
		if (selectedRow.getElementsByTagName("TD")[5].innerText === "Yes") {
      		playerToUpdatePitcherYes.checked = true;
    	} else if (selectedRow.getElementsByTagName("TD")[5].innerText === "No") {
      		playerToUpdatePitcherNo.checked = true;
    	};
		// assign radio buttons from value of hand
		if (selectedRow.getElementsByTagName("TD")[6].innerText === "Left") {
			playerToUpdateLeft.checked = true;
		} else if (selectedRow.getElementsByTagName("TD")[6].innerText === "Right") {
			playerToUpdateRight.checked = true;
		};

		// once update fields are pre-populated, toggle visibility of form containers
		togglePlayerFormsVisibility('updateON');

		updatePlayer(playerID);			// proceed to update
	};
};

function updatePlayer(playerID) {

	// get objects to modify
	let updatePlayerForm = document.getElementById('update-player-form-ajax');
	
	// modify the objects we need
	updatePlayerForm.addEventListener("submit", function (e) {

		// prevent form from submitting
		e.preventDefault();

		// get form fields to get data from
		let updateLastName = document.getElementById("input-update-player-lname");
		let updateFirstName = document.getElementById("input-update-player-fname");
		let updateDOB = document.getElementById("input-update-player-dob");
		let updateIsPitcher = document.querySelector('input[name="input-update-player-pitcher"]:checked');
		let updateHand = document.querySelector('input[name="input-update-player-hand"]:checked');

		// get values from form fields
		let idValue = `${playerID}`;
		let lastNValue = updateLastName.value;
		let firstNValue = updateFirstName.value;
		let dobValue = updateDOB.value;		// if not selected will have value "0000-00-00"
		let isPitcherValue = updateIsPitcher ? updateIsPitcher.value : null; // if unchecked
    	let handValue = updateHand ? updateHand.value : null;                // if unchecked

		// put data to send in a JS object
		let pData = {
			player_id: idValue,
			last_name: lastNValue,
			first_name: firstNValue,
			dob: dobValue,
			is_pitcher: isPitcherValue,
			hand: handValue
		};

		// set up AJAX request
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "/update-player-ajax", true);
		xhttp.setRequestHeader("Content-type", "application/json");

		// tell AJAX request how to resolve
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

				// once submitted the update, toggle visibility of form containers back
				togglePlayerFormsVisibility('updateOFF');

				// update entry in the table
				updateRow(xhttp.response);

				// clear values for next transaction
 				updateLastName.value = "";
				updateFirstName.value = "";
				updateDOB.value = "";
				updateIsPitcher.checked = false;	// uncheck radio buttons
				updateHand.checked = false;

			} else if (xhttp.readyState == 4 && xhttp.status != 200) {
				console.log("There was an error with the input.")
			};
		};

		// send request and wait for response
		xhttp.send(JSON.stringify(pData));

	}, {once: true});	// trigger event listener once to prevent multiple submissions of form
};

function updateRow(data) {
  let parsedData = JSON.parse(data);

	// get updated row by getting matching row in Players table
	let rowToUpdate = document.querySelector(`#players-table tr[data-value="${parsedData.player_id}"]`);
	if (rowToUpdate) {
		
		// get target cells in row
		let lastNameCell = rowToUpdate.getElementsByTagName("TD")[2];
		let firstNameCell = rowToUpdate.getElementsByTagName("TD")[3];
		let dobCell = rowToUpdate.getElementsByTagName("TD")[4];
		let pitcherCell = rowToUpdate.getElementsByTagName("TD")[5];
		let handCell = rowToUpdate.getElementsByTagName("TD")[6];

		// reassign game updated values
		lastNameCell.innerText = parsedData.last_name;
		firstNameCell.innerText = parsedData.first_name;
		dobCell.innerText = parsedData.dob_str;
		pitcherCell.innerText = parsedData.pitcher;
		handCell.innerText = parsedData.hand;
    };
};
