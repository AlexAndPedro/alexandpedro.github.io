// Renders a character profile page, the same way js/article_reader.js
// renders articles.
//
// Two ways in:
//   * a dedicated page:  <body data-character="alexpaws">
//   * the shared page:   /cast/character.html?c=<slug>
//
// Content comes from /cast/md/<slug>.md when that file exists. Otherwise
// the profile falls back to the character's name / image / blurb in
// /data/json/cast.json, so placeholder cast members still get a page.
//
// Front matter drives the infobox; the Markdown body becomes the
// biography. Any front-matter key that isn't reserved (below) turns into
// an "Information" row automatically, in file order - so adding a fact is
// just adding a line.

document.addEventListener("DOMContentLoaded", async () => {

    const mount = document.getElementById("CharacterContainer");

    if (!mount) {
        return;
    }

    // Layout template
    try {
        const templateResponse = await fetch("/html/character_template.html");
        mount.innerHTML = await templateResponse.text();
    } catch (error) {
        console.error("Character profile: template failed to load:", error);
        return;
    }

    const slug =
        document.body.dataset.character ||
        new URLSearchParams(window.location.search).get("c") ||
        "";

    if (!slug) {
        mount.innerHTML = "<p>No character was specified.</p>";
        return;
    }

    // Preferred source: a Markdown profile.
    let markdown = null;

    try {
        const response = await fetch(`/cast/md/${slug}.md`);
        if (response.ok) {
            markdown = await response.text();
        }
    } catch (error) {
        // fall through to the cast.json fallback
    }

    if (markdown !== null) {
        const { data, content } = parseFrontMatter(markdown);
        renderCharacter(data, content);
        return;
    }

    // Fallback: name / image / blurb straight from cast.json.
    await renderFromCastList(slug, mount);
});


async function renderFromCastList(slug, mount) {

    let entry = null;

    try {
        const cast = await fetch("/data/json/cast.json").then(res => res.json());

        for (const group of Object.values(cast)) {
            const found = group.find(character => character.slug === slug);
            if (found) {
                entry = found;
                break;
            }
        }
    } catch (error) {
        console.error("Character profile: cast.json failed to load:", error);
    }

    if (!entry) {
        mount.innerHTML = "<p>This character profile could not be found.</p>";
        return;
    }

    const data = { name: entry.name };

    if (entry.image) {
        data.image = entry.image;
    }

    const body = entry.description
        ? entry.description
        : "_This profile is still being written._";

    renderCharacter(data, body);
}


// Front-matter keys the infobox handles itself; anything else becomes a
// labelled row under "Information".
const RESERVED_KEYS = new Set([
    "name",
    "image",
    "artist",
    "quote",
    "category"
]);


function renderCharacter(data, content) {

    const name =
        data.name || document.body.dataset.character || "Unknown";

    document.title = `Alex and Pedro | ${name}`;


    // ---------- Infobox ----------

    const infobox = document.querySelector(".CharacterInfoboxBody");

    if (infobox) {

        const rows = [
            `<tr><td colspan="2" class="CharacterInfoboxName">${escapeHtml(name)}</td></tr>`
        ];

        if (data.image) {
            const title = data.artist
                ? ` title="art by ${escapeAttr(data.artist)}"`
                : "";

            rows.push(
                `<tr><td colspan="2">` +
                    `<img src="${escapeAttr(data.image)}" alt="${escapeAttr(name)}"${title}>` +
                `</td></tr>`
            );
        }

        const infoKeys = Object.keys(data).filter(key =>
            !RESERVED_KEYS.has(key) && String(data[key]).trim() !== ""
        );

        if (infoKeys.length) {
            rows.push(
                `<tr><td colspan="2" class="CharacterInfoboxInfoTitle">Information</td></tr>`
            );

            for (const key of infoKeys) {
                rows.push(
                    `<tr class="CharacterInfoboxInfo">` +
                        `<td><b>${escapeHtml(labelFor(key))}</b></td>` +
                        // Values may carry light HTML (<br>, <a>), like the
                        // article Markdown does - the file is author-owned.
                        `<td>${data[key]}</td>` +
                    `</tr>`
                );
            }
        }

        infobox.innerHTML = rows.join("");
    }


    // ---------- Pull quote ----------

    const quoteBox = document.querySelector(".CharacterQuote");

    if (quoteBox && data.quote) {
        quoteBox.querySelector("em").textContent =
            data.quote.replace(/^["']|["']$/g, "");
        quoteBox.hidden = false;
    }


    // ---------- Biography ----------

    const bodyEl = document.querySelector(".characterBody");

    if (bodyEl) {
        bodyEl.innerHTML =
            typeof marked !== "undefined"
                ? marked.parse(content)
                : escapeHtml(content);
    }
}


// "fullName" -> "Full Name" ; "age" -> "Age"
function labelFor(key) {
    return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, character => character.toUpperCase())
        .trim();
}


// Minimal "--- key: value ---" front-matter parser, matching the one in
// js/article_reader.js (closing fence must be on its own line).
function parseFrontMatter(markdown) {

    const data = {};

    if (!markdown.startsWith("---")) {
        return { data, content: markdown };
    }

    const end = markdown.indexOf("\n---", 3);

    if (end === -1) {
        return { data, content: markdown };
    }

    const frontMatter = markdown.substring(3, end).trim();
    const content = markdown.substring(end + 4).replace(/^-+\s*/, "").trim();

    for (const line of frontMatter.split("\n")) {

        const separator = line.indexOf(":");

        if (separator === -1) {
            continue;
        }

        const key = line.substring(0, separator).trim();
        const value = line.substring(separator + 1).trim();

        if (key) {
            data[key] = value;
        }
    }

    return { data, content };
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
