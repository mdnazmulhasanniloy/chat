/** @format */

import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Send } from "lucide-react";
import ChatListt from "./ChatListt";
import { useGetMyChatQuery } from "../features/chat/chat.api";

const Chat = () => {
  const socket = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedChat, setSelectedChat] = useState();
  const [chatList, setChatList] = useState([]);

  const { data, isLoading, isSuccess, isError } = useGetMyChatQuery(user?._id);
  useEffect(() => {
    if (isSuccess) {
      if (data?.success) {
        setChatList(data?.data);
      }
    }
  }, [isSuccess]);

  // const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [users, setUsers] = useState([]);
  // const [selectedUser, setSelectedUser] = useState(
  //   users?.length ? users[0] : null
  // );
  // const [contentType, setContentType] = useState("text");
  // const [document, setDocument] = useState();
  // const { data: chat, ...chatResult } = useMyMessagesQuery({
  //   senderId: user?._id,
  //   receiverId: selectedUser?._id,
  // });

  // //socket functionality
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
      setChatList((preChatList) =>
        preChatList?.map((chat) => {
          chat?.chat.participants?.map((user) => {
            if (user?._id === userId) {
              return { ...user, status: status };
            }
            return user;
          });
        })
      );
    });

    // check user status
    socket.current.on("currentOnlineUsers", (onlineUserIds) => {
      setChatList((preChatList) =>
        preChatList?.map((chat) => {
          chat?.chat?.participants?.map((user) => {
            if (onlineUserIds?.includes(user?._id)) {
              return { ...user, status: "online" };
            }
            return user;
          });
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedUser || !message.trim()) return;
  //   const formData = new FormData();
  //   const newMessage = {
  //     senderId: user._id,
  //     receiverId: selectedUser._id,
  //     content: {
  //       messageType: contentType,
  //       message,
  //     },
  //   };

  //   formData.append("data", JSON.stringify(newMessage));
  //   formData.append("document", document);

  //   socket.current.emit("sendMessage", newMessage);
  //   setMessages((prevMessages) => [...prevMessages, newMessage]);
  //   setMessage("");
  //   await sendMessageFn(formData).then((data) => {
  //     if (data.data?.success) {
  //       setMessage("");
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (sendMessageResult?.isError) {
  //     toast.error(sendMessageResult?.error.message);
  //   }
  //   if (sendMessageResult?.data) {
  //   }
  // }, [sendMessageResult]);
  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  // console.log(chatList);

  return (
    <div className="h-screen flex">
      <ChatListt chatList={chatList} setSelectedChat={setSelectedChat} />
      <div className="w-3/4 flex flex-col">
        <h3 className="text-xl font-bold">
          {" "}
          {selectedChat?.chat?.participants[0]?.email ||
            "Select a user to chat"}
        </h3>
        {/* <div className="flex-grow p-4 overflow-y-auto">
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
        </div> */}
        {/* <form
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
        </form> */}
      </div>
    </div>
  );
};

export default Chat;
