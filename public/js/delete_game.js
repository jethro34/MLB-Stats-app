// delete_game.js

function deleteGame(gameID) {
  // put data to send in a JS object
  let data = {
      game_id: gameID
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-game-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete game from table
          deleteRow(gameID);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(gameID) {
  // find row whose data value matches gameID
  let targetRow = document.querySelector(`#games-table tr[data-value="${gameID}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};
