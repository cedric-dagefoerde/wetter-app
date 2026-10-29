const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

function showView(id) {
    document.querySelectorAll("main > section").forEach(function (section) {
        section.classList.add("hidden");
    });
    document.getElementById(id).classList.remove("hidden");
}

async function getCoordinates(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.results) {
        throw new Error("Stadt nicht gefunden");
    }
    return data.results[0];
}

async function getWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,apparent_temperature,weather_code&timezone=auto&forecast_days=7`;
    const response = await fetch(url);
    return await response.json();
}
function formatWeekday(dateString, index) {
    if (index === 0) {
        return "Heute";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", { weekday: "long", timeZone: "UTC" });
}

function renderWeek(weather) {
    const dayList = document.getElementById("day-list");
    dayList.innerHTML = "";
    weather.daily.time.forEach(function (date, index) {
        const info = getWeatherInfo(weather.daily.weather_code[index]);
        const max = Math.round(weather.daily.temperature_2m_max[index]);
        const min = Math.round(weather.daily.temperature_2m_min[index]);

        const item = document.createElement("li");
        item.innerHTML = `
            <button type="button" class="day-item">
                <span class="day-icon">${info.icon}</span>
                <span class="day-name">${formatWeekday(date, index)}</span>
                <span class="day-temp">${max}° / ${min}°</span>
            </button>`;
        item.querySelector("button").addEventListener("click", function () {
            console.log("Tag angeklickt:", index);
        });
        dayList.appendChild(item);
    });
}
searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
        return;
    }
    try {
        const place = await getCoordinates(city);
        const weather = await getWeather(place.latitude, place.longitude);
        document.getElementById("forecast-city").textContent = place.name;
        renderWeek(weather);
        showView("forecast");
    } catch (error) {
        console.log("Fehler:", error.message);
    }
});

document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
        cityInput.value = chip.textContent;
        searchForm.requestSubmit();
    });
});

document.getElementById("back-home").addEventListener("click", function () {
    showView("home");
});