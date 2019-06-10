var url = "https://randomuser.me/api/?results=12";
// ***** USing API To get data from other website*****
function getEmployees(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      dataType: "json",
      success: function(data) {
        resolve(data.results);
      }
    });
  });
}
//***** create array to store the 12 employees*****
var employeesArray = [];
//***** after get Json from other website do something below *****
getEmployees(url)
  .then(response => {
    return response.map(employee => {
      return generateHTML(employee);
    });
  })
  .then(response => {
    // add each employee to div exmployees div
    response.forEach(employeeDetail => {
      employeesArray.push(employeeDetail);
    });
    generateEmployeesHtml(employeesArray);
    monitorUserSearch();
  })
  .catch(error => console.log(error));

function generateHTML(employeeObject) {
  let newHtml = `
    <ul class="employee">
      <li class="avatar"><a href="${employeeObject.picture.large}"><img src="${
    employeeObject.picture.thumbnail
  }"></a> </li>
     <li class="name"><h1>${employeeObject.name.first} ${
    employeeObject.name.last
  }</h1></li>
    <li class="email"><a href="${employeeObject.email}">${
    employeeObject.email
  }</a></li>
      <li class="city">${employeeObject.location.city}</li>
       <div style="display: none">
      <li class="phone">${employeeObject.cell}</li>
      <li class="address">${employeeObject.location.street} ${
    employeeObject.location.city
  } ${employeeObject.location.state} ${employeeObject.location.postcode}</li>
      <li class="birthday">Birthday: ${employeeObject.dob.date.substring(
        0,
        10
      )}</li>
       </div>
      </ul>
   `;
  return newHtml;
}
//*****This is resuable function to get the position of selected employee in whole array *****
function getIndexnumberOfselectedEmployee(selectedEmployee) {
  let selectedEmployeeEmail = $(selectedEmployee)
    .children(".email")
    .children()
    .text();

  let indexnumber = "";
  for (let i = 0; i < employeesArray.length; i++) {
    if (employeesArray[i].indexOf(selectedEmployeeEmail) != -1) {
      indexnumber = i;
    }
  }
  return indexnumber;
}
//***** This function is used to generateLightBox for selected employee and keep motinor the click on is after light box is generated  *****
function generateLightbox(selectedEmployee) {
  return new Promise((resolve, reject) => {
    let indexnumber = getIndexnumberOfselectedEmployee(selectedEmployee);
    let selectedEmployeeInArrayString = employeesArray[indexnumber].replace(
      "display: none",
      "display: flex"
    );
    var lightboxHtml = document.createElement("div");
    lightboxHtml.setAttribute("id", "lightbox");
    lightboxHtml.appendChild($(selectedEmployeeInArrayString)[0]);
    $(lightboxHtml).append(`<p class="closeicon">X</p>`);
    $(lightboxHtml).append(`<p class="lefticon"><</p>`);
    $(lightboxHtml).append(`<p class="righticon">></p>`);
    var overlayHtml = `<div id="overlay"></div>`;
    $(".main").append(overlayHtml);
    $(".main").append(lightboxHtml);
    resolve($(selectedEmployeeInArrayString)[0]);
  }).then(response => {
    monitorLightbox(response);
  });
}

function putemployeeBack(selectedEmployee) {
  $("#overlay").remove();
  $("#lightbox").remove();
}
//*****This function is used to monitor the useer interactive with the light box *****
function monitorLightbox(response) {
  $("#overlay").on("click", function() {
    putemployeeBack(response);
  });
  $(".closeicon").on("click", function() {
    putemployeeBack(response);
  });
  $(".lefticon").on("click", function() {
    showLeftOfSelectedEmployee(response);
  });
  $(".righticon").on("click", function() {
    showRightOfSelectedEmployee(response);
  });
}

function showLeftOfSelectedEmployee(selectedEmployee) {
  let indexnumber = getIndexnumberOfselectedEmployee(selectedEmployee);
  putemployeeBack(selectedEmployee);
  if (indexnumber === 0) {
    var lastEmployee = employeesArray[employeesArray.length - 1];
    generateLightbox($(lastEmployee)[0]);
  } else {
    var prevEmployee = employeesArray[indexnumber - 1];
    generateLightbox($(prevEmployee)[0]);
  }
}

function showRightOfSelectedEmployee(selectedEmployee) {
  let indexnumber = getIndexnumberOfselectedEmployee(selectedEmployee);
  putemployeeBack(selectedEmployee);
  if (indexnumber === 11) {
    var firstEmployee = employeesArray[0];
    generateLightbox($(firstEmployee)[0]);
  } else {
    var nextEmployee = employeesArray[indexnumber + 1];
    generateLightbox($(nextEmployee)[0]);
  }
}

function monitorEmployeeClick(selectedEmployee) {
  $(selectedEmployee).on("click", function(event) {
    // if someone gets click, then we generate light box for this employee, this is promise function, after this, people are able to choose close overlay and lightbox
    generateLightbox($(this)[0]);
  });
}
function generateEmployeesHtml(arr) {
  $(".employees").empty();
  arr.forEach(function(item) {
    $(".employees").append(item);
  });

  $(".employees")
    .children("ul")
    .each(function() {
      monitorEmployeeClick($(this)[0]);
    });
}
function monitorUserSearch() {
  $(".search").on("keyup", function() {
    var userInput = $(".search").val();
    let newArray = employeesArray.filter(function(item) {
      let name = $(item)
        .children(".name")
        .children()
        .text();
      if (name.indexOf(userInput) != -1) {
        return true;
      } else {
        return false;
      }
    });
    generateEmployeesHtml(newArray);
  });
}
