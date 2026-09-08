// Builds the "Browse by Tag" cloud at the bottom of articles.html from
// /data/json/articles_tag.json. Every tag used by any article shows up here
// and links to its collection page (/tag.html?type=articles&tags=<tag>).

(async () => {

    const container = document.getElementById("ArticleTagCloud");

    if (!container) {
        return;
    }


    let index;

    try {
        const response = await fetch("/data/json/articles_tag.json");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        index = await response.json();
    } catch (error) {
        console.error("Error loading article tags:", error);
        return;
    }


    // Count how many articles use each tag
    const counts = {};

    for (const entry of index) {
        if (!Array.isArray(entry.tags)) {
            continue;
        }

        for (const tag of entry.tags) {
            const key = String(tag).toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
        }
    }


    const tags = Object.keys(counts).sort();

    if (tags.length === 0) {
        return;
    }


    // Bigger tags are used by more articles
    function groupFor(count) {
        if (count >= 4) return 1;
        if (count === 3) return 2;
        if (count === 2) return 3;
        return 4;
    }


    const list = document.createElement("div");
    list.className = "TagList";

    for (const tag of tags) {

        const item = document.createElement("div");
        item.className = `TagGroup${groupFor(counts[tag])}`;

        const link = document.createElement("a");
        link.href = `/tag.html?type=articles&tags=${encodeURIComponent(tag)}`;
        link.textContent = `${tag} (${counts[tag]})`;

        item.appendChild(link);
        list.appendChild(item);
    }

    container.appendChild(list);
})();
