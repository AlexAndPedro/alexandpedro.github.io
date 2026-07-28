const provinces = ["Pangilan", "Asolan", "Dapangisangado", "Lobolan", "Horibama"];
let currentProvinceIndex = 0;
let temperatureData = [];

async function displayTodayTemperature() {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.toLocaleString("en-US", { month: "long" });
    const day = today.getDate();

    const province = provinces[currentProvinceIndex];

    const record = temperatureData.find(item =>
        item.province === province &&
        item.month === month &&
        item.day === day
    );

	const dateOutput = document.getElementById("temperature_date");
	const tempOutput = document.getElementById("temperature_value");

    if (!dateOutput || !tempOutput) {
        console.error("Temperature divs not found");
        return;
    }

// Date does not fade
dateOutput.innerHTML = `
    ${year} ${month} ${day}
`;

// Temperature fades
tempOutput.classList.add("fade");

setTimeout(() => {

    if (record) {
        tempOutput.innerHTML = `
            ${province}: ${record.temperature_celsius}&deg;C
        `;
    } else {
        tempOutput.innerHTML = `
            ${province}: ${Math.round(Math.random() * 30)}&deg;C
        `;
    }

    tempOutput.classList.remove("fade");

}, 1000);


    // Move to next province
    currentProvinceIndex++;

    // Loop back to first province
    if (currentProvinceIndex >= provinces.length) {
        currentProvinceIndex = 0;
    }
}

window.loadTemperatureData = async function() {
    console.log("Loading weather");

    const response = await fetch("/data/json/mampulan_temperature.json");
    temperatureData = await response.json();

    console.log("Weather data:", temperatureData);

    displayTodayTemperature();

    setInterval(displayTodayTemperature, 10000);
}


console.log("mampulanWeather.js loaded");