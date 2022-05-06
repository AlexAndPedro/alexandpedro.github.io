function lockPanel(buttonNumber) {
	//Changes the text of the lock button to "Locked" or "Unlocked"
	if (document.getElementById("panel" + buttonNumber).innerHTML == "Unlocked") {
		document.getElementById("panel" + buttonNumber).innerHTML = "Locked"
	} else {
		document.getElementById("panel" + buttonNumber).innerHTML = "Unlocked"
	}
}
// Function to generate random comic image
function getRandomImage(ARR_LENGTH) {
	//Makes the Unlocked/Locked buttons visible after clicking button
	document.getElementById("panel1").style.display = "inline";
	document.getElementById("panel2").style.display = "inline";
	document.getElementById("panel3").style.display = "inline";
	var panelNumber = [];
	var numberIndex, a;
	// getting the file of the previous iteration
	var comicPanel = [document.getElementById("ComicPanel1")
						, document.getElementById("ComicPanel2")
						, document.getElementById("ComicPanel3")];
	for (i = 0; i < ARR_LENGTH; i++) {
		panelNumber[i] = i + 1;
	}
	for (i = 0; i < 3; i++) {
		//if the panel is unlocked, 
		if (document.getElementById("panel" + (i + 1)).innerHTML == "Unlocked") {
			numberIndex = Math.floor(Math.random() * panelNumber.length);
			comicPanel[i] = panelNumber[numberIndex];
			panelNumber.splice(numberIndex, 1);
		} else {
			//gets filename of the original comic panel
			a = comicPanel[i].src.split("/");
			comicPanel[i] = a[a.length - 1].split(".")[0];
		}
	}
	// Write them to the document
	document.getElementById("RandomComic").innerHTML = ('<img id="ComicPanel1" src="/images/random_comic_panels/' + comicPanel[0] + '.png" width="33%" height="auto">' + '<img id="ComicPanel2" src="/images/random_comic_panels/' + comicPanel[1] + '.png" width="33%" height="auto">' + '<img id="ComicPanel3" src="/images/random_comic_panels/' + comicPanel[2] + '.png" width="33%" height="auto">');
}