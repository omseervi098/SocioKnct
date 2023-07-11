function WeatherApi() {
  const apiKey = "dc2b9624f8f4860d5ae5ddbc75cf4bc6";
  const main = document.getElementById("weathermain");
  const form = document.getElementById("weatherform");
  const search = document.getElementById("searchloc");

  const url = (city) =>
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  async function getWeatherByLocation(city) {
    const resp = await fetch(url(city), {
      origin: "cors",
    });
    const respData = await resp.json();

    addWeatherToPage(respData);
  }

  function addWeatherToPage(data) {
    const temp = Ktoc(data.main.temp);

    const weather = document.createElement("div");
    weather.classList.add("weather");

    weather.innerHTML = `
    
          <h2 class="m-0 p-0"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="img-fluid" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" class="img-fluid" /></h2>
          <small>${data.weather[0].main}</small>
          <small>${data.name}, ${data.sys.country}</small>

          `;

    // cleanup
    main.innerHTML = "";
    main.appendChild(weather);
  }

  function Ktoc(K) {
    return Math.floor(K - 273.15);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = search.value;

    if (city) {
      getWeatherByLocation(city);
    }
  });
  //   SET Mumbai when page loads
  getWeatherByLocation("Mumbai");
}
WeatherApi();
