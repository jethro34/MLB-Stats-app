// delete_team.js

function deleteTeam(teamName) {
  // put data to send in a JS object
  let data = {
      team_name: teamName
  };

  // set up AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", "/delete-team-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // tell AJAX request how to resolve
  xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
          // delete team from table
          deleteRow(teamName);
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
          console.log("There was an error with the input.");
      };
  };
  // send request and wait for response
  xhttp.send(JSON.stringify(data));
};

function deleteRow(teamName) {
  // find row whose data value matches teamID
  let targetRow = document.querySelector(`#teams-table tr[data-value="${teamName}"]`);
  if (targetRow) {
      targetRow.remove();
  };
};
