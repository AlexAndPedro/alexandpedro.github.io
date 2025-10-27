const comic_number = document.getElementById("ComicTags").innerHTML;

let text;

async function loadJSON() {
  const response = await fetch('../data/json/comic.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  text = await response.json();
  console.log('JSON data stored in text:', text);
}

function renderData() {
  let nav_first_num = 1;
  let nav_prev_num = Number(comic_number) - 1;
  let nav_next_num = Number(comic_number) + 1;
  let nav_last_num = text.length;
  let navFirstHTML = "";
  let navPrevHTML = "";
  let navNextHTML = "";
  let navLastHTML = "";

  if (comic_number != 1) {
    navFirstHTML = `<div class = "nav-First">
                        <a href = "${nav_first_num.toString().padStart(4,"0")}.html">
                          &lt;&lt; First
                        </a>
                        </div>`
                      }

  if (comic_number != 1) {
  navPrevHTML = `<div class = "nav-Previous">
                      <a href = "${nav_prev_num.toString().padStart(4,"0")}.html">
                        &lt; Previous
                      </a>
                      </div>`
                      }
  if (comic_number != text.length) {
  navNextHTML = `<div class = "nav-Next">
                      <a href = "${nav_next_num.toString().padStart(4,"0")}.html">
                        Next &gt;
                      </a>
                    </div>`
                    }


  if (comic_number != text.length) {
  navLastHTML = `<div class = "nav-Latest">
                      <a href = "${nav_last_num.toString().padStart(4,"0")}.html">
                        Last &gt;&gt;
                      </a>
                    </div>`
                    }

  let toNavigationHTML = navFirstHTML + navPrevHTML + navNextHTML + navLastHTML;

  console.log(toNavigationHTML);

  document.querySelector(".Navigation").innerHTML = toNavigationHTML;





{/* The following code is for comic tags */}

  console.log('Rendering data:', text);
  let toHTML = " ";

  let comic_tags = text[comic_number-1].tag;

  console.log('Comic Tags:', comic_tags);

  for(let i = 0; i < comic_tags.length; i++){
    toHTML += `<a href = "/tag.html?type=comics&tags=${comic_tags[i]}">${comic_tags[i]}</a>` //query string
    if(i != comic_tags.length - 1)
    toHTML += "&nbsp &nbsp";
  }
    document.getElementById("ComicTags").innerHTML = toHTML;
}

(async () => {
  try {
    await loadJSON();  // wait for the JSON data
    renderData();      // run the loop here, after data is ready
  } catch (error) {
    console.error(error);
  }
})();