document.addEventListener("DOMContentLoaded", () => {
    const base = window.location.origin + "/es/partials/";

    // HEADER
    fetch(base + "header.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("header").innerHTML = html;
        })
        .catch(() => console.log("⚠️ No se pudo cargar el header ES."));

    // FOOTER
    fetch(base + "footer.html")
        .then(r => r.text())
        .then(html => {
            document.getElementById("footer").innerHTML = html;
        })
        .catch(() => console.log("⚠️ No se pudo cargar el footer ES."));
});
