fetch("/data/json/people.json")
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to load people.json: ${response.status}`);
    }

    return response.json();
  })
  .then(people => {
    const list = document.querySelector(".ArtistList");

    if (!list) {
      throw new Error("Could not find .ArtistList element.");
    }

    for (const person of people) {

      const card = document.createElement("div");
      card.className = "ArtistCard";

      // Image
      const imageWrap = document.createElement("div");
      imageWrap.className = "ArtistImage";

      const image = document.createElement("img");
      image.src = person.image;
      image.alt = person.alt || person.name;

      imageWrap.appendChild(image);

      // Info
      const info = document.createElement("div");
      info.className = "ArtistInfo";

      const name = document.createElement("h2");
      name.textContent = person.name;
      info.appendChild(name);

      // Links (only when there are any)
      if (Array.isArray(person.links) && person.links.length > 0) {
        const links = document.createElement("div");
        links.className = "ArtistLinks";

        for (const link of person.links) {
          const anchor = document.createElement("a");
          anchor.href = link.url;
          anchor.textContent = link.label;
          links.appendChild(anchor);
        }

        info.appendChild(links);
      }

      // Description (only when present)
      if (person.description) {
        const description = document.createElement("p");
        description.textContent = person.description;
        info.appendChild(description);
      }

      card.appendChild(imageWrap);
      card.appendChild(info);
      list.appendChild(card);
    }
  })
  .catch(error => {
    console.error("Error loading people:", error);
  });
