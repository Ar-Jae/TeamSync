import React, { useState, useEffect, useRef } from "react";
import './ChatView.css';
import { Paper, IconButton, InputBase, Avatar, Tooltip, Snackbar, Alert, Button } from "@mui/material";
import { Send as SendIcon, MoreVert as MoreIcon, AttachFile as AttachIcon, EmojiEmotions as EmojiIcon, Search as SearchIcon } from '@mui/icons-material';
import { useAuth } from "./AuthProvider";
import { chatYArray, createConversationId, conversationsMap } from '../utils/chat-yjs';

export default function ChatView() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [input, setInput] = useState("");
  const [notify, setNotify] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
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

  // derive simple conversations list (grouped by conversationId or sender) from messages
  const conversations = React.useMemo(() => {
    const map = new Map();
    messages.forEach(m => {
      const key = m.conversationId || (m.sender || 'Unknown');
      const name = m.conversationName || m.sender || key;
      if (!map.has(key)) map.set(key, { id: key, name, last: m, unread: Math.random() < 0.25 });
      else if (m.ts && map.get(key).last.ts < m.ts) map.get(key).last = m;
    });
    return Array.from(map.values());
  }, [messages]);

  useEffect(() => {
    // initialize selected conversation to the first one if unset
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0].id || conversations[0].name);
    }
  }, [conversations, selectedConversation]);

  // Notification for new messages from others
  useEffect(() => {
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last && last.sender !== displayName) {
        setNotify(`${last.sender} sent a new message`);
      }
    }
  }, [messages, displayName]);

  // (Optional) Typing indicator placeholder: listen to a `typing` map on Yjs if present
  useEffect(() => {
    if (!chatYArray.doc || !chatYArray.doc.getMap) return;
    try {
      const typingMap = chatYArray.doc.getMap('typing');
      const updateTyping = () => setTypingUsers(Array.from(typingMap.keys()).filter(k => k !== displayName));
      typingMap.observe && typingMap.observe(updateTyping);
      updateTyping();
      return () => typingMap.unobserve && typingMap.unobserve(updateTyping);
    } catch (e) {
      // ignore if not present
    }
  }, [displayName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      const convId = selectedConversation || createConversationId();
      chatYArray.push([{ sender: displayName, conversationId: convId, conversationName: null, text: input, avatar: user?.avatar, ts: Date.now() }]);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <Paper className="chatview-root" elevation={4}>
      <div className="chatview-layout">
        <aside className="chatview-left">
          <div className="chatview-left-header">
            <div className="chat-left-title">Chat</div>
            <div className="chat-left-actions">
              <IconButton size="small"><SearchIcon fontSize="small"/></IconButton>
              <Button size="small" variant="contained" onClick={() => {
                const id = createConversationId();
                try { conversationsMap.set(id, { name: `Conversation ${id}` }); } catch (e) { /* ignore if not available */ }
                setSelectedConversation(id);
              }}>New</Button>
            </div>
          </div>
          <div className="chatview-list">
            {conversations.length ? conversations.map((c, i) => (
              <div key={i} className={`chatview-list-item ${selectedConversation === (c.id||c.name) ? 'selected' : ''}`} onClick={() => setSelectedConversation(c.id||c.name)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setSelectedConversation(c.id||c.name); }}>
                <Avatar src={c.last?.avatar} className="chatview-list-avatar">{(c.name||'U')[0]}</Avatar>
                <div className="chatview-list-meta">
                  <div className="chatview-list-name">{c.name}</div>
                  <div className="chatview-list-snippet">{c.last?.text?.slice(0,40)}</div>
                </div>
                <div className="chatview-list-right">
                  <div className="chatview-list-time">{c.last?.ts ? new Date(c.last.ts).toLocaleTimeString() : ''}</div>
                  {c.unread && <div className="chatview-unread" />}
                </div>
              </div>
            )) : <div className="chatview-empty-list">No conversations</div>}
          </div>
        </aside>

        <div className="chatview-messages">
          {messages.filter(m => {
            if (!selectedConversation) return true;
            return (m.conversationId && m.conversationId === selectedConversation) || (!m.conversationId && m.sender === selectedConversation);
          }).map((msg, idx) => (
            <div key={idx} className={`chatview-message ${msg.sender === displayName ? 'self' : ''}`}>
              <Avatar className="chatview-avatar" src={msg.avatar || (msg.sender === displayName ? user?.avatar : undefined)}>
                {msg.sender[0]}
              </Avatar>
              <div className="chatview-bubble">
                <div className="chatview-header">
                  <div className="chatview-sender">{msg.sender}</div>
                  <div className="chatview-meta">{msg.ts ? new Date(msg.ts).toLocaleTimeString() : ''}</div>
                </div>
                <div className="chatview-text">{msg.text}</div>
                <div className="chatview-reactions">
                  <span role="img" aria-label="heart">💜</span>
                  <span role="img" aria-label="ball">⚽</span>
                  <span role="img" aria-label="thumb">👍</span>
                </div>
              </div>
              <div className="chatview-actions">
                <Tooltip title="More">
                  <IconButton size="small"><MoreIcon fontSize="small" /></IconButton>
                </Tooltip>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatview-input-area">
          <div className="chatview-attach">
            <IconButton size="small"><AttachIcon fontSize="small"/></IconButton>
            <IconButton size="small"><EmojiIcon fontSize="small"/></IconButton>
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
        </div>
        {typingUsers.length > 0 && (
          <div className="chatview-typing">{typingUsers.join(', ')} is typing…</div>
        )}
      <Snackbar open={!!notify} autoHideDuration={2500} onClose={() => setNotify(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={() => setNotify(null)} severity="info" sx={{ width: '100%' }}>
          {notify}
        </Alert>
      </Snackbar>
      </div>
    </Paper>
  );
}
