console.log("🟡 include_es.js carregado!");

async function loadPartial(targetId, file) {
    const url = `/es/partials/${file}`;
    const res = await fetch(url);

    if (!res.ok) return;

    document.getElementById(targetId).innerHTML = await res.text();

    if (file === "footer_es.html") {
        console.log("Iniciando chatbot...")
        loadChatbot();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPartial("header", "header_es.html");
    loadPartial("footer", "footer_es.html");
    loadPartial("hero", "hero.html");
   
});

function loadChatbot() {
    const script = document.createElement("script");
    script.src = "/static/js/chatbot-loader.js";
    script.defer = true;
    document.body.appendChild(script);
}
