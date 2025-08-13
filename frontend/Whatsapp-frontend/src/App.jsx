/**
 * App Component - Fixed for full screen and proper scrolling
 */

import React from 'react';
import ChatPage from './pages/ChatPage';
import './index.css';

function App() {
  return (
    // Fixed: Full viewport height with no scrolling on body
    <div className="App h-screen overflow-hidden">
      <ChatPage />
    </div>
  );
}

export default App;