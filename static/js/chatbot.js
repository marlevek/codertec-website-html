// /static/js/chatbot.js
(function () {
  console.log("🤖 [Chatbot] Script carregado — aguardando HTML...");

  const waitForElements = setInterval(() => {
    if (document.getElementById("chatbot-btn") &&
        document.getElementById("chatbot-window")) {
      clearInterval(waitForElements);
      console.log("✅ [Chatbot] HTML detectado. Iniciando...");
      initChatbot();
    }
  }, 200);

  function initChatbot() {
    const LANG = window.CHATBOT_LANG || "pt";
    const CONTEXT = window.CHATBOT_CONTEXT || "general";

    console.log("🌎 Idioma:", LANG, "| Contexto:", CONTEXT);

    // ELEMENTOS
    const chatBtn = document.getElementById("chatbot-btn");
    const chatWindow = document.getElementById("chatbot-window");
    const chatMessages = document.getElementById("chatbot-messages");
    const chatInput = document.getElementById("chatbot-input");
    const chatSend = document.getElementById("chatbot-send");
    const chatClose = document.getElementById("chatbot-close");
    const chatClear = document.getElementById("chatbot-clear");

    let greeted = false;
    let userName = "";
    let businessType = "";
    let step = "start";

    const soundSend = new Audio("/static/sounds/send.mp3");
    const soundReceive = new Audio("/static/sounds/receive.mp3");

    // GERAR SAUDAÇÃO AUTOMÁTICA
    const GREET = LANG === "en"
      ? {
          ai: "Hello! 👋 Looking into AI solutions? Want help applying AI to your business?",
          automation: "Hi! 👋 Checking automation? I can help you improve productivity!",
          dashboards: "Hello! 👋 Want to learn how dashboards can help your business?",
          "web-development": "Hi! 👋 I can help you build a modern website or system!",
          general: "Hello! 👋 I'm CoderTec's virtual assistant. How can I help you today?"
        }
      : {
          ai: "Olá! 👋 Quer saber como aplicar IA no seu negócio?",
          automacao: "Oi! 👋 Quer automatizar processos e ganhar tempo?",
          dashboards: "Olá! 👋 Quer transformar dados em decisões inteligentes?",
          "desenvolvimento-web": "Oi! 👋 Precisa de um site moderno ou sistema web?",
          geral: "Olá! 👋 Sou o assistente da CoderTec. Como posso ajudar hoje?"
        };

    // MENSAGENS DO FLUXO PT/EN
    const M = {
      askName: LANG === "en"
        ? "Before we start, may I know your name? 😊"
        : "Antes de começarmos, posso saber seu nome? 😊",

      askBusiness: name => LANG === "en"
        ? `Nice to meet you, ${name}! 😄 What type of business do you have?`
        : `Prazer, ${name}! 😄 Qual é o seu ramo de atuação?`,

      askService: business => LANG === "en"
        ? `What would you like to build for your ${business}? A website, automation, or an AI solution?`
        : `O que você gostaria de desenvolver para a sua ${business}? Um site, automação ou solução de IA?`,

      askContact: name => LANG === "en"
        ? `All right, ${name}! If you want, I can guide you with more examples.`
        : `Perfeito, ${name}! Posso te ajudar com mais detalhes ou exemplos, se quiser.`
    };

    //----------------------------------------------------------------
    // ABRIR JANELA
    //----------------------------------------------------------------
    chatBtn.addEventListener("click", () => {
      const visible = chatWindow.style.display === "flex";
      chatWindow.style.display = visible ? "none" : "flex";

      if (!greeted) {
        appendMessage(GREET[CONTEXT] || GREET.general, "bot");
        greeted = true;
      }
    });

    chatClose.addEventListener("click", () => {
      chatWindow.style.display = "none";
    });

    //----------------------------------------------------------------
    // FLUXO PERSONALIZADO DO CHATBOT
    //----------------------------------------------------------------
    function handleCustomFlow(text) {
      const lower = text.toLowerCase();

      if (step === "start") {
        appendMessage(M.askName, "bot");
        step = "ask_name";
        return true;
      }

      if (step === "ask_name") {
        userName = text.split(" ")[0];
        appendMessage(M.askBusiness(userName), "bot");
        step = "ask_business";
        return true;
      }

      if (step === "ask_business") {
        businessType = text;
        appendMessage(M.askService(businessType), "bot");
        step = "ask_service";
        return true;
      }

      if (step === "ask_service") {

        if (LANG === "en") {
          if (lower.includes("website")) {
            appendMessage(`Great! 🚀 We can build a modern website for your ${businessType}.`, "bot");
          } else if (lower.includes("automation")) {
            appendMessage(`Awesome! 🤖 We can automate processes for your ${businessType}.`, "bot");
          } else if (lower.includes("ai")) {
            appendMessage(`Nice! 😎 We can create custom AI solutions for your ${businessType}.`, "bot");
          } else {
            appendMessage(`Got it! Tell me more about what you need for your ${businessType}.`, "bot");
          }
        } else {
          if (lower.includes("site")) {
            appendMessage(`Ótimo! 🚀 Podemos criar um site moderno para sua ${businessType}.`, "bot");
          } else if (lower.includes("automação")) {
            appendMessage(`Perfeito! 🤖 Podemos automatizar processos da sua ${businessType}.`, "bot");
          } else if (lower.includes("ia")) {
            appendMessage(`Show! 😎 Podemos criar soluções de IA para sua ${businessType}.`, "bot");
          } else {
            appendMessage(`Certo! Me conte mais sobre o que você precisa para sua ${businessType}.`, "bot");
          }
        }

        step = "ask_contact";
        return true;
      }

      if (step === "ask_contact") {
        appendMessage(M.askContact(userName), "bot");
        step = "done";
        return true;
      }

      return false;
    }

    //----------------------------------------------------------------
    // ENVIAR MENSAGEM
    //----------------------------------------------------------------
    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });

    async function sendMessage() {
      const text = chatInput.value.trim();
      if (!text) return;

      appendMessage(text, "user");
      chatInput.value = "";

      if (handleCustomFlow(text)) return;

      appendMessage(
        LANG === "en"
          ? "Let me think... 🤖"
          : "Deixa eu pensar... 🤖",
        "bot"
      );
    }

    //----------------------------------------------------------------
    // CRIAR MENSAGEM NA TELA
    //----------------------------------------------------------------
    function appendMessage(text, sender) {
      const wrap = document.createElement("div");
      wrap.classList.add("message-container", sender);

      const avatar = document.createElement("div");
      avatar.classList.add("avatar");
      avatar.innerHTML =
        sender === "user"
          ? '<i class="bi bi-person-circle"></i>'
          : '<i class="bi bi-robot"></i>';

      const msg = document.createElement("div");
      msg.classList.add(
        "message",
        sender === "user" ? "user-message" : "bot-message"
      );
      msg.innerHTML = text;

      wrap.appendChild(avatar);
      wrap.appendChild(msg);
      chatMessages.appendChild(wrap);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      (sender === "user" ? soundSend : soundReceive).play();
    }
  }
})();
