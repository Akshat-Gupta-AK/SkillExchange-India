import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { format } from "date-fns";

export default function Sessions() {
  const { user } = useSelector((s) => s.auth);
  const [sessions, setSessions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ matchId: "", topic: "", scheduledAt: "", duration: 60, meetingLink: "" });

  useEffect(() => {
    api.get("/sessions").then((r) => setSessions(r.data));
    api.get("/matches").then((r) => setMatches(r.data.filter((m) => m.status === "accepted")));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/sessions", form);
      setSessions((prev) => [res.data, ...prev]);
      setShowForm(false);
      setForm({ matchId: "", topic: "", scheduledAt: "", duration: 60, meetingLink: "" });
      toast.success("Session scheduled! 📅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to schedule");
    }
  };

  const getPartnerName = (session) => {
    const match = session.matchId;
    if (!match) return "Unknown";
    return match.requester?._id === user?._id ? match.receiver?.name : match.requester?.name;
  };

  const upcoming = sessions.filter((s) => s.status === "upcoming" && new Date(s.scheduledAt) > new Date());
  const past = sessions.filter((s) => s.status !== "upcoming" || new Date(s.scheduledAt) <= new Date());

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Sessions</h1>
          <p className="text-slate-500 mt-1">Schedule and track your skill exchange sessions.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? "Cancel" : "+ Schedule Session"}
        </button>
      </div>

      {/* Schedule form */}
      {showForm && (
        <div className="card mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">New Session</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Match Partner</label>
              <select className="input" value={form.matchId} onChange={(e) => setForm({ ...form, matchId: e.target.value })} required>
                <option value="">Select a match...</option>
                {matches.map((m) => {
                  const partner = m.requester?._id === user?._id ? m.receiver : m.requester;
                  return <option key={m._id} value={m._id}>{partner?.name} — {m.requesterSkill} ↔ {m.receiverSkill}</option>;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Session Topic</label>
              <input className="input" placeholder="e.g. Introduction to React Hooks" value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Date & Time</label>
                <input className="input" type="datetime-local" value={form.scheduledAt}
                  onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (mins)</label>
                <input className="input" type="number" min="15" max="240" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: +e.target.value })} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Meeting Link (optional)</label>
              <input className="input" placeholder="https://meet.google.com/..." value={form.meetingLink}
                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary">Schedule Session</button>
          </form>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-slate-700 mb-4">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map((s) => (
              <div key={s._id} className="card border-l-4 border-brand-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{s.topic}</p>
                    <p className="text-slate-500 text-sm mt-0.5">with {getPartnerName(s)}</p>
                    <p className="text-brand-600 text-sm font-medium mt-2">
                      📅 {format(new Date(s.scheduledAt), "PPp")} · {s.duration} min
                    </p>
                  </div>
                  {s.meetingLink && (
                    <a href={s.meetingLink} target="_blank" rel="noreferrer" className="btn-secondary text-sm py-1.5 px-4">
                      Join →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide text-slate-400">Past Sessions</h2>
          <div className="space-y-3">
            {past.map((s) => (
              <div key={s._id} className="card opacity-70">
                <p className="font-semibold text-slate-700">{s.topic}</p>
                <p className="text-slate-400 text-sm mt-0.5">with {getPartnerName(s)} · {format(new Date(s.scheduledAt), "PP")}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">📅</p>
          <p className="font-semibold text-slate-700 text-lg">No sessions yet</p>
          <p className="text-slate-400 mt-2 mb-6">Schedule your first skill exchange session with a match.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">Schedule Now</button>
        </div>
      )}
    </div>
  );
}
