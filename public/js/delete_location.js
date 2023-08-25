// delete_location.js

function deleteLocation(locationID) {
  // put data to send in a JS object
  let data = {
      location_id: locationID
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-location-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete data from table
          deleteRow(locationID);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(locationID) {
  let targetRow = document.querySelector(`#locations-table tr[data-value="${locationID}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};