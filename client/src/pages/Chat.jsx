import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/api.js";
import socket from "../utils/socket.js";

export default function Chat() {
  const { matchId } = useParams();
  const { user } = useSelector((s) => s.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [match, setMatch] = useState(null);
  const [typing, setTyping] = useState(null);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    const load = async () => {
      const [msgRes, matchRes] = await Promise.all([
        api.get(`/messages/${matchId}`),
        api.get(`/matches`),
      ]);
      setMessages(msgRes.data);
      const found = matchRes.data.find((m) => m._id === matchId);
      setMatch(found);
    };
    load();

    socket.emit("chat:join", matchId);

    socket.on("chat:message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat:typing", ({ name }) => {
      setTyping(name);
      clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => setTyping(null), 2000);
    });

    return () => {
      socket.off("chat:message");
      socket.off("chat:typing");
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat:message", { matchId, senderId: user._id, content: input.trim() });
    setInput("");
    socket.emit("chat:stopTyping", { matchId });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else {
      socket.emit("chat:typing", { matchId, userId: user._id, name: user.name });
    }
  };

  const partner = match
    ? match.requester?._id === user?._id ? match.receiver : match.requester
    : null;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center gap-3">
        <Link to="/matches" className="text-slate-400 hover:text-slate-600 mr-1">←</Link>
        <div className="w-9 h-9 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
          {partner?.name?.[0] || "?"}
        </div>
        <div>
          <p className="font-semibold text-slate-900 text-sm">{partner?.name || "Loading..."}</p>
          <p className="text-xs text-slate-400">
            {typing ? <span className="text-brand-500 animate-pulse">{typing} is typing...</span> : "Skill exchange chat"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <p className="text-3xl mb-2">💬</p>
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              {!isMe && (
                <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs mr-2 flex-shrink-0 mt-1">
                  {msg.sender?.name?.[0]}
                </div>
              )}
              <div className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                isMe ? "bg-brand-600 text-white rounded-br-sm" : "bg-white text-slate-800 rounded-bl-sm shadow-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-100 p-4 flex gap-3 items-end">
        <textarea
          className="input flex-1 resize-none min-h-[42px] max-h-28"
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={sendMessage} disabled={!input.trim()} className="btn-primary py-2.5 px-5">
          Send
        </button>
      </div>
    </div>
  );
}
