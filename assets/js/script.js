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
  for (i = 0; i < pastSearch.length; i++) {
    if (i == 8) {
      break;
    }
    //  creates links/buttons https://getbootstrap.com/docs/4./components/list-group/
    citySearchButton = $("<a>").attr({
      class: "quick-search-item quick-search-item-action",
      href: "#",
    });
    // appends history as a button below the search field
    citySearchButton.text(pastSearch[i]);
    $(".quick-search").append(citySearchButton);
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
    var date = moment().format("MM/DD/YYYY");
    var mainCityName = city;
    currentLocation.append($("<h3>").html(city + "-" + date));
    // API key c0ff9f8846dfedac696381dd7ae61e6e

    // Current City Details
    // Weather Icon
    var icon = response.weather.icon;
    currentLocation.append(
      $("<p>").html("http://openweathermap.org/img/w/" + icon + ".png")
    );

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
      var card = $("<div>").attr(
        "class",
        "col fiveDay bg-primary text-white rounded-lg p-2"
      );
      $("#five-day-forecast").append(card);

      // Date
      var date = moment().format("MM/DD/YYYY");
      card.append($("<h4>").text(date));

      // // Temperature
      var temp = "Temperature: " + forecastResponse.daily[i].temp.max;
      card.append($("<h4>").text(temp));

      // // Wind Speed
      var wind = "Wind Speed: " + forecastResponse.daily[i].wind_speed;
      card.append($("<h4>").text(wind));

      // // Humidity
      var humidity = "Humidity: " + forecastResponse.daily[i].humidity;
      card.append($("<h4>").text(humidity));

      // // UVI
      var uvi = "UV Index: " + forecastResponse.daily[i].uvi;
      card.append($("<h4>").text(uvi));
    }
  });
};

// Save to local storage
$("#search-button").click(function () {
  city = $("#city").val().trim();
  citySearch();
  var checkArray = pastSearch.includes(city);
  if (checkArray == true) {
    return;
  } else {
    pastSearch.push(city);
    localStorage.setItem("pastSearch", JSON.stringify(pastSearch));
    var cityListBtn = $("<a>").attr({
      // quick-search-item-action keeps the search history buttons consistent
      class: "quick-search-item quick-search-item-action",
      href: "#",
    });
    cityListBtn.text(city);
    $(".quick-search").append(cityListBtn);
  }
});

// listens for action on the history buttons(event)
$(".quick-search-item").click(function () {
  city = $(this).text();
  citySearch();
});
