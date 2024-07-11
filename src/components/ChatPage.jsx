import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import NavAndSidebar from './NavAndSidebar';
import './ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'receiver', text: 'Hello! How can I help you today?' },
    {
      sender: 'sender',
      text: 'Hi! I need some information about your products.',
    },
    { sender: 'receiver', text: 'Sure! What would you like to know?' },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'sender', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <Container fluid className="chat-container">
      <h1 className="text-center">Chat</h1>
      <div className="chat-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender === 'sender'
                ? 'chat-message-sender'
                : 'chat-message-receiver'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <Form className="chat-input-form">
        <Form.Group className="d-flex">
          <Form.Control
            type="text"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="chat-input"
          />
          <Button onClick={handleSendMessage} className="chat-send-button">
            Send
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default ChatPage;
