// Create a URL object
const url = new URL(window.location);

// Push the new URL to the browser without reloading
window.history.pushState({}, "", url);

const params = new URLSearchParams(window.location.search);
const tag_type = params.get("type");
const tag_name = params.get("tags");


let text;

//This function fetches json file and puts content into text variable
async function loadJSON() {
    const response = await fetch(`../data/json/${tag_type}.json`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    text = await response.json();
    console.log('JSON data stored in text:', text);
}

function renderData() {
  console.log('Rendering data:', text);
  let toHTML = " ";

  let divClass = "<div class=\"comicarchiveframe\" style=\"width:380px;\">";
  let divClassEnd = "</div><br></br>";
  let divToTagPage = "";
  let tag_content = "";
  let number_of_tags = 0;
  if (tag_type === "comic"){
          for (let i = 0; i < text.length; i++) {
            tag_content = text[i].tag;
            if (tag_content.includes(tag_name)) {
              number_of_tags++;
              let art_image = text[i].image;
              let art_title = text[i].title;
              let art_date = text[i].date;
              let comic_number = i + 1;
              let padded_comic_number = comic_number.toString().padStart(4,"0");
              let link = `<a href="../comic/${padded_comic_number}.html">`;
              let imgsrc = `<img src="../images${art_image}" alt="${art_title}" title="Click for full size." width="380">`;
              let htmlTitle = `<h3>${art_title}</h3>`;
              let htmlArt = `<small>${art_date}</small></a>`;
              
              toHTML = toHTML.concat(art_image);

              divToTagPage += divClass + link + imgsrc + htmlTitle + htmlArt + divClassEnd;
            }
              
            }
          }else{
          for (let i = 0; i < text.length; i++) {
            tag_content = text[i].tag;
            if (tag_content.includes(tag_name)) {
              number_of_tags++;
              let article_title = text[i].title;
              let article_author = text[i].author;
              let article_author_description = text[i].author_description;
              let article_date = text[i].date;
              let article_article = text[i].article;

              let [year, month, day] = article_date.split("-");
              let article_html = article_title.replaceAll(" ","-").toLowerCase();


              

              let link = `<a href="../articles/${year}/${article_html}.html">`;

              // let imgsrc = `<img src="../images${art_image}" alt="${art_title}" title="Click for full size." width="380">`;
              let htmlTitle = `<h3 style="margin:0px">${article_title}</h3>`;
              let htmlAuthor = `by ${article_author}${article_author_description}`;
              let htmlPreview = article_article[0].split(" ").slice(0, 20).join(" ") + "...<br>[SEE MORE]";
              // let htmlArt = `<small>${art_date}</small></a>`;
              
              // toHTML = toHTML.concat(art_image);

              divToTagPage += divClass + link + htmlTitle + htmlAuthor + "<br><br>" + htmlPreview + divClassEnd;
            }
              
            }            
          }
  console.log(number_of_tags);
  
  document.getElementById("PageTitle").innerHTML = `<title>Alex and Pedro ≫ ${tag_name}</title>`;

  if (number_of_tags != 0){
    document.getElementById("TagTitle").innerHTML = `${tag_type} tagged \"${tag_name}\" `;
  }
  else {
    document.getElementById("TagTitle").innerHTML = `Sorry! There's no ${tag_type} with the tag name \"${tag_name}\".`;
  }
  document.getElementById("abc").innerHTML = divToTagPage;
}

(async () => {
  try {
    await loadJSON();  // wait for the JSON data
    renderData();      // run the loop here, after data is ready
  } catch (error) {
    console.error(error);
  }
})();