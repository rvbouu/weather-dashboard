// c1440bd800730d57893df9d23fa3e479 :: API Key
const today = $('#today'); // append today's weather here
const fiveDay = $('#five-day'); // append 5 day forecast title here
const future = $('#future-forecast'); // append 5 day forecast here
const searchForm = $('#search-form'); // DOM element for search form
const cityName = $('#city-name'); // input value from search

// gets cities array from localStorage and returns it
function readCitiesFromStorage() {
  let stringData = localStorage.getItem('cities');
  let cities = JSON.parse(stringData) || [];
  return cities;
}

// saves cities array to localStorage
function saveCitiesToStorage(cities) {
  let savedCities = JSON.stringify(cities);
  localStorage.setItem('cities', savedCities);
}

// gets city's longitude and latitude, saves it into an object, and updates cities array
function getGeoApi() {
  const requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.val()}&appid=c1440bd800730d57893df9d23fa3e479`;
  console.log(requestURL);

  fetch(requestURL)
    .then(response => {
      return response.json();
    })

    .then(data => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&appid=c1440bd800730d57893df9d23fa3e479&units=imperial`;
        return fetch(requestURL);
      }
    })

    .then(response => {
      return response.json();
    })

    .then(function(data2) {
      console.log(data2);
      localStorage.setItem('weatherSearch', JSON.stringify(data2))
    })
    
    .catch(function (error) {
      console.log(error);
      alert('An error has occured.');
    });
}

// function getWeatherApi(city) {
//   const city = getGeoApi();
//   console.log(`City Object: ${city}`);

//   const requestURL = `api.openweathermap.org/data/2.5/forecast/daily?lat=${city.lat}&lon=${city.lon}&cnt=6&appid=c1440bd800730d57893df9d23fa3e479&units=imperial`;

//   fetch(requestURL)
//     .then(function (response) {
//       return response.json();
//     })

//     .then(function (data) {
//       console.log(data);

//     const h3 = $('<h3>');
//     h3.addClass('fw-bold').text('5 Day Forecast:').appendTo(fiveDay);

//     for (let i = 0; i < data.length; i++) {
//       const obj = data[i];
//       let date = dayjs.unix(obj.list.dt).format('MM/DD/YYYY')
//       let type = obj.list.weather.icon;
//       let temp = obj.list.main.temp;
//       let wind = obj.list.wind.speed;
//       let hum = obj.list.main.humidity;

//       const weatherCard = $('<div>');
//       weatherCard.addClass('future').addClass('text-white');

//       const h4 = $('<h4>');
//       h4.addClass('fw-bold').text(date).appendTo(weatherCard);

//       const icon = $('<p>');
//       icon.text(type).appendTo(weatherCard);

//       const pTemp = $('<p>');
//       pTemp.text(`Temp: ${temp}°F`).appendTo(weatherCard);

//       const pWind = $('<p>');
//       pWind.text(`Wind: ${wind} MPH`).appendTo(weatherCard);

//       const pHum = $('<p>');
//       pHum.text(`Humidity: ${hum}%`).appendTo(weatherCard);
//     };
//     })

//     .catch(function (error) {
//       console.log(error);
//       alert('An error has occured.');
//     });


// }

searchForm.on('click', '.btn', function (e) {
  e.preventDefault();

  getGeoApi();
  cityName.val('');
})

// getGeoApi();