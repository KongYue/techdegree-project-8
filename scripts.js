const employees = $(".employees")[0];
var url = "https://randomuser.me/api/?results=12";
function getEmployees(url) {
  return $.ajax({
    url: url,
    dataType: "json",
    success: function(data) {
      return data;
    }
  });
  //  return jqXHR;
}

var employeesData = getEmployees(url);

console.log(employeesData);
//When you print out on console the readyState is 1 , but actually if you check from console the readyState is 4. Why?
console.log(employeesData.readyState);
