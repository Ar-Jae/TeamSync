import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext();
export const useUI = () => useContext(UIContext);

export default function UIProvider({ children }) {
  const [chatOpen, setChatOpen] = useState(false);

  const openChat = () => setChatOpen(true);
  const closeChat = () => setChatOpen(false);
  const toggleChat = () => setChatOpen(v => !v);

  return (
    <UIContext.Provider value={{ chatOpen, openChat, closeChat, toggleChat }}>
      {children}
    </UIContext.Provider>
  );
}
