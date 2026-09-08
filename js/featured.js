// Fills the "Featured" block on index.html (#Featured) with one random
// artwork, comic and article. Rendered once on load, and re-rolled when
// the #FeaturedRefresh button is clicked (the manifests are fetched once
// and cached, so a refresh is instant).
//
//   /data/json/artwork.json        -> art     -> /artwork/<collection>.html
//   /data/json/comic.json          -> comic   -> /comic/NNNN.html
//   /data/json/articles_tag.json   -> article -> entry.url
//
// If the data can't be loaded the whole section hides itself.

(() => {

    const section = document.getElementById("FeaturedSection");
    const root = document.getElementById("Featured");

    if (!root) {
        return;
    }


    const pick = list => list[Math.floor(Math.random() * list.length)];

    const esc = value => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const escAttr = value => esc(value).replace(/"/g, "&quot;");

    // Image paths in comic.json use mixed slashes / leading slashes.
    const comicImage = raw => raw
        ? "/images/" + String(raw).replace(/\\/g, "/").replace(/^\/+/, "")
        : "";

    // "2022" -> "Artwork from 2022"; "fanart" -> "Fan Art"; etc.
    const collectionLabel = name => {
        if (/^\d{4}$/.test(name)) return `Artwork from ${name}`;
        if (name === "fanart") return "Fan Art";
        if (name === "commissions") return "Commissions";
        return name.charAt(0).toUpperCase() + name.slice(1);
    };

    // Lots of artwork "titles" are just the original photo filename.
    const titleLooksReal = title =>
        /[a-zA-Z]/.test(title) && !/^\d{4,}[_\d]/.test(title);

    // Same "#tag" links as the tag.html article cards (js/tags.js).
    const tagLinks = tags => (tags || [])
        .map(tag =>
            `<a href="/tag.html?type=articles&tags=${encodeURIComponent(tag)}">#${esc(tag)}</a>`
        )
        .join(" ");

    const fill = (kind, html) => {
        const cell = root.querySelector(`[data-featured="${kind}"]`);
        if (cell) {
            cell.innerHTML = html;
        }
    };


    // Fetch the three manifests once, then reuse them for every refresh.
    let manifests = null;

    async function loadManifests() {
        if (!manifests) {
            const [artworks, comics, articles] = await Promise.all([
                fetch("/data/json/artwork.json").then(r => r.json()),        // -> artworks
                fetch("/data/json/comic.json").then(r => r.json()),          // -> comics
                fetch("/data/json/articles_tag.json").then(r => r.json())    // -> articles
            ]);
            manifests = { artworks, comics, articles };
        }
        return manifests;
    }


    async function renderFeatured() {

        let data;

        try {
            data = await loadManifests();
        } catch (error) {
            console.error("Featured section:", error);
            if (section) {
                section.hidden = true;
            }
            return;
        }


        // ----- Art -----
        if (Array.isArray(data.artworks) && data.artworks.length) {

            const art = pick(data.artworks);
            const rawTitle = art.title || art.filename || "";
            const caption = titleLooksReal(rawTitle)
                ? rawTitle
                : collectionLabel(art.collection);

            fill("art", `
                <span class="FeaturedKind">Art</span>
                <a href="/artwork/${escAttr(art.collection)}.html">
                    <img src="/images/artwork/${escAttr(art.collection)}/thumbnail/${escAttr(art.filename)}" alt="${escAttr(caption)}">
                    <span class="FeaturedTitle">${esc(caption)}</span>
                </a>
            `);
        }


        // ----- Comic -----
        if (Array.isArray(data.comics) && data.comics.length) {

            const comic = pick(data.comics);
            const number = String(comic.comic_number).padStart(4, "0");
            const title = comic.name || comic.title || `Comic ${number}`;

            fill("comic", `
                <span class="FeaturedKind">Comic</span>
                <a href="/comic/${number}.html">
                    <img src="${escAttr(comicImage(comic.image))}" alt="${escAttr(title)}">
                    <span class="FeaturedTitle">${esc(title)}</span>
                </a>
            `);
        }


        // ----- Article ----- (same layout as the tag.html article cards)
        if (Array.isArray(data.articles) && data.articles.length) {

            const article = pick(data.articles);
            const url = article.url || "#";
            const author = article.author ? `by ${esc(article.author)}` : "";
            const date = article.date ? esc(article.date) : "";

            fill("article", `
                <span class="FeaturedKind">Article</span>
                <a href="${escAttr(url)}"><h3 class="FeaturedTitle" style="margin:0">${esc(article.title || "Untitled")}</h3></a>
                <small>${author}${author && date ? " &middot; " : ""}${date}</small>
                ${article.blurb ? `<p>${esc(article.blurb)}</p>` : ""}
                <small class="TagRow">${tagLinks(article.tags)}</small>
            `);
        }
    }


    const refreshButton = document.getElementById("FeaturedRefresh");
    if (refreshButton) {
        refreshButton.addEventListener("click", () => renderFeatured());
    }

    renderFeatured();
})();
