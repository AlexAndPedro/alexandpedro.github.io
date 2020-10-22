function word_list(word){

var part_of_speech = "";
var definition = "";

var meaning = [
		{
			w: "apple",
			p_of_s: "noun",
			def: "a fruit"
		},
		{
			w: "walk",
			p_of_s: "verb",
			def: "leg move"
		}




];

for (var i=0; i < meaning.length; i++){
	
	if (meaning[i].w === word){
		part_of_speech = meaning[i].p_of_s;
		definition = meaning[i].def;
}

var word_definition = [part_of_speech, definition]

return word_definition;


}