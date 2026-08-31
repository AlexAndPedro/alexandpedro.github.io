import lightGallery from "https://esm.sh/lightgallery@2.1.2";

import lgZoom from "https://esm.sh/lightgallery@2.1.2/plugins/zoom";
import lgThumbnail from "https://esm.sh/lightgallery@2.1.2/plugins/thumbnail";
import lgShare from "https://esm.sh/lightgallery@2.1.2/plugins/share";
import lgRotate from "https://esm.sh/lightgallery@2.1.2/plugins/rotate";
import lgAutoplay from "https://esm.sh/lightgallery@2.1.2/plugins/autoplay";
import lgFullscreen from "https://esm.sh/lightgallery@2.1.2/plugins/fullscreen";


const collection = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");


fetch("../json/artwork.json")
    .then(response => {

        if (!response.ok) {
            throw new Error(
                `Could not load artwork.json: ${response.status}`
            );
        }

        return response.json();
    })


    .then(artworks => {

        const gallery =
            document.getElementById("gallery");

        if (!gallery) {
            throw new Error(
                "Gallery element not found."
            );
        }


        artworks
            .filter(art => art.collection === collection)
            .forEach(art => {

                const link =
                    document.createElement("a");

                link.href =
                    `../images/artwork/${art.collection}/${art.filename}`;

                link.dataset.lgSize =
                    `${art.width}-${art.height}`;

                link.dataset.subHtml = `
                    <h4>${art.title}</h4>
                    <p>${art.description || ""}</p>
                `;


                const img =
                    document.createElement("img");

                img.src =
                    `../images/artwork/${art.collection}/thumbnail/${art.filename}`;

                img.alt = art.title;


                link.appendChild(img);
                gallery.appendChild(link);
            });


        // Initialize LightGallery
        // AFTER the images have been created.

        lightGallery(gallery, {

            selector: "a",

            plugins: [
                lgZoom,
                lgThumbnail,
                lgShare,
                lgRotate,
                lgFullscreen,
                lgAutoplay
            ],

            speed: 500,

            autoplayFirstVideo: false,
            pager: false,

            mobileSettings: {
                controls: false,
                showCloseIcon: false,
                download: false,
                rotate: false
            }
        });

    })


    .catch(error => {

        console.error(
            "Gallery error:",
            error
        );

    });