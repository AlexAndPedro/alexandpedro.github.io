// Builds the track list inside #MusicList on music.html from
// /data/json/music.json (rebuilt by py/generate_music_json.py, which
// scans the /music folder). Each track gets a thumbnail, an optional
// description and an inline <audio> player.

(async () => {

    const list = document.getElementById("MusicList");

    if (!list) {
        return;
    }


    const PLACEHOLDER = "/images/music_thumbnail/placeholder.svg";


    let tracks;

    try {
        const response = await fetch("/data/json/music.json");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        tracks = await response.json();
    } catch (error) {
        console.error("Music list:", error);
        list.innerHTML = "<p>The music list could not be loaded.</p>";
        return;
    }


    if (!Array.isArray(tracks) || tracks.length === 0) {
        list.innerHTML = "<p>No music here yet.</p>";
        return;
    }


    const esc = value => String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const escAttr = value => esc(value).replace(/"/g, "&quot;");


    const rows = tracks.map(track => {

        const src = encodeURI("/music/" + track.file);
        const title = esc(track.title || track.file.replace(/\.[^.]+$/, ""));

        const thumb = track.thumbnail
            ? encodeURI(track.thumbnail)
            : PLACEHOLDER;

        const description = track.description
            ? `<p class="MusicDesc">${esc(track.description)}</p>`
            : "";

        return `<li class="MusicTrack">
            <img class="MusicThumb" src="${escAttr(thumb)}" alt="" loading="lazy"
                 onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
            <div class="MusicBody">
                <div class="MusicTitle">${title}</div>
                ${description}
                <audio controls preload="none" src="${src}"></audio>
                <a class="MusicDownload" href="${src}" download>Download</a>
            </div>
        </li>`;
    });

    list.innerHTML = `<ol class="MusicTracks">${rows.join("")}</ol>`;
})();
