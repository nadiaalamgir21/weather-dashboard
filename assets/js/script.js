let apiId = "a248938f43b3027a2f331d88df42b72b"
let area = "sacramento"
let url1 = `https://api.openweathermap.org/data/2.5/weather?q=${area}&APPID=${apiId}&units=imperial`
let data = null
let futureData = null

function callFirstAPI(url) {
  let whenDataArrives = function (response) {
    response.json().then((dataFromApi) => {
      console.log(dataFromApi)
      data = dataFromApi
      displayOnScreen()
      fetchFutureWeather(dataFromApi)
      saveCity(dataFromApi.name)
    })
  }
  fetch(url).then(whenDataArrives)
}

$(document).ready(() => {

  getStoredCities()
  callFirstAPI(url1)
})

function displayOnScreen() {
  $(".current-day-weather").html(
    ` <h2>${data.name}</h2>
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

//todo next api main send the long and lat data to the second api for future weather
//use booststrap

function fetchFutureWeather(EarlierData) {
  let coord = EarlierData.coord
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=hourly&appid=${apiId}&units=imperial`

  let whenDataArrives = function (response) {
    response.json().then((dataFromApi) => {
      console.log("future data =>", dataFromApi)
      futureData = dataFromApi
      printFutureWeather(dataFromApi)
    })
  }
  fetch(url).then(whenDataArrives)
}

function printFutureWeather(data) {
  let daily = data.daily
  let appendStr = ""

  for (let i = 0; i < 5; i++) {
    // console.log( moment.unix(data.daily[i].dt).format('DD/MM/YYYY'))
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

function handleSearch(city) {
  let area = null
  if (city) {
    area = city
  }else{
    area = $("#searchBar").val()
  }

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${area}&APPID=${apiId}&units=imperial`
  callFirstAPI(url)
}

function saveCity(city) {
  console.log("city", city)


  let cities = JSON.parse(localStorage.getItem('cityArr'))
  if(cities.indexOf(city) === -1){ 
  
    cities.push(city)
    localStorage.setItem('cityArr', JSON.stringify(cities))
    getStoredCities()
   
  }
  
}



// localStorage.setItem('cityArr', JSON.stringify(['Miami', 'Nevada', 'Utah']))

function getStoredCities() {
  if (localStorage.getItem("cityArr") === null){
    localStorage.setItem('cityArr', JSON.stringify([]))
    return
  } 
  let cities = JSON.parse(localStorage.getItem("cityArr"))

  let str = ""
  for (let i = 0; i < cities.length; i++) {
    str += `<button class="search-btn" onclick="handleSearch('${cities[i]}')">${cities[i]}</button>`
  }
  
  $(".savedCities").html(str)
}

//todo initial load main localstorage main stored list ko fetch karna hai DONE
//and to show on the screen DONE
//todo when saving localstorage main stored lost main duplication avoid
//if there is no duplication we will push to the list
//if the city already exist we will not the push to the list
