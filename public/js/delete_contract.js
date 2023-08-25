// delete_contract.js

function deleteContract(contractID) {
  // put data to send in a javascript object
  let data = {
      contract_id: contractID
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-contract-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete data from table
          deleteRow(contractID);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(contractID) {
  let targetRow = document.querySelector(`#contracts-table tr[data-value="${contractID}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};