// /static/js/chatbot-loader.js
(async function loadChatbot() {
  try {
    console.log("💬 [Loader] Iniciando carregamento do chatbot...");

    // Caminho absoluto (funciona em todas as páginas)
    const basePath = "/static/components/chatbot.html";
    console.log("📂 [Loader] Carregando chatbot de:", basePath);

    const res = await fetch(basePath);
    if (!res.ok) throw new Error(`Erro ao carregar chatbot.html (${res.status})`);

    const html = await res.text();

    // Injeta o HTML do chatbot no final do body
    document.body.insertAdjacentHTML("beforeend", html);
    console.log("✅ [Loader] Chatbot HTML injetado com sucesso.");

    // Define o contexto da página (ex: automação, IA, etc.)
    const path = window.location.pathname.toLowerCase();
    let pageContext = "geral";
    if (path.includes("inteligencia-artificial") || path.includes("ia"))
      pageContext = "inteligência artificial";
    else if (path.includes("automacao"))
      pageContext = "automação";
    else if (path.includes("dashboards"))
      pageContext = "dashboards";
    else if (path.includes("desenvolvimento-web") || path.includes("site"))
      pageContext = "desenvolvimento web";
    else if (path.includes("contato"))
      pageContext = "contato";

    window.CHATBOT_CONTEXT = pageContext;

    console.log(`🌎 [Loader] Contexto detectado: ${pageContext}`);

    // Aguarda até o botão existir no DOM antes de carregar o script
    const waitForButton = setInterval(() => {
      const btn = document.getElementById("chatbot-btn");
      if (!btn) return;

      clearInterval(waitForButton);
      console.log("✅ [Loader] Botão do chatbot detectado. Carregando script principal...");

      const script = document.createElement("script");
      script.src = "/static/js/chatbot.js";
      script.defer = true;
      script.onload = () => console.log("🚀 [Loader] Script chatbot.js carregado e executado com sucesso!");
      script.onerror = () => console.error("❌ [Loader] Erro ao carregar chatbot.js");
      document.body.appendChild(script);
    }, 300);
  } catch (err) {
    console.error("❌ [Loader] Erro ao carregar o chatbot:", err);
  }
})();
