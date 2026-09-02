fetch("/data/json/cast.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load cast.json: ${response.status}`);
    }

    return response.json();
  })
  .then(data => {
    const castContainer = document.getElementById("cast");

    if (!castContainer) {
      throw new Error("Could not find #cast element.");
    }

    // Create a section for each category in the JSON
    for (const [category, characters] of Object.entries(data)) {

      // Section heading
      const section = document.createElement("div");
      section.className = `PageSection ${category
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      section.textContent = category;

      castContainer.appendChild(section);

      // Character grid
      const grid = document.createElement("div");
      grid.className = "castGrid";

      // Add characters
      for (const character of characters) {

        const article = document.createElement("div");
        article.className = "PageArticle";

        // Image
        const image = document.createElement("img");
        image.className = "castImage";
        image.src = character.image;
        image.alt = character.name;

        // Name
        const name = document.createElement("h1");
        name.className = "castName";
        name.textContent = character.name;

        // Description
        const description = document.createElement("p");
        description.className = "characterDescription";

        // Allow <br> in descriptions
        description.innerHTML = character.description;

        // Put everything into the character card
        article.appendChild(image);
        article.appendChild(name);
        article.appendChild(description);

        // Put character card into grid
        grid.appendChild(article);
      }

      castContainer.appendChild(grid);
    }
  })
  .catch(error => {
    console.error("Error loading cast:", error);
  });