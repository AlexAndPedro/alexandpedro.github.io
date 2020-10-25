let path = "/data/word_data.csv";
let delimiter = ",";

function parseDictCSV(text, delimiter) {
    delimiter = delimiter || ',';
    
    let dict = new Object();

    let lines = text.trim().split('\n');
    let headers = [];
    lines.forEach((line, index) => {
        
        if (index == 0) {
            headers = line.trim().split(delimiter);
        } else {
            let word = '';
            line.trim().split(delimiter).forEach((elem, index) => {
                if (index == 0) {
					word = elem;
                    dict[word] = new Object();
                } else {
                    dict[word][headers[index]] = elem;
                }
            });
        }
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
    console.log(dictionary['apple'].definition);

    // If you want to access the part of speech of apple
    console.log(dictionary['apple']['part of speech'])
	
	// If you want to access the etymology of apple..
    console.log(dictionary['apple'].etymology);

    // If you want to see all the words in array
    console.log(Object.keys(dictionary));

    // You can use variable to access the definition too
    let userInput = 'run';
    console.log(dictionary[userInput].definition);

    // Example code for getting user input and displaying definition
    // and part of speech of the given word.

    document.getElementById('word').addEventListener('keyup', e => {
        e.preventDefault();

        if (e.key == 'Enter' || e.keyCode == 13){
            
			let inputWord = e.target.value;
            e.target.value = '';
			let word1 = inputWord.charAt(0).toUpperCase()+inputWord.slice(1).toLowerCase();
			let word2 = inputWord.toLowerCase();
			
            if (dictionary[inputWord] !== undefined) {
				document.querySelector('.input-word').innerHTML = inputWord;
                document.querySelector('.part-of-speech').innerHTML = dictionary[inputWord]['part of speech'];
                document.querySelector('.definition').innerHTML = dictionary[inputWord].definition;
				document.querySelector('.mampula').innerHTML = dictionary[inputWord].mampula;
				document.querySelector('.etymology').innerHTML = dictionary[inputWord].etymology;				
				document.getElementById('definition_title').style.display = 'inline';
				document.getElementById('etymology_title').style.display = 'inline';
				document.getElementById('mampula_title').style.display = 'inline';
            } else if (dictionary[word1] !== undefined)
			{
				document.querySelector('.input-word').innerHTML = word1;
                document.querySelector('.part-of-speech').innerHTML = dictionary[word1]['part of speech'];
                document.querySelector('.definition').innerHTML = dictionary[word1].definition;
				document.querySelector('.mampula').innerHTML = dictionary[word1].mampula;
				document.querySelector('.etymology').innerHTML = dictionary[word1].etymology;
				document.getElementById('definition_title').style.display = 'inline';
				document.getElementById('etymology_title').style.display = 'inline';
				document.getElementById('mampula_title').style.display = 'inline';				
			} else if (dictionary[word2] !== undefined)
			{
				document.querySelector('.input-word').innerHTML = word2;
                document.querySelector('.part-of-speech').innerHTML = dictionary[word2]['part of speech'];
                document.querySelector('.definition').innerHTML = dictionary[word2].definition;
				document.querySelector('.mampula').innerHTML = dictionary[word2].mampula;
				document.querySelector('.etymology').innerHTML = dictionary[word2].etymology;
				document.getElementById('definition_title').style.display = 'inline';
				document.getElementById('etymology_title').style.display = 'inline';
				document.getElementById('mampula_title').style.display = 'inline';				
			} else
			{
                document.querySelector('.input-word').innerHTML = 'Not Found in Dictionary';
                document.querySelector('.part-of-speech').innerHTML = '';
                document.querySelector('.definition').innerHTML = '';
				document.querySelector('.mampula').innerHTML = '';
				document.querySelector('.etymology').innerHTML = '';
				document.getElementById('definition_title').style.display = 'none';
				document.getElementById('etymology_title').style.display = 'none';
				document.getElementById('mampula_title').style.display = 'none';
            };
            
        }
        
    });
}


