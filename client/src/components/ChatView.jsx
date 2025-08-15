import React, { useState, useEffect, useRef } from "react";
import './ChatView.css';
import { Paper, IconButton, InputBase, Avatar, Tooltip, Snackbar, Alert } from "@mui/material";
import { Send as SendIcon } from '@mui/icons-material';
import { useAuth } from "./AuthProvider";
import { chatYArray } from '../utils/chat-yjs';

export default function ChatView() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [notify, setNotify] = useState(null);
  const messagesEndRef = useRef(null);
  const userDisplayName = (user?.firstName || "") + (user?.lastName ? ` ${user.lastName}` : "");
  const displayName = userDisplayName.trim() || user?.name || user?.email;

  // Listen for Yjs chat updates
  useEffect(() => {
    const updateMessages = () => {
      setMessages(chatYArray.toArray());
    };
    chatYArray.observe(updateMessages);
    updateMessages();
    return () => chatYArray.unobserve(updateMessages);
  }, []);

  // Notification for new messages from others
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last && last.sender !== displayName) {
        setNotify(`${last.sender} sent a new message`);
      }
    }
  }, [messages, displayName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      chatYArray.push([{ sender: displayName, text: input, avatar: user?.avatar }]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Paper className="chatview-root" elevation={4}>
      <div className="chatview-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chatview-message ${msg.sender === displayName ? 'self' : ''}`}>
            <Avatar className="chatview-avatar" src={msg.avatar || (msg.sender === displayName ? user?.avatar : undefined)}>
              {msg.sender[0]}
            </Avatar>
            <div className="chatview-bubble">
              <div className="chatview-sender">{msg.sender}</div>
              <div className="chatview-text">{msg.text}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatview-inputbar">
        <InputBase
          className="chatview-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />
        <Tooltip title="Send">
          <span>
            <IconButton color="primary" onClick={handleSend} disabled={!input.trim()}>
              <SendIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
      <Snackbar open={!!notify} autoHideDuration={2500} onClose={() => setNotify(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setNotify(null)} severity="info" sx={{ width: '100%' }}>
          {notify}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
