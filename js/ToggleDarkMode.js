function ToggleDarkMode() {
    document.querySelector(".PageBody").classList.toggle("dark-mode");
	document.querySelector(".gradient").classList.toggle("dark-mode");

	    // Save the current state
    const isDarkMode = document.querySelector(".PageBody").classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");
}