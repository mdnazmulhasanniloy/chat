/** @format */

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useGetAllUserQuery } from "../features/Api/authSlice/AuthApi";
import { Send } from "lucide-react";

const Chat = () => {
  const socket = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  //login suer
  const { data, isLoading, isSuccess, isError } = useGetAllUserQuery({
    token: user?.accessToken,
  });

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [contentType, setContentType] = useState("text");
  const [document, setDocument] = useState();

  //users get
  useEffect(() => {
    if (isSuccess) {
      const filteredUsers = data?.data?.filter(
        (data) => data?._id !== user?._id
      );
      setUsers(filteredUsers);
    }
  }, [data, isSuccess, user?._id]);

  //socket functionality
  useEffect(() => {
    socket.current = io("http://192.168.31.82:5000/");

    socket.current.on("connect", () => {
      console.log("Connected to server");
      //user status added
      socket.current.emit("userOnline", user?._id);
    });

    //disconnect socket
    socket.current.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.current.on("updateUserStatus", ({ userId, status }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id === userId) {
            return { ...user, status: status };
          }
          return user;
        })
      );
    });

    //check user status
    socket.current.on("currentOnlineUsers", (onlineUserIds) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (onlineUserIds.includes(user._id)) {
            return { ...user, status: "online" };
          }
          return user;
        })
      );
    });

    socket.current.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;

    const newMessage = {
      sender: user._id,
      receiver: selectedUser._id,
      content: {
        messageType: contentType,
        message,
      },
    };
    const FormData = new FormData();

    FormData.append("data", JSON.stringify(newMessage));
    FormData.append("document", document);

    // socket.current.emit("sendMessage", newMessage);
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
    // setMessage("");
  };
  console.log("sssssssss", document);
  return (
    <div className="h-screen flex">
      <div className="w-1/4 bg-gray-800 text-white p-4">
        <h2 className="text-xl mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user?._id}
              onClick={() => setSelectedUser(user)}
              className="cursor-pointer p-2 hover:bg-gray-700 flex gap-3"
            >
              {user?.email}
              <div
                className={`${
                  user?.status === "online" ? "bg-green-400" : "bg-yellow-400"
                } h-3 w-3 rounded-full`}
              ></div>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 flex flex-col">
        <h3 className="text-xl font-bold">
          {selectedUser?.email || "Select a user to chat"}
        </h3>
        <div className="flex-grow p-4 overflow-y-auto">
          {messages
            .filter(
              (msg) =>
                (msg.sender === selectedUser?._id &&
                  msg.receiver === user._id) ||
                (msg.receiver === selectedUser?._id && msg.sender === user._id)
            )
            .map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === user._id ? "justify-end" : "justify-start"
                }`}
              >
                <div className="bg-blue-500 text-white p-2 m-2 rounded-lg">
                  {msg.content}
                </div>
              </div>
            ))}
        </div>
        <form
          className="p-4 bg-gray-200 flex items-center justify-between gap-4"
          onSubmit={handleSubmit}
        >
          <input type="file" onChange={(e) => setDocument(e.target.files)} />
          <input
            type="text"
            className="w-full p-2 rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            required
          />
          <button
            type="submit"
            className="flex gap-2 items-end justify-center hover:text-sky-400 transition-all duration-300"
          >
            <Send /> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
