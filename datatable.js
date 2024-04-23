$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#example thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#example thead");
  $.ajax({
    url: "data.json",
    dataType: "json",
    success: function (data) {
      globalData = data.data; // Assign the retrieved data to the global  letiable
    },
  });
});
let table = $("#example").DataTable({
  paging: false,
  orderCellsTop: true,
  fixedHeader: true,
  initComplete: function () {
    let api = this.api();

    // For each column
    api
      .columns()
      .eq(0)
      .each(function (colIdx) {
        let cell = $(".filters th").eq($(api.column(colIdx).header()).index());
        let title = $(cell).text();
        if (title == "") {
        } else {
          $(cell).html(
            '<input type="text" class="color-primry form-control mx-auto" placeholder="' +
              title +
              '" />'
          );
        }

        $("input", $(".filters th").eq($(api.column(colIdx).header()).index()))
          .off("keyup change")
          .on("change", function (e) {
            $(this).attr("title", $(this).val());
            let regexr = "({search})";

            let cursorPosition = this.selectionStart;

            api
              .column(colIdx)
              .search(
                this.value != ""
                  ? regexr.replace("{search}", "(((" + this.value + ")))")
                  : "",
                this.value != "",
                this.value == ""
              )
              .draw();
          })
          .on("keyup", function (e) {
            e.stopPropagation();

            $(this).trigger("change");
            $(this)
              .focus()[0]
              .setSelectionRange(cursorPosition, cursorPosition);
          });
      });
  },
  ajax: {
    url: "data.json",
  },
  columns: [
    { data: "id_number" },
    { data: "name" },
    { data: "family" },
    { data: "citizenship_number" },
    {
      data: null,
      render: function (data) {
        let buttons = `
            <i class="text-success pointer bi bi-eye mx-1" onclick="openPopup( 'view' , '${data.id_number}')"></i>
            <i class="text-success pointer bi bi-pen mx-1" onclick="openPopup( 'edit' , '${data.id_number}')"></i>
            <i class="text-success pointer bi bi-trash mx-1" onclick="openPopup( 'delete' , '${data.id_number}')"></i>
            <i class="text-success pointer bi bi-globe-americas mx-1" onclick="openPopup( 'maps' , '${data.id_number}')"></i>
            <i class="text-success pointer bi bi-bar-chart-fill mx-1"id="openModalButton"onclick="OpenChartPopup('${data.id_number}')"></i>
            `;
        return buttons;
      },
    },
  ],
});
function openPopup(action, id_number) {
  $("#PopupModal").modal("show");
  if (action == "addPerson") {
    addPersonModal();
    $("#modal-title").html("Add Person");
  } else if (action == "view") {
    viewModal(id_number);
    $("#modal-title").html("View");
  } else if (action == "edit") {
    editModal(id_number);
    $("#modal-title").html("edit");
  } else if (action == "delete") {
    deleteModal(id_number);
    $("#modal-title").html("delete");
  } else if (action == "maps") {
    $("#modal-title").html("maps");
    mapModal(id_number);
  } else if (action == "graphs") {
    $("#modal-title").html("graphs");
    graphModal(id_number);
  }
}
function addPersonModal() {
  let modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  let nameInput = `
  <div class="form-floating mb-3">
  <input type="name" class="form-control" id="nameInput" placeholder="Name">
  <label for="nameInput">Name</label>
  </div>`;

  let familyInput = `
    <div class="form-floating mb-3">
    <input type="family" class="form-control" id="familyInput" placeholder="Family Name">
    <label for="familyInput">Family Name</label>
    </div>`;

  let citizenshipInput = `
    <div class="form-floating mb-3">
    <input type="citizenship number" class="form-control" id="citizenshipNumberInput" placeholder="citizenship number">
    <label for="citizenshipNumberInput">citizenship number</label>
    </div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameInput + familyInput + citizenshipInput
  );
  let modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  let buttonClose = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  let buttonSave = `
    <button type="button" class="btn btn-primary" onclick="addPerson(null)">
    Save 
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
}
function viewModal(id) {
  let modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  let nameView = `
  <div class="alert alert-info" role="alert">Name:<hr>${globalData[id].name}</div>`;

  let familyView = `
    <div class="alert alert-info" role="alert">Family:<hr>${globalData[id].family}</div>`;

  let citizenshipView = `
    <div class="alert alert-info" role="alert">Citizenship Number:<hr>${globalData[id].citizenship_number}</div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameView + familyView + citizenshipView
  );
  let modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  let buttonClose = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose);
}
function editModal(id) {
  let modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  let nameInput = `
  <div class="form-floating mb-3">
  <input type="name" class="form-control" id="nameInput" value='${globalData[id].name}'>
  <label for="nameInput">Name</label>
  </div>`;

  let familyInput = `
    <div class="form-floating mb-3">
    <input type="family" class="form-control" id="familyInput" value='${globalData[id].family}'>
    <label for="familyInput">Family Name</label>
    </div>`;

  let citizenshipInput = `
    <div class="form-floating mb-3">
    <input type="citizenship number" class="form-control" id="citizenshipNumberInput" value='${globalData[id].citizenship_number}'>
    <label for="citizenshipNumberInput">citizenship number</label>
    </div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameInput + familyInput + citizenshipInput
  );
  let modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  let buttonClose = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  let buttonSave = `
    <button type="button" class="btn btn-primary" onclick="addPerson(${id})">
    Save
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
}
function deleteModal(id) {
  let modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  let nameView = `
  <div class ="row">
  <p class="text-primary">Do you want to delete the following information? </p>
  <div class="alert alert-danger col-5 mx-auto" role="alert">Name:<hr>${globalData[id].name}</div>`;

  let familyView = `
    <div class="alert alert-danger col-5 mx-auto" role="alert">Family:<hr>${globalData[id].family}</div>`;

  let citizenshipView = `
    <div class="alert alert-danger col-11 mx-auto" role="alert">Citizenship Number:<hr>${globalData[id].citizenship_number}</div>
    </div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameView + familyView + citizenshipView
  );
  let modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  let buttonClose = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  let buttonSave = `
    <button type="button" class="btn btn-danger" onclick="detelePerson(${id})">
    Delete 
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
}
function mapModal(id) {
  let modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  let mapView = `
  <div id="map" style="height: 400px;"></div>`;
  modalBody.insertAdjacentHTML("afterbegin", mapView);
  document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map
    let map = L.map("map").setView([51.505, -0.09], 13);

    // Add a tile layer to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Add a marker to the map
    L.marker([51.5, -0.09]).addTo(map).bindPopup("A sample marker.");

    // Optionally, you can customize the map view or add more markers, polygons, etc.
  });
  let modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  let buttonClose = `
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    "Close
    "</button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose);
}
function createChartModal(id) {
  // Create a canvas element to hold the chart
  let chartCanvas = document.createElement("canvas");
  chartCanvas.id = "chartCanvas";
  chartCanvas.width = 400;
  chartCanvas.height = 300;

  // Create the chart using Chart.js
  let chartCtx = chartCanvas.getContext("2d");
  let chart = new Chart(chartCtx, {
    type: "bar",
    data: {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: globalData[id].actions.graphsData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  return chartCanvas;
}
function addPerson(id) {
  let id_number = 0;
  let actions = {};
  let name = document.getElementById("nameInput").value;
  let family = document.getElementById("familyInput").value;
  let citizenship_number = document.getElementById(
    "citizenshipNumberInput"
  ).value;
  if (id == null) {
    id_number = globalData.length;
    actions.mapsLocation = "0,0";
    actions.graphsData = [0, 0, 0, 0, 0, 0];
  } else {
    id_number = id;
    actions = globalData[id].actions;
    table.rows(id).remove().draw();
  }
  console.log({ id_number, name, family, citizenship_number, actions });
  table.rows
    .add([{ id_number, name, family, citizenship_number, actions }])
    .draw();

  $("#PopupModal").modal("hide");
  createAlert("success", "data added to the Data Table.");
}
function detelePerson(id) {
  table.rows(id).remove().draw();
  $("#PopupModal").modal("hide");
  createAlert("danger", "Person data deleted!");
}
function closePopup() {
  $("#PopupModal").modal("hide");
}
function closechartPopup() {
  $("#chartModal").modal("hide");
}
function OpenChartPopup(id) {
  $("#chartModal").modal("show");
  let chartModalBody = document.querySelector("#chartModal .modal-body");
  chartModalBody.innerHTML = "";
  chartModalBody.appendChild(createChartModal(id));
}
function createAlert(type, message) {
  // Create the alert element
  let alertElement = `
  <div class="pe-auto col-3 my-5 ms-4 me-auto alert alert-${type} alert-dismissible fade show">
      <div class="modal-header">
              <i id="modal-title" class="modal-title" id="PopupModal">
              ${message}</i>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="closealert()">
                <span aria-hidden="true">&times;</span>
              </button>
      </div>
  </div>`;

  // Append the alert element to the container
  let alertContainer = document.getElementById("alertContainer");
  alertContainer.insertAdjacentHTML("afterbegin", alertElement);
}
function closealert() {
  let alertContainer = document.getElementById("alertContainer");
  alertContainer.innerHTML = "";
}
