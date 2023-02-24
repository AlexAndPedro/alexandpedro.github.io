let path = "/data/word_data.csv"; //change to "/data/word_data.csv" when done
let delimiter = "|";

class Word{
    constructor(WordInfo) {
        this.english = WordInfo[0];
        this.mampulan = WordInfo[1];
        this.mampulan_symbol = WordInfo[2];
        this.pos_english = WordInfo[3];
        this.pos_mampulan = WordInfo[4];
        this.definition = WordInfo[5];
        this.etymology = WordInfo[6];
        this.example_eng = WordInfo[7];
        this.example_mam = WordInfo[8];
        this.see_also = WordInfo[9];
    }
}


function parseDictCSV(text, delimiter) {
    delimiter = delimiter;
    
    let dict = new Object();
    dict["d"] = new Array();

    let lines = text.trim().split('\n');
    let headers = [];
    lines.forEach((line, rowIndex) => {
        if (rowIndex == 0) {
            headers = line.trim().split(delimiter);                                 //the first row of the csv file is a header
        } else {                                                                    //as for the rest of the rows...
            line.trim().split(delimiter).forEach((elem, columnIndex) => {                 //note that index here means columns now
                if (columnIndex == 0) {                                                       // For English, the first column of CSV becomes a header
                    let entry = new Word(line.trim().split(delimiter));
                    dict["d"].push(entry);
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
    // dictionary['apple'].definition

    // If you want to access the part of speech of apple
    // dictionary['apple']['part of speech']

    // If you want to see all the words in array
    // Object.keys(dictionary)

    // Example code for getting user input and displaying definition
    // and part of speech of the given word.

    document.querySelector('.form__input#word').addEventListener('keyup', e=> {
        e.preventDefault();

        if (e.key == 'Enter' || e.keyCode == 13){
            
            //engRadio = document.getElementById('english-word');
            //let language = engRadio.checked ? 'english' : 'mampulan';
            let inputWord = e.target.value.toLowerCase();
            e.target.value = '';

           document.querySelector('.result-container').style.display = "block";
           document.querySelector('.result-container-2').style.display = "block";

            let dictionaryOutput = new Array();
            let englishWord = new Array();
            let mampulanWord = new Array();
            let mampulanSymbol = new Array();
            let partOfSpeechEng = new Array();
            let partOfSpeechMam = new Array();
            let definition = new Array();
            let etymology = new Array();
            let englishExample = new Array();
            let mampulanExample = new Array();
            let seeAlso = new Array();

            // Finds all the indices of the inputted word
            for(let step = 0; step < dictionary["d"].length; step++) {
                if(dictionary["d"][step].english.toLowerCase() == inputWord.toLowerCase() || dictionary["d"][step].mampulan_symbol.toLowerCase() == inputWord.toLowerCase() || dictionary["d"][step].mampulan.toLowerCase() == inputWord.toLowerCase()){
                    dictionaryOutput.push(dictionary["d"][step]);
                }
             }
             let wordDOM = document.querySelector('.word');
             // if a dictionaryOutput exists or has an element
            if (dictionaryOutput !== undefined && dictionaryOutput.length > 0) {

                //puts in dictionary Output in an array for easier access 
                for(let i = 0; i < dictionaryOutput.length; i++){
                    englishWord.push(dictionaryOutput[i].english);
                    mampulanWord.push(dictionaryOutput[i].mampulan);
                    mampulanSymbol.push(dictionaryOutput[i].mampulan_symbol);
                    partOfSpeechEng.push(dictionaryOutput[i].pos_english);
                    partOfSpeechMam.push(dictionaryOutput[i].pos_mampulan);
                    definition.push(dictionaryOutput[i].definition);
                    etymology.push(dictionaryOutput[i].etymology);
                    englishExample.push(dictionaryOutput[i].example_eng);
                    mampulanExample.push(dictionaryOutput[i].example_mam);
                    seeAlso.push(dictionaryOutput[i].see_also);
                }
            
                //ALL DOMS (ALL HTMLS)




                let DictionaryDisplayElement = new Array();
                let DictionaryDisplayEng = new Array();
                let DictionaryDisplayMam = new Array();
                

                //If the user input matches one of the words in the ENGLISH word list
                if (inputWord.toLowerCase() == englishWord[0].toLowerCase()) {

                    wordDOM.style.fontFamily = "AnP";
                    wordDOM.innerHTML = `${englishWord[0]}`;
                    
                    for(let i = 0; i < dictionaryOutput.length; i++){

                        // Compiling html code to be sent to Dictionary Display
                        // Note that this is only one entry.
                        DictionaryDisplayElement[0] = `<h1>${partOfSpeechEng[i]}</h1>`;
                        DictionaryDisplayElement[1] = `<h2 class="translation" style="font-family:MampulanFont">${mampulanSymbol[i]}</h2>`;
                        DictionaryDisplayElement[2] = `<h3 class="transliteration">${mampulanWord[i]}</h2>`;
                        DictionaryDisplayElement[3] = `<h3 class="definition">${definition[i]}</h2>`;
                        DictionaryDisplayElement[4] = `Example:<h3 class="mampulanExample">${mampulanExample[i]}</h2>`;
                        DictionaryDisplayElement[5] = `<h3 class="englishExample">${englishExample[i]}</h2>`;
                        DictionaryDisplayElement[6] = `Etymology:<h3 class="etymology">${etymology[i]}</h2>`;
                        DictionaryDisplayElement[7] = `See Also:<h3 class="seeAlso">${seeAlso[i]}</h2>`;


                       DictionaryDisplayEng[i] = DictionaryDisplayElement.join('');

                    }
                        

                } else if (inputWord.toLowerCase() == mampulanSymbol[0].toLowerCase() || inputWord.toLowerCase() == mampulanWord[0].toLowerCase()){    
                    //If the user input matches one of the words in the MAMPULAN word list

                    wordDOM.style.fontFamily = "MampulanFont";
                    wordDOM.innerHTML = `${mampulanSymbol[0]}`;

                    for(let i = 0; i < dictionaryOutput.length; i++){
                     // Compiling html code to be sent to Dictionary Display
                        // Note that this is only one entry.
                        DictionaryDisplayElement[0] = `<h1>${partOfSpeechMam[i]}</h1>`;
                        DictionaryDisplayElement[1] = `<h2 class="transliteration">${mampulanWord[i]}</h2>`;
                        DictionaryDisplayElement[2] = `<h2 class="translation">${englishWord[i]}</h2>`;
                        DictionaryDisplayElement[3] = `<h3 class="definition">${definition[i]}</h2>`;
                        DictionaryDisplayElement[4] = `Example:<h3 class="mampulanExample">${mampulanExample[i]}</h2>`;
                        DictionaryDisplayElement[5] = `<h3 class="englishExample">${englishExample[i]}</h2>`;
                        DictionaryDisplayElement[6] = `Etymology:<h3 class="etymology">${etymology[i]}</h2>`;
                        DictionaryDisplayElement[7] = `See Also:<h3 class="seeAlso">${seeAlso[i]}</h2>`;


                       DictionaryDisplayMam[i] = DictionaryDisplayElement.join('');
                    }


                } else {
                    wordDOM.innerHTML = `"${inputWord}" was not found in the dictionary.`;
                    document.querySelector('.result-container-2').style.display = "none";

                };
                
                // All possible entries are in DictionaryDisplay. We write entire html code to .result-container-2
                document.querySelector('.result-container-2').innerHTML = DictionaryDisplayEng.join('') + DictionaryDisplayMam.join('');

            } else {
                //If the word is not found in the dictionary
                wordDOM.innerHTML = `"${inputWord}" was not found in the dictionary.`;
                wordDOM.classList.remove('underline');
                document.querySelector('.result-container-2').style.display = "none";
            };
        }
    }
    )
}