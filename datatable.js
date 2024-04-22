$(document).ready(function () {
  // Setup - add a text input to each footer cell
  $("#example thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#example thead");

  var table = $("#example").DataTable({
    paging: false,
    orderCellsTop: true,
    fixedHeader: true,
    initComplete: function () {
      var api = this.api();

      // For each column
      api
        .columns()
        .eq(0)
        .each(function (colIdx) {
          var cell = $(".filters th").eq(
            $(api.column(colIdx).header()).index()
          );
          var title = $(cell).text();
          if (title == "") {
          } else {
            $(cell).html(
              '<input type="text" class="bg-light form-control" placeholder="' +
                title +
                '" />'
            );
          }

          $(
            "input",
            $(".filters th").eq($(api.column(colIdx).header()).index())
          )
            .off("keyup change")
            .on("change", function (e) {
              $(this).attr("title", $(this).val());
              var regexr = "({search})";

              var cursorPosition = this.selectionStart;

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
      dataSrc: "data",
    },
    columns: [
      { data: "id_number" },
      { data: "name" },
      { data: "family" },
      { data: "citizenship_number" },
      {
        data: null,
        render: function (data) {
          var buttons = `
          <i class="text-success bi bi-eye mx-1" onclick="openPopup( 'view' , '${data.id_number}')"></i>
          <i class="text-success bi bi-pen mx-1" onclick="openPopup( 'edit' , '${data.id_number}')"></i>
          <i class="text-success bi bi-trash mx-1" onclick="openPopup( 'delete' , '${data.id_number}')"></i>
          <i class="text-success bi bi-globe-americas mx-1" onclick="openPopup( 'maps' , '${data.id_number}')"></i>
          <i class="text-success bi bi-bar-chart-fill mx-1" onclick="openPopup( 'graphs' , '${data.id_number}')"></i>
          `;
          return buttons;
        },
      },
    ],
  });
});
$.ajax({
  url: "data.json",
  dataType: "json",
  success: function (data) {
    globalData = data.data; // Assign the retrieved data to the global variable
  },
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
    deleteModa(id_number);
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
  var id = 1;
  var modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  var nameInput = `
  <div class="form-floating mb-3">
  <input type="name" class="form-control" id="nameInput" placeholder="Name">
  <label for="nameInput">Name</label>
  </div>`;

  var familyInput = `
    <div class="form-floating mb-3">
    <input type="family" class="form-control" id="familyInput" placeholder="Family Name">
    <label for="familyInput">Family Name</label>
    </div>`;

  var citizenshipInput = `
    <div class="form-floating mb-3">
    <input type="citizenship number" class="form-control" id="citizenshipNumberInput" placeholder="citizenship number">
    <label for="citizenshipNumberInput">citizenship number</label>
    </div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameInput + familyInput + citizenshipInput
  );
  var modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  var buttonClose =`
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  var buttonSave =`
    <button type="button" class="btn btn-primary" onclick="addPerson(${id})">
    Save 
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
}
function viewModal(id) {
  var modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  var nameView = `
  <div class="alert alert-info" role="alert">Name:<hr>${globalData[id].name}</div>`;

  var familyView = `
    <div class="alert alert-info" role="alert">Family:<hr>${globalData[id].family}</div>`;

  var citizenshipView = `
    <div class="alert alert-info" role="alert">Citizenship Number:<hr>${globalData[id].citizenship_number}</div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameView + familyView + citizenshipView
  );
  var modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  var buttonClose =
    '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">' +
    "Close" +
    "</button>";
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose);
}
function editModal(id) {
  var modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  var nameInput = `
  <div class="form-floating mb-3">
  <input type="name" class="form-control" id="nameInput" value='${globalData[id].name}'>
  <label for="nameInput">Name</label>
  </div>`;

  var familyInput = `
    <div class="form-floating mb-3">
    <input type="family" class="form-control" id="familyInput" value='${globalData[id].family}'>
    <label for="familyInput">Family Name</label>
    </div>`;

  var citizenshipInput = `
    <div class="form-floating mb-3">
    <input type="citizenship number" class="form-control" id="citizenshipNumberInput" value='${globalData[id].citizenship_number}'>
    <label for="citizenshipNumberInput">citizenship number</label>
    </div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameInput + familyInput + citizenshipInput
  );
  var modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  var buttonClose =`
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  var buttonSave =`
    <button type="button" class="btn btn-primary" onclick="addPerson(${id})">
    Save
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
}
function deleteModa(id){
  var modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  var nameView = `
  <div class ="row">
  <p class="text-primary">Do you want to delete the following information? </p>
  <div class="alert alert-danger col-5 mx-auto" role="alert">Name:<hr>${globalData[id].name}</div>`;

  var familyView = `
    <div class="alert alert-danger col-5 mx-auto" role="alert">Family:<hr>${globalData[id].family}</div>`;

  var citizenshipView = `
    <div class="alert alert-danger col-11 mx-auto" role="alert">Citizenship Number:<hr>${globalData[id].citizenship_number}</div>
    </div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
    nameView + familyView + citizenshipView
  );
  var modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  var buttonClose =`
    <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">
    Close
    </button>`;
  var buttonSave =`
    <button type="button" class="btn btn-danger" onclick="detelePerson(${id})">
    Delete 
    </button>`;
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
}
function mapModal(id){
  var modalBody = document.getElementById("modalbody");
  modalBody.innerHTML = ""; // Clear the content of modal-body
  var mapView = `
  <div id="map" style="height: 400px;"></div>`;
  modalBody.insertAdjacentHTML(
    "afterbegin",
     mapView
  );
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add a tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Add a marker to the map
    L.marker([51.5, -0.09]).addTo(map)
      .bindPopup('A sample marker.');

    // Optionally, you can customize the map view or add more markers, polygons, etc.
  });
  var modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  var buttonClose =
    '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">' +
    "Close" +
    "</button>";
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose);

}
function graphModal(id){
  var modalfooter = document.getElementById("modalfooter");
  modalfooter.innerHTML = "";
  var buttonClose =
    '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">' +
    "Close" +
    "</button>";
  modalfooter.insertAdjacentHTML("afterbegin", buttonClose);
}
function addPerson(id) {
  var name = document.getElementById("nameInput").value;
  var family = document.getElementById("familyInput").value;
  var citizenshipNumber = document.getElementById(
    "citizenshipNumberInput"
  ).value;
  console.log(name, family, citizenshipNumber);

  $("#PopupModal").modal("hide");
}
function detelePerson(id){
  $("#PopupModal").modal("hide");
}
function closePopup() {
  $("#PopupModal").modal("hide");
}
