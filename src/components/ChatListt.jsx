/** @format */

import React, { useState, useEffect, useRef } from "react";
const ChatListt = ({ chatList, setSelectedChat }) => {
  return (
    <div className="w-1/4 bg-gray-800 text-white p-4">
      <h2 className="text-xl mb-4">Users</h2>
      <ul>
        {chatList.length > 0 &&
          chatList.map((chat) => (
            <li
              key={chat?._id}
              onClick={() => setSelectedChat(chat)}
              className="cursor-pointer p-2 hover:bg-gray-700 flex gap-3 font-bold text-lg items-center"
            >
              <div
                className={`${
                  chat?.chat?.participants[0]?.status === "online"
                    ? "bg-green-400"
                    : "bg-yellow-400"
                } h-3 w-3 rounded-full`}
              ></div>
              <div className="flex flex-col">
                {chat?.chat?.participants[0]?.email}
                <h2 className="text-md font-bold text-gray-200 flex  justify-between items-center">
                  {chat?.message?.content?.message}
                  <span className="py-1 px-3 rounded-full bg-white text-black">
                    {" "}
                    {chat?.unreadMessageCount}
                  </span>
                </h2>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default ChatListt;
