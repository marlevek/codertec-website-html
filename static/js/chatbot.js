document.addEventListener("DOMContentLoaded", function () {
  const interval = setInterval(() => {
    const chatBtn = document.getElementById("chatbot-btn");
    if (!chatBtn) return;

    clearInterval(interval);
    initChatbot();
  }, 200);

  function initChatbot() {
    const chatWindow = document.getElementById("chatbot-window");
    const chatMessages = document.getElementById("chatbot-messages");
    const chatInput = document.getElementById("chatbot-input");
    const chatSend = document.getElementById("chatbot-send");
    const chatClose = document.getElementById("chatbot-close");
    const chatClear = document.getElementById("chatbot-clear");

   const API_URL = "https://web-production-6e4b.up.railway.app/api/chat/";

    const context = window.CHATBOT_CONTEXT || "geral";

    let greeted = false;
    let userName = localStorage.getItem("codertec_user_name") || "";
    let businessType = localStorage.getItem("codertec_business_type") || "";
    let step = localStorage.getItem("codertec_step") || "start";

    const soundSend = new Audio("/static/sounds/send.mp3");
    const soundReceive = new Audio("/static/sounds/receive.mp3");

    loadChatHistory();

    document.getElementById("chatbot-btn").addEventListener("click", () => {
      chatWindow.style.display =
        chatWindow.style.display === "flex" ? "none" : "flex";

      const hasHistory = chatMessages.children.length > 0;
      if (!hasHistory && !greeted) {
        const greetings = {
          "inteligência artificial":
            "Olá! 👋 Vejo que você está explorando nossa página de Inteligência Artificial. Quer saber como podemos aplicar IA no seu negócio?",
          automação:
            "Oi! 👋 Está na página de Automação? Posso te mostrar como automatizar processos e economizar tempo!",
          dashboards:
            "Olá! 👋 Vejo que você está na seção de Dashboards! Quer saber como transformamos dados em decisões inteligentes?",
          "desenvolvimento web":
            "Oi! 👋 Está vendo sobre Desenvolvimento Web? Posso te ajudar a criar um site moderno e com IA!",
          contato:
            "Olá! 👋 Está na página de contato — posso te ajudar antes de enviar sua mensagem?",
          geral:
            "Olá! 👋 Sou o assistente virtual da CoderTec. Posso te ajudar a criar um site, automatizar processos ou aplicar IA no seu negócio?"
        };

        appendMessage(greetings[context] || greetings["geral"], "bot");
        greeted = true;
        saveChatHistory();
      }
    });

    chatClose.addEventListener("click", () => (chatWindow.style.display = "none"));

    if (chatClear) {
      chatClear.addEventListener("click", () => {
        localStorage.clear();
        chatMessages.innerHTML = "";
        greeted = false;
        userName = "";
        businessType = "";
        step = "start";
        appendMessage("Nova conversa iniciada! 👋 Como posso te ajudar?", "bot");
        saveChatHistory();
      });
    }

    chatSend.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    function appendMessage(text, sender) {
      const msgContainer = document.createElement("div");
      msgContainer.classList.add("message-container", sender);

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

      if (sender === "bot") {
        if (text.includes("<a")) msg.innerHTML = text;
        else
          msg.innerHTML = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
          );
      } else msg.textContent = text;

      msgContainer.appendChild(avatar);
      msgContainer.appendChild(msg);
      chatMessages.appendChild(msgContainer);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      saveChatHistory();
      (sender === "user" ? soundSend : soundReceive).play();
    }

    async function sendMessage() {
      const text = chatInput.value.trim();
      if (text === "") return;
      appendMessage(text, "user");
      chatInput.value = "";

      if (handleCustomFlow(text)) {
        saveChatHistory();
        return;
      }

      const typingMsg = document.createElement("div");
      typingMsg.classList.add("message", "bot-message");
      typingMsg.textContent = "Digitando...";
      chatMessages.appendChild(typingMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });

        const data = await response.json();
        typingMsg.remove();

        if (data.reply) appendMessage(data.reply, "bot");
        else appendMessage("Desculpe, não consegui entender 😅", "bot");
      } catch (error) {
        typingMsg.remove();
        appendMessage("❌ Erro ao se conectar com o servidor.", "bot");
      }
    }

    // 💬 Fluxo inteligente com gênero
    function handleCustomFlow(userText) {
      const lower = userText.toLowerCase();

      if (step === "start") {
        appendMessage("Antes de começarmos, posso saber seu nome? 😊", "bot");
        step = "ask_name";
        localStorage.setItem("codertec_step", step);
        return true;
      }

      if (step === "ask_name") {
        userName = userText.split(" ")[0];
        localStorage.setItem("codertec_user_name", userName);
        appendMessage(
          `Prazer, ${userName}! 😄 Qual é o seu ramo de atuação ou tipo de negócio? (ex: consultório, clínica, loja, escritório...)`,
          "bot"
        );
        step = "ask_business";
        localStorage.setItem("codertec_step", step);
        return true;
      }

      if (step === "ask_business") {
        businessType = userText;
        localStorage.setItem("codertec_business_type", businessType);

        const negocio = businessType
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

        const femininas = [
          "loja", "empresa", "clinica", "escola", "farmacia",
          "oficina", "agencia", "padaria", "boutique", "academia",
          "igreja", "confeitaria", "panificadora"
        ];

        const artigoNegocio = femininas.some((w) => negocio.includes(w))
          ? "sua"
          : "seu";

        appendMessage(
          `Entendido! E o que você gostaria de desenvolver para a ${artigoNegocio} ${businessType}? Um site, automação ou solução de IA?`,
          "bot"
        );

        step = "ask_service";
        localStorage.setItem("codertec_step", step);
        return true;
      }

      if (step === "ask_service") {
        const negocio = businessType
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

        const femininas = [
          "loja", "empresa", "clinica", "escola", "farmacia",
          "oficina", "agencia", "padaria", "boutique", "academia",
          "igreja", "confeitaria", "panificadora"
        ];

        const eFeminino = femininas.some((w) => negocio.includes(w));
        const artigoSimples = eFeminino ? "sua" : "seu";
        const artigoPreposicao = eFeminino ? "na sua" : "no seu";

        if (lower.includes("site")) {
          appendMessage(
            `Perfeito, ${userName}! 🚀 Podemos criar um site moderno ${artigoPreposicao} ${businessType}, com agendamento online, chatbot e integração com IA. Quer que eu te envie um exemplo ou proposta pelo WhatsApp?`,
            "bot"
          );
        } else if (lower.includes("automação")) {
          appendMessage(
            `Excelente, ${userName}! 🤖 Podemos automatizar tarefas e processos da ${artigoSimples} ${businessType}. Deseja que eu te envie mais detalhes pelo WhatsApp?`,
            "bot"
          );
        } else if (lower.includes("ia") || lower.includes("inteligência")) {
          appendMessage(
            `Show, ${userName}! 😎 Criamos agentes de IA sob medida para empresas do ramo da ${artigoSimples} ${businessType}. Posso te mostrar um exemplo pelo WhatsApp?`,
            "bot"
          );
        } else {
          appendMessage(
            `Certo, ${userName}! Pode me contar um pouco mais sobre o que você precisa para a ${artigoSimples} ${businessType}?`,
            "bot"
          );
        }

        step = "ask_contact";
        localStorage.setItem("codertec_step", step);
        return true;
      }

      if (step === "ask_contact") {
        appendMessage(
          `Perfeito, ${userName}! 👍 Você pode falar diretamente com nosso time clicando abaixo:`,
          "bot"
        );
        appendMessage(
          "👉 <a href='https://wa.me/5541996131762?text=Olá!%20Falei%20com%20o%20assistente%20da%20CoderTec%20e%20quero%20mais%20informações!' target='_blank'>Falar no WhatsApp 💬</a>",
          "bot"
        );
        step = "done";
        localStorage.setItem("codertec_step", step);
        return true;
      }

      return false;
    }

    function saveChatHistory() {
      localStorage.setItem("codertec_chat_history", chatMessages.innerHTML);
    }

    function loadChatHistory() {
      const saved = localStorage.getItem("codertec_chat_history");
      if (saved) chatMessages.innerHTML = saved;
    }
  }
});
