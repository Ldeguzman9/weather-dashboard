// Past searches
var pastSearch = [];
var currentLocation = $("#current-location");

// //Retrieve from local storage
function getItems() {
  var citySearchHistory = JSON.parse(localStorage.getItem("pastSearch"));
  if (citySearchHistory !== null) {
    pastSearch = citySearchHistory;
  }
  //Add Searches to past list
  for (i = 0; i < citySearchHistory.length; i++) {
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
var citySearch = function (city) {
  queryUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=c0ff9f8846dfedac696381dd7ae61e6e&units=imperial";
  currentLocation.empty();
  $("#five-day-forecast").empty();
  $.ajax({
    url: queryUrl,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // Current City Title
    var date = moment().format("MMMM Do YYYY, h:mm:ss a");
    var mainCityName = $("<h3>").html(city + date);
    // API key c0ff9f8846dfedac696381dd7ae61e6e
    // Current City Details
    // Weather Icon
    var icon = response.weather.icon;

    // Current Temperature
    var temp = response.main.temp;
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
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=c0ff9f8846dfedac696381dd7ae61e6e",
      method: "GET",
    }).then(function (uviResponse) {
      currentLocation.append(
        $("<p>").html("UV Index: <span>" + uviResponse.current.uvi + "</span>")
      );
      forecast(lat, lon);
    });
  });
};

var forecast = function (lat, lon) {
  $.ajax({
    url:
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=c0ff9f8846dfedac696381dd7ae61e6e&units=imperial",
    method: "GET",
  }).then(function (forecastResponse) {
    console.log(forecastResponse);
    for (var i = 1; i < forecastResponse.daily.length - 2; i++) {
      var temp = $("<h3>").text(
        "Temperature: " + forecastResponse.daily[i].temp.max
      );

      var card = $("<span>").addClass("card").append(temp);
      $("#five-day-forecast").append(card);
    }
  });
};

// Save to local storage

// var setItems = function () {};

// var getItems = function () {};
