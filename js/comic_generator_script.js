// Function to generate random comic image

function getRandomImage() { 

ARR_LENGTH = 54;
  // Generate the three comic panel indices randomly
  var comic1 = Math.floor(Math.random() * ARR_LENGTH) + 1;
  var comic2 = Math.floor(Math.random() * ARR_LENGTH) + 1;
  var comic3 = Math.floor(Math.random() * ARR_LENGTH) + 1;
  
  
  // Write them to the document
  document.getElementById("RandomComic").innerHTML =
	('<img class="ComicPanel" src="Comic_Image_English/test/Slide' + comic1 +
	'.png" width="32%" height="auto"> <img class="ComicPanel" src="Comic_Image_English/test/Slide' + comic2 +
	'.png" width="32%" height="auto"> <img class="ComicPanel" src="Comic_Image_English/test/Slide' + comic3 +
	'.png" width="32%" height="auto">'
	);
}