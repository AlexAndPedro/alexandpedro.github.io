// Shared helper: resolve an article author's name to their cast profile
// (/cast/character.html?c=<slug>) using /data/json/cast.json.
//
// Loaded by articles.html (for the archive table) and by every article
// page via html/article_page.html (for the "By <author>" byline).
//
// Authors with no matching cast member just stay plain text.

window.AuthorLink = (() => {

    let castPromise = null;

    function loadCast() {
        if (!castPromise) {
            castPromise = fetch("/data/json/cast.json")
                .then(response => (response.ok ? response.json() : {}))
                .catch(() => ({}));
        }
        return castPromise;
    }


    // Cast slug for `authorName`, or null. Matches on the full name, and
    // also when one is the other plus a title
    // ("Pangil" <-> "Pangil the Wolf Legend").
    async function slugFor(authorName) {

        const want = String(authorName || "").trim().toLowerCase();

        if (!want) {
            return null;
        }

        const cast = await loadCast();

        for (const group of Object.values(cast)) {

            if (!Array.isArray(group)) {
                continue;
            }

            for (const member of group) {

                if (!member || !member.slug) {
                    continue;
                }

                const name = String(member.name || "").trim().toLowerCase();

                if (name && (
                    name === want ||
                    name.startsWith(want + " ") ||
                    want.startsWith(name + " ")
                )) {
                    return member.slug;
                }
            }
        }

        return null;
    }


    // Full profile URL for `authorName`, or null.
    async function urlFor(authorName) {
        const slug = await slugFor(authorName);
        return slug
            ? `/cast/character.html?c=${encodeURIComponent(slug)}`
            : null;
    }


    return { slugFor, urlFor };
})();
