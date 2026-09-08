// #RandomArtworkButton on art.html: jump to a random artwork, picked
// from /data/json/artwork.json.
//
// Artwork has no per-image page, so this lands on the gallery page for
// the collection the piece belongs to (/artwork/<collection>.html).

(() => {

    const button = document.getElementById("RandomArtworkButton");

    if (!button) {
        return;
    }


    let artworks = [];

    fetch("/data/json/artwork.json")
        .then(response =>
            response.ok
                ? response.json()
                : Promise.reject(new Error(`HTTP ${response.status}`))
        )
        .then(data => {
            artworks = Array.isArray(data)
                ? data.filter(entry => entry && entry.collection)
                : [];

            button.disabled = artworks.length === 0;
        })
        .catch(error => {
            console.error("Random artwork: could not load the index:", error);
            button.disabled = true;
        });


    button.addEventListener("click", () => {

        if (artworks.length === 0) {
            return;
        }

        const choice =
            artworks[Math.floor(Math.random() * artworks.length)];

        window.location.href = `/artwork/${choice.collection}.html`;
    });
})();
