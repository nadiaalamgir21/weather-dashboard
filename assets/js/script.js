let apiId = "a248938f43b3027a2f331d88df42b72b"
let area = "sacramento"
let url1 = `https://api.openweathermap.org/data/2.5/weather?q=${area}&APPID=${apiId}&units=imperial`
let data = null
let futureData = null

// calls the first api which fetch the searched city weather
function callFirstAPI(url) {
  let whenDataArrives = function (response) {
    response.json().then((dataFromApi) => {
      data = dataFromApi
      printSearchedCity()
      fetchFutureWeather(dataFromApi)
      saveCity(dataFromApi.name)
    })
  }
  fetch(url).then(whenDataArrives)
}

//this function displays the fetched city weather details onto the screen with help of jquery html function
function printSearchedCity() {
  $('.info-area').show()
  $(".current-day-weather").html(
    `<h2>${data.name}</h2>
        <h5>${moment.unix(data.dt).format("DD/MM/YYYY")}</h5>
        <p><img src="http://openweathermap.org/img/w/${
          data.weather[0].icon
        }.png"</img></p>
        <p>Temp: ${data.main.temp} <span>&#176;</span>F</p>
        <p>Wind ${data.wind.speed}MPH</p>
        <p>Humidity ${data.main.humidity}%</p>
    `
  )
}

//this function fetches the the searched city future weather forecast through the help on another API call
function fetchFutureWeather(EarlierData) {
  let coord = EarlierData.coord
  let urlFuture = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=hourly&appid=${apiId}&units=imperial`

  let whenDataArrives = function (response) {
    response.json().then((dataFromApi) => {
      futureData = dataFromApi
      printFutureWeather(dataFromApi)
      if ($(window).width() < 800) {
        hideSearchArea()
      }
    })
  }
  fetch(urlFuture).then(whenDataArrives)
}

//this function prints the future weather fetched from second API on the screen below current day weather
function printFutureWeather(data) {
  let daily = data.daily
  let appendStr = ""

  for (let i = 0; i < 5; i++) {
    appendStr += `<div>
                  <h5>${moment.unix(data.daily[i].dt).format("DD/MM/YYYY")}</h5>
                  <img src="http://openweathermap.org/img/w/${
                    daily[i].weather[0].icon
                  }.png"</img>
                  <p>Temp: ${daily[i].temp.day} <span>&#176;</span>F</p>
                  <p>Wind ${daily[i].wind_speed}MPH</p>
                  <p>Humidity ${daily[i].humidity}%</p>
                </div>`
  }

  $(".weather-cards-wrapper").html(appendStr)
}

//this function extract the text typed in the searchbar and do the API call to the server
function handleSearch(city) {
  let area = null
  if (city) {
    area = city
  } else {
    area = $("#searchBar").val()
  }

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${area}&APPID=${apiId}&units=imperial`
  callFirstAPI(url)
}

//this function checks for duplicate in cityArr and save the searched city in the localstorage if it is unique 
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cityArr"))
  if (cities.indexOf(city) === -1) {
    cities.push(city)
    localStorage.setItem("cityArr", JSON.stringify(cities))
    getStoredCities()
  }
}

//this function get the stored cities from the localstorarge and prints them below the search bar
function getStoredCities() {
  if (localStorage.getItem("cityArr") === null) {
    localStorage.setItem("cityArr", JSON.stringify([]))
    return
  }
  let cities = JSON.parse(localStorage.getItem("cityArr"))

  let str = ""
  for (let i = 0; i < cities.length; i++) {
    str += `<button class="search-btn stored-city-style" onclick="handleSearch('${cities[i]}')">${cities[i]}</button>`
  }

  $(".savedCities").html(str)
}

//this function hides the search section
function hideSearchArea() {
  $(".search-area").hide()
}

//this function hides the search section
function showSearchArea() {
  $(".search-area").show()
}

//default function that need to be run setup this app
function initRun(){
  $(window).resize(function () {
    if ($(window).width() < 800) {
      hideSearchArea()
    } else {
      showSearchArea()
    }
  })
  
  $(".small-search-screen-enabler").click(showSearchArea)
  $(".search-screen-close-button").click(hideSearchArea)
}

//run below functions when document is ready to be used
$(document).ready(() => {
  initRun()
  getStoredCities()
})


//todo 