let text;

async function loadJSON() {
  const response = await fetch('../data/json/misc_artists.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  text = await response.json();
  console.log('JSON data stored in text:', text);
}

function renderData() {
    let ulStart = "<ul>";
    let ulEnd = "</ul>";
    let toHTML = "";
    for(let i = 0; i < text.length; i++){
      toHTML += `<li>
        ${text[i].name} (<a href="${text[i].link}">${text[i].link_name}</a>): ${text[i].description}
      </li>`;
    }

  document.getElementById("artists").innerHTML = "<ul>" + toHTML + "</ul>";
}

(async () => {
  try {
    await loadJSON();  // wait for the JSON data
    renderData();      // run the loop here, after data is ready
  } catch (error) {
    console.error(error);
  }
})();