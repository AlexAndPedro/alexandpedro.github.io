function look_up_word(){
	
		const word = document.getElementById("search_input").value;
		document.getElementById("word").innerHTML = word;

		var content = word_list(word);

		document.getElementById("part_of_speech").innerHTML = content[0];
		document.getElementById("definition").innerHTML = content[1];
}