/** @format */

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useGetAllUserQuery } from "../features/Api/authSlice/AuthApi";
import { Send } from "lucide-react";
import {
  useGetChatQuery,
  useMyMessagesQuery,
  useSendChatMutation,
} from "../features/chat/chat.api";
import toast from "react-hot-toast";

const Chat = () => {
  const socket = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [sendMessageFn, sendMessageResult] = useSendChatMutation();

  //login suer
  const { data, isLoading, isSuccess, isError } = useGetAllUserQuery({
    token: user?.accessToken,
  });

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(
    users?.length ? users[0] : null
  );
  const [contentType, setContentType] = useState("text");
  const [document, setDocument] = useState();
  const { data: chat, ...chatResult } = useMyMessagesQuery({
    senderId: user?._id,
    receiverId: selectedUser?._id,
  });
  //users get
  useEffect(() => {
    if (isSuccess) {
      const filteredUsers = data?.data?.filter(
        (data) => data?._id !== user?._id
      );
      setUsers(filteredUsers);
    }
  }, [data, isSuccess, user?._id]);

  useEffect(() => {
    // console.log("sssssssss", chat?.data);
    if (chat?.success) {
      setMessages(chat?.data);
      toast.success("successfully get", { id: "message" });
    }
    if (!chat?.success) {
      toast.error(chat?.message, { id: "message" });
    }
    if (chatResult.isLoading) {
      toast.error("Loading...", { id: "message" });
    }
    if (chatResult.isError) {
      toast.error(chatResult.error?.message, { id: "message" });
    }
  }, [chat, chatResult]);

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

    // socket.current.on("receiveMessage", (newMessage) => {
    //   setMessages((prevMessages) => [...prevMessages, newMessage]);
    // });

    return () => {
      socket.current.disconnect();
    };
  }, [user?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !message.trim()) return;
    const formData = new FormData();
    const newMessage = {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: {
        messageType: contentType,
        message,
      },
    };

    formData.append("data", JSON.stringify(newMessage));
    formData.append("document", document);

    socket.current.emit("sendMessage", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    await sendMessageFn(formData).then((data) => {
      if (data.data?.success) {
        setMessage("");
      }
    });
  };

  useEffect(() => {
    if (sendMessageResult?.isError) {
      toast.error(sendMessageResult?.error.message);
    }
    if (sendMessageResult?.data) {
    }
  }, [sendMessageResult]);
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
          {" "}
          {selectedUser?.email || "Select a user to chat"}
        </h3>
        <div className="flex-grow p-4 overflow-y-auto">
          {messages?.length > 0 &&
            messages?.map((msg) => (
              <div
                key={msg?._id}
                className={`flex ${
                  msg?.senderId === user?._id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 m-2 rounded-lg ${
                    msg?.senderId === user?._id
                      ? "bg-blue-500 text-white "
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {msg?.content?.message}
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
            {sendMessageResult?.isLoading ? (
              <>
                <div className="spinner-border text-white"></div> Sending...
              </>
            ) : (
              <>
                <Send /> Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
