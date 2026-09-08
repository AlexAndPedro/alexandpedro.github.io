// Renders one article. Every article page is an identical copy of
// html/article_page.html living at /articles/<year>/<slug>/, with an
// index.md next to it holding the front matter + body. This script reads
// that Markdown and fills the newspaper template.

document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("ArticleContainer");

    if (!container) {
        return;
    }


    // Load the article HTML template
    const templateResponse = await fetch("/html/article_template.html");
    container.innerHTML = await templateResponse.text();


    // Load this article's Markdown (sits next to the page)
    let markdown;

    try {
        const response = await fetch("index.md");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        markdown = await response.text();
    } catch (error) {
        console.error("Article: could not load index.md:", error);
        container.innerHTML = "<p>This article could not be loaded.</p>";
        return;
    }


    // Parse front matter, convert the body, fill the template
    const parsed = parseFrontMatter(markdown);
    const article = parsed.data;
    article.body = marked.parse(parsed.content);

    if (article.headline) {
        document.title = `Alex and Pedro | ${article.headline}`;
    }

    // Link the byline author to their cast page, if they have one.
    const authorUrl = window.AuthorLink
        ? await window.AuthorLink.urlFor(article.author)
        : null;

    renderArticle(article, authorUrl);

    renderArticleTags(article.tags);
});


function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


// ------------------------------
// Article tags - straight from this article's own front matter
// ("tags: animals, dog, wolf")
// ------------------------------

function renderArticleTags(tagString) {

    const container = document.querySelector(".ArticleTags");
    const list = document.querySelector(".ArticleTagsList");

    if (!container || !list) {
        return;
    }


    const tags = (tagString || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

    if (tags.length === 0) {
        return;
    }


    list.innerHTML = "";

    for (const tag of tags) {

        const link = document.createElement("a");
        link.className = "ArticleTag";
        link.href = `/tag.html?type=articles&tags=${encodeURIComponent(tag)}`;
        link.textContent = tag;

        list.appendChild(link);
    }

    container.hidden = false;
}


// ------------------------------
// Simple front matter parser
// ------------------------------

function parseFrontMatter(markdown) {

    const data = {};

    // No front matter
    if (!markdown.startsWith("---")) {
        return {
            data: data,
            content: markdown
        };
    }


    // Find closing ---
    const end = markdown.indexOf("\n---", 3);

    if (end === -1) {
        return {
            data: data,
            content: markdown
        };
    }


    const frontMatter = markdown
        .substring(3, end)
        .trim();


    // Parse key:value pairs
    frontMatter.split("\n").forEach(line => {

        const separator = line.indexOf(":");

        if (separator === -1) {
            return;
        }


        const key = line
            .substring(0, separator)
            .trim();


        const value = line
            .substring(separator + 1)
            .trim();


        data[key] = value;

    });


    return {
        data: data,
        content: markdown
            .substring(end + 4)
            .replace(/^-+\s*/, "")
            .trim()
    };

}

// ------------------------------
// Date converter from YYYY-MM-DD to Day, Month DD, YYYY
// ------------------------------

function formatArticleDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

}
// ------------------------------
// Populate article template
// ------------------------------

function renderArticle(article, authorUrl) {

    document.querySelector(".NewsMasthead").textContent =
        article.masthead || "THE MAMPULAN TIMES";


    document.querySelector(".NewsTagline").textContent =
        article.tagline || "The Independent Voice of Mampulan";


    document.querySelector(".NewsVolume").textContent =
        `Vol. ${article.volume || ""}`;


    document.querySelector(".NewsDate").textContent =
        article.date
            ? formatArticleDate(article.date)
            : "";


    document.querySelector(".NewsIssue").textContent =
        `No. ${article.issue || ""}`;


    document.querySelector(".NewsSection").textContent =
        article.section || "";


    document.querySelector(".ArticleHeadline").textContent =
        article.headline || "";


    const authorEl = document.querySelector(".ArticleAuthor");
    const authorName = article.author || "";

    const authorMarkup = authorUrl && authorName
        ? `<a href="${authorUrl.replace(/"/g, "&quot;")}">${escapeHtml(authorName)}</a>`
        : escapeHtml(authorName);

    if (!authorName) {
        authorEl.textContent = "";
    } else if (article.authorTitle) {
        authorEl.innerHTML = `By ${authorMarkup}, ${escapeHtml(article.authorTitle)}`;
    } else {
        authorEl.innerHTML = authorMarkup;
    }


    document.querySelector(".NewsBody").innerHTML =
        article.body || "";

}
