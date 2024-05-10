import { GoogleGenerativeAI } from "@google/generative-ai";

// Substitua pela sua chave de API
const API_KEY = "AIzaSyAnbkEeK-eWag5qF8UZBEPI4Ae2Ep3zAAI"; 

const genAI = new GoogleGenerativeAI(API_KEY);

// Use o modelo 'gemini-pro' para chat
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const generationConfig = {
  temperature: 0.9,
};


// Inicia a conversa
const chat = model.startChat({}); 

// Elementos do HTML
const chatMessagesEl = document.getElementById("chat-messages");
const messageInputEl = document.getElementById("message-input");
const sendButtonEl = document.getElementById("send-button");

// Função para adicionar mensagens ao chat
function appendMessage(role, text) {
  const messageEl = document.createElement("li");
  messageEl.classList.add("message", `${role}-message`);
  messageEl.textContent = text;
  chatMessagesEl.appendChild(messageEl);
}

// Função para enviar a mensagem e obter a resposta
async function sendMessage() {
  const message = messageInputEl.value.trim();
  if (message) {
    appendMessage("user", message);
    messageInputEl.value = "";

    try {
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const teacherMessage = response.text();
      appendMessage("teacher", teacherMessage);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      // Opcional: Exibir uma mensagem de erro para o usuário
    }
  }
}

// Evento de clique no botão "Enviar"
sendButtonEl.addEventListener("click", sendMessage);

// Evento de pressionar "Enter" no campo de entrada
messageInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});