var fs = require('fs');
let text = fs.readFileSync(".\\data\\json\\comic.json","utf8");
const obj = JSON.parse(text);
const tag_name = "pedro";
let toHTML = "";

let divClass = "<div class=\"comicarchiveframe\" style=\"width:380px;\">"
let divClassEnd = "</div><br></br>"
// console.log(obj);
// console.log(obj.length)

const comic_list_index = [];

for (let i = 0; i < obj.length; i++){
    // console.log(obj[i]["tag"]);
    tag_content = obj[i].tag;
    if (tag_content.includes(tag_name)){
        // comic_list_index.push(i)
        //console.log(obj[i]["name"]);
        x = obj[i].name;
        toHTML = toHTML.concat(divClass + x + divClassEnd);
    }
}

document.getElementById("abc").innerHTML = result;



					
					// 	<a href="/comic/0001.html"><img src="/images/comic/archive/0001 - Pedro's Phone.png" alt="[0001] Pedro's Phone" title="Click for full size." width="380"><br>
					// 	<h3>[0001] Pedro's Phone</h3>
					// 	<small>2020/3/25</small></a>
					// 