// delete_pitch_boxscore.js

function deletePitchBoxscore(pBoxscoreID) {
  // put data to send in a JS object
  let data = {
      pitch_boxscore_id: pBoxscoreID
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-pitch_boxscore-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete data from table
          deleteRow(pBoxscoreID);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(pBoxscoreID) {
  let targetRow = document.querySelector(`#pitcher_boxscores-table tr[data-value="${pBoxscoreID}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};