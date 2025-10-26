async function loadComponent(id, file) {
  try {
    const response = await fetch("/partials/" + file);
    if (!response.ok) throw new Error("Erro ao carregar " + file);
    const content = await response.text();
    document.getElementById(id).innerHTML = content;

    // Quando o footer for carregado, injeta o chatbot automaticamente
    if (file === "footer.html") {
      console.log("✅ Footer carregado, iniciando chatbot...");
      injectChatbotLoader();
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "header.html");
  loadComponent("footer", "footer.html");
});

function injectChatbotLoader() {
  // Evita duplicar
  if (document.getElementById("chatbot-loader-script")) return;

  const script = document.createElement("script");
  script.id = "chatbot-loader-script";
  script.src = "/static/js/chatbot-loader.js";
  script.onload = () => {
    console.log("💬 Chatbot loader carregado e executado com sucesso!");
  };
  document.body.appendChild(script);
}
