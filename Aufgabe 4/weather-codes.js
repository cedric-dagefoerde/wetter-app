function getWeatherInfo(code, isDay) {
    if (code === 0) { return { icon: isDay ? "sun" : "moon", text: "Klar" }; }
    if (code <= 2) { return { icon: isDay ? "cloud-sun" : "cloud-moon", text: "Leicht bewölkt" }; }
    if (code === 3) { return { icon: "cloud", text: "Bedeckt" }; }
    if (code <= 48) { return { icon: "cloud-fog", text: "Nebel" }; }
    if (code <= 57) { return { icon: "cloud-drizzle", text: "Nieselregen" }; }
    if (code <= 67) { return { icon: "cloud-rain", text: "Regen" }; }
    if (code <= 77) { return { icon: "cloud-snow", text: "Schnee" }; }
    if (code <= 82) { return { icon: isDay ? "cloud-sun-rain" : "cloud-moon-rain", text: "Regenschauer" }; }
    if (code <= 86) { return { icon: "cloud-snow", text: "Schneeschauer" }; }
    return { icon: "cloud-lightning", text: "Gewitter" };
}