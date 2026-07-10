import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { sendMatchRequest } from "../store/slices/matchSlice.js";

export default function Browse() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [requesting, setRequesting] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append("skill", search);
      const res = await api.get(`/users?${params}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const handleRequest = async (targetUser) => {
    const mySkill = user?.skillsOffered?.[0]?.name || "My skill";
    const theirSkill = targetUser.skillsOffered?.[0]?.name || "their skill";
    setRequesting(targetUser._id);
    const res = await dispatch(sendMatchRequest({
      receiverId: targetUser._id,
      requesterSkill: mySkill,
      receiverSkill: theirSkill,
      message: `Hi! I'd love to exchange skills with you.`,
    }));
    if (res.error) toast.error(res.payload || "Could not send request");
    else toast.success("Match request sent! 🎉");
    setRequesting(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-slate-900">Browse Skills</h1>
        <p className="text-slate-500 mt-1">Find people with skills you want to learn.</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          className="input max-w-sm"
          placeholder="Search by skill (e.g. Python, Guitar...)"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-100 rounded w-16" />
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded mb-2" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-slate-700">No users found</p>
          <p className="text-slate-400 text-sm mt-1">Try a different skill search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((u) => (
            <div key={u._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-lg flex-shrink-0">
                  {u.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/profile/${u._id}`} className="font-semibold text-slate-900 hover:text-brand-600 transition-colors">
                    {u.name}
                  </Link>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-slate-500 text-xs">{u.rating || "New"}</span>
                    {u.sessionsCompleted > 0 && (
                      <span className="text-slate-300 text-xs">· {u.sessionsCompleted} sessions</span>
                    )}
                  </div>
                </div>
              </div>

              {u.bio && <p className="text-slate-500 text-sm mb-4 line-clamp-2">{u.bio}</p>}

              {u.skillsOffered?.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Offers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {u.skillsOffered.slice(0, 3).map((s) => (
                      <span key={s.name} className="badge bg-brand-50 text-brand-700">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              {u.skillsWanted?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">Wants to learn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {u.skillsWanted.slice(0, 3).map((s) => (
                      <span key={s.name} className="badge bg-slate-100 text-slate-600">{s.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleRequest(u)}
                disabled={requesting === u._id}
                className="btn-primary w-full text-sm"
              >
                {requesting === u._id ? "Sending..." : "Request Match"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary px-4 py-2 text-sm">← Prev</button>
          <span className="text-slate-500 text-sm">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn-secondary px-4 py-2 text-sm">Next →</button>
        </div>
      )}
    </div>
  );
}
