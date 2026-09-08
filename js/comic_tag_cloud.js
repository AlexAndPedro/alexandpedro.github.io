// Builds the "Browse by Tag" cloud at the bottom of comic_archive.html from
// /data/json/comic.json. Every tag used by any comic shows up here and
// links to its collection page (/tag.html?type=comic&tags=<tag>).

(async () => {

    const container = document.getElementById("ComicTagCloud");

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
        console.error("Error loading comic tags:", error);
        return;
    }


    // Count how many comics use each tag
    const counts = {};

    for (const comic of comics) {
        if (!Array.isArray(comic.tag)) {
            continue;
        }

        for (const tag of comic.tag) {
            const key = String(tag).toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
        }
    }


    const tags = Object.keys(counts).sort();

    if (tags.length === 0) {
        return;
    }


    // Bigger tags are used by more comics
    const max = Math.max(...tags.map(tag => counts[tag]));

    function groupFor(count) {
        const ratio = count / max;
        if (ratio > 0.75) return 1;
        if (ratio > 0.5) return 2;
        if (ratio > 0.25) return 3;
        return 4;
    }


    const list = document.createElement("div");
    list.className = "TagList";

    for (const tag of tags) {

        const item = document.createElement("div");
        item.className = `TagGroup${groupFor(counts[tag])}`;

        const link = document.createElement("a");
        link.href = `/tag.html?type=comic&tags=${encodeURIComponent(tag)}`;
        link.textContent = `${tag} (${counts[tag]})`;

        item.appendChild(link);
        list.appendChild(item);
    }

    container.appendChild(list);
})();
