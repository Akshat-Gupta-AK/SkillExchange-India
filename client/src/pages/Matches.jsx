import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatches, updateMatchStatus } from "../store/slices/matchSlice.js";
import toast from "react-hot-toast";

const statusBadge = {
  pending:   "bg-amber-50 text-amber-700",
  accepted:  "bg-green-50 text-green-700",
  declined:  "bg-red-50 text-red-600",
  completed: "bg-slate-100 text-slate-600",
};

export default function Matches() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.matches);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMatches()); }, []);

  const handleStatus = async (id, status) => {
    await dispatch(updateMatchStatus({ id, status }));
    toast.success(status === "accepted" ? "Match accepted! 🎉" : "Request declined");
  };

  const getPartner = (match) =>
    match.requester?._id === user?._id ? match.receiver : match.requester;

  const pending = list.filter((m) => m.status === "pending" && m.receiver?._id === user?._id);
  const active  = list.filter((m) => m.status === "accepted");
  const others  = list.filter((m) => ["declined", "completed"].includes(m.status) || (m.status === "pending" && m.requester?._id === user?._id));

  const MatchCard = ({ match }) => {
    const partner = getPartner(match);
    const isIncoming = match.receiver?._id === user?._id && match.status === "pending";
    return (
      <div className="card hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-11 h-11 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold flex-shrink-0">
            {partner?.name?.[0]}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{partner?.name}</p>
            <span className={`badge text-xs mt-1 ${statusBadge[match.status]}`}>{match.status}</span>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm">
          <p className="text-slate-600">
            <span className="font-medium">You teach:</span> {match.status === "pending" && match.requester?._id === user?._id ? match.requesterSkill : match.receiverSkill}
          </p>
          <p className="text-slate-600 mt-1">
            <span className="font-medium">You learn:</span> {match.status === "pending" && match.requester?._id === user?._id ? match.receiverSkill : match.requesterSkill}
          </p>
        </div>
        {isIncoming && (
          <div className="flex gap-2">
            <button onClick={() => handleStatus(match._id, "accepted")} className="btn-primary flex-1 text-sm py-2">Accept</button>
            <button onClick={() => handleStatus(match._id, "declined")} className="btn-secondary flex-1 text-sm py-2">Decline</button>
          </div>
        )}
        {match.status === "accepted" && (
          <Link to={`/chat/${match._id}`} className="btn-primary block text-center text-sm py-2">Open Chat →</Link>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-8 text-slate-400">Loading matches...</div>;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-slate-900">Your Matches</h1>
        <p className="text-slate-500 mt-1">Manage your skill exchange connections.</p>
      </div>

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span> Incoming Requests ({pending.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pending.map((m) => <MatchCard key={m._id} match={m} />)}
          </div>
        </section>
      )}

      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span> Active Matches ({active.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map((m) => <MatchCard key={m._id} match={m} />)}
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section>
          <h2 className="font-semibold text-slate-700 mb-4 text-sm uppercase tracking-wide">Other</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {others.map((m) => <MatchCard key={m._id} match={m} />)}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🤝</p>
          <p className="font-semibold text-slate-700 text-lg">No matches yet</p>
          <p className="text-slate-400 mt-2 mb-6">Browse users and send match requests to get started.</p>
          <Link to="/browse" className="btn-primary">Browse Skills</Link>
        </div>
      )}
    </div>
  );
}
