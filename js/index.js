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