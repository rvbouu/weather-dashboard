const todaySection = $('.today'); // append today's weather here
const fiveDay = $('#five-day'); // append 5 day forecast title here
const future = $('#future-forecast'); // append 5 day forecast here
const searchForm = $('#search-form'); // DOM element for search form
const cityName = $('#city-name'); // input value from search
const apiKey = 'c1440bd800730d57893df9d23fa3e479'; // api key for openweathermaps

// gets cities array from localStorage and returns it
function readCitiesFromStorage() {
  let stringData = localStorage.getItem('cities'); // gets stringData from localStorage
  let cities = JSON.parse(stringData) || []; // parses data from localStorage; if none found, makes an empty array
  return cities;
}

// saves cities array to localStorage
function saveCitiesToStorage(cities) {
  let savedCities = JSON.stringify(cities); // stringifies savedCities array
  localStorage.setItem('cities', savedCities); // saves to localStorage under 'cities'
}

// gets city's longitude and latitude, saves it into an object, and updates cities array
function getGeoApi() {
  // api URL for getting longitude and latitude by city name
  const requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName.val()}&appid=${apiKey}&units=imperial`;
  console.log(requestURL);
// fetches data from api
  fetch(requestURL)
    .then(response => {
      return response.json(); // converts json array into js object/array
    })
    
    // takes the converted data and grabs the information needed for next api fetch
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        // object of variables needed for next api fetch and future functions
        let city = {
          id: crypto.randomUUID(),
          city: obj.name,
          lon: obj.lon,
          lat: obj.lat
        };
        // gets array from localStorage
        let citiesArr = readCitiesFromStorage();
        // adds latest searched city to the beginning of array
        citiesArr.unshift(city);
        // saves citiesArr to localStorage
        saveCitiesToStorage(citiesArr);
        // next api URL to get the 5 day forecast for searched city
        const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${obj.lat}&lon=${obj.lon}&appid=${apiKey}&units=imperial`;
        return fetch(requestURL);
      }
    })
    .then(response => {
      return response.json();
    })
    .then(function (data2) {
      console.log(data2);
      // calls removeDuplicates function
      removeDuplicates();
      // stringifies new data from second api fetch and saves it to localStorage under 'weatherSearch'
      localStorage.setItem('weatherSearch', JSON.stringify(data2));
      // calls todayWeather function
      todayWeather();
      // calls fiveDayWeather function
      fiveDayWeather();
      // calls creatSearchHistory function
      createSearchHistory();
    })
    // catches errors and alerts user
    .catch(function (error) {
      console.log(error);
      alert('An error has occured. Please check city name spelling.');
    });
}

// function to create today's weather portion of page
function todayWeather() {
  // gets weatherSearch data from localStorage and parses it
  let weatherData = JSON.parse(localStorage.getItem('weatherSearch'));
  console.log(weatherData);
  // div tag to hold header and weather icon
  let today = $('<div>');
  // id='today' and sets text to black
  today.attr('id', 'today').addClass('text-black');
  // div tag to hold weather forecast data
  let todayForecast = $('<div>');
  // id='today-forecast'
  todayForecast.attr('id', 'today-forecast');
  // h2 tag for date and city name
  let h2 = $('<h2>');
  // sets text to bold and margin-3; sets text to city name and date in MM/DD/YYYY format
  h2.addClass('fw-bold m-3').text(`${weatherData.city.name} (${dayjs.unix(weatherData.list[0].dt).format('MM/DD/YYYY')}) `);
  // appends to today div
  h2.appendTo(today);
  // div to hold weather icon
  let icon = $('<div>');
  // sets class to weather icon link in CSS
  icon.addClass(`w${weatherData.list[0].weather[0].icon}`);
  // p tag for temp
  let temp = $('<p>');
  // sets text to temp in fahrenheit and appends to todayForecast div
  temp.text(`Temp: ${weatherData.list[0].main.temp}°F`).appendTo(todayForecast);
  // p tag for wind
  let wind = $('<p>');
  // sets text to wind in MPH and appends to todayForecast div
  wind.text(`Wind: ${weatherData.list[0].wind.speed} MPH`).appendTo(todayForecast);
  // p tag for humidity
  let hum = $('<p>');
  // sets text to humidity percentage and appends to todayForecast
  hum.text(`Humidity: ${weatherData.list[0].main.humidity}%`).appendTo(todayForecast);
  // appends weather icon to today div
  icon.appendTo(today);
  // appends today div to todaySection in html
  today.appendTo(todaySection);
  // appends todayForecast div to todaySection in html
  todayForecast.appendTo(todaySection);
  // adds a black border around entire section
  todaySection.addClass('border border-dark');
}
// function to create five day forecast cards
function fiveDayWeather() {
  // creates h2 for 5 Day Forecast title
  let h2 = $('<h2>');
  // sets text to bold and appends to fiveDay section in html
  h2.addClass('fw-bold five-head').text('5-Day Forecast').appendTo(fiveDay);
  // gets weatherSearch from localStorage and parses it
  let weatherData = JSON.parse(localStorage.getItem('weatherSearch'));
  // creates array from weatherData with only one object from each day
  let fiveArray = weatherData.list.filter(time => time.dt % 86400 === 43200);
  console.log(fiveArray)
  // for loop to create five day forecast cards
  for (i = 0; i < fiveArray.length; i++) {
    // calls DOM element for future appending
    const futureForecast = $('#future-forecast');
    // creates div and sets classes for styling and text white
    let div = $('<div>');
    div.addClass('future p-1 text-white');
    // h3 tag for date and sets text to bold and appends to div
    let h3 = $('<h3>');
    h3.addClass('fw-bold').text(dayjs.unix(fiveArray[i].dt + 86400).format('MM/DD/YYYY')).appendTo(div);
    // div tag for weather icon and appends it to main div
    let icon = $('<div>');
    icon.addClass(`w${fiveArray[i].weather[0].icon}`).appendTo(div);
    // p tag for temp in fahrenheit and appends to main div
    let temp = $('<p>');
    temp.text(`Temp: ${fiveArray[i].main.temp}°F`).appendTo(div);
    // p tag for wind in MPH and appends to main div
    let wind = $('<p>');
    wind.text(`Wind: ${fiveArray[i].wind.speed} MPH`).appendTo(div);
    // p tag for humidity percentage and appends to main div
    let hum = $('<p>');
    hum.text(`Humidity: ${fiveArray[i].main.humidity}%`).appendTo(div);
    // appends main div to DOM element
    div.appendTo(futureForecast);
  }
}

