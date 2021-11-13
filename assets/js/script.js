let apiId = "a248938f43b3027a2f331d88df42b72b"
let url1 = `https://api.openweathermap.org/data/2.5/weather?q=sacramento&APPID=${apiId}&units=imperial`

let data = null
let futureData = null

function init() {
  let whenDataArrives = function (response) {
    response.json().then((dataFromApi) => {
      console.log(dataFromApi)
      data = dataFromApi
      displayOnScreen()
      fetchFutureWeather(dataFromApi)
    })
  }
  fetch(url1).then(whenDataArrives)
}

$(document).ready(init)

function displayOnScreen() {
  $(".current-day-weather").html(
    ` <h2>${data.name}</h2>
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
    // console.log(moment(daily[i].dt).format('MM/DD/YYYY'))
    console.log(Date(daily[i].dt))
    console.log("")


    appendStr += `<div>
                  <h5>${daily[i].dt}</h5>
                  <p>${daily[i].weather[0].icon}</p>
                  <p>Temp: ${daily[i].temp.day} <span>&#176;</span>F</p>
                  <p>Wind ${daily[i].wind_speed}MPH</p>
                  <p>Humidity ${daily[i].humidity}%</p>
                </div>`
  }

  $(".weather-cards-wrapper").html(appendStr)
}
