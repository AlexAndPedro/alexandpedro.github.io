const panels = [document.getElementById("panel1"),
				document.getElementById("panel2"),
				document.getElementById("panel3"),
];

const number_comic_panels = 3;

function lockPanel(buttonNumber) {
	//Changes the text of the lock button to "Locked" or "Unlocked"
	if (document.getElementById("panel" + buttonNumber).innerHTML == "Unlocked") {
		document.getElementById("panel" + buttonNumber).innerHTML = "Locked"
	} else {
		document.getElementById("panel" + buttonNumber).innerHTML = "Unlocked"
	}
}
// Function to generate random comic image
function getRandomImage(total_panel_number) {
	//Makes the Unlocked/Locked buttons visible after clicking button
	for (let i = 0; i < panels.length; i++) {
    panels[i].style.display = "inline";
}
	let panelNumber = [];
	let numberIndex, a;
	// getting the file of the previous iteration
	let comicPanel = [document.getElementById("ComicPanel1")
						, document.getElementById("ComicPanel2")
						, document.getElementById("ComicPanel3")];
	for (let i = 0; i < total_panel_number; i++) {
		panelNumber[i] = i + 1;
	}
	for (let i = 0; i < number_comic_panels; i++) {
		//if the panel is unlocked, 
		if (panels[i].innerHTML == "Unlocked") {
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