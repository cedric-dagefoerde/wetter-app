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