// #RandomComicButton on comic_archive.html: jump to a random comic,
// picked from the same data the archive is built from
// (/data/json/comic.json).

(() => {

    const button = document.getElementById("RandomComicButton");

    if (!button) {
        return;
    }


    let comics = [];

    fetch("/data/json/comic.json")
        .then(response =>
            response.ok
                ? response.json()
                : Promise.reject(new Error(`HTTP ${response.status}`))
        )
        .then(data => {
            comics = Array.isArray(data)
                ? data.filter(entry => entry && entry.comic_number != null)
                : [];

            button.disabled = comics.length === 0;
        })
        .catch(error => {
            console.error("Random comic: could not load the index:", error);
            button.disabled = true;
        });


    button.addEventListener("click", () => {

        if (comics.length === 0) {
            return;
        }

        const choice =
            comics[Math.floor(Math.random() * comics.length)];

        const number = String(choice.comic_number).padStart(4, "0");

        window.location.href = `/comic/${number}.html`;
    });
})();
