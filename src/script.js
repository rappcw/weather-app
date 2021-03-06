//FUNCTION to show local date and time
function formatDate(timestamp) {
  let locationDate = new Date(timestamp);
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

function formatSun(suntime) {
  let time = new Date(suntime);

  let hour = time.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minute = time.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `${hour}:${minute}`;
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(dailyForecast) {
  let forecast = dailyForecast.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = ``;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      let forecastMax = Math.round(forecastDay.temp.max);
      let forecastMin = Math.round(forecastDay.temp.min);
      let forecastIcon = forecastDay.weather[0].icon;

      forecastHTML =
        forecastHTML +
        `<div>
              <div class="weather-forecast-day">${formatForecastDay(
                forecastDay.dt
              )}</div>
              <img src="images/${forecastIcon}.svg" class="forecast" alt="" />
              <div class="weather-forecast-temperature small">
                <span>${forecastMin}</span>°
                <span>${forecastMax}</span>°
              </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML;
  forecastElement.innerHTML = forecastHTML;
}

//showWeather uses the forecast API call
function showWeather(response) {
  //console.log("forecast");
  //console.log(response);
  document.querySelector("h1").innerHTML = response.data.city.name;
  document.querySelector("#description").innerHTML =
    response.data.list[0].weather[0].main;
  document.querySelector("#temp-now").innerHTML = Math.round(
    response.data.list[0].main.temp
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.list[0].wind.speed
  );
  //celsiusTemperature = Math.round(response.data.list[0].main.temp);
}
//showWeather2 uses the onecall API call - this is the second set of data received
function showWeather2(response) {
  //console.log("onecall");
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
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute("src", `images/${weatherIcon}.svg`);
  let altText = response.data.current.weather[0].main;
  iconElement.setAttribute("alt", `${altText}`);
  let uvIndicator = Math.round(response.data.current.uvi);
  document.querySelector("#uvNumber").innerHTML = uvIndicator;
  let uvIcon = document.querySelector("#uvIndicator");

  if (uvIndicator < 2) {
    uvIcon.classList.remove("UV-indicator");
    uvIcon.classList.remove("UV-indicator-high");
    uvIcon.classList.remove("UV-indicator-moderate");
    uvIcon.classList.add("UV-indicator-low");
  } else if ((uvIndicator >= 2) & (uvIndicator < 4)) {
    uvIcon.classList.remove("UV-indicator");
    uvIcon.classList.remove("UV-indicator-low");
    uvIcon.classList.remove("UV-indicator-high");
    uvIcon.classList.add("UV-indicator-moderate");
  } else if (uvIndicator > 5) {
    uvIcon.classList.remove("UV-indicator");
    uvIcon.classList.remove("UV-indicator-low");
    uvIcon.classList.remove("UV-indicator-moderate");
    uvIcon.classList.add("UV-indicator-high");
  }

  document.querySelector("#current-temp-min").innerHTML = Math.round(
    response.data.daily[0].temp.min
  );
  document.querySelector("#current-temp-max").innerHTML = Math.round(
    response.data.daily[0].temp.max
  );
  document.querySelector("h2").innerHTML = formatDate(
    response.data.current.dt * 1000
  );
  document.querySelector("#sunrise").innerHTML = formatSun(
    response.data.current.sunrise * 1000
  );
  document.querySelector("#sunset").innerHTML = formatSun(
    response.data.current.sunset * 1000
  );
}

function getWeatherCoordinates(response) {
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}
function getWeatherCoordinates2(response) {
  let latitude = response.data[0].lat;
  let longitude = response.data[0].lon;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather2);
  axios.get(apiUrl).then(displayForecast);
}

function findCityGeolocation(city) {
  //console.log(city);
  userCity = city;
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
  //console.log(geocoordinates);
  let latitude = geocoordinates.coords.latitude;
  let longitude = geocoordinates.coords.longitude;
  let apiKey = "442a9a6ad3254edf75193558d4248959";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather2);
  axios.get(apiUrl).then(displayForecast);
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

//change temperature unit Fahrenheit
/*
function changeFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temp-now");
  currentTemp.innerHTML = Math.round((celsiusTemperature * 9) / 5 + 32);
  showCelsius.classList.remove("temp-selected");
  showFahrenheit.classList.add("temp-selected");
}

let showFahrenheit = document.querySelector("#temp-fahrenheit");
showFahrenheit.addEventListener("click", changeFahrenheit);

//change temperature unit Celsius
function changeCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#temp-now");
  currentTemp.innerHTML = celsiusTemperature;
  showCelsius.classList.add("temp-selected");
  showFahrenheit.classList.remove("temp-selected");
}
let celsiusTemperature = null;
let showCelsius = document.querySelector("#temp-celsius");
showCelsius.addEventListener("click", changeCelsius);

*/
