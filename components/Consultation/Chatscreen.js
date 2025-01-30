// ChatScreen.js

import React, { useState, useEffect, useContext, useRef } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { Context as AuthContext } from '../../context/AppContext';
import { io } from 'socket.io-client'; // Import socket.io-client

const ChatScreen = ({ route }) => {
  const { chat, doctorId } = route.params; // Access the chat data passed from ChatList
  const [messages, setMessages] = useState([]); // Messages for the selected chat
  const { state } = useContext(AuthContext);
  const socket = useRef(null); // Ref to store the WebSocket connection

  // Connect to the WebSocket server when the component mounts
  useEffect(() => {
    // Initialize the WebSocket connection
    socket.current = io('https://api.quickline.tech', {
      auth: {
        token: state?.user?.auth_token, // Send the auth token for authentication
      },
    });

    // Listen for incoming messages
    socket.current.on('message', (message) => {
      console.log(message?.sender);
      console.log(doctorId);
      if (message?.sender === doctorId) {
        // Transform the incoming message into the format required by GiftedChat
      const formattedMessage = {
        _id: new Date(message.timestamp).getTime(), // Use timestamp as a unique ID
        text: message.message, // The message content
        createdAt: new Date(message.timestamp), // Convert timestamp to Date object
        user: {
          _id: message.sender, // Sender's ID
          name: message.senderModel === 'User' ? 'User' : 'Doctor', // Sender's name
          avatar: message.senderModel === 'User'
            ? 'https://placehold.jp/3d4070/ffffff/150x150.png?text=U' // User avatar
            : 'https://placehold.jp/3d4070/ffffff/150x150.png?text=D', // Doctor avatar
        },
      };

      // Append the new message to the existing messages
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [formattedMessage]));
      }
    });

    // Join the chat room when the component mounts
    socket.current.emit('joinChat', chat._id);

    // Cleanup on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [state?.user?.auth_token, chat._id]); // Re-run when auth token or chat ID changes

  // Transform chat messages into the format required by GiftedChat
  useEffect(() => {
    if (chat.messages) {
      // Sort messages in ascending order (oldest first, newest last)
      const sortedMessages = [...chat.messages]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort in ascending order
        .reverse(); // Reverse the array to get newest messages first
      // Transform the sorted messages into the format required by GiftedChat
      const formattedMessages = sortedMessages.map((msg) => ({
        _id: msg._id, // Use the message's MongoDB ID
        text: msg.message, // The message content
        createdAt: new Date(msg.timestamp), // Convert timestamp to Date object
        user: {
          _id: msg?.sender?._id, // Sender's ID
          name: msg.senderModel === 'User' ? 'User' : 'Doctor', // Sender's name
          avatar: msg.senderModel === 'User'
            ? 'https://placehold.jp/3d4070/ffffff/150x150.png?text=U' // User avatar
            : 'https://placehold.jp/3d4070/ffffff/150x150.png?text=D', // Doctor avatar
        },
      }));

      // Set the transformed messages in state
      setMessages(formattedMessages);
    }
  }, [chat]); // Re-run when the chat data changes

  // Handle sending a new message
  const onSend = (newMessages = []) => {
    if (newMessages.length > 0) {
      const newMessage = newMessages[0];

      // Prepare the message data to send to the server
      const messageData = {
        chatId: chat._id, // ID of the selected chat
        senderId: state?.user?.user?._id, // ID of the sender
        senderModel: 'Doctors', // Role of the sender
        text: newMessage.text, // Message text
      };

      // Send the message to the WebSocket server
      socket.current.emit('message', messageData);

      // Append the new message to the local state
      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: state?.user?.user?._id, // Replace with the current user's ID
        name: 'User', // Role of the user
        avatar: 'https://placehold.jp/3d4070/ffffff/150x150.png?text=U',
      }}
      renderBubble={(props) => (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#007bff', // Blue color for sent messages
              borderRadius: 10, // Rounded corners
              padding: 8, // Padding inside the bubble
            },
            left: {
              backgroundColor: '#e0e0e0', // Gray color for received messages
              borderRadius: 10, // Rounded corners
              padding: 8, // Padding inside the bubble
            },
          }}
          textStyle={{
            right: {
              color: '#fff', // White text for sent messages
            },
            left: {
              color: '#000', // Black text for received messages
            },
          }}
        />
      )}
    />
  );
};

export default ChatScreen;