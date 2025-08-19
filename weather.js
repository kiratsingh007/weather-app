
const apiKey = "4f991c231afd58f91619b0e6a091720f";

const data1 = document.querySelector(".weather-data");
const cityel = document.querySelector("#city-name");
const formel = document.querySelector("form");
const icimg = document.querySelector(".icon");

// Handle form submit
formel.addEventListener("submit", (e) => {
    e.preventDefault();

    const cityvalue = cityel.value.trim();
    if (!cityvalue) {
        alert("Please enter a city name!");
        return;
    }

    getWeatherData(cityvalue);
    getForecast(cityvalue);
});

// Current weather function
async function getWeatherData(cityvalue) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityvalue}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found!");
        }

        const data = await response.json();
        const temperature = Math.floor(data.main.temp);
        const descr = data.weather[0].description;
        const icon = data.weather[0].icon;

        const details = [
            `Feels like: ${Math.floor(data.main.feels_like)}°C`,
            `Humidity: ${data.main.humidity}%`,
            `Wind speed: ${data.wind.speed} m/s`
        ];

        // Update DOM
        data1.querySelector(".temp").textContent = `${temperature}°C`;
        data1.querySelector(".desc").textContent = descr;
        icimg.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="${descr}">`;
        data1.querySelector(".details").innerHTML = details
            .map(detail => `<div>${detail}</div>`)
            .join("");

    } catch (err) {
        console.error("Error fetching weather data:", err);
        alert("Could not fetch weather data. Please try again.");
    }
}

// 4-day forecast function
async function getForecast(cityvalue) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityvalue}&units=metric&appid=${apiKey}`;
        const res = await fetch(forecastUrl);
        const data = await res.json();

        if (data.cod !== "200") {
            alert("Forecast not found!");
            return;
        }

        // Get 4 daily forecasts at 12:00 PM
        const dailyForecasts = data.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 4);

        const forecastDivs = document.querySelectorAll(".forecast .day");

        dailyForecasts.forEach((day, index) => {
            if (forecastDivs[index]) {
                const date = new Date(day.dt_txt);
                const weekday = date.toLocaleDateString(undefined, { weekday: "long" });

                forecastDivs[index].innerHTML = `
                    <p><b>${weekday}</b></p>
                    <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                    <p>${day.main.temp_max.toFixed(1)}°C / ${day.main.temp_min.toFixed(1)}°C</p>
                    <p>${day.weather[0].description}</p>
                `;
            }
        });

    } catch (err) {
        console.error("Error fetching forecast:", err);
        alert("Could not fetch forecast. Please try again.");
    }
}