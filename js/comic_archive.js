// Builds the comic archive inside #ComicArchive on comic_archive.html from
// /data/json/comic.json.
//
// Comics are grouped by year (newest first) and shown as thumbnail cards
// in the same style as the tag collection pages
// (/tag.html?type=comic&tags=...). Add an entry to comic.json and its
// card shows up here automatically.

(async () => {

    const container = document.getElementById("ComicArchive");

    if (!container) {
        return;
    }


    let comics;

    try {
        const response = await fetch("/data/json/comic.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        comics = await response.json();
    } catch (error) {
        console.error("Error loading comics:", error);
        container.innerHTML = "<p>The comic archive could not be loaded.</p>";
        return;
    }


    // --------------------------------------------------------
    // Helpers (mirrors js/tags.js so the cards match tag.html)
    // --------------------------------------------------------

    // Image paths in comic.json are inconsistent (leading slash or
    // backslashes); normalise to "/images/comic/...".
    function comicImage(raw) {
        if (!raw) {
            return "";
        }

        const cleaned = String(raw)
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");

        return `/images/${cleaned}`;
    }


    function tagLinks(tags) {
        return (tags || [])
            .map(tag =>
                `<a href="/tag.html?type=comic&tags=${encodeURIComponent(tag)}">#${escapeHtml(tag)}</a>`
            )
            .join(" ");
    }


    function yearOf(dateString) {
        const match = /^(\d{4})-\d{2}-\d{2}/.exec(dateString || "");
        return match ? match[1] : "";
    }


    function dateValue(dateString) {
        const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateString || "");

        if (!match) {
            return 0;
        }

        return Number(match[1]) * 10000 +
            Number(match[2]) * 100 +
            Number(match[3]);
    }


    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/"/g, "&quot;");
    }


    // --------------------------------------------------------
    // Group by year
    // --------------------------------------------------------

    const byYear = new Map();

    for (const comic of comics) {

        const year = yearOf(comic.date) || "Undated";

        if (!byYear.has(year)) {
            byYear.set(year, []);
        }

        byYear.get(year).push(comic);
    }


    // Numeric years newest first; "Undated" last.
    const years = [...byYear.keys()].sort((a, b) => {

        const aNum = /^\d+$/.test(a);
        const bNum = /^\d+$/.test(b);

        if (aNum && bNum) return Number(b) - Number(a);
        if (aNum) return -1;
        if (bNum) return 1;
        return a.localeCompare(b);
    });


    // --------------------------------------------------------
    // Render
    // --------------------------------------------------------

    const parts = [];

    for (const year of years) {

        const group = byYear.get(year).slice();

        // Newest comic first within a year.
        group.sort((a, b) =>
            dateValue(b.date) - dateValue(a.date) ||
            Number(b.comic_number) - Number(a.comic_number)
        );

        parts.push(`<h1>${escapeHtml(year)}</h1>`);

        for (const comic of group) {

            const number = String(comic.comic_number).padStart(4, "0");
            const title = comic.name || comic.title || `Comic ${number}`;
            const date = comic.date || "";

            parts.push(
                `<div class="comicarchiveframe" style="width:380px;">
    <a href="/comic/${number}.html">
        <img src="${escapeAttr(comicImage(comic.image))}" alt="${escapeAttr(title)}" title="Click to read." width="380">
        <h3 style="margin:0">${escapeHtml(title)}</h3>
        <small>${escapeHtml(date)}</small>
    </a>
    <small class="TagRow">${tagLinks(comic.tag)}</small>
</div><br>`
            );
        }
    }

    container.innerHTML = parts.join("\n");
})();
