import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Message = ({ sender }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // Fetch users
    axios
      .get('http://localhost:3000/api/v1/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      // Fetch messages for selected user
      axios
        .get(`http://localhost:3000/api/v1/messages/${sender}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setMessages(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedUser, sender]);

  const sendMessage = () => {
    if (!selectedUser) return;

    axios
      .post(
        'http://localhost:3000/api/v1/messages',
        {
          sender,
          receiver: selectedUser._id,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setMessages([...messages, response.data]);
        setContent('');
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        {users.map((user) => (
          <div
            key={user._id}
            className={`user-item ${
              selectedUser && selectedUser._id === user._id ? 'selected' : ''
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </div>
        ))}
      </div>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender._id === sender ? 'sent' : 'received'
              }`}
            >
              <strong>{message.sender.name}:</strong> {message.content}
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Message;
