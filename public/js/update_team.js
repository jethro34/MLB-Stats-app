// update_team.js

function toggleTeamFormsVisibility(switchStr) {
	let searchTeamFormContainer = document.getElementById("search-team-form-container");
	let addTeamFormContainer = document.getElementById("add-team-form-container");
	let updateTeamFormContainer = document.getElementById("update-team-form-container");
	searchTeamFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	addTeamFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	updateTeamFormContainer.style.display = switchStr === 'updateON' ? "block" : "none";
};

function fillTeamToUpdate(teamName) {

	// get Update Form & fields contents to be pre-populated
  	let teamToUpdateStandings = document.getElementById("input-update-team-standings");
	let teamToUpdateDivAL = document.getElementById("update-division-al");
  	let teamToUpdateDivNL = document.getElementById("update-division-nl");
	let teamToUpdateCoach = document.getElementById("input-update-team-coach");
	let teamToUpdateGamesPl = document.getElementById("input-update-team-gplayed");
	let teamToUpdateGamesW = document.getElementById("input-update-team-gwon");
	let teamToUpdateGamesL = document.getElementById("input-update-team-glost");
	let teamToUpdateHomeField = document.getElementById("input-update-team-homeloc");

	// get Teams Table row selected for update from matching team_name
	let selectedRow = document.querySelector(`#teams-table tr[data-value="${teamName}"]`);

	if (selectedRow) {

		// populate Update Form fields with corresponding data from selected row
		teamToUpdateStandings.value = selectedRow.getElementsByTagName("TD")[1].innerText;

		// assign radio buttons from value of division
		if (selectedRow.getElementsByTagName("TD")[3].innerText === "AL") {
      		teamToUpdateDivAL.checked = true;
    	} else if (selectedRow.getElementsByTagName("TD")[3].innerText === "NL") {
      		teamToUpdateDivNL.checked = true;
    	};
		teamToUpdateCoach.value = selectedRow.getElementsByTagName("TD")[4].innerText;
		if (teamToUpdateCoach.value === 'Unknown') {
			teamToUpdateCoach.value = "";
		};
		teamToUpdateGamesPl.value = selectedRow.getElementsByTagName("TD")[5].innerText;
		teamToUpdateGamesW.value = selectedRow.getElementsByTagName("TD")[6].innerText;
		teamToUpdateGamesL.value = selectedRow.getElementsByTagName("TD")[7].innerText;
		teamToUpdateHomeField.value = selectedRow.getElementsByTagName("TD")[8].getAttribute("data-loc-id");
		
		// once update fields are pre-populated, toggle visibility of form containers
		toggleTeamFormsVisibility('updateON');

		updateTeam(teamName);			// proceed to update
	};
};

function updateTeam(teamName) {

	// get objects to modify
	let updateTeamForm = document.getElementById('update-team-form-ajax');

	// modify the objects we need
	updateTeamForm.addEventListener("submit", function (e) {
	
		// prevent form from submitting
		e.preventDefault();

		// get form fields to get data from
		let updateDivision = document.querySelector('input[name="input-update-team-division"]:checked');
		let updateCoach = document.getElementById("input-update-team-coach");
		let updateGamesPl = document.getElementById("input-update-team-gplayed");
		let updateGamesW = document.getElementById("input-update-team-gwon");
		let updateGamesL = document.getElementById("input-update-team-glost");
		let updateHomeField = document.getElementById("input-update-team-homeloc");
		let updateStandings = document.getElementById("input-update-team-standings");

		// get values from form fields
		let divisionValue = updateDivision.value;
		let coachValue = updateCoach.value;
		let gPlayedValue = updateGamesPl.value;
		let gWonValue = updateGamesW.value;
		let gLostValue = updateGamesL.value;
		let homeFieldValue = updateHomeField.value;
		let standingsValue = updateStandings.value;

		// put data to send in a JS object
		let tData = {
			team_name: teamName,
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
		xhttp.open("PUT", "/update-team-ajax", true);
		xhttp.setRequestHeader("Content-type", "application/json");

		// tell AJAX request how to resolve
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

				// once submitted the update, toggle visibility of form containers back
				toggleTeamFormsVisibility('updateOFF');

				// update entry in the table
				updateRow(xhttp.response);

				// clear values for next transaction
				updateDivision.checked = false;
				updateCoach.value = "";
				updateGamesPl.value = "";
				updateGamesW.value = "";
				updateGamesL.value = "";
				updateHomeField.value = "";
				updateStandings.value = "";

			} else if (xhttp.readyState == 4 && xhttp.status != 200) {
				console.log("There was an error with the input.")
			};
		};

		// send request and wait for response
		xhttp.send(JSON.stringify(tData));

	}, {once: true});	// trigger event listener once to prevent multiple submissions of form
};

function updateRow(data) {
  let parsedData = JSON.parse(data);

	// get updated row by getting matching row in Teams table
	let rowToUpdate = document.querySelector(`#teams-table tr[data-value="${parsedData.team_name}"]`);
	if (rowToUpdate) {

		// get target cells in row
    	let standingsCell = rowToUpdate.getElementsByTagName("TD")[1];
		let divisionCell = rowToUpdate.getElementsByTagName("TD")[3];
		let coachCell = rowToUpdate.getElementsByTagName("TD")[4];
		let gPlayedCell = rowToUpdate.getElementsByTagName("TD")[5];
		let gWonCell = rowToUpdate.getElementsByTagName("TD")[6];
		let gLostCell = rowToUpdate.getElementsByTagName("TD")[7];
		let homeFieldCell = rowToUpdate.getElementsByTagName("TD")[8];

		// reassign game updated values
    	standingsCell.innerText = parsedData.standings;
		divisionCell.innerText = parsedData.division;
		coachCell.innerText = parsedData.coach_last_name;
		gPlayedCell.innerText = parsedData.games_played;
		gWonCell.innerText = parsedData.games_won;
		gLostCell.innerText = parsedData.games_lost;
		homeFieldCell.innerText = parsedData.location_str;
		homeFieldCell.setAttribute('data-loc-id', parsedData.home_field);
    };
};
