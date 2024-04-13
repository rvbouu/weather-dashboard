// c1440bd800730d57893df9d23fa3e479 :: API Key
const todaySection = $('.today'); // append today's weather here
const fiveDay = $('#five-day'); // append 5 day forecast title here
const future = $('#future-forecast'); // append 5 day forecast here
const searchForm = $('#search-form'); // DOM element for search form
const cityName = $('#city-name'); // input value from search
const apiKey = 'c1440bd800730d57893df9d23fa3e479';

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
  const requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.val()}&appid=${apiKey}&units=imperial`;
  console.log(requestURL);

  fetch(requestURL)
    .then(response => {
      return response.json();
    })

    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        let city = {
          id: crypto.randomUUID(),
          city: obj.name,
          lon: obj.lon,
          lat: obj.lat
        };

        let citiesArr = readCitiesFromStorage()
        citiesArr.unshift(city);
        saveCitiesToStorage(citiesArr)
        const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&appid=${apiKey}&units=imperial`;
        return fetch(requestURL);
      }
    })

    .then(response => {
      return response.json();
    })

    .then(function (data2) {
      console.log(data2);
      removeDuplicates();
      localStorage.setItem('weatherSearch', JSON.stringify(data2));
      todayWeather();
      fiveDayWeather();
      createSearchHistory()
    })

    .catch(function (error) {
      console.log(error);
      alert('An error has occured.');
    });
}


function todayWeather() {
  let weatherData = JSON.parse(localStorage.getItem('weatherSearch'));
  console.log(weatherData)
  let today = $('<div>');
  today.attr('id', 'today').addClass('text-black');
  let todayForecast = $('<div>')
  todayForecast.attr('id', 'today-forecast');
  let h2 = $('<h2>');
  h2.addClass('fw-bold m-3').text(`${weatherData.city.name} (${dayjs.unix(weatherData.list[0].dt).format('MM/DD/YYYY')}) `);
  h2.appendTo(today);
  let icon = $('<div>');
  icon.addClass(`w${weatherData.list[0].weather[0].icon}`);
  let temp = $('<p>');
  temp.text(`Temp: ${weatherData.list[0].main.temp}°F`).appendTo(todayForecast);
  let wind = $('<p>');
  wind.text(`Wind: ${weatherData.list[0].wind.speed} MPH`).appendTo(todayForecast);
  let hum = $('<p>');
  hum.text(`Humidity: ${weatherData.list[0].main.humidity}%`).appendTo(todayForecast);
  icon.appendTo(today);
  today.appendTo(todaySection);
  todayForecast.appendTo(todaySection);
  todaySection.addClass('border border-dark')
}

function fiveDayWeather() {
  let h2 = $('<h2>');
  h2.addClass('fw-bold five-head').text('5-Day Forecast').appendTo(fiveDay)
  let weatherData = JSON.parse(localStorage.getItem('weatherSearch'));
  let fiveArray = weatherData.list.filter(time => time.dt % 86400 === 43200)
  console.log(fiveArray)
  for (i = 0; i < fiveArray.length; i++) {
    const futureForecast = $('#future-forecast');
    let div = $('<div>');
    div.addClass('future p-1 text-white');
    let h3 = $('<h3>');
    h3.addClass('fw-bold').text(dayjs.unix(fiveArray[i].dt + 86400).format('MM/DD/YYYY')).appendTo(div);
    let icon = $('<div>');
    icon.addClass(`w${fiveArray[i].weather[0].icon}`).appendTo(div);
    let temp = $('<p>');
    temp.text(`Temp: ${fiveArray[i].main.temp}°F`).appendTo(div);
    let wind = $('<p>');
    wind.text(`Wind: ${fiveArray[i].wind.speed} MPH`).appendTo(div);
    let hum = $('<p>');
    hum.text(`Humidity: ${fiveArray[i].main.humidity}%`).appendTo(div);

    div.appendTo(futureForecast);
  }
}

function removeDuplicates() {
  let cities = readCitiesFromStorage();
  let cityName = cities.map(({ city }) => city);
  let filtered = cities.filter(({ city }, i) => !cityName.includes(city, i + 1));
  let filtered10 = filtered.slice(0, 10);
  console.log(filtered10);
  return saveCitiesToStorage(filtered10);
}

// search bar history
function createSearchHistory() {
  let cities = readCitiesFromStorage();
  const searchHist = $('#search-hist');

  for (let i = 0; i < cities.length; i++) {
    const div = $('<div>');
    div.addClass('d-grid gap-2 history').attr('data-city-id', cities[i].id);

    const button = $('<button>');
    button.addClass('btn btn-secondary mb-3 search-hist-btn').attr('type', 'submit').attr('data-city-id', cities[i].id).text(cities[i].city);
    button.appendTo(div);
    div.appendTo(searchHist);
  }
}

function handleSearch() {
  const cityButton = $(this).attr('data-city-id');
  const cities = readCitiesFromStorage();
  // console.log(cityButton)

  let coords = cities.filter(function (city) {

    if (city.id === cityButton) {
      return city;
    }
  })
  console.log(coords);
  console.log(coords[0].lat);
  const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${apiKey}&units=imperial`;
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      removeDuplicates();
      localStorage.setItem('weatherSearch', JSON.stringify(data));
      todayWeather();
      fiveDayWeather();
      createSearchHistory()
    })
}

createSearchHistory();

searchForm.on('click', '.btn', function (e) {
  e.preventDefault();

  $('#today').remove();
  $('#today-forecast').remove();
  $('.five-head').remove();
  $('.future').remove();
  $('.history').remove()
  getGeoApi();
  cityName.val('');
})

$('#search-hist').on('click', '.search-hist-btn', handleSearch)

$('#search-hist').on('click', '.search-hist-btn', function (e) {
  e.preventDefault();
  $('#today').remove();
  $('#today-forecast').remove();
  $('.five-head').remove();
  $('.future').remove();
  $('.history').remove();
})