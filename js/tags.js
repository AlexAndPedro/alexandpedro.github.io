// tag.html — renders a collection of content that shares one or more tags.
//
// URL shape:  /tag.html?type=articles&tags=animals
//             /tag.html?type=comic&tags=alex
//             /tag.html?type=comic&tags=alex,pangil   (matches ANY listed tag)
//
// Data source per type:
//   articles -> /data/json/articles_tag.json
//                 array of { url, title, author, date, blurb, tags: [...] }
//   comic    -> /data/json/comic.json
//                 array of { comic_number, title, name, date, image, tag: [...] }

const params = new URLSearchParams(window.location.search);
const rawType = (params.get("type") || "articles").toLowerCase();
const isComic = rawType === "comic" || rawType === "comics";
const tagType = isComic ? "comic" : rawType;

const requestedTags = (params.get("tags") || "")
    .split(",")
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);

const prettyTags = requestedTags.join(", ");


async function loadJSON() {
    const source = isComic
        ? "/data/json/comic.json"
        : `/data/json/${tagType}_tag.json`;

    const response = await fetch(source);

    if (!response.ok) {
        throw new Error(`Network response was not ok (${response.status})`);
    }

    return response.json();
}


// Does this entry carry at least one of the requested tags?
function entryMatches(entryTags) {
    if (!Array.isArray(entryTags)) {
        return false;
    }

    const normalised = entryTags.map(tag => String(tag).toLowerCase());

    return requestedTags.some(tag => normalised.includes(tag));
}


// Comic image paths in the JSON are inconsistent (leading slash or
// backslashes); normalise them to a usable "/images/comic/..." URL.
function comicImage(raw) {
    if (!raw) {
        return "";
    }

    const cleaned = String(raw)
        .replace(/\\/g, "/")
        .replace(/^\/+/, "");

    return `/images/${cleaned}`;
}


function tagLinks(tags, type) {
    return (tags || [])
        .map(tag =>
            `<a href="/tag.html?type=${type}&tags=${encodeURIComponent(tag)}">#${tag}</a>`
        )
        .join(" ");
}


function renderComics(data) {
    let html = "";
    let matches = 0;

    for (const entry of data) {
        if (!entryMatches(entry.tag)) {
            continue;
        }

        matches++;

        const number = String(entry.comic_number).padStart(4, "0");
        const title = entry.name || entry.title || `Comic ${number}`;
        const date = entry.date || "";

        html += `<div class="comicarchiveframe" style="width:380px;">
            <a href="/comic/${number}.html">
                <img src="${comicImage(entry.image)}" alt="${title}" title="Click to read." width="380">
                <h3 style="margin:0">${title}</h3>
                <small>${date}</small>
            </a>
            <small class="TagRow">${tagLinks(entry.tag, "comic")}</small>
        </div><br>`;
    }

    return { html, matches };
}


function renderArticles(data) {
    let html = "";
    let matches = 0;

    for (const entry of data) {
        if (!entryMatches(entry.tags)) {
            continue;
        }

        matches++;

        const title = entry.title || "Untitled";
        const author = entry.author ? `by ${entry.author}` : "";
        const date = entry.date || "";
        const blurb = entry.blurb || "";
        const url = entry.url || "#";

        html += `<div class="comicarchiveframe" style="width:380px;">
            <a href="${url}"><h3 style="margin:0">${title}</h3></a>
            <small>${author}${author && date ? " &middot; " : ""}${date}</small>
            <p>${blurb}</p>
            <small class="TagRow">${tagLinks(entry.tags, "articles")}</small>
        </div><br>`;
    }

    return { html, matches };
}


function renderData(data) {
    const { html, matches } = isComic
        ? renderComics(data)
        : renderArticles(data);

    const label = requestedTags.length > 1 ? "any of " : "";
    const noun = isComic ? "comics" : tagType;
    const heading = isComic ? "Comics" : capitalise(tagType);

    document.getElementById("PageTitle").innerHTML =
        `<title>Alex and Pedro &raquo; ${prettyTags}</title>`;

    document.getElementById("TagTitle").innerHTML = matches > 0
        ? `${heading} tagged ${label}"${prettyTags}" (${matches})`
        : `Sorry! There's no ${noun} with the tag "${prettyTags}".`;

    document.getElementById("abc").innerHTML = html;
}


function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}


(async () => {
    try {
        const data = await loadJSON();
        renderData(data);
    } catch (error) {
        console.error(error);

        const title = document.getElementById("TagTitle");
        if (title) {
            const noun = isComic ? "comics" : tagType;
            title.innerHTML =
                `Sorry! There's no ${noun} with the tag "${prettyTags}".`;
        }
    }
})();
