let path = "/data/word_data.csv"; //change to "/data/word_data.csv" when done
let delimiter = ",";

function parseDictCSV(text, delimiter) {
    delimiter = delimiter || ',';
    
    let dict = new Object();
    dict["eng"] = new Object();
    dict["mampulan"] = new Object();

    let lines = text.trim().split('\n');
    let headers = [];
    lines.forEach((line, index) => {
        if (index == 0) {
            headers = line.trim().split(delimiter);
        } else {
            let eng_word = '';
            let mam_word = '';
            line.trim().split(delimiter).forEach((elem, index) => {
                if (index == 0) {
                // For English, the first column of CSV becomes a header
                    eng_word = elem
                    dict["eng"][eng_word.toLowerCase()] = new Object();
                    dict["eng"][eng_word.toLowerCase()][headers[index]] = elem;
                } else if (index == 1) {
                // For English, the second column becomes the word to translate to.
                // For Mampula, the second column becomes a header.
                //              the first column becomes the word to translate to.
                    mam_word = elem
                    dict["mampulan"][mam_word.toLowerCase()] = new Object();
                    dict["mampulan"][mam_word.toLowerCase()][headers[index]] = elem;
                    
                    dict["mampulan"][mam_word.toLowerCase()]["translate"] = eng_word;
                    dict["eng"][eng_word.toLowerCase()]["translate"] = mam_word;
                    
                } else {
                // Fills in the information from the rest of the columns
                    dict["eng"][eng_word.toLowerCase()][headers[index]] = elem;
                    dict["mampulan"][mam_word.toLowerCase()][headers[index]] = elem;
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
            
            engRadio = document.getElementById('english-word');
            let language = engRadio.checked ? 'eng' : 'mampulan';
            let lang_word = engRadio.checked ? 'english' : 'mampulan';

            let inputWord = e.target.value.toLowerCase();
            e.target.value = '';

            let wordDOM = document.querySelector('.word');
            let definitionDOM = document.querySelector('.definition');
            let transliterationDOM = document.querySelector('.transliteration');
            let translationDOM = document.querySelector('.translation');
            let mampulanInfoDOM = document.querySelector('.mampulanInfo');
            let mampulanExampleDOM = document.querySelector('.mampulanExample');
            let englishExampleDOM = document.querySelector('.englishExample');
            let seeAlsoDOM = document.querySelector('.seeAlso');
            let etymologyDOM = document.querySelector('.etymology');            

            document.querySelector('.result-container-2').style.display = "block";

            if (dictionary[language][inputWord] !== undefined) {
                let partOfSpeechEng = dictionary[language][inputWord]["part of speech English"];
                let partOfSpeechMam = dictionary[language][inputWord]["part of speech Mampula"];
                let definition = dictionary[language][inputWord]["definition"];
                let mampulanInfo = dictionary[language][inputWord]["mampulan info"];
                let mampulanSymbol = dictionary[language][inputWord]["mampulan symbol"]
                let etymology = dictionary[language][inputWord]["etymology"];
                let mampulanExample = dictionary[language][inputWord]["mampulan example"];
                let englishExample = dictionary[language][inputWord]["english example"];
                let seeAlso = dictionary[language][inputWord]["see also"];

                //This part displays word being searched in its correct capitalization
                //and part of speech
                if (language == 'eng') {
                    wordDOM.innerHTML = `${dictionary[language][inputWord][lang_word]}<i class="part-of-speech">${partOfSpeechEng}</i>`;
                } else {
                    wordDOM.innerHTML = `${dictionary[language][inputWord][lang_word]}<i class="part-of-speech">${partOfSpeechMam}</i>`;
                };              

                wordDOM.classList.add('underline');              
                    
                if (language == 'eng') {

                    translationDOM.innerHTML = `${mampulanSymbol}`;

                    definitionDOM.innerHTML = `${definition}`;

                    transliterationDOM.innerHTML = `${dictionary["eng"][inputWord]["translate"]}`;

                    mampulanInfoDOM.innerHTML = `<i>${mampulanInfo}</i>`;

                    mampulanExampleDOM.innerHTML = `${mampulanExample}`;

                    englishExampleDOM.innerHTML = `<i>${englishExample}</i>`;
                    
                    seeAlsoDOM.innerHTML = `<i>${seeAlso}</i>`;

                    etymologyDOM.innerHTML = `${etymology}`;

                } else {
                    //transliterationTitleDOM.innerHTML = `${language == 'eng' ? "Mampula" : "English"} language translation`;
                   // wordInfoDOM.innerHTML = `${dictionary["mampulan"][inputWord]["translate"]}&nbsp;<br><br><i>${mampulanInfo}</i>
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


