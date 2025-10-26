// /static/js/chatbot-loader.js
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("💬 Iniciando carregamento do chatbot...");

    // ✅ Caminho base dinâmico (funciona tanto em localhost quanto no servidor)
    const basePath =
      location.hostname === "127.0.0.1" || location.hostname === "localhost"
        ? "static/components/chatbot.html"
        : "/static/components/chatbot.html";

    console.log("📂 Carregando chatbot de:", basePath);

    // Carrega o HTML do chatbot
    const res = await fetch(basePath);
    if (!res.ok) throw new Error(`Erro ao carregar chatbot: ${res.status}`);
    const html = await res.text();

    // Injeta no final do body
    document.body.insertAdjacentHTML("beforeend", html);

    console.log("✅ Chatbot HTML injetado com sucesso.");

    // Detecta o contexto da página (para mensagens personalizadas)
    const path = window.location.pathname.toLowerCase();
    let pageContext = "geral";
    if (path.includes("inteligencia-artificial") || path.includes("ia"))
      pageContext = "inteligência artificial";
    else if (path.includes("automacao")) pageContext = "automação";
    else if (path.includes("dashboards")) pageContext = "dashboards";
    else if (path.includes("desenvolvimento-web") || path.includes("site"))
      pageContext = "desenvolvimento web";
    else if (path.includes("contato")) pageContext = "contato";

    // Define o contexto global
    window.CHATBOT_CONTEXT = pageContext;

    // ✅ Carrega o script principal do chatbot (chatbot.js)
    const script = document.createElement("script");
    script.src =
      location.hostname === "127.0.0.1" || location.hostname === "localhost"
        ? "static/js/chatbot.js"
        : "/static/js/chatbot.js";
    script.defer = true;
    document.body.appendChild(script);

    console.log("🚀 Script do chatbot carregado com sucesso.");
  } catch (err) {
    console.error("❌ Erro ao carregar o chatbot:", err);
  }
});
