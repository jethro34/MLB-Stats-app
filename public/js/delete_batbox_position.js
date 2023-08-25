// delete_batbox_position.js

function deleteBatBoxHasPos(batBoxHasPosID) {

  // get IDs from Str
  const [batbox_id, pos] = batBoxHasPosID.split('-');

  // put data to send in a JS object
  let data = {
      bat_boxscore_id_str: batbox_id,
      position: pos
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-batbox-position-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete a 'Batter Boxscores has Position' entry from the table
          deleteRow(batBoxHasPosID);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(batBoxHasPosID) {
  // find row whose data value matches batBoxHasPosID
  let targetRow = document.querySelector(`#batbox-positions-table tr[data-value="${batBoxHasPosID}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};