var path = "/data/fun_fact.csv";
var delimiter = "|";
var longText = [];


function parsePhraseCSV(text, delimiter){
    
    var FunFacts = new Array();
    
    FunFacts = text.trim().split('\n').map(line => line.split(delimiter));
    return FunFacts;
}

var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        longText = parsePhraseCSV(this.responseText,delimiter);
        valueCallBack(longText);
    }
  };
  xhttp.open("GET", path, true);
  xhttp.send();

function valueCallBack(longText){
    
}



function randomFunFact() {
   	var statement = longText[0][Math.floor(Math.random() * longText[0].length)];
	document.getElementById("FunFactStatement").innerHTML = statement; 
}