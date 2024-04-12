// c1440bd800730d57893df9d23fa3e479 :: API Key
const todaySection = $('.today'); // append today's weather here
const fiveDay = $('#five-day'); // append 5 day forecast title here
const future = $('#future-forecast'); // append 5 day forecast here
const searchForm = $('#search-form'); // DOM element for search form
const cityName = $('#city-name'); // input value from search
const apiKey = 'c1440bd800730d57893df9d23fa3e479'

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
  const requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.val()}&appid=${apiKey}`;
  console.log(requestURL);

  fetch(requestURL)
    .then(response => {
      return response.json();
    })

    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        let city = {
          city: obj.name,
          lon: obj.lon,
          lat: obj.lat
        };

        let citiesArr = readCitiesFromStorage()
        citiesArr.push(city);
        saveCitiesToStorage(citiesArr)
        const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&appid=${apiKey}`;
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

// weatherData = localStorage.getItem('')
// // console.log(cities)
// let day = 1712836800 % 86400;
// let newArr = cities.list.filter(time => time.dt % 86400 === day);
// console.log(newArr)

function todayWeather(){
  let weatherData = JSON.parse(localStorage.getItem('weatherSearch'));
  let today = $('<div>');
  today.attr('id', 'today');
  let h2 = $('<h2>');
  h2.addClass('fw-bold').text(`${weatherData.city.name} (${dayjs.unix(weatherData.list[0].dt).format('MM/DD/YYYY')}) `);
  h2.appendTo(today);
  let icon = $('<div>');
  icon.attr('id',weatherData.list[0].weather[0].icon);
  icon.appendTo()

  today.appendTo(todaySection);
}














searchForm.on('click', '.btn', function (e) {
  e.preventDefault();

  getGeoApi();
  todayWeather();
  cityName.val('');
})

// getGeoApi();