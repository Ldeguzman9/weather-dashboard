// Past searches
var pastSearch = [];
var city;
var currentLocation = $("#current-location");

// Search button
$("#search-button").on("click", function () {
  var city = $("#city").val().trim();
  console.log(city);
  //citySearch();
});

//Search function
var citySearch = function () {
  queryUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=c0ff9f8846dfedac696381dd7ae61e6e";
  currentLocation.empty();
  $("#five-day-forecast").empty();
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    // Current City Title
    var date = moment().format("MMMM Do YYYY, h:mm:ss a");
    var mainCityName = $("<h3>").html(city + date);
    // API key c0ff9f8846dfedac696381dd7ae61e6e
    // Current City Details
    // Weather Icon
    var icon = response.weather.icon;

    // Current Temperature
    var temp = response.temperature;
    currentLocation.append($("<p>").html("Temperature: " + temp + " &#8457"));

    // Wind Speed
    var wind = response.wind.speed;
    currentLocation.append($("<p>").html("Wind Speed: " + wind));

    // Humidity
    var humidity = response.main.humidity;
    currentLocation.append($("<p>").html("Humidity: " + humidity));
  });
};

//Add Searches to past list

// //Save to local storage
// var setItems = function () {};
// //Retrieve from local storage
// var getItems = function () {};
