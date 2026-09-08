// Colour themes. "pedro" is the default (blue) and needs no class; each
// other theme adds .theme-<name> to .gradient + .PageBody (same mechanism
// as ToggleDarkMode.js). The choice is stored in localStorage("theme")
// and restored on every page by js/index.js.

var THEMES = ["pedro", "alex", "ertle", "pangil"];


function SetTheme(name) {

    if (THEMES.indexOf(name) === -1) {
        name = "pedro";
    }

    var targets = [
        document.querySelector(".gradient"),
        document.querySelector(".PageBody")
    ];

    targets.forEach(function (el) {
        if (!el) {
            return;
        }
        THEMES.forEach(function (theme) {
            el.classList.remove("theme-" + theme);
        });
        if (name !== "pedro") {
            el.classList.add("theme-" + name);
        }
    });

    localStorage.setItem("theme", name);

    ReflectTheme();
}


// Fill in the active theme's button, if the header is on the page.
function ReflectTheme() {

    var saved = localStorage.getItem("theme");
    var active = THEMES.indexOf(saved) === -1 ? "pedro" : saved;

    document.querySelectorAll("[data-theme-choice]").forEach(function (button) {
        button.classList.toggle(
            "theme-choice-active",
            button.dataset.themeChoice === active
        );
    });
}


// header.html is injected after load; this file runs once it is in the
// DOM, so highlight the current choice now.
ReflectTheme();
