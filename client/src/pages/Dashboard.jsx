import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMatches } from "../store/slices/matchSlice.js";
import api from "../utils/api.js";

export default function Dashboard() {
  const { user } = useSelector((s) => s.auth);
  const { list: matches } = useSelector((s) => s.matches);
  const dispatch = useDispatch();
  const [suggestions, setSuggestions] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    dispatch(fetchMatches());
    api.get("/users/suggestions").then((r) => setSuggestions(r.data.users?.slice(0, 3) || []));
    api.get("/sessions").then((r) => setSessions(r.data?.slice(0, 3) || []));
  }, []);

  const accepted = matches.filter((m) => m.status === "accepted");
  const pending = matches.filter((m) => m.status === "pending" && m.receiver?._id === user?._id);

  const stats = [
    { label: "Active Matches", value: accepted.length, icon: "🤝", color: "bg-brand-50 text-brand-700" },
    { label: "Pending Requests", value: pending.length, icon: "⏳", color: "bg-amber-50 text-amber-700" },
    { label: "Sessions Done", value: user?.sessionsCompleted || 0, icon: "✅", color: "bg-green-50 text-green-700" },
    { label: "Your Rating", value: user?.rating ? `${user.rating}★` : "New", icon: "⭐", color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          Hey, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your skill exchanges.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xl mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="font-display font-bold text-2xl text-slate-900">{s.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Profile incomplete banner */}
      {!user?.skillsOffered?.length && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">Complete your profile to get matched!</p>
            <p className="text-amber-600 text-sm mt-0.5">Add skills you offer and skills you want to learn.</p>
          </div>
          <Link to="/profile/edit" className="btn-primary text-sm whitespace-nowrap">Add Skills</Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Suggestions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-slate-900">Suggested Matches</h2>
            <Link to="/browse" className="text-brand-600 text-sm font-medium">View all →</Link>
          </div>
          {suggestions.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">Add skills to see personalized suggestions</p>
          ) : (
            <div className="space-y-3">
              {suggestions.map((u) => (
                <Link key={u._id} to={`/profile/${u._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
                    {u.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{u.name}</p>
                    <p className="text-slate-400 text-xs truncate">
                      Offers: {u.skillsOffered?.map((s) => s.name).slice(0, 2).join(", ")}
                    </p>
                  </div>
                  <span className="badge bg-accent-400/10 text-accent-500">
                    {u.compatibilityScore || 0} pts
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming sessions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-slate-900">Upcoming Sessions</h2>
            <Link to="/sessions" className="text-brand-600 text-sm font-medium">View all →</Link>
          </div>
          {sessions.length === 0 ? (
            <p className="text-slate-400 text-sm py-4 text-center">No sessions scheduled yet</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s._id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="font-medium text-slate-800 text-sm">{s.topic}</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {new Date(s.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
