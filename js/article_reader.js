document.addEventListener("DOMContentLoaded", async () => {

    // Load the article HTML template
    const templateResponse = await fetch("/html/article_template.html");
    const template = await templateResponse.text();

    document.getElementById("ArticleContainer").innerHTML = template;


    // Get article information from the HTML body
    const articleName = document.body.dataset.article;
    const articleYear = document.body.dataset.year;


    // Load Markdown article
    const articleResponse = await fetch(
        `/articles/${articleYear}/md/${articleName}.md`
    );

    const markdown = await articleResponse.text();


    // Parse Markdown front matter
    const parsed = parseFrontMatter(markdown);


    // Convert Markdown body into HTML
    const article = parsed.data;
    article.body = marked.parse(parsed.content);


    // Fill the template
    renderArticle(article);

});


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
    const end = markdown.indexOf("---", 3);

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
            .substring(end + 3)
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

function renderArticle(article) {

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


    document.querySelector(".ArticleAuthor").textContent =
        article.authorTitle
            ? `By ${article.author}, ${article.authorTitle}`
            : article.author || "";


    document.querySelector(".NewsBody").innerHTML =
        article.body || "";

}