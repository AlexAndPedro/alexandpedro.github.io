window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.querySelector(".PageBody").classList.add("dark-mode");
        document.querySelector(".gradient").classList.add("dark-mode");
    }
});

function showHide() {
	var GalleryInfo = document.getElementById("ArtGalleryInfo");
	var displaySetting = GalleryInfo.style.display;
	var InfoButton = document.getElementById("ArtGalleryInfoButton");

	if(displaySetting == "none"){
		GalleryInfo.style.display = "inline-block";
		InfoButton.innerHTML = "Hide Info";
	} else {
		GalleryInfo.style.display = "none";
		InfoButton.innerHTML = "Show Info";
	}
}

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
	const locationOutput = document.getElementById("temperature_location");
	const tempOutput = document.getElementById("temperature_value");

// Date does not fade
dateOutput.innerHTML = `
    ${year} ${month} ${day}
`;

// Temperature fades
locationOutput.classList.add("fade");
tempOutput.classList.add("fade");

setTimeout(() => {

    if (record) {
        locationOutput.innerHTML = `
            ${province}
        `;        
		
		tempOutput.innerHTML = `
            ${record.temperature_celsius}&deg;C
        `;
    } else {
		locationOutput.innerHTML = `
            ${province}
        `;      
        tempOutput.innerHTML = `
            ${Math.round(Math.random() * 30)}&deg;C
        `;
    }

	locationOutput.classList.remove("fade");
    tempOutput.classList.remove("fade");

}, 1000);


    // Move to next province
    currentProvinceIndex++;

    // Loop back to first province
    if (currentProvinceIndex >= provinces.length) {
        currentProvinceIndex = 0;
    }
}

async function loadTemperatureData() {
    const response = await fetch("../data/json/mampulan_temperature.json");
    temperatureData = await response.json();

    // Display immediately
    displayTodayTemperature();

    // Change province every 5 seconds
    setInterval(displayTodayTemperature, 10000);
}

window.addEventListener("DOMContentLoaded", loadTemperatureData);