//FUNCTION to show local date and time
function formatDate(timestamp) {
  let locationDate = new Date(timestamp);

  console.log(timestamp);
  console.log(locationDate);

  let date = locationDate.getDate();

  let hour = locationDate.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minute = locationDate.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[locationDate.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[locationDate.getMonth()];

  return `${day} ${date} ${month} ${hour}:${minute}`;
}

//showWeather uses the forecast API call
function showWeather(response) {
  console.log(response);
  document.querySelector("h1").innerHTML = response.data.city.name;

  document.querySelector("#description").innerHTML =
    response.data.list[0].weather[0].main;
  document.querySelector("#temp-now").innerHTML = Math.round(
    response.data.list[0].main.temp
  );
  document.querySelector("#current-temp-min").innerHTML = Math.round(
    response.data.list[0].main.temp_min
  );
  document.querySelector("#current-temp-max").innerHTML = Math.round(
    response.data.list[0].main.temp_max
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.list[0].wind.speed
  );
}
//showWeather2 uses the onecall API call - this is the second set of data received
function showWeather2(response) {
  console.log(response);

  let rain = response.data.daily[0].rain;
  if (rain !== undefined) {
    rain = document.querySelector("#rain").innerHTML = Math.round(
      response.data.daily[0].rain
    );
  } else if (rain === undefined) {
    rain = document.querySelector("#rain").innerHTML = 0;
  }
  let weatherIcon = response.data.current.weather[0].icon;
  console.log(weatherIcon);
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );
  let uvIndicator = Math.round(response.data.current.uvi);
  document.querySelector("#uvNumber").innerHTML = uvIndicator;
  let uvIcon = document.querySelector("#uvIndicator");
  if (uvIndicator < 2) {
    uvIcon.classList.add("UV-indicator-low");
  } else if ((uvIndicator > 2) & (uvIndicator < 5)) {
    uvIcon.classList.add("UV-indicator-moderate");
  } else if (uvIndicator > 5) {
    uvIcon.classList.add("UV-indicator-high");
  }
  document.querySelector("h2").innerHTML = formatDate(
    response.data.current.dt * 1000
  );
}

function getWeatherCoordinates(response) {
  //console.log(response);
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}
function getWeatherCoordinates2(response) {
  //console.log(response);
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather2);
}

function findCityGeolocation(city) {
  console.log(city);
  userCity = city;
  //document.querySelector("h1").innerHTML = userCity;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${userCity}&appid=${apiKey}`;
  axios.get(apiUrl).then(getWeatherCoordinates2);
  axios.get(apiUrl).then(getWeatherCoordinates);
}

function cityName(event) {
  event.preventDefault();
  let city = document.querySelector("#text-city-search").value;
  findCityGeolocation(city);
}

function findCityGeolocation2(geocoordinates) {
  console.log(geocoordinates);
  let latitude = geocoordinates.coords.latitude;
  let longitude = geocoordinates.coords.longitude;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather2);
}
function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(findCityGeolocation2);
}

let userCity = document.querySelector("#submit-city-search");
userCity.addEventListener("click", cityName);

let currentLocation = document.querySelector("#submit-current-location");
currentLocation.addEventListener("click", getPosition);

//set default city to display on page load
findCityGeolocation("Perth");
