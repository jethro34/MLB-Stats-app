// delete_player.js

function deletePlayer(playerID) {
    // put data to send in a JS object
    let data = {
        player_id: playerID
    };

    // set up AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-player-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // tell AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // delete player from table
            deleteRow(playerID);
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.");
        };
    };
    // send request and wait for response
    xhttp.send(JSON.stringify(data));
};

function deleteRow(playerID) {
    // find row whose data value matches gameID
    let targetRow = document.querySelector(`#players-table tr[data-value="${playerID}"]`);
    if (targetRow) {
        targetRow.remove();
    };
};
