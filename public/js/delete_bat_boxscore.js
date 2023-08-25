// delete_bat_boxscore.js

function deleteBatBoxscore(bBoxscoreID) {
  // put data to send in a JS object
  let data = {
      bat_boxscore_id: bBoxscoreID
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-bat_boxscore-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete data from the table
          deleteRow(bBoxscoreID);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(bBoxscoreID) {
  let targetRow = document.querySelector(`#batter_boxscores-table tr[data-value="${bBoxscoreID}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};