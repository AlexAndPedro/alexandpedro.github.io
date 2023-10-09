// Function to generate a random fun fact

function randomFunFact(){	
	
	var funFactsList = [
		"Pedro may seem funny and cool, but when he serious, watch out!",
		"Alex still does get why he is not allowed to eat chocolate.",
		"Pawesome's secret identity is ______.",
		"The Facebook page of Alex and Pedro was made on July 8, 2015.",
		"The Tumblr page of Alex and Pedro was made on December 28, 2015.",
		"Pawesome made a first appearance at San Juanito City when Pedro was still in high school.",		
		"Pedro have a school classroom and a part of his bedroom dedicated to research of Pawesome's secret identity.",
		"There is an article of me in MetroPets! Link <a href = \"http://www.metro-pets.com/metropets-discoveries/the-adventures-of-alex-and-pedro\">here</a>.",
		"Pangil and Ertle are best of friends.",
		"Pedro has his own classroom for Pawesome Club.",
		"Ertle might be dumb, but he has a big heart.",
		"Alex's blood type is DEA 1.1+",
		"Alex is a dog.",
		"Pedro is a human.",
		"Pangil is a wolf.",
		"Ertle is a box turtle.",
		"Pangil has an arm tumor called Ertle.",
		"Pangil's name came from the fact that he is a wolf.",
		"Pangil gnaw the bones of his enemies.",
		"Alex and Pangil are more than friends.[citation needed]",
		"Pangil only used 0.575 J of work.",
		"It weighs about a pound.",
		"Alex loves McChicken burgers and McChicken texts.",
		"Pangilan is a province located west of the main landmass called Mampulan.",
		"Alex's last name is Paws.",
		"Milochitas Swiff is one of the best fast delivery mailcheetah in the job."
		];
	
		//number multiplied must be 1 more than number in array index.
	var statement = funFactsList[Math.floor(Math.random() * funFactsList.length)];
	document.getElementById("FunFactStatement").innerHTML = statement;
}

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

function ToggleDarkMode() {
	var element = document.getElementsByClassName("PageBody")[0].classList;
	element.toggle("dark-mode");
 }