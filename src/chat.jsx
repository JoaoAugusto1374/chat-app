import { useState, useEffect, useRef } from "react";
import "./chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); 

  
  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = { text: message, sender: "user" };
      setMessages((prev) => [...prev, newMessage]); 

      try {
        
        const response = await fetch("https://nau8q0ot0e.execute-api.us-east-1.amazonaws.com/prd/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        console.log("Resposta da API:", data);  

        if (data.body) {
          
          const botMessage = { text: data.body, sender: "bot" };
          setMessages((prev) => [...prev, botMessage]);
        } else {
          console.error("Formato de resposta inesperado:", data);
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem para a API:", error);
      }

      setMessage(""); 
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Chat</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
          >
            {msg.text}
          </p>
        ))}
        {/* Referência para a última mensagem */}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-box">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
