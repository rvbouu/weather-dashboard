// c1440bd800730d57893df9d23fa3e479 :: API Key
const today = $('#today'); // append today's weather here
const fiveDay = $('#five-day'); // append 5 day forecast title here
const future = $('#future-forecast'); // append 5 day forecast here


function getGeoApi() {
  const cityName = $('#city-name');

  const requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},{country code}&limit={limit}&appid={c1440bd800730d57893df9d23fa3e479}`;

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        let city = {
          lon: obj.lon,
          lat: obj.lat
        }
        return city;
      };
    })

    .catch(function (error) {
      console.log(error);
      alert('An error has occured.');
    });
}

function getFiveDayApi() {
  const city = getGeoApi();

  const requestURL = `api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=6&appid=c1440bd800730d57893df9d23fa3e479&units=imperial`

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      console.log(data);

      const h3 = $('<h3>');
      h3.addClass('fw-bold').text('5 Day Forecast:').appendTo(fiveDay);

      for (let i = 0; i < data.length; i++) {
        const obj = data[i];
        let date = dayjs.unix(obj.list.dt).format('MM/DD/YYYY')
        let type = obj.list.weather.icon;
        let temp = obj.list.main.temp;
        let wind = obj.list.wind.speed;
        let hum = obj.list.main.humidity;

        const weatherCard = $('<div>');
        weatherCard.addClass('future').addClass('text-white');

        const h4 = $('<h4>');
        h4.addClass('fw-bold').text(date).appendTo(weatherCard);

        const icon = $('<p>');
        icon.text(type).appendTo(weatherCard);

        const pTemp = $('<p>');
        pTemp.text(`Temp: ${temp}°F`).appendTo(weatherCard);

        const pWind = $('<p>');
        pWind.text(`Wind: ${wind} MPH`).appendTo(weatherCard);

        const pHum = $('<p>');
        pHum.text(`Humidity: ${hum}%`).appendTo(weatherCard);
      };
    })

    .catch(function (error) {
      console.log(error);
      alert('An error has occured.');
    });


}