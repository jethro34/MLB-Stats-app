// update_contracts.js

function toggleContractFormsVisibility(switchStr) {
	let searchContractFormContainer = document.getElementById("search-contract-form-container");
	let addContractFormContainer = document.getElementById("add-contract-form-container");
	let updateContractFormContainer = document.getElementById("update-contract-form-container");
	searchContractFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	addContractFormContainer.style.display = switchStr === 'updateON' ? "none" : "block";
	updateContractFormContainer.style.display = switchStr === 'updateON' ? "block" : "none";
};

function fillContractToUpdate(contractID) {

	// get Update Form & fields contents to be pre-populated
	let updateConTeam = document.getElementById("input-update-contract-team");
    let updateConLen = document.getElementById("input-update-contract-length");
    let updateConVal = document.getElementById("input-update-contract-value");

	// get Contractss Table row selected for update from matching contractID
	let selectedRow = document.querySelector(`#contracts-table tr[data-value="${contractID}"]`);
	if (selectedRow) {
		// populate Update Form fields with corresponding data from selected row
		updateConTeam.value = selectedRow.getElementsByTagName("TD")[2].innerText;
		updateConLen.value = selectedRow.getElementsByTagName("TD")[5].innerText;
		updateConVal.value = selectedRow.getElementsByTagName("TD")[6].innerText;
		
		// once update fields are pre-populated, toggle visibility of form containers
		toggleContractFormsVisibility('updateON');

		updateContract(contractID);			// proceed to update
	};
};

function updateContract(contractID) {
	// get objects to modify
	let updateContractForm = document.getElementById('update-contract-form-ajax');
	
	// modify objects needed
	updateContractForm.addEventListener("submit", function (e) {
	
		// prevent form from submitting
		e.preventDefault();

		// get form fields to get data from
		let inputUpdateConTeam = document.getElementById("input-update-contract-team");
		let inputUpdateConLen = document.getElementById("input-update-contract-length");
		let inputUpdateConVal = document.getElementById("input-update-contract-value");

		// get values from form fields
		let idValue = `${contractID}`;
		let teamValue = inputUpdateConTeam.value;
		let lenValue = inputUpdateConLen.value;
		let valValue = inputUpdateConVal.value;

		// put data to send in a JS object
		let uData = {
			contract_id: idValue,
			team_name: teamValue,
			length_years: lenValue,
			total_value: valValue
		};

		// set up AJAX request
		var xhttp = new XMLHttpRequest();
		xhttp.open("PUT", "/update-contract-ajax", true);
		xhttp.setRequestHeader("Content-type", "application/json");

		// tell AJAX request how to resolve
		xhttp.onreadystatechange = () => {
			if (xhttp.readyState == 4 && xhttp.status == 200) {

				// once submitted the update, toggle visibility of form containers back
				toggleContractFormsVisibility('updateOFF');

				// update entry in the table
				updateRow(xhttp.response);

				// clear values for next transaction
				inputUpdateConTeam.value = "";
				inputUpdateConLen.value = "";
				inputUpdateConVal.value = "";

			} else if (xhttp.readyState == 4 && xhttp.status != 200) {
				console.log("There was an error with the input.");
			};
		};

		// send request and wait for response
		xhttp.send(JSON.stringify(uData));
	});
};

function updateRow(data) {
  let parsedData = JSON.parse(data);

	// get updated row by getting matching row in Contracts table
	let rowToUpdate = document.querySelector(`#contracts-table tr[data-value="${parsedData.contract_id}"]`);
	if (rowToUpdate) {
		let teamCell = rowToUpdate.getElementsByTagName("TD")[2];
		let lenCell = rowToUpdate.getElementsByTagName("TD")[5];
		let valCell = rowToUpdate.getElementsByTagName("TD")[6];

		// reassign game updated values
		teamCell.innerText = parsedData.team_name;
		lenCell.innerText = parsedData.length_years;
		valCell.innerText = parsedData.total_value;
    };
};