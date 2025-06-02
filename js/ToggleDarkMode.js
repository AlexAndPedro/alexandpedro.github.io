function ToggleDarkMode() {
	var elementBody = document.getElementsByClassName("PageBody")[0].classList;
	elementBody.toggle("dark-mode");
	var elementGradient = document.getElementsByClassName("gradient")[0].classList;
    elementGradient.toggle("dark-mode");
	var elementContent = document.getElementsByClassName("PageContent")[0].classList;
    elementContent.toggle("dark-mode");
	var elementBanner = document.getElementsByClassName("PageBanner")[0].classList;
    elementBanner.toggle("dark-mode");
	var elementComicTitle = document.getElementsByClassName("ComicTitle")[0].classList;
	console.log(elementComicTitle);
    elementComicTitle.toggle("dark-mode");
	var elementNavigation = document.getElementsByClassName("Navigation")[0].classList;
    elementNavigation.toggle("dark-mode");

 }