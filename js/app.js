const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const errorMessage = document.getElementById("error-message");

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

function renderWeek(weather, place) {
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
                 <span class="day-name">${formatWeekday(date, index)}<small>${info.text}</small></span>
                <span class="day-temp"><strong>${max}°</strong> ${min}°</span>
            </button>`;
        item.querySelector("button").addEventListener("click", function () {
            renderDetail(weather, place, index);
            showView("detail");
        });
        dayList.appendChild(item);
    });
}
function renderDetail(weather, place, dayIndex) {
    const daily = weather.daily;
    const hourly = weather.hourly;
    const firstHour = dayIndex * 24;

    let temp, feels, code, label;
    if (dayIndex === 0) {
        temp = weather.current.temperature_2m;
        feels = weather.current.apparent_temperature;
        code = weather.current.weather_code;
        label = "Aktuell";
    } else {
        temp = hourly.temperature_2m[firstHour + 12];
        feels = hourly.apparent_temperature[firstHour + 12];
        code = hourly.weather_code[firstHour + 12];
        label = "Mittags um 12 Uhr";
    }
    const info = getWeatherInfo(code);
    const dateText = new Date(daily.time[dayIndex]).toLocaleDateString("de-DE", { day: "numeric", month: "long", timeZone: "UTC" });

    document.getElementById("detail-day").textContent = formatWeekday(daily.time[dayIndex], dayIndex);
    document.getElementById("detail-sub").textContent = dateText + " · " + place.name;
    document.getElementById("detail-icon").textContent = info.icon;
    document.getElementById("detail-text").textContent = info.text;
    document.getElementById("detail-temp").textContent = Math.round(temp) + "°";
    document.getElementById("detail-label").textContent = label;
    document.getElementById("detail-feels").textContent = Math.round(feels) + "°";
    document.getElementById("detail-min").textContent = Math.round(daily.temperature_2m_min[dayIndex]) + "°";
    document.getElementById("detail-max").textContent = Math.round(daily.temperature_2m_max[dayIndex]) + "°";

    const hourList = document.getElementById("hour-list");
    hourList.innerHTML = "";
    for (let hour = 0; hour < 24; hour++) {
        const i = firstHour + hour;
        const hourInfo = getWeatherInfo(hourly.weather_code[i]);
        const item = document.createElement("li");
        item.innerHTML = `
            <span class="hour-time">${hourly.time[i].slice(11)}</span>
            <span class="hour-icon">${hourInfo.icon}</span>
            <strong class="hour-temp">${Math.round(hourly.temperature_2m[i])}°</strong>
            <span class="hour-feels">Gefühlt ${Math.round(hourly.apparent_temperature[i])}°</span>`;
        hourList.appendChild(item);
    }
}

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (!city) {
        return;
    }
    errorMessage.classList.add("hidden");
    try {
        const place = await getCoordinates(city);
        const weather = await getWeather(place.latitude, place.longitude);
        document.getElementById("forecast-city").textContent = place.name;
        renderWeek(weather, place);
        showView("forecast");
    } catch (error) {
        if (error.message === "Stadt nicht gefunden") {
            errorMessage.textContent = "Stadt nicht gefunden. Bitte prüfe die Schreibweise.";
        } else {
            errorMessage.textContent = "Wetterdaten konnten nicht geladen werden. Bitte versuche es später noch einmal.";
        }
        errorMessage.classList.remove("hidden");
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
document.getElementById("back-forecast").addEventListener("click", function () {
    showView("forecast");
});