// function to remove duplicate cities from search history
function removeDuplicates() {
  // gets cities array from localStorage
  let cities = readCitiesFromStorage();
  // pulls out names of cities for easier search
  let cityName = cities.map(({ city }) => city);
  // filtered array with only one of each city in search
  let filtered = cities.filter(({ city }, i) => !cityName.includes(city, i + 1));
  // filters out 10 most recent searched cities
  let filtered10 = filtered.slice(0, 10);
  console.log(filtered10);
  return saveCitiesToStorage(filtered10);
}

// function to create search history buttons
function createSearchHistory() {
  // gets cities array from localStorage
  let cities = readCitiesFromStorage();
  // DOM element to append search history buttons to
  const searchHist = $('#search-hist');
  // for loop to make search history buttons with all elements in the array
  for (let i = 0; i < cities.length; i++) {
    // div tag to hold button and city id
    const div = $('<div>');
    div.addClass('d-grid gap-2 history').attr('data-city-id', cities[i].id);
    // button tag with city id and name appending to div
    const button = $('<button>');
    button.addClass('btn btn-secondary mb-3 search-hist-btn').attr('type', 'submit').attr('data-city-id', cities[i].id).text(cities[i].city);
    button.appendTo(div);
    // appending div to DOM element
    div.appendTo(searchHist);
  }
}

// function to handle api fetch when city button from search history
function handleSearch() {
  // gets id of city that is clicked
  const cityButton = $(this).attr('data-city-id');
  // gets cities array from localStorage
  const cities = readCitiesFromStorage();

  // sets coords to city object that matches the city id
  let coords = cities.filter(function (city) {
    if (city.id === cityButton) {
      return city;
    }
  })
  console.log(coords);
  console.log(coords[0].lat);
  // api URL to get search history city data
  const requestURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0].lat}&lon=${coords[0].lon}&appid=${apiKey}&units=imperial`;
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      // calls removeDuplicates function
      removeDuplicates();
      // sets updated weatherSearch to localStorage
      localStorage.setItem('weatherSearch', JSON.stringify(data));
      // calls todayWeather function
      todayWeather();
      // calls fiveDayWeather function
      fiveDayWeather();
      // calls createSearchHistory function
      createSearchHistory()
    });
}
// calls createSearchHistory function
createSearchHistory();

// event listener for form
searchForm.on('click', '.btn', function (e) {
  e.preventDefault();

  // clears DOM elements for repopulation
  $('#today').remove();
  $('#today-forecast').remove();
  $('.five-head').remove();
  $('.future').remove();
  $('.history').remove()
  // calls getGeoApi
  getGeoApi();
  // clears search input
  cityName.val('');
})

// event listener for search history buttons; calls handleSearch function
$('#search-hist').on('click', '.search-hist-btn', handleSearch)

// event listener for search history buttons; clears DOM elements for repopulation
$('#search-hist').on('click', '.search-hist-btn', function (e) {
  e.preventDefault();
  $('#today').remove();
  $('#today-forecast').remove();
  $('.five-head').remove();
  $('.future').remove();
  $('.history').remove();
})