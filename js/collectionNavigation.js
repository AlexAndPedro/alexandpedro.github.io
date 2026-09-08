const currentCollection = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

fetch("/data/json/artwork.json")
    .then(response => {
        if (!response.ok) {
            throw new Error(
                `Could not load artwork.json: ${response.status}`
            );
        }

        return response.json();
    })
    .then(artworks => {

        const navigation =
            document.getElementById("collectionNavigation");

        if (!navigation) {
            throw new Error(
                "Collection navigation element not found."
            );
        }


        // ====================================================
        // Get unique non-year collections
        // ====================================================

        const collections = [...new Set(
            artworks
                .map(art => art.collection)
                .filter(collection =>
                    !/^\d{4}$/.test(collection)
                )
        )];


        // ====================================================
        // Sort collections alphabetically
        // ====================================================

        collections.sort((a, b) =>
            a.localeCompare(b)
        );


        // ====================================================
        // Find current collection
        // ====================================================

        const currentIndex =
            collections.indexOf(currentCollection);


        // If this isn't a collection page,
        // don't create collection navigation.
        if (currentIndex === -1) {
            return;
        }


        // ====================================================
        // Determine previous and next collections
        // ====================================================

        const previousCollection =
            currentIndex > 0
                ? collections[currentIndex - 1]
                : null;

        const nextCollection =
            currentIndex < collections.length - 1
                ? collections[currentIndex + 1]
                : null;


        // ====================================================
        // Helper function
        // ====================================================

        function createNavigationItem(
            className,
            text,
            collection
        ) {

            const div =
                document.createElement("div");

            div.className = className;


            const link =
                document.createElement("a");

            link.href =
                `${collection}.html`;

            link.textContent =
                text;


            div.appendChild(link);

            navigation.appendChild(div);
        }


        // ====================================================
        // Previous
        // ====================================================

        if (previousCollection) {

            createNavigationItem(
                "nav-Previous",
                `< ${formatCollectionName(previousCollection)}`,
                previousCollection
            );
        }


        // ====================================================
        // Next
        // ====================================================

        if (nextCollection) {

            createNavigationItem(
                "nav-Next",
                `${formatCollectionName(nextCollection)} >`,
                nextCollection
            );
        }

    })
    .catch(error => {
        console.error(
            "Collection navigation error:",
            error
        );
    });


// ============================================================
// Format collection name for display
// ============================================================

function formatCollectionName(collection) {

    const names = {
        "fanart": "Fan Art",
        "commissions": "Commissions"
    };

    return names[collection] || collection;
}