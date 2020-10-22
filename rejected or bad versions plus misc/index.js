function randomFunFact(){
	
	var funFactsList = [
		"Alex Paws was a Christmas present from Pedro's father.",
		"Pedro may seem funny and cool, but when he serious, watch out!",
		"Alex still does get why he is not allowed to eat chocolate.",
		"Pawesome's secret identity is ______.",
		"The Facebook page of Alex and Pedro was made on July 8, 2015.",
		"Pawesome is kinda scared of the number 2514 for some reason.", //[5]
		"The Tumblr page of Alex and Pedro was made on December 28, 2015."
		];
	
	var statement = funFactsList[Math.floor(Math.random() * 7)]; //number multiplied must be 1 more than number in array index.
	document.getElementById("FunFactStatement").innerHTML = statement;
}