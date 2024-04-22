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
          // Set the header cell to contain the input element
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
          // On every keypress in this input
          $(
            "input",
            $(".filters th").eq($(api.column(colIdx).header()).index())
          )
            .off("keyup change")
            .on("change", function (e) {
              // Get the search value
              $(this).attr("title", $(this).val());
              var regexr = "({search})"; //$(this).parents('th').find('select').val();

              var cursorPosition = this.selectionStart;
              // Search the column for that value
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
        data: "actions",
        render: function (data, type, row) {
          var buttons = "";
          for (var key in data) {
            buttons +=
              '<i class="text-success bi bi-' +
              key +
              ' mx-1" onclick="openPopup(\'' +
              data[key] +
              "')\"></i>";
          }
          return buttons;
        },
      },
    ],
  });
});
function openPopup(data, id) {
  $("#PopupModal").modal("show");
  if (data == "addPerson") {
    $("#modal-title").html("Add Person");
    var modalBody = document.getElementById("modalbody");
    modalBody.innerHTML = ""; // Clear the content of modal-body
    var nameInput =
      '<div class="form-floating mb-3">' +
      '<input type="name" class="form-control" id="nameInput" placeholder="Name">' +
      '<label for="nameInput">Name</label>' +
      "</div>";

    var familyInput =
      '<div class="form-floating mb-3">' +
      '<input type="family" class="form-control" id="familyInput" placeholder="Family Name">' +
      '<label for="familyInput">Family Name</label>' +
      "</div>";

    var citizenshipInput =
      '<div class="form-floating mb-3">' +
      '<input type="citizenship number" class="form-control" id="citizenshipNumberInput" placeholder="citizenship number">' +
      '<label for="citizenshipNumberInput">citizenship number</label>' +
      "</div>";
    modalBody.insertAdjacentHTML(
      "afterbegin",
      nameInput + familyInput + citizenshipInput
    );
    var modalfooter = document.getElementById("modalfooter");
    modalfooter.innerHTML = "";
    var buttonClose =
      '<button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closePopup()">' +
      "Close" +
      "</button>";
    var buttonSave =
      '<button type="button" class="btn btn-primary" onclick="addPerson()">' +
      "Save" +
      "</button>";
    modalfooter.insertAdjacentHTML("afterbegin", buttonClose + buttonSave);
  } else if (data == "view") {
    $("#modal-title").html("view");
  } else if (data == "edit") {
    $("#modal-title").html("edit");
  } else if (data == "delete") {
    $("#modal-title").html("delete");
  } else if (data == "maps") {
    $("#modal-title").html("maps");
  } else if (data == "graphs") {
    $("#modal-title").html("graphs");
  }
}

function closePopup() {
  $("#PopupModal").modal("hide");
}
function addPerson() {
  var name = document.getElementById("nameInput").value;
  var family = document.getElementById("familyInput").value;
  var citizenshipNumber = document.getElementById(
    "citizenshipNumberInput"
  ).value;

  // Additional logic to handle the form submission
}
