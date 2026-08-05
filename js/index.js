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

$(document).ready(function(){
    
    $('.Header').load("/html/header.html");
    $('.SideBars').load("/html/sideBar.html", function() {
        // Sidebar has finished loading
        loadTemperatureData();
    });
    $('Footer').load("/html/footer.html");
});

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

}, 5000);


    // Move to next province
    currentProvinceIndex++;

    // Loop back to first province
    if (currentProvinceIndex >= provinces.length) {
        currentProvinceIndex = 0;
    }
}

async function loadTemperatureData() {
    const response = await fetch("/data/json/mampulan_temperature.json");
    temperatureData = await response.json();

    // Display immediately
    displayTodayTemperature();

    // Change province every 5 seconds
    setInterval(displayTodayTemperature, 5000);
}
// Fun Fact

var path = "/data/fun_fact.csv";
let delimiter = "|";
var longText = [];


function parsePhraseCSV(text, delimiter){
    
    var FunFacts = new Array();
    
    FunFacts = text.trim().split('\n').map(line => line.split(delimiter));
    return FunFacts;
}

var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        longText = parsePhraseCSV(this.responseText,delimiter);
        valueCallBack(longText);
    }
  };
  xhttp.open("GET", path, true);
  xhttp.send();

function valueCallBack(longText){
    
}



function randomFunFact() {
    const statement = longText[0][Math.floor(Math.random() * longText[0].length)];
    const factBox = document.getElementById("FunFactStatement");

    factBox.classList.remove("fact-showing");
    factBox.classList.add("fact-changing");

    setTimeout(() => {
        factBox.innerHTML = "💡 " + statement;

        factBox.classList.remove("fact-changing");
        factBox.classList.add("fact-showing");
    }, 200);
}