import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, updateMessage, deleteMessage } from '../../Slice/chatSlice';

const ChatArea = () => {
  const [message, setMessage] = useState('');
  const [editMessage, setEditMessage] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  
  const dispatch = useDispatch();
  const { messages, selectedUser } = useSelector(state => state.chat);
  const currentUser = useSelector(state => state.auth.user);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (currentUser && selectedUser) {
      dispatch(fetchMessages({ 
        currentUserId: currentUser.uid, 
        selectedUserId: selectedUser.id 
      }));
    }
  }, [dispatch, currentUser, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (message.trim() && currentUser && selectedUser) {
      if (editMessage) {
        dispatch(updateMessage({ 
          messageId: editMessage.id, 
          newText: message 
        }));
        setEditMessage(null);
      } else {
        dispatch(sendMessage({
          text: message,
          senderId: currentUser.uid,
          receiverId: selectedUser.id
        }));
      }
      setMessage('');
    }
  };

  const handleEdit = (msg) => {
    setEditMessage(msg);
    setMessage(msg.text);
    setMenuAnchor(null);
    setHoveredMessage(null);
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      dispatch(deleteMessage(messageId));
    }
    setMenuAnchor(null);
    setHoveredMessage(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (!selectedUser) {
    return (
      <div className="chat-area">
        <div className="no-chat-selected">
          <div className="welcome-message">
            <div className="welcome-icon">💬</div>
            <h3>Welcome to ChatApp</h3>
            <p>Select a contact from the left to start messaging</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="user-avatar">
            {selectedUser.displayName ? selectedUser.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <div className="user-name">{selectedUser.displayName}</div>
            <div className="user-status">Online</div>
          </div>
        </div>
        
        <div className="header-actions">
          <button className="header-btn" title="Video call">
            <span className="icon">📹</span>
          </button>
          <button className="header-btn" title="Voice call">
            <span className="icon">📞</span>
          </button>
          <button className="header-btn" title="More options">
            <span className="icon">⋮</span>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.senderId === currentUser.uid ? 'sent' : 'received'}`}
            onMouseEnter={() => setHoveredMessage(msg.id)}
            onMouseLeave={() => setHoveredMessage(null)}
          >
            <div className="message-bubble">
              <div className="message-content">
                <div className="message-text">{msg.text}</div>
                <div className="message-footer">
                  <span className="message-time">
                    {formatTime(msg.timestamp)}
                  </span>
                  {msg.edited && (
                    <span className="message-edited">edited</span>
                  )}
                  {msg.senderId === currentUser.uid && (
                    <span className="message-status">✓✓</span>
                  )}
                </div>
              </div>
              
              {/* Message Actions - Show on hover for sent messages */}
              {msg.senderId === currentUser.uid && hoveredMessage === msg.id && (
                <div className="message-actions">
                  <button 
                    className="action-btn edit-btn"
                    onClick={() => handleEdit(msg)}
                    title="Edit message"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(msg.id)}
                    title="Delete message"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="message-input-container">
        {editMessage && (
          <div className="edit-notice">
            <div className="edit-info">
              <span className="edit-icon">✏️</span>
              <span>Editing message</span>
            </div>
            <button 
              className="cancel-edit"
              onClick={() => {
                setEditMessage(null);
                setMessage('');
              }}
            >
              Cancel
            </button>
          </div>
        )}
        
        <div className="input-wrapper">
          <button className="attachment-btn" title="Attach file">
            <span className="icon">📎</span>
          </button>
          
          <textarea
            className="message-input"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          
          <button className="emoji-btn" title="Emoji">
            <span className="icon">😊</span>
          </button>
          
          <button
            className="send-btn"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            title="Send message"
          >
            <span className="send-icon">
              {editMessage ? '✏️' : '➤'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;