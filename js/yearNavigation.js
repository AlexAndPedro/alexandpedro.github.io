const currentYear = window.location.pathname
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
            document.getElementById("yearNavigation");

        if (!navigation) {
            throw new Error(
                "Year navigation element not found."
            );
        }


        // ====================================================
        // Get only year collections
        // ====================================================

        const years = [...new Set(
            artworks
                .map(art => art.collection)
                .filter(collection =>
                    /^\d{4}$/.test(collection)
                )
        )];


        // Sort chronologically
        years.sort(
            (a, b) => Number(a) - Number(b)
        );


        // ====================================================
        // Find current year
        // ====================================================

        const currentIndex =
            years.indexOf(currentYear);


        // If this isn't a year page, don't create
        // year navigation.
        if (currentIndex === -1) {
            return;
        }


        // ====================================================
        // Determine navigation years
        // ====================================================

        const firstYear = years[0];

        const lastYear =
            years[years.length - 1];

        const previousYear =
            currentIndex > 0
                ? years[currentIndex - 1]
                : null;

        const nextYear =
            currentIndex < years.length - 1
                ? years[currentIndex + 1]
                : null;


        // ====================================================
        // Helper function
        // ====================================================

        function createNavigationItem(
            className,
            text,
            year
        ) {

            const div =
                document.createElement("div");

            div.className = className;


            const link =
                document.createElement("a");

            link.href = `${year}.html`;

            link.textContent = text;


            div.appendChild(link);

            navigation.appendChild(div);
        }


        // ====================================================
        // First
        // ====================================================

        // Only show First if it is different from Previous
        if (
            currentIndex > 1
        ) {

            createNavigationItem(
                "nav-First",
                `<< ${firstYear}`,
                firstYear
            );
        }


        // ====================================================
        // Previous
        // ====================================================

        if (previousYear) {

            createNavigationItem(
                "nav-Previous",
                `< ${previousYear}`,
                previousYear
            );
        }


        // ====================================================
        // Next
        // ====================================================

        if (nextYear) {

            createNavigationItem(
                "nav-Next",
                `${nextYear} >`,
                nextYear
            );
        }


        // ====================================================
        // Last
        // ====================================================

        // Only show Last if it is different from Next
        if (
            currentIndex < years.length - 2
        ) {

            createNavigationItem(
                "nav-Latest",
                `${lastYear} >>`,
                lastYear
            );
        }

    })
    .catch(error => {
        console.error(
            "Navigation error:",
            error
        );
    });