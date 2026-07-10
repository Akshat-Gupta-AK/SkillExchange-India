import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const features = [
  { icon: "🎯", title: "Smart Matching", desc: "Our algorithm finds peers whose skills complement yours perfectly." },
  { icon: "💬", title: "Real-time Chat", desc: "Message your matches instantly, no third-party apps needed." },
  { icon: "📅", title: "Session Scheduling", desc: "Book, manage, and track your skill exchange sessions easily." },
  { icon: "⭐", title: "Verified Reviews", desc: "Build your reputation with peer reviews after every session." },
];

export default function Home() {
  const { token } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
          <span className="font-display font-bold text-slate-900 text-xl">SkillBridge</span>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Get Started Free</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse"></span>
          Free skill exchange — no money needed
        </div>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-slate-900 leading-tight mb-6">
          Trade Skills.<br />
          <span className="text-brand-600">Grow Together.</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Got a skill someone needs? Find someone who has a skill you want.
          SkillBridge connects learners and teachers for peer-to-peer skill exchange — completely free.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="btn-primary text-base px-8 py-3">Start Exchanging Skills</Link>
          <Link to="/browse" className="btn-secondary text-base px-8 py-3">Browse Skills</Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-5xl mx-auto px-8">
          <h2 className="font-display font-bold text-3xl text-slate-900 text-center mb-12">Everything you need to exchange skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-display font-semibold text-lg text-slate-900 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="font-display font-bold text-3xl text-slate-900 mb-4">Ready to start learning?</h2>
        <p className="text-slate-500 mb-8">Join thousands of people already exchanging skills every day.</p>
        <Link to="/register" className="btn-primary text-base px-8 py-3">Create Free Account</Link>
      </section>
    </div>
  );
}
