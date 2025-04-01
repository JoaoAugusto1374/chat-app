import { useState, useEffect, useRef } from "react";
import "./chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const messagesEndRef = useRef(null);

  const userId = crypto.randomUUID();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (message.trim() || base64Image) {
      const newMessage = {
        text: message,
        sender: "user",
        image: base64Image ? `data:image/png;base64,${base64Image}` : null,
      };

      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
      setImage(null);
      setBase64Image(null);

      setIsTyping(true);

      try {
        const response = await fetch("https://nau8q0ot0e.execute-api.us-east-1.amazonaws.com/prd/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: userId,
            message: message,
            base64: base64Image || null,
          }),
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

      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      convertToBase64(file);
    }
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      setBase64Image(base64String);
    };
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">SARA <br />Secretaria Assistida por IA</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === "user" ? "user" : "bot"}`}>
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <img src={msg.image} alt="Imagem anexada" className="image-preview" />}
          </div>
        ))}
        {isTyping && <p className="typing">Aguarde...</p>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-box">
        {image && (
          <div className="image-preview-container">
            <img src={URL.createObjectURL(image)} alt="Pré-visualização" className="preview-image" />
          </div>
        )}

        <label htmlFor="imageInput" className="image-button">
          Anexar imagem
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>

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
