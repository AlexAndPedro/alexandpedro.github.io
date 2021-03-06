let path = "/data/word_data.csv";
let delimiter = ",";

function parseDictCSV(text, delimiter) {
    delimiter = delimiter || ',';
    
    let dict = new Object();
    dict["eng"] = new Object();
    dict["mampula"] = new Object();

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
                    dict["mampula"][mam_word.toLowerCase()] = new Object();
                    dict["mampula"][mam_word.toLowerCase()][headers[index]] = elem;
                    
                    dict["mampula"][mam_word.toLowerCase()]["translate"] = eng_word;
                    dict["eng"][eng_word.toLowerCase()]["translate"] = mam_word;
                    
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

        if (e.key == 'Enter' || e.keyCode == 13){
            
            engRadio = document.getElementById('english-word');
            let language = engRadio.checked ? 'eng' : 'mampula';
            let lang_word = engRadio.checked ? 'english' : 'mampula';

            let inputWord = e.target.value.toLowerCase();
            e.target.value = '';

            let wordDOM = document.querySelector('.word');
            let definitionDOM = document.querySelector('.definition');
            let translationTitleDOM = document.querySelector('.translation-title');
            let translateDOM = document.querySelector('.translation');

            if (dictionary[language][inputWord] !== undefined) {
                let partOfSpeechEng = dictionary[language][inputWord]["part of speech English"];
                let partOfSpeechMam = dictionary[language][inputWord]["part of speech Mampula"];
                let definition = dictionary[language][inputWord]["definition"];
                let mampulaInfo = dictionary[language][inputWord]["mampula info"];
                if (language == 'eng') {
                    wordDOM.innerHTML = `${dictionary[language][inputWord][lang_word]}<i class="part-of-speech">${partOfSpeechEng}</i>`;
                } else {
                    wordDOM.innerHTML = `${dictionary[language][inputWord][lang_word]}<i class="part-of-speech">${partOfSpeechMam}</i>`;
                };
                
                if (!wordDOM.classList.contains('underline')) {
                    wordDOM.classList.add('underline');
                };

                definitionDOM.innerHTML = `${definition}`;

                
                if (language == 'eng') {
                    translationTitleDOM.innerHTML = `${language == 'eng' ? "Mampula" : "English"} language transliteration`;
                    translateDOM.innerHTML = `${dictionary["eng"][inputWord]["translate"]}&nbsp;<i>${mampulaInfo}</i>`;
                } else {
                    translationTitleDOM.innerHTML = `${language == 'eng' ? "Mampula" : "English"} language translation`;
                    translateDOM.innerHTML = dictionary["mampula"][inputWord]["translate"];
                };

            } else {
                wordDOM.innerHTML = `"${inputWord}" was not found in the dictionary.`;
                wordDOM.classList.remove('underline');
                definitionDOM.innerHTML = '';
                translationTitleDOM.innerHTML = '';
                translateDOM.innerHTML = '';
            };
        };
    });

}


