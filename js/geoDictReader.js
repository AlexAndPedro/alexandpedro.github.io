let path = "/data/geography_data.csv";
let delimiter = ",";

function parseDictCSV(text, delimiter) {
    delimiter = delimiter || ',';
    
    let dict = new Object();

    let lines = text.trim().split('\n');
    let headers = [];
    lines.forEach((line, index) => {
        
        if (index == 0) {
            headers = line.trim().split(delimiter);
        }
            
        let word = '';
        line.trim().split(delimiter).forEach((elem, index) => {
            if (index == 0) {
                word = elem.toLowerCase();
                dict[word] = new Object();
            }

            dict[word][headers[index]] = elem;
        });
    });

    return dict;
}

let xhr = new XMLHttpRequest();
let dictionary = new Object();

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        dictionary = parseDictCSV(xhr.responseText, delimiter);
        callback(dictionary);
    } else if (xhr.readyState == 4){
        console.log('Error: ' + xhr.status);
    }
}
xhr.open('GET', path, true);
xhr.send();

function callback(dictionary) {
    // you can do whatever you want with the dictionary here..
    // if you try using it outside of this function, it might not work

    // HOW TO USE IT

    // If you want to access the definition of apple..
    // console.log(dictionary['Pangilan']["definition"]);

	
	// // If you want to access the etymology of apple..
    // console.log(dictionary['Pangilan']["etymology"]);

    // // If you want to see all the words in array
    // console.log(Object.keys(dictionary));

    // // You can use variable to access the definition too
    // let userInput = 'run';
    // console.log(dictionary[userInput].definition);

    // Example code for getting user input and displaying definition
    // and part of speech of the given word.

    document.getElementById('word').addEventListener('keyup', e => {
        e.preventDefault();

        if (e.key == 'Enter' || e.keyCode == 13){
            
            let inputWord = e.target.value.toLowerCase();
            e.target.value = '';
            
                if (dictionary[inputWord] !== undefined) {

                    if(dictionary[inputWord]["state code"] === ""){
                        document.querySelector(".input-word").innerHTML = dictionary[inputWord].name;
                    } else {
                    document.querySelector(".input-word").innerHTML = `${dictionary[inputWord].name}, ${dictionary[inputWord]["state code"]}`;
                    }
                    document.querySelector(".definition").innerHTML = dictionary[inputWord].definition;
                    document.getElementById("definition_title").style.display = "inline";

                    document.querySelector(".etymology").innerHTML = dictionary[inputWord].etymology;
                    document.getElementById("etymology_title").style.display = "inline";
                } 
                else
                {
                    document.querySelector(".input-word").innerHTML = "Not Found in Dictionary";
                    document.querySelector(".definition").innerHTML = "";
                    document.querySelector(".etymology").innerHTML = "";
                    document.getElementById("definition_title").style.display = "none";
                    document.getElementById("etymology_title").style.display = "none";
                }
            
        }
        
    });
}


