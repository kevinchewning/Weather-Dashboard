//Element variables
var searchInput = $('#search');
var searchBtn = $('#searchBtn');
var historyCont = $('#history');
var city = $('#city');
var date = $('#date');
var todayIcon = $('#todayIcon');
var condition = $('#condition');
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var uvi = $('#uvi');
var fiveDayBox = $('#five-day-box');

//Global variables
//API Keys
var geoAPIKey = '&key=AIzaSyAU8d0CPflBIc89XO5UpO-CWk3PH7O2oIc'
var weatherAPIKey = '802e10c874c659e55fc1bc214dfe595a'
//Local Storage
var historyString = localStorage.getItem("historyString");
var historyObj = JSON.parse(historyString) ?? [];
//Create variables to use for local storage
var searchLoc;
var searchObj;
//Set the following variables to display Detroit Weather by default.
var lattitude = 42.331427
var longitude = -83.0457538
var cityName = 'Detroit, MI, USA'

//Event listeners
searchBtn.on('click', getLocation);
historyCont.on('click', '.history', historyFetch);

//Show default weather and saved history on page load
renderHistory();
getWeather();

//Renders history saved to local storage
function renderHistory () {
  for (i = 0; i < historyObj.length; i++) {
    var history = $('<div>');
    var city = Object.keys(historyObj[i])[0];

    history.text(city);
    history.addClass('history');
    history.attr('id', city);

    historyCont.append(history);
  }
}

//Get Lattitude & Longitude from geocoding API
function getLocation () {
    searchLoc = searchInput.val();
    var encode = encodeURIComponent(searchInput.val());
    var requestURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encode + geoAPIKey;

    fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.status != 'OK') {
          alert(data.status);
      } else {
        //save search lattitude and longitude and create object for local storage
        lattitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;
        searchObj = [lattitude, longitude];
        cityName = data.results[0].formatted_address;
        var obj = {};
        obj[cityName] = searchObj;

        //Check history objects to see if element already exists
        var elementExists = document.getElementById(cityName);    
        if (elementExists === null) {
          //if element doesn't exist, add to history
          historyObj.push(obj);

          //if history is more than 9 objects, delete oldest search and render new history
          if (historyObj.length > 9) {
            historyObj.splice(0,1)
            localStorage.setItem('historyString', JSON.stringify(historyObj));
            $('.history').remove();
            renderHistory();
          } else {
            localStorage.setItem('historyString', JSON.stringify(historyObj));
            $('.history').remove();
            renderHistory();
          }
        }

        getWeather();
    }})
}

//Get Weather Object
function getWeather() {
  var requestURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lattitude + '&lon=' + longitude + '&units=imperial&exclude=minutely,hourly,alerts&appid=' + weatherAPIKey;

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //remove old 5 day forecast
      $('.five-day-card').remove();

      var icon = 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png'
      
      //render current day weather
      city.text(cityName);
      date.text(moment().format("dddd, MMMM Do YYYY"));
      todayIcon.attr('src', icon);
      condition.text(data.current.weather[0].main);
      temp.text(Math.round(data.current.temp) + '°');
      wind.text(data.current.wind_speed + 'MPH');
      humidity.text(data.current.humidity + '%');
      uvi.text(data.current.uvi);

      //Color code UVI
      if (data.current.uvi < 3) {
        uvi.css("background-color", "green");
      } else if (data.current.uvi < 8) {
        uvi.css("background-color", "yellow");
      } else {
        uvi.css("background-color", "red");
      };

      //Render new 5 day forecast
      for (i = 1; i < 6; i++) {
        var fiveDay = $('<div>');
        var boxDate = $('<h3>');
        var boxIcon = $('<img>');
        var boxTemp = $('<p>');
        var boxWind = $('<p>');
        var boxHumidity = $('<p>');
        var icon = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '@2x.png';

        fiveDay.addClass('five-day-card');
        boxDate.text(moment().add(i, 'd').format('M/D/YY'));
        boxIcon.attr('src', icon);
        boxTemp.text('Temp: ' + Math.round(data.daily[i].temp.day) + '°');
        boxWind.text('Wind: ' + data.daily[i].wind_speed + 'MPH');
        boxHumidity.text('Humidity: ' + data.daily[i].humidity + '%');

        fiveDayBox.append(fiveDay);
        fiveDay.append(boxDate);
        fiveDay.append(boxIcon);
        fiveDay.append(boxTemp);
        fiveDay.append(boxWind);
        fiveDay.append(boxHumidity);
      }
    })
}

//Search saved history for coordinates of element that was clicked.
function historyFetch(event) {
  var cityID = $(this).attr('id');
  
  for (i = 0; i < historyObj.length; i++) {
    var cityHistory = Object.keys(historyObj[i])[0];
    if (cityHistory == cityID) {
      lattitude = historyObj[i][cityID][0];
      longitude = historyObj[i][cityID][1];
      cityName = cityID;
      
      //render new coordinates
      getWeather();
    }
  }
}
