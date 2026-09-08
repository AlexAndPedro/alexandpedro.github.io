// #RandomArticleButton on articles.html: jump to a random article, picked
// from the same index the archive below is built from
// (/data/json/articles_tag.json).

(() => {

    const button = document.getElementById("RandomArticleButton");

    if (!button) {
        return;
    }


    let articles = [];

    fetch("/data/json/articles_tag.json")
        .then(response =>
            response.ok
                ? response.json()
                : Promise.reject(new Error(`HTTP ${response.status}`))
        )
        .then(data => {
            articles = Array.isArray(data)
                ? data.filter(entry => entry && entry.url)
                : [];

            button.disabled = articles.length === 0;
        })
        .catch(error => {
            console.error("Random article: could not load the index:", error);
            button.disabled = true;
        });


    button.addEventListener("click", () => {

        if (articles.length === 0) {
            return;
        }

        const choice =
            articles[Math.floor(Math.random() * articles.length)];

        window.location.href = choice.url;
    });
})();
