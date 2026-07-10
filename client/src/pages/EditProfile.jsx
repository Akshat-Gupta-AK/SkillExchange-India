import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../store/slices/authSlice.js";
import api from "../utils/api.js";
import toast from "react-hot-toast";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Expert"];

export default function EditProfile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", bio: "", location: "",
    skillsOffered: [], skillsWanted: [],
  });
  const [newOffered, setNewOffered] = useState({ name: "", level: "Intermediate", description: "" });
  const [newWanted, setNewWanted] = useState({ name: "", priority: "Medium" });

  useEffect(() => {
    if (user) setForm({ name: user.name || "", bio: user.bio || "", location: user.location || "",
      skillsOffered: user.skillsOffered || [], skillsWanted: user.skillsWanted || [] });
  }, [user]);

  const addOffered = () => {
    if (!newOffered.name.trim()) return;
    setForm((f) => ({ ...f, skillsOffered: [...f.skillsOffered, { ...newOffered }] }));
    setNewOffered({ name: "", level: "Intermediate", description: "" });
  };

  const addWanted = () => {
    if (!newWanted.name.trim()) return;
    setForm((f) => ({ ...f, skillsWanted: [...f.skillsWanted, { ...newWanted }] }));
    setNewWanted({ name: "", priority: "Medium" });
  };

  const removeOffered = (i) => setForm((f) => ({ ...f, skillsOffered: f.skillsOffered.filter((_, idx) => idx !== i) }));
  const removeWanted = (i) => setForm((f) => ({ ...f, skillsWanted: f.skillsWanted.filter((_, idx) => idx !== i) }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/users/profile", form);
      dispatch(updateUser(res.data));
      toast.success("Profile updated!");
      navigate(`/profile/${user._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="font-display font-bold text-2xl text-slate-900 mb-8">Edit Profile</h1>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Basic Info</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
            <textarea className="input" rows={3} maxLength={300} placeholder="Tell others about yourself..."
              value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <input className="input" placeholder="City, Country" value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
        </div>

        {/* Skills Offered */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Skills I Can Teach</h2>
          <div className="flex flex-wrap gap-2">
            {form.skillsOffered.map((s, i) => (
              <span key={i} className="badge bg-brand-50 text-brand-700 gap-2">
                {s.name} · {s.level}
                <button type="button" onClick={() => removeOffered(i)} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <input className="input flex-1 min-w-32" placeholder="Skill name" value={newOffered.name}
              onChange={(e) => setNewOffered({ ...newOffered, name: e.target.value })} />
            <select className="input w-36" value={newOffered.level}
              onChange={(e) => setNewOffered({ ...newOffered, level: e.target.value })}>
              {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
            <button type="button" onClick={addOffered} className="btn-secondary px-4">Add</button>
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-900">Skills I Want to Learn</h2>
          <div className="flex flex-wrap gap-2">
            {form.skillsWanted.map((s, i) => (
              <span key={i} className="badge bg-slate-100 text-slate-700 gap-2">
                {s.name}
                <button type="button" onClick={() => removeWanted(i)} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="input flex-1" placeholder="Skill I want to learn" value={newWanted.name}
              onChange={(e) => setNewWanted({ ...newWanted, name: e.target.value })} />
            <button type="button" onClick={addWanted} className="btn-secondary px-4">Add</button>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save Profile"}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
