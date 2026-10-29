function getWeatherInfo(code) {
    if (code === 0) { return { icon: "☀️", text: "Klar" }; }
    if (code <= 2) { return { icon: "🌤️", text: "Leicht bewölkt" }; }
    if (code === 3) { return { icon: "☁️", text: "Bedeckt" }; }
    if (code <= 48) { return { icon: "☁️", text: "Nebel" }; }
    if (code <= 57) { return { icon: "🌦️", text: "Nieselregen" }; }
    if (code <= 67) { return { icon: "🌧️", text: "Regen" }; }
    if (code <= 77) { return { icon: "❄️", text: "Schnee" }; }
    if (code <= 82) { return { icon: "🌧️", text: "Regenschauer" }; }
    if (code <= 86) { return { icon: "🌨️", text: "Schneeschauer" }; }
    return { icon: "⛈️", text: "Gewitter" };
}