import { useState, useEffect, useRef } from "react";
import "./chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (message.trim()) {
      const userId = localStorage.getItem("chatUserID") || crypto.randomUUID();
      localStorage.setItem("chatUserID", userId);

      const newMessage = { text: message, sender: "user" };
      setMessages((prev) => [...prev, newMessage]);
      setMessage(""); // Limpa o campo de entrada imediatamente

      setIsTyping(true); // Ativa o efeito "digitando..."

      try {
        const response = await fetch("https://nau8q0ot0e.execute-api.us-east-1.amazonaws.com/prd/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: userId, message: message })
        });

        const data = await response.json();
        console.log("Resposta da API:", data);

        if (data.body) {
          setMessages((prev) => [...prev, { text: data.body, sender: "bot" }]);
        } else {
          console.error("Formato de resposta inesperado:", data);
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem para a API:", error);
      }

      setIsTyping(false); // Remove o efeito "digitando..."
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">SARA <br/>Secretaria Assistida por IA</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p key={index} className={`message ${msg.sender === "user" ? "user" : "bot"}`}>
            {msg.text}
          </p>
        ))}
        {isTyping && <p className="typing">Aguarde...</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
