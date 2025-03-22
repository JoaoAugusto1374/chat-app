import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chat from "./chat"

function App() {
  return (
    <div>
      <Chat />
      <footer className="chat-footer">
        <p>© 2024 Meu Chat App - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default App;