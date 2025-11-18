// /static/js/chatbot-loader.js
(async function loadChatbot() {
  try {
    console.log("💬 [Loader] Iniciando carregamento do chatbot...");

    // Detectar idioma global
    const path = window.location.pathname.toLowerCase();
    window.CHATBOT_LANG = path.includes("/en/") ? "en" : "pt";

    console.log("🌎 [Loader] Idioma detectado:", window.CHATBOT_LANG);

    const basePath = "/static/components/chatbot.html";
    const res = await fetch(basePath);

    if (!res.ok) throw new Error(`Erro ao carregar chatbot.html (${res.status})`);

    const html = await res.text();
    document.body.insertAdjacentHTML("beforeend", html);
    console.log("✅ [Loader] Chatbot HTML injetado com sucesso.");

    // Detecta contexto da página
    let detectedContext = "general";

    if (path.includes("automation") || path.includes("automacao"))
      detectedContext = "automation";
    else if (path.includes("dash"))
      detectedContext = "dashboards";
    else if (path.includes("ai") || path.includes("inteligencia"))
      detectedContext = "ai";
    else if (path.includes("web"))
      detectedContext = "web-development";  

    window.CHATBOT_CONTEXT = detectedContext;

    // Aguarda botão do chatbot aparecer
    const waitForButton = setInterval(() => {
      const btn = document.getElementById("chatbot-btn");
      if (!btn) return;

      clearInterval(waitForButton);
      console.log("✅ [Loader] Botão do chatbot detectado. Carregando script principal...");

      const script = document.createElement("script");
      script.src = "/static/js/chatbot.js?v=3";
      script.defer = true;

      script.onload = () =>
        console.log("🚀 [Loader] chatbot.js carregado e executado!");
      script.onerror = () =>
        console.error("❌ [Loader] Erro ao carregar chatbot.js");

      document.body.appendChild(script);
    }, 300);
  } catch (err) {
    console.error("❌ [Loader] Erro ao carregar chatbot:", err);
  }
})();
