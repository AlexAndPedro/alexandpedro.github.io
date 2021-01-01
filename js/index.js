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
		"Alex loves McChicken burgers and McChicken texts."
		];
	
	var statement = funFactsList[Math.floor(Math.random() * funFactsList.length)]; //number multiplied must be 1 more than number in array index.
	document.getElementById("FunFactStatement").innerHTML = statement;
}


function lockPanel(buttonNumber){
	
	//Changes the text of the lock button to "Locked" and "Unlocked"
		
	if(document.getElementById("panel" + buttonNumber).innerHTML == "Unlocked"){
	
		document.getElementById("panel" + buttonNumber).innerHTML = "Locked"
	
	} else {
	
		document.getElementById("panel" + buttonNumber).innerHTML = "Unlocked"
	
	}

}

// Function to generate random comic image

function getRandomImage(ARR_LENGTH) { 
	
	//Makes the Unlocked/Locked buttons visible
	document.getElementById("panel1").style.display = "inline";
	document.getElementById("panel2").style.display = "inline";
	document.getElementById("panel3").style.display = "inline";
								
	var panelNumber = [];
	var numberIndex;
	var a;
	// getting the file of the previous iteration
	var comicPanel = [document.getElementById("ComicPanel1"),
						document.getElementById("ComicPanel2"),
						document.getElementById("ComicPanel3")];

	for (i = 0; i < ARR_LENGTH; i++) {									
		panelNumber[i] = i + 1;
	}

	for (i = 0; i < 3; i++){
		if(document.getElementById("panel" + (i + 1)).innerHTML == "Unlocked"){
			numberIndex = Math.floor(Math.random() * panelNumber.length);
			comicPanel[i] = panelNumber[numberIndex];
			panelNumber.splice(numberIndex, 1);
		} else {
			//gets filename of the original comic panel
			a = comicPanel[i].src.split("/");
			comicPanel[i] = a[comicPanel[i].src.split("/").length-1].split(".")[0];
		}
	}
	

	// Write them to the document
	document.getElementById("RandomComic").innerHTML =
		(
		'<img id="ComicPanel1" src="/images/random_comic_panels/' + comicPanel[0] + '.png" width="33%" height="auto">'+
		'<img id="ComicPanel2" src="/images/random_comic_panels/' + comicPanel[1] + '.png" width="33%" height="auto">'+
		'<img id="ComicPanel3" src="/images/random_comic_panels/' + comicPanel[2] + '.png" width="33%" height="auto">'
		);
}