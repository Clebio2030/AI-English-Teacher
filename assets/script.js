import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
const API_KEY = "AIzaSyB5LkwjcaxoYtGHrCwljWZ0dGxBNbX43uE";
const genAI = new GoogleGenerativeAI(API_KEY);

const generationConfig = {
    temperature: 0.1,
  };

// Modelo 'gemini-pro' para chat
const model = genAI.getGenerativeModel({ 
    model: "gemini-pro",
    generationConfig,
  }); 

// Inicia a conversa
let chat = model.startChat({});

// Elementos do HTML
const chatMessagesEl = document.getElementById("chat-messages");
const messageInputEl = document.getElementById("message-input");
const sendButtonEl = document.getElementById("send-button");
const trashButtonEl = document.getElementById("trash-button"); // Adicione o botão de limpar

// Variável para controlar a ocultação da primeira mensagem
let firstMessageSent = false;

// Função para adicionar mensagens ao chat
function appendMessage(role, text) {
  const messageEl = document.createElement("li");
  messageEl.classList.add("message", `${role}-message`);

  // Criar parágrafos e transformar links
  const paragraphs = text.split("\n\n");
  paragraphs.forEach((paragraph) => {
    const p = document.createElement("p");
    p.innerHTML = paragraph.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    messageEl.appendChild(p);
  });

  chatMessagesEl.appendChild(messageEl);
}

// Função para enviar a mensagem e obter a resposta
async function sendMessage(messageText) {
  if (firstMessageSent) {
    appendMessage("user", messageText);
  } else {
    firstMessageSent = true; // Marca a primeira mensagem como enviada
  }

  try {
    const result = await chat.sendMessage(messageText);
    const response = await result.response;
    const teacherMessage = response.text();

    // Formata a mensagem do professor antes de exibir
    const formattedMessage = formatTeacherMessage(teacherMessage);
    appendMessage("teacher", formattedMessage); 
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    // Exibir uma mensagem de erro para o usuário
  }
}



// Enviar mensagem automática "Olá" e obter a resposta
(async () => {
  const introMessage = 
  "Sua primeira mensagem sempre será: Olá eu sou a Mari e vou te ensinar inglês com músicas, qual música você quer aprender? Você se chama Mari. Você é professora especialista em ensinar inglês com músicas, traduzindo e explicando elas de forma bem divertida sobre todas as músicas e tem um vasto conhecimento sobre todas as músicas da atualidade forneça detalhes precisos sobre as letras das músicas e suas traduções. 🎤🎶\n" +
  "IMPORTANTE: Não use asteristicos nas palavras (*), formate o texto para ser lido poluição visual. Responda de forma amigável, entusiasmada e envolvente, como uma professora que adora ensinar inglês com música. Use emojis para tornar as interações mais divertidas e expressivas. 😉✨\n" +
  "Quando o aluno fornecer uma música, você deve:\n" +
  "1. Ouvir a música: Simule que você ouviu a música (você tem acesso a um vasto conhecimento de músicas internacionais). 🎧\n" +
  "2. Traduzir trechos: Selecione trechos interessantes da letra e forneça a tradução para o português. 🇧🇷\n" +
  "3. Explicar expressões: Explique expressões idiomáticas, gírias ou outras construções linguísticas que possam ser desafiadoras para o aluno. 🤓\n";

  await sendMessage(introMessage); 
})();

// Função para formatar a mensagem do professor
function formatTeacherMessage(message) {
  // 1. Remover asteriscos
  message = message.replace(/\*/g, '');

  // 2. Adicionar quebras de linha antes de listas numeradas 
  message = message.replace(/\n(\d+\.\s)/g, '\n\n$1'); 

  return message;
}

// Evento de clique no botão "Enviar"
sendButtonEl.addEventListener("click", () => {
  const message = messageInputEl.value.trim();
  if (message) {
    sendMessage(message);
    messageInputEl.value = ""; 
  }
});

// Evento de pressionar "Enter" no campo de entrada
messageInputEl.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendButtonEl.click();
  }
});

function clearConversation() {
  chatMessagesEl.innerHTML = ""; // Limpa as mensagens
  firstMessageSent = false; // Reseta a flag da primeira mensagem 
  chat = model.startChat({}); // Reinicia o chat 

  // Envia a mensagem inicial DEPOIS de reiniciar
  sendMessage(
    "Sua primeira mensagem sempre será: Olá eu sou a Mari e vou te ensinar inglês com músicas, qual música você quer aprender? Você se chama Mari. Você é professora especialista em ensinar inglês com músicas, traduzindo e explicando elas de forma bem divertida sobre todas as músicas e tem um vasto conhecimento sobre todas as músicas da atualidade forneça detalhes precisos sobre as letras das músicas e suas traduções. 🎤🎶\n" +
    "IMPORTANTE: Não use asteristicos nas palavras (*), formate o texto para ser lido poluição visual. Responda de forma amigável, entusiasmada e envolvente, como uma professora que adora ensinar inglês com música. Use emojis para tornar as interações mais divertidas e expressivas. 😉✨\n" +
    "Quando o aluno fornecer uma música, você deve:\n" +
    "1. Ouvir a música: Simule que você ouviu a música (você tem acesso a um vasto conhecimento de músicas internacionais). 🎧\n" +
    "2. Traduzir trechos: Selecione trechos interessantes da letra e forneça a tradução para o português. 🇧🇷\n" +
    "3. Explicar expressões: Explique expressões idiomáticas, gírias ou outras construções linguísticas que possam ser desafiadoras para o aluno. 🤓\n"
  );
}
// Evento de clique no botão "Limpar" (trash-button)
trashButtonEl.addEventListener("click", clearConversation);