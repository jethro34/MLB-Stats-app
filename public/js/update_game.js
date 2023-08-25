// update_game.js

function toggleGameFormsVisibility(switchStr) {
	let searchGameFormContainer = document.getElementById("search-game-form-container");
	let addGameFormContainer = document.getElementById("add-game-form-container");
	let updateGameFormContainer = document.getElementById("update-game-form-container");
	searchGameFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	addGameFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	updateGameFormContainer.style.display = switchStr === 'updateON' ? "block" : "none";
};

function fillGameToUpdate(gameID) {

	// get Update Form & fields contents to be pre-populated
	let gameToUpdateDate = document.getElementById("input-update-game-date");
	let gameToUpdateLoc = document.getElementById("input-update-game-location");
	let gameToUpdateAwayTeam = document.getElementById("input-update-game-awayt");
	let gameToUpdateAwayScore = document.getElementById("input-update-game-awayt-score");
	let gameToUpdateHomeTeam = document.getElementById("input-update-game-homet");
	let gameToUpdateHomeScore = document.getElementById("input-update-game-homet-score");
	let gameToUpdateAwayWinYes = document.getElementById("input-update-away-winner-yes");
	let gameToUpdateAwayWinNo = document.getElementById("input-update-away-winner-no");

	// get Games Table row selected for update from matching gameID
	let selectedRow = document.querySelector(`#games-table tr[data-value="${gameID}"]`);

	if (selectedRow) {
		// populate Update Form fields with corresponding data from selected row
		gameToUpdateDate.value = selectedRow.getElementsByTagName("TD")[2].innerText;
		gameToUpdateLoc.value = selectedRow.getElementsByTagName("TD")[3].getAttribute("data-loc-id");
		gameToUpdateAwayTeam.value = selectedRow.getElementsByTagName("TD")[4].innerText;
		gameToUpdateAwayScore.value = selectedRow.getElementsByTagName("TD")[5].innerText;
		gameToUpdateHomeTeam.value = selectedRow.getElementsByTagName("TD")[6].innerText;
		gameToUpdateHomeScore.value = selectedRow.getElementsByTagName("TD")[7].innerText;
		// assign radio buttons from value of winner
		if (selectedRow.getElementsByTagName("TD")[8].innerText === "A") {
			gameToUpdateAwayWinYes.checked = true;
		} else if (selectedRow.getElementsByTagName("TD")[8].innerText === "H") {
			gameToUpdateAwayWinNo.checked = true;
		};
		
		// once update fields are pre-populated, toggle visibility of form containers
		toggleGameFormsVisibility('updateON');

		updateGame(gameID);			// proceed to update
	};
};

function updateGame(gameID) {

	// get objects to modify
	let updateGameForm = document.getElementById('update-game-form-ajax');

	// modify objects needed
	updateGameForm.addEventListener("submit", function (e) {
	
		// prevent form from submitting
		e.preventDefault();

		// get form fields to get data from
		let updateGameDate = document.getElementById("input-update-game-date");
		let updateGameLocID = document.getElementById("input-update-game-location");
		let updateAwayTeam = document.getElementById("input-update-game-awayt");
		let updateAwayScore = document.getElementById("input-update-game-awayt-score");
		let updateHomeTeam = document.getElementById("input-update-game-homet");
		let updateHomeScore = document.getElementById("input-update-game-homet-score");
		let updateAwayWin = document.querySelector('input[name="input-update-game-away-winner"]:checked');

		// get values from form fields
		let gameIDValue = `${gameID}`;
		let gameDateValue = updateGameDate.value;
		let gameLocIDValue = updateGameLocID.value;
		let awayTeamValue = updateAwayTeam.value;
		let awayScoreValue = updateAwayScore.value;
		let homeTeamValue = updateHomeTeam.value;
		let homeScoreValue = updateHomeScore.value;
		let awayWinnerValue = updateAwayWin.value;

		// put data to send in a JS object
		let gData = {
			game_id: gameIDValue,
			date: gameDateValue,
			away_team: awayTeamValue,
			away_score: awayScoreValue,
			home_team: homeTeamValue,
			home_score: homeScoreValue,
			location_id: gameLocIDValue,
			is_away_winner: awayWinnerValue
		};

		// set up AJAX request
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "/update-game-ajax", true);
		xhttp.setRequestHeader("Content-type", "application/json");

		// tell AJAX request how to resolve
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

				// once submitted the update, toggle visibility of form containers back
				toggleGameFormsVisibility('updateOFF');

				// update entry in the table
				updateRow(xhttp.response);

				// clear values for next transaction
 				updateGameDate.value = "";
				updateAwayTeam.value = "";
				updateAwayScore.value = "";
				updateHomeTeam.value = "";
				updateHomeScore.value = "";
				updateGameLocID.value = "";
				updateAwayWin.checked = false;

			} else if (xhttp.readyState == 4 && xhttp.status != 200) {
				console.log("There was an error with the input.")
			};
		};

		// send request and wait for response
		xhttp.send(JSON.stringify(gData));

	}, {once: true});	// trigger event listener once = prevent multiple submissions of form
};

function updateRow(data) {
  let parsedData = JSON.parse(data);

	// get updated row by getting matching row in Games table
	let rowToUpdate = document.querySelector(`#games-table tr[data-value="${parsedData.game_id}"]`);
	if (rowToUpdate) {

		// get target cells in row
		let gameDateCell = rowToUpdate.getElementsByTagName("TD")[2];
		let gameLocCell = rowToUpdate.getElementsByTagName("TD")[3];
		let awayTeamCell = rowToUpdate.getElementsByTagName("TD")[4];
		let awayScoreCell = rowToUpdate.getElementsByTagName("TD")[5];
		let homeTeamCell = rowToUpdate.getElementsByTagName("TD")[6];
		let homeScoreCell = rowToUpdate.getElementsByTagName("TD")[7];
		let winnerCell = rowToUpdate.getElementsByTagName("TD")[8];

		// reassign game updated values
		gameDateCell.innerText = parsedData.date;
		gameLocCell.innerText = parsedData.location;
		gameLocCell.setAttribute('data-loc-id', parsedData.location_id);
		awayTeamCell.innerText = parsedData.away_team;
		awayScoreCell.innerText = parsedData.away_score;
		homeTeamCell.innerText = parsedData.home_team;
		homeScoreCell.innerText = parsedData.home_score;
		winnerCell.innerText = parsedData.winner;
    };
};
