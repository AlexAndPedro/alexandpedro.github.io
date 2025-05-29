function ToggleDarkMode() {
	var elementBody = document.getElementsByClassName("PageBody")[0].classList;
	console.log(document.getElementsByClassName("PageBody"));
	elementBody.toggle("dark-mode");
	var elementGradient = document.getElementsByClassName("gradient")[0].classList;
    elementGradient.toggle("dark-mode");
 }