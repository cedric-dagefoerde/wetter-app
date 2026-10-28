const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    console.log("Gesucht wird:", city);
});

document.querySelectorAll(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
        cityInput.value = chip.textContent;
        searchForm.requestSubmit();
    });
});