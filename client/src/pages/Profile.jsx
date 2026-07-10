import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { sendMatchRequest } from "../store/slices/matchSlice.js";
import api from "../utils/api.js";
import toast from "react-hot-toast";

export default function Profile() {
  const { id } = useParams();
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwn = id === user?._id;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [userRes, reviewRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/reviews/${id}`),
        ]);
        setProfile(userRes.data);
        setReviews(reviewRes.data);
      } catch {
        toast.error("Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRequest = async () => {
    const res = await dispatch(sendMatchRequest({
      receiverId: id,
      requesterSkill: user?.skillsOffered?.[0]?.name || "My skill",
      receiverSkill: profile?.skillsOffered?.[0]?.name || "their skill",
    }));
    if (res.error) toast.error(res.payload || "Could not send request");
    else toast.success("Match request sent! 🎉");
  };

  if (loading) return <div className="p-8 text-slate-400">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-slate-400">Profile not found</div>;

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      {/* Header card */}
      <div className="card mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-700 font-bold text-3xl flex-shrink-0">
            {profile.name[0]}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display font-bold text-2xl text-slate-900">{profile.name}</h1>
                {profile.location && <p className="text-slate-400 text-sm mt-0.5">📍 {profile.location}</p>}
              </div>
              {isOwn ? (
                <Link to="/profile/edit" className="btn-secondary text-sm py-2">Edit Profile</Link>
              ) : (
                <button onClick={handleRequest} className="btn-primary text-sm py-2">Request Match</button>
              )}
            </div>
            {profile.bio && <p className="text-slate-600 mt-3 text-sm leading-relaxed">{profile.bio}</p>}
            <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
              <span>⭐ {profile.rating || "New"} rating</span>
              <span>✅ {profile.sessionsCompleted} sessions</span>
              <span>💬 {profile.reviewCount} reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-3">Skills Offered</h2>
          {profile.skillsOffered?.length ? (
            <div className="space-y-2">
              {profile.skillsOffered.map((s) => (
                <div key={s.name} className="flex items-center justify-between">
                  <span className="text-slate-700 text-sm">{s.name}</span>
                  <span className="badge bg-brand-50 text-brand-600 text-xs">{s.level}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-slate-400 text-sm">No skills listed yet</p>}
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-900 mb-3">Wants to Learn</h2>
          {profile.skillsWanted?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.skillsWanted.map((s) => (
                <span key={s.name} className="badge bg-slate-100 text-slate-600">{s.name}</span>
              ))}
            </div>
          ) : <p className="text-slate-400 text-sm">No skills listed yet</p>}
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <h2 className="font-semibold text-slate-900 mb-4">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-slate-400 text-sm">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="border-b border-slate-100 pb-4 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs">
                    {r.fromUser?.name?.[0]}
                  </div>
                  <span className="font-medium text-slate-800 text-sm">{r.fromUser?.name}</span>
                  <span className="text-yellow-400 text-xs ml-auto">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                {r.comment && <p className="text-slate-600 text-sm ml-9">{r.comment}</p>}
                {r.skillTaught && <p className="text-slate-400 text-xs ml-9 mt-1">Skill: {r.skillTaught}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
