// Past searches
var pastSearch = [];
var currentLocation = $("#current-location");

function getItems() {
  var citySearchHistory = JSON.parse(localStorage.getItem("pastSearch"));
  if (citySearchHistory !== null) {
    pastSearch = citySearchHistory;
  }
  // lists up to 8 locations
  for (i = 0; i < searchHistory.length; i++) {
    if (i == 8) {
      break;
    }
    //  creates links/buttons https://getbootstrap.com/docs/4./components/list-group/
    citySearchButton = $("<a>").attr({
      class: "list-group-item list-group-item-action",
      href: "#",
    });
    // appends history as a button below the search field
    citySearchButton.text(citySearchHistory[i]);
    $(".list-group").append(citySearchButton);
  }
}
// Search button
$("#search-button").on("click", function () {
  var city = $("#city").val().trim();
  console.log(city);
  citySearch(city);
});

//Search function
var city;
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

    //UV Index
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?appid=c0ff9f8846dfedac696381dd7ae61e6elat=" +
        lat +
        "&lon=" +
        lon,
      method: "GET",
    }).then(function (response) {
      currentLocation.append(
        $("<p>").html("UV Index: <span>" + response.value + "</span>")
      );
    });
  });
};
//Add Searches to past list

// //Save to local storage
// var setItems = function () {};
// //Retrieve from local storage
// var getItems = function () {}};
