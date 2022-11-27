let path = "/data/word_TEST.csv"; //change to "/data/word_data.csv" when done
let delimiter = ",";

function parseDictCSV(text, delimiter) {
  
    //declaring new objects
    let dict = new Object();
    dict["eng"] = new Object();
    dict["mampula"] = new Object();

    //changing CSV file to array
    let lines = text.trim().split('\n');                                            // splits text rows due to \n
    let headers = [];
    lines.forEach((line, index) => {
        if (index == 0) {
            headers = line.trim().split(delimiter);                                 // the first row of csv, "english, mampula, mampulan symbol, etc. is defined as header and split"
        } else {
            let eng_word = '';
            let mam_word = '';
            line.trim().split(delimiter).forEach((elem, index) => {                 // each row of the rest of the row are split by commas.
                if (index == 0) {                           
                    eng_word = elem                                                 // For English, the first column becomes a header, the second column becomes the word to translate to.
                    if(dict["eng"][eng_word.toLowerCase()] === undefined){              // If the word has no place, add a place.
                        dict["eng"][eng_word.toLowerCase()] = new Object();             // If the word is taken, add to the word, not replace.
                        dict["eng"][eng_word.toLowerCase()][headers[index]] = [elem];
                    } else {
                        dict["eng"][eng_word.toLowerCase()][headers[index]].push(elem);
                    }
                } else if (index == 1) {
                    mam_word = elem                                                 // For Mampula, the second column becomes a header, the first column becomes the word to translate to.
                    if(dict["mampula"][mam_word.toLowerCase()] === undefined){ 
                        dict["mampula"][mam_word.toLowerCase()] = new Object();
                        dict["mampula"][mam_word.toLowerCase()][headers[index]] = [elem];

                        dict["mampula"][mam_word.toLowerCase()]["translate"] = [eng_word];
                        dict["eng"][eng_word.toLowerCase()]["translate"] = [mam_word];

                    } else {
                        dict["mampula"][mam_word.toLowerCase()][headers[index]].push(elem);

                        dict["mampula"][mam_word.toLowerCase()]["translate"].push(eng_word);
                        dict["eng"][eng_word.toLowerCase()]["translate"].push(mam_word);                      
                    }



                    
                } else {
                // Fills in the information from the rest of the columns
                    dict["eng"][eng_word.toLowerCase()][headers[index]] = elem;
                    dict["mampula"][mam_word.toLowerCase()][headers[index]] = elem;
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

        if (e.key == 'Enter'){                                           //If the 'Enter' Key is pressed
            
            engRadio = document.getElementById('english-word');
            let language = engRadio.checked ? 'eng' : 'mampula';        // Check the language
            let lang_word = engRadio.checked ? 'english' : 'mampula';   // Check the laguage_word

            let inputWord = e.target.value.toLowerCase();               // input word turns to lowercase for stanrdize inputs ("RiCe" and "rIce") have same input
            e.target.value = '';                                        // turns the value back to blank

            //The following are DOMs for editing HTML elements
            let wordDOM = document.querySelector('.word');
            let definitionDOM = document.querySelector('.definition');
            let transliterationDOM = document.querySelector('.transliteration');
            let translationDOM = document.querySelector('.translation');
            let mampulaInfoDOM = document.querySelector('.mampulaInfo');
            let exampleDOM = document.querySelector('.example');
            let seeAlsoDOM = document.querySelector('.seeAlso');
            let etymologyDOM = document.querySelector('.etymology');            


            if (dictionary[language][inputWord] !== undefined) {
                let partOfSpeechEng = dictionary[language][inputWord]["part of speech English"];
                let partOfSpeechMam = dictionary[language][inputWord]["part of speech Mampula"];
                let definition = dictionary[language][inputWord]["definition"];
                let mampulaInfo = dictionary[language][inputWord]["mampula info"];
                let mampulanSymbol = dictionary[language][inputWord]["mampulan symbol"]
                let etymology = dictionary[language][inputWord]["etymology"];
                let example = dictionary[language][inputWord]["example"];
                let seeAlso = dictionary[language][inputWord]["see also"];

                //This part displays word being searched in its correct capitalization
                //and part of speech
                if (language == 'eng') {
                    wordDOM.innerHTML = `${dictionary[language][inputWord][lang_word]}<i class="part-of-speech">${partOfSpeechEng}</i>`;
                } else {
                    wordDOM.innerHTML = `${dictionary[language][inputWord][lang_word]}<i class="part-of-speech">${partOfSpeechMam}</i>`;
                };              

                wordDOM.classList.add('underline');
            
                document.querySelector('.result-container-2').style.display = "inline";

                
                    
                if (language == 'eng') {

                    translationDOM.innerHTML = `${mampulanSymbol}`;

                    definitionDOM.innerHTML = `${definition}`;

                    transliterationDOM.innerHTML = `${dictionary["eng"][inputWord]["translate"]}`;

                    mampulaInfoDOM.innerHTML = `<i>${mampulaInfo}</i>`;

                    exampleDOM.innerHTML = `Example<br><i>${example}</i>`;
                    
                    seeAlsoDOM.innerHTML = `See also:<br><i>${seeAlso}</i>`;

                    etymologyDOM.innerHTML = `Etymology:<br>${etymology}`;

                } else {
                    //transliterationTitleDOM.innerHTML = `${language == 'eng' ? "Mampula" : "English"} language translation`;
                   // wordInfoDOM.innerHTML = `${dictionary["mampula"][inputWord]["translate"]}&nbsp;<br><br><i>${mampulaInfo}</i>
                   // &nbsp;<br><br>Example<br><i>${example}</i>&nbsp;<br><br>See also:<br><i>${seeAlso}</i>`;
                };

                //If the word is not found in the dictionary
            } else {
                wordDOM.innerHTML = `"${inputWord}" was not found in the dictionary.`;
                wordDOM.classList.remove('underline');
                definitionDOM.innerHTML = '';
                //wordInfoDOM.innerHTML = '';
                document.querySelector('.result-container-2').style.display = "none";
            };
        };
    });

}


