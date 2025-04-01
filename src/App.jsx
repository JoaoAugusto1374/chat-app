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
        <p>© 2025 SARA - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default App;