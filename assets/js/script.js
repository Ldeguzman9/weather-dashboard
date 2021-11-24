// Past searches
var pastSearch = [];
var currentLocation = $("#current-location");
var fiveDayCard = $("#five-day-card");

//Retrieve from local storage
function getItems() {
  var citySearchHistory = JSON.parse(localStorage.getItem("pastSearch")) || [];
  if (citySearchHistory !== null) {
    pastSearch = citySearchHistory;
  }
  //Add Searches to past list
  for (i = 0; i < citySearchHistory.length; i++) {
    if (i == 8) {
      break;
    }

    //  creates links/buttons
    cityListButton = $("<a>").attr({
      class: "list-group-item list-group-item-action",
      href: "#",
    });
    // past search as a button below the search field
    cityListButton.text(pastSearch[i]);
    $("#quick-search").append(cityListButton);
  }
}

// call get item function
getItems();

//Search function
var city;

var citySearch = function () {
  queryUrl =
    "api.openweathermap.org/data/2.5/weather?q=" +
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
    currentLocation.addClass("border border-dark");
    currentLocation.append($("<h3>").html(city + " - " + date));
    // API key c0ff9f8846dfedac696381dd7ae61e6e

    // Current City Details
    // Weather Icon
    var weatherIcon = response.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/w/" + weatherIcon + ".png";
    currentLocation.append($("<img>").attr("src", iconURL));

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
        "api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=c0ff9f8846dfedac696381dd7ae61e6e",
      method: "GET",
    }).then(function (uviResponse) {
      currentLocation.append(
        $("<p>").html("UV Index: <span>" + uviResponse.current.uvi + "</span>")
      );
      if (uviResponse.current.uvi <= 2) {
        $("span").attr("class", "bg-success");
      }
      if (uviResponse.current.uvi > 2 && response.value <= 5) {
        $("span").attr("class", "bg-warning");
      }
      if (uviResponse.current.uvi > 5) {
        $("span").attr("class", "bg-danger");
      }
      forecast(lat, lon);
    });
  });
};

var forecast = function (lat, lon) {
  $.ajax({
    url:
      "api.openweathermap.org/data/2.5/onecall?lat=" +
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
      var date = moment.unix(forecastResponse.daily[i].dt).format("MM/DD/YYYY");
      card.append($("<h4>").text(date));

      // Weather Icon
      var weatherIcons = forecastResponse.daily[i].weather[0].icon;
      var iconURL = "https://openweathermap.org/img/w/" + weatherIcons + ".png";
      card.append($("<img>").attr("src", iconURL));

      // // Temperature
      var temp = "Temperature: " + forecastResponse.daily[i].temp.max;
      card.append($("<p>").text(temp));

      // // Wind Speed
      var wind = "Wind Speed: " + forecastResponse.daily[i].wind_speed;
      card.append($("<p>").text(wind));

      // // Humidity
      var humidity = "Humidity: " + forecastResponse.daily[i].humidity;
      card.append($("<p>").text(humidity));
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

    var cityListButton = $("<a>").attr({
      // quick-search-item-action keeps the search history buttons consistent
      class: "quick-search-item quick-search-item-action",
      href: "#",
    });
    cityListButton.text(city);
    $(".quick-search").append(cityListButton);
    $(".list-group").append(cityListButton);
    $("#city").val("");
  }
});

// past search buttons
$("#quick-search").on("click", "a", function () {
  city = $(this).text();
  citySearch(city);
});
