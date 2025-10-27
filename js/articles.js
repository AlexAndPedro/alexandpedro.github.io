let text;
  


async function loadJSON() {
  const response = await fetch('/data/json/articles.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  text = await response.json();
  console.log('JSON data stored in text:', text);
}

//Render data to make sure the files are loaded first before running
function renderData() {
console.log('Rendering data:', text);
  let article_title = document.getElementById("ArticleTitle").innerHTML;
  let article_index = 0;

  //Find index of article from json file
    for(let i = 0; i < text.length; i++) {
    if(text[i].title.toLowerCase() === article_title.toLowerCase()){
      article_index = i;
      }
    }

  console.log('Article Index:',article_index);

  // Add author
  let article_author = text[article_index].author;
  console.log("Article Author:",article_author);

  let article_author_description = text[article_index].author_description;
  console.log("Article Description:",article_author_description);

  let htmlAuthor = `by ${article_author}${article_author_description}`;
  console.log("Author in HTML:",htmlAuthor);
  document.getElementById("ArticleAuthor").innerHTML = htmlAuthor;
  
  let article_tags = "";


  console.log('Rendering data:', text);
  let toHTMLArtileTitle = "";
  let toHTMLArticleTags = "";
  let article_content = "";




    ////////////////////////////////////////////////////////////////////////////
  //This function fetches txt file and puts content into text variable
  let article_html = article_title.replaceAll(" ","-").toLowerCase();
  
  fetch(`txt/${article_html}.txt`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      //Adds txt file into html under div id ArticleContent
      article_content = text;
      //console.log('File content:', article_content);
      document.getElementById("ArticleContent").innerHTML = article_content;
    })
    .catch(error => {
      console.error('Error reading file:', error);
    });

   //////////////////////////////////////////////////////////////////////// 
  //Grag tag info from text!
  for(let i = 0; i < text.length; i++) {
    if(text[i].title.toLowerCase() === article_title.toLowerCase()){
      article_tags = text[i].tag;
    }
  }
  
  //Makes html string to be sent to html id ArticleTags
  for(let i = 0; i < article_tags.length; i++){
    toHTMLArticleTags += `<a href = "/tag.html?type=articles&tags=${article_tags[i]}">${article_tags[i]}</a>`
    if(i < article_tags.length - 1)
    toHTMLArticleTags += "&nbsp &nbsp";
  }
    document.getElementById("ArticleTags").innerHTML = toHTMLArticleTags;
}

(async () => {
  try {
    await loadJSON();  // wait for the JSON data
    renderData();      // run the loop here, after data is ready
  } catch (error) {
    console.error(error);
  }
})();