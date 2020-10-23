// Function to generate a random fun fact

function randomFunFact(){	
	
	var funFactsList = [
		"Alex Paws was a Christmas present from Pedro's father.",
		"Pedro may seem funny and cool, but when he serious, watch out!",
		"Alex still does get why he is not allowed to eat chocolate.",
		"Pawesome's secret identity is ______.",
		"The Facebook page of Alex and Pedro was made on July 8, 2015.",
		"The Tumblr page of Alex and Pedro was made on December 28, 2015.",
		"Pawesome made a first appearance at San Juanito City when Pedro was still in high school.",		
		"Pedro have a school classroom and a part of his bedroom dedicated to research of Pawesome's secret identity.",
		"There is an article of me in MetroPets! Link <a href = \"http://www.metro-pets.com/metropets-discoveries/the-adventures-of-alex-and-pedro\">here</a>.",
		"Pangil and Ertle are best of friends.",
		"Pedro has hia own classroom for Pawesome Club.",
		"Ertle might be dumb, but he has a big heart.",
		"Alex's blood type is DEA 1.1+",
		"Alex is a dog.",
		"Pedro is a human.",
		"Pangil is a wolf.",
		"Ertle is a box turtle.",
		"Pangil has an arm tumor called Ertle.",
		"Pangil's name came from the fact that he is a wolf.",
		"Pangil gnaw the bones of his enemies."
		];
	
	var statement = funFactsList[Math.floor(Math.random() * funFactsList.length)]; //number multiplied must be 1 more than number in array index.
	document.getElementById("FunFactStatement").innerHTML = statement;
}

// Function to generate random comic image

function getRandomImage() { 

ARR_LENGTH = 54;
  // Generate the three comic panel indices randomly
  var comic1 = Math.floor(Math.random() * ARR_LENGTH) + 1;
  var comic2 = Math.floor(Math.random() * ARR_LENGTH) + 1;
  var comic3 = Math.floor(Math.random() * ARR_LENGTH) + 1;
  
  
  // Write them to the document
  document.getElementById("RandomComic").innerHTML =
	('<img class="ComicPanel" src="../images/Comic_Image_English/test/Slide' + comic1 +
	'.PNG" width="32%" height="auto"> <img class="ComicPanel" src="../images/Comic_Image_English/test/Slide' + comic2 +
	'.PNG" width="32%" height="auto"> <img class="ComicPanel" src="../images/Comic_Image_English/test/Slide' + comic3 +
	'.PNG" width="32%" height="auto">'
	);
}
