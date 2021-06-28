//geocoding api key = AIzaSyAU8d0CPflBIc89XO5UpO-CWk3PH7O2oIc
//open weather api key = 802e10c874c659e55fc1bc214dfe595a

/*
geocoding request url = https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,
+Mountain+View,+CA&key=YOUR_API_KEY
*/

/*
open weather request url = https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
*/

//Element variables
var searchInput = $('#search');
var searchBtn = $('#searchBtn');
var historyCont = $('#history');
var city = $('#city');
var todayIcon = $('#todayIcon');
var condition = $('#condition');
var temp = $('#temp');
var wind = $('#wind');
var humidity = $('#humidity');
var uvi = $('#uvi');
var fiveDayBox = $('#five-day-box');

//Global variables
var geoAPIKey = '&key=AIzaSyAU8d0CPflBIc89XO5UpO-CWk3PH7O2oIc'
var weatherAPIKey = '802e10c874c659e55fc1bc214dfe595a'

var weather = [];
var searchLoc;
var searchObj;
var lattitude;
var longitude;

//Event listeners
searchBtn.on('click', getLocation);

//Get Lattitude & Longitude
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
        lattitude = data.results[0].geometry.location.lat;
        longitude = data.results[0].geometry.location.lng;
        searchObj = [lattitude, longitude];
        localStorage.setItem(searchLoc, JSON.stringify(searchObj));

        var elementExists = document.getElementById(searchLoc);
    
        if (elementExists === null) {
            var history = $('<div>');

            history.text(searchLoc);
            history.addClass('history');
            history.attr('id', searchLoc);

            historyCont.append(history);
        }
    }})
    
    
}

//Get Weather Object and Render

//Display previous search
