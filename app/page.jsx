'use client'
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area, LineChart, Line } from "recharts";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════════════════════
//  GLOBAL CSS
// ═══════════════════════════════════════════════════════════════
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;600;700;800;900&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #070810; color: #dde1f0; font-family: 'Instrument Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 3px; height: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e2235; border-radius: 4px; }
    ::selection { background: rgba(100,220,140,0.18); }
    input, select, textarea, button { font-family: inherit; }
    input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.3); cursor: pointer; }
    select option { background: #111520; color: #dde1f0; }
    input[type=number] { -moz-appearance: textfield; }
    input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn { from { transform:scale(0.96); opacity:0; } to { transform:scale(1); opacity:1; } }
    @keyframes slideRight { from { transform:translateX(-10px); opacity:0; } to { transform:translateX(0); opacity:1; } }
    @keyframes notifIn { 0% { transform:translateX(120%); opacity:0; } 12% { transform:translateX(0); opacity:1; } 85% { transform:translateX(0); opacity:1; } 100% { transform:translateX(120%); opacity:0; } }
    @keyframes spin { to { transform:rotate(360deg); } }
    @keyframes marquee { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
    @keyframes gradientShift { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
    @keyframes floatUp { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-8px); } }
    @keyframes borderGlow { 0%,100% { border-color: rgba(100,220,140,0.2); } 50% { border-color: rgba(100,220,140,0.5); } }

    .fu { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
    .fu1 { animation: fadeUp 0.45s 0.06s cubic-bezier(0.22,1,0.36,1) both; }
    .fu2 { animation: fadeUp 0.45s 0.12s cubic-bezier(0.22,1,0.36,1) both; }
    .fu3 { animation: fadeUp 0.45s 0.18s cubic-bezier(0.22,1,0.36,1) both; }
    .fu4 { animation: fadeUp 0.45s 0.24s cubic-bezier(0.22,1,0.36,1) both; }
    .fu5 { animation: fadeUp 0.45s 0.30s cubic-bezier(0.22,1,0.36,1) both; }

    .hover-card { transition: border-color 0.2s, transform 0.18s, box-shadow 0.2s; }
    .hover-card:hover { border-color: rgba(100,220,140,0.22) !important; transform: translateY(-2px); box-shadow: 0 16px 48px rgba(0,0,0,0.45); }

    .nav-link { transition: background 0.14s, color 0.14s; border-radius: 8px; }
    .nav-link:hover { background: rgba(255,255,255,0.045) !important; color: #dde1f0 !important; }
    .nav-link.active { background: rgba(100,220,140,0.1) !important; color: #64dc8c !important; }

    .btn-green { background: #64dc8c; color: #050708; font-weight: 700; border: none; transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s; }
    .btn-green:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(100,220,140,0.28); }
    .btn-ghost { background: transparent; color: #8891b0; border: 1px solid #1e2235; transition: border-color 0.15s, color 0.15s; }
    .btn-ghost:hover:not(:disabled) { border-color: rgba(100,220,140,0.3); color: #64dc8c; }
    .btn-danger { background: rgba(255,70,70,0.1); color: #ff4646; border: 1px solid rgba(255,70,70,0.25); transition: background 0.15s; }
    .btn-danger:hover:not(:disabled) { background: rgba(255,70,70,0.2); }

    .ifield { width:100%; padding:10px 14px; background:#0d1020; border:1px solid #1e2235; border-radius:8px; color:#dde1f0; font-size:13.5px; outline:none; transition:border-color 0.15s, box-shadow 0.15s; }
    .ifield:focus { border-color: #64dc8c; box-shadow: 0 0 0 3px rgba(100,220,140,0.08); }
    .ifield::placeholder { color: #3a4060; }

    .notif { position:fixed; bottom:24px; right:24px; z-index:9999; min-width:280px; max-width:380px; padding:14px 18px; border-radius:10px; border:1px solid; font-size:13px; font-weight:500; display:flex; align-items:center; gap:10px; animation: notifIn 3.8s ease forwards; backdrop-filter:blur(16px); pointer-events:none; }

    .pricing-card { transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
    .pricing-card:hover { transform: translateY(-4px); box-shadow: 0 24px 64px rgba(0,0,0,0.5); }

    .logo-text { font-family:'Cabinet Grotesk',sans-serif; font-weight:900; letter-spacing:-0.04em; }
    .heading { font-family:'Cabinet Grotesk',sans-serif; font-weight:900; letter-spacing:-0.03em; }
    .mono { font-family:'JetBrains Mono',monospace; }

    .kanban-col { min-height: 200px; }
    .task-card { transition: border-color 0.15s, transform 0.12s, box-shadow 0.15s; }
    .task-card:hover { border-color: #2a3050 !important; transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,0,0,0.35); }
    
    .tab-btn { padding: 7px 16px; border-radius: 7px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; transition: background 0.14s, color 0.14s; }
    .tab-btn.active { background: rgba(100,220,140,0.12); color: #64dc8c; }
    .tab-btn:not(.active) { background: transparent; color: #6b7394; }
    .tab-btn:not(.active):hover { background: rgba(255,255,255,0.04); color: #dde1f0; }

    .toggle { position:relative; width:40px; height:22px; border-radius:11px; border:none; cursor:pointer; transition:background 0.2s; }
    .toggle::after { content:''; position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform 0.2s; }
    .toggle.on { background:#64dc8c; }
    .toggle.on::after { transform:translateX(18px); }
    .toggle:not(.on) { background:#1e2235; }

    .progress-ring { transform: rotate(-90deg); }
    
    .marquee-wrap { overflow: hidden; }
    .marquee-inner { display: flex; animation: marquee 30s linear infinite; white-space: nowrap; }
    .marquee-inner:hover { animation-play-state: paused; }
  `}</style>
);

// ═══════════════════════════════════════════════════════════════
//  DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const T = {
  bg: "#070810", bgAlt: "#0d1020", surface: "#0f1220",
  surface2: "#131826", surface3: "#181d2e", border: "#1e2235",
  borderMid: "#252a42", muted: "#3a4060", sub: "#5c6480",
  mutedText: "#8891b0", text: "#dde1f0", bright: "#f0f2fa",
  green: "#64dc8c", greenDim: "rgba(100,220,140,0.1)", greenBorder: "rgba(100,220,140,0.22)",
  red: "#ff4646", redDim: "rgba(255,70,70,0.1)", redBorder: "rgba(255,70,70,0.25)",
  yellow: "#ffb340", yellowDim: "rgba(255,179,64,0.1)", yellowBorder: "rgba(255,179,64,0.25)",
  blue: "#4fa3ff", blueDim: "rgba(79,163,255,0.1)",
  purple: "#a78bfa", purpleDim: "rgba(167,139,250,0.1)",
};

const STATUS_CFG = {
  overloaded: { color: T.red, bg: T.redDim, border: T.redBorder, label: "Overloaded", emoji: "🔴" },
  balanced: { color: T.green, bg: T.greenDim, border: T.greenBorder, label: "Balanced", emoji: "🟢" },
  underloaded: { color: T.yellow, bg: T.yellowDim, border: T.yellowBorder, label: "Underloaded", emoji: "🟡" },
};

const PRI_CFG = {
  high: { color: T.red, bg: T.redDim, label: "High" },
  medium: { color: T.yellow, bg: T.yellowDim, label: "Medium" },
  low: { color: T.blue, bg: T.blueDim, label: "Low" },
};

// ═══════════════════════════════════════════════════════════════
//  SEED DATA
// ═══════════════════════════════════════════════════════════════
const SEED_TEAMS = [
  { id: 1, name: "Engineering", description: "Core product & platform engineering", color: "#4fa3ff", emoji: "⚙️" },
  { id: 2, name: "Design", description: "Product design & user experience", color: "#a78bfa", emoji: "🎨" },
  { id: 3, name: "Marketing", description: "Growth, content & brand", color: "#ffb340", emoji: "📣" },
];

const SEED_EMPLOYEES = [
  { id: 1, name: "Alex Rivera", role: "Senior Engineer", team: 1, capacity: 40, skills: ["React", "Node.js", "PostgreSQL"], avatar: "AR", email: "alex@acme.com", location: "San Francisco, CA", joined: "2023-03-15" },
  { id: 2, name: "Sarah Kim", role: "Frontend Engineer", team: 1, capacity: 40, skills: ["React", "TypeScript", "CSS"], avatar: "SK", email: "sarah@acme.com", location: "New York, NY", joined: "2023-06-01" },
  { id: 3, name: "Marcus Johnson", role: "Backend Engineer", team: 1, capacity: 32, skills: ["Python", "Django", "AWS"], avatar: "MJ", email: "marcus@acme.com", location: "Austin, TX", joined: "2024-01-10" },
  { id: 4, name: "Priya Patel", role: "UX Designer", team: 2, capacity: 40, skills: ["Figma", "Research", "Prototyping"], avatar: "PP", email: "priya@acme.com", location: "London, UK", joined: "2023-09-20" },
  { id: 5, name: "Tom Wright", role: "UI Designer", team: 2, capacity: 40, skills: ["Figma", "Illustration", "Motion"], avatar: "TW", email: "tom@acme.com", location: "Berlin, DE", joined: "2024-02-05" },
  { id: 6, name: "Lisa Zhang", role: "Marketing Lead", team: 3, capacity: 40, skills: ["SEO", "Content", "Analytics"], avatar: "LZ", email: "lisa@acme.com", location: "Chicago, IL", joined: "2023-05-12" },
  { id: 7, name: "Chris Okafor", role: "Growth Engineer", team: 3, capacity: 40, skills: ["Analytics", "A/B Testing", "SQL"], avatar: "CO", email: "chris@acme.com", location: "Toronto, CA", joined: "2023-11-30" },
];

const SEED_TASKS = [
  { id: 1, title: "Refactor authentication module", desc: "Migrate JWT to refresh token pattern for better security posture", hours: 12, priority: "high", employeeId: 1, teamId: 1, due: "2025-04-15", status: "in-progress", created: "2025-04-01" },
  { id: 2, title: "Build analytics dashboard API", desc: "REST endpoints for workload metrics and team health analytics", hours: 16, priority: "high", employeeId: 1, teamId: 1, due: "2025-04-10", status: "in-progress", created: "2025-04-02" },
  { id: 3, title: "Performance optimization sprint", desc: "Optimize DB queries, implement Redis caching layer", hours: 20, priority: "medium", employeeId: 1, teamId: 1, due: "2025-04-20", status: "todo", created: "2025-04-03" },
  { id: 4, title: "Component library setup", desc: "Bootstrap shared UI library with Storybook documentation", hours: 8, priority: "medium", employeeId: 2, teamId: 1, due: "2025-04-12", status: "done", created: "2025-03-28" },
  { id: 5, title: "Onboarding flow redesign", desc: "New 5-step onboarding wizard with progress tracking", hours: 14, priority: "high", employeeId: 2, teamId: 1, due: "2025-04-18", status: "in-progress", created: "2025-04-04" },
  { id: 6, title: "Fix cross-browser CSS bugs", desc: "Safari and Firefox compatibility fixes for main dashboard", hours: 6, priority: "low", employeeId: 2, teamId: 1, due: "2025-04-08", status: "todo", created: "2025-04-05" },
  { id: 7, title: "API integration tests", desc: "Comprehensive integration test suite for all endpoints", hours: 10, priority: "medium", employeeId: 3, teamId: 1, due: "2025-04-14", status: "todo", created: "2025-04-06" },
  { id: 8, title: "Design system audit", desc: "Full audit of all components against design tokens and guidelines", hours: 18, priority: "high", employeeId: 4, teamId: 2, due: "2025-04-16", status: "in-progress", created: "2025-04-03" },
  { id: 9, title: "User research sessions", desc: "Conduct 8 usability interviews and synthesize findings into report", hours: 16, priority: "high", employeeId: 4, teamId: 2, due: "2025-04-19", status: "in-progress", created: "2025-04-02" },
  { id: 10, title: "Mobile prototype v2", desc: "High-fidelity Figma prototype for mobile app redesign", hours: 14, priority: "medium", employeeId: 5, teamId: 2, due: "2025-04-22", status: "todo", created: "2025-04-07" },
  { id: 11, title: "Q2 content calendar", desc: "Plan and schedule full Q2 content pipeline across all channels", hours: 8, priority: "medium", employeeId: 6, teamId: 3, due: "2025-04-11", status: "done", created: "2025-03-30" },
  { id: 12, title: "SEO technical audit", desc: "Complete site technical SEO review and prioritized action plan", hours: 12, priority: "high", employeeId: 6, teamId: 3, due: "2025-04-17", status: "in-progress", created: "2025-04-04" },
  { id: 13, title: "A/B test new landing page", desc: "Configure, launch and monitor landing page conversion experiment", hours: 6, priority: "low", employeeId: 7, teamId: 3, due: "2025-04-25", status: "todo", created: "2025-04-08" },
];

// ═══════════════════════════════════════════════════════════════
//  WORKLOAD ENGINE
// ═══════════════════════════════════════════════════════════════
function computeWorkload(employees, tasks) {
  return employees.map(emp => {
    const active = tasks.filter(t => t.employeeId === emp.id && t.status !== "done");
    const done = tasks.filter(t => t.employeeId === emp.id && t.status === "done");
    const totalHours = active.reduce((s, t) => s + t.hours, 0);
    const pct = emp.capacity > 0 ? Math.round((totalHours / emp.capacity) * 100) : 0;
    const available = Math.max(0, emp.capacity - totalHours);
    let status = "balanced";
    if (pct < 60) status = "underloaded";
    else if (pct > 100) status = "overloaded";
    const highCount = active.filter(t => t.priority === "high").length;
    const burnoutRisk = pct > 120 ? "high" : pct > 100 ? "medium" : "low";
    return { ...emp, totalHours, pct, status, available, activeTasks: active, doneTasks: done, highCount, burnoutRisk };
  });
}

function generateInsights(workloads, tasks) {
  const insights = [];
  const over = workloads.filter(e => e.status === "overloaded");
  const under = workloads.filter(e => e.status === "underloaded");
  over.forEach(o => {
    const overBy = o.totalHours - o.capacity;
    const candidates = under.filter(u => u.team === o.team).sort((a, b) => b.available - a.available);
    if (candidates.length) {
      const target = candidates[0];
      const task = o.activeTasks.filter(t => t.hours <= target.available && t.priority !== "high").sort((a, b) => b.hours - a.hours)[0];
      if (task) { insights.push({ type: "reassign", severity: "critical", title: "Task Redistribution Available", message: `${o.name} is overloaded by ${overBy}h. Moving "${task.title}" (${task.hours}h) to ${target.name} would rebalance both employees.`, from: o.name, to: target.name, taskId: task.id, savings: task.hours }); return; }
    }
    insights.push({ type: "deadline", severity: "warning", title: "High Workload Alert", message: `${o.name} is at ${o.pct}% capacity with ${o.highCount} high-priority task${o.highCount !== 1 ? "s" : ""}. Consider deadline extension or scope reduction.`, from: o.name });
  });
  under.forEach(u => { if (u.available > 12) insights.push({ type: "capacity", severity: "info", title: "Available Capacity", message: `${u.name} has ${u.available}h free this week. They could absorb additional tasks or support overloaded teammates.`, from: u.name }); });
  const upcoming = tasks.filter(t => t.priority === "high" && t.status === "todo");
  if (upcoming.length > 0) insights.push({ type: "alert", severity: "warning", title: "Unstarted High-Priority Tasks", message: `${upcoming.length} high-priority task${upcoming.length !== 1 ? "s are" : " is"} not yet in progress. Review assignments to avoid deadline risk.` });
  return insights;
}

// ═══════════════════════════════════════════════════════════════
//  NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════════════════════
let _setN = null;
const notify = (msg, type = "success") => {
  if (!_setN) return;
  const id = Date.now();
  _setN(p => [...p.slice(-2), { id, msg, type }]);
  setTimeout(() => _setN(p => p.filter(n => n.id !== id)), 3900);
};

// ═══════════════════════════════════════════════════════════════
//  SUPABASE CLIENT + DATA HELPERS
// ═══════════════════════════════════════════════════════════════
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// DB row → local shape mappers
const mapTeam = r => ({ id: r.id, name: r.name, description: r.description || "", color: r.color || "#4fa3ff", emoji: r.emoji || "🏗️" });
const mapEmployee = r => ({ id: r.id, name: r.name, role: r.role || "", team: r.team_id, capacity: r.capacity || 40, skills: r.skills || [], avatar: r.avatar || r.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2), email: r.email || "", location: r.location || "", joined: r.joined || new Date().toISOString().slice(0, 10) });
const mapTask = r => ({ id: r.id, title: r.title, desc: r.description || "", hours: r.hours || 0, priority: r.priority || "medium", status: r.status || "todo", employeeId: r.employee_id, teamId: r.team_id, due: r.due || "", created: r.created_at ? r.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10) });

// Seed demo data for brand-new users
async function seedUserData(userId) {
  const { data: teams } = await supabase.from("teams").insert(
    SEED_TEAMS.map(({ id, ...t }) => ({ ...t, user_id: userId }))
  ).select();
  if (!teams) return;
  const teamIdMap = {};
  teams.forEach((t, i) => { teamIdMap[SEED_TEAMS[i].id] = t.id; });
  const { data: emps } = await supabase.from("employees").insert(
    SEED_EMPLOYEES.map(({ id, team, ...e }) => ({ ...e, user_id: userId, team_id: teamIdMap[team] || teams[0].id }))
  ).select();
  if (!emps) return;
  const empIdMap = {};
  emps.forEach((e, i) => { empIdMap[SEED_EMPLOYEES[i].id] = e.id; });
  await supabase.from("tasks").insert(
    SEED_TASKS.map(({ id, employeeId, teamId, desc, created, ...t }) => ({
      ...t, description: desc, user_id: userId,
      employee_id: empIdMap[employeeId] || null,
      team_id: teamIdMap[teamId] || null,
    }))
  );
}

// ═══════════════════════════════════════════════════════════════
//  ATOMIC COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Av = ({ t, size = 32, color = T.blue, shape = "circle" }) => (
  <div style={{ width: size, height: size, borderRadius: shape === "square" ? 8 : "50%", background: `${color}18`, border: `1.5px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.31, fontWeight: 700, color, flexShrink: 0, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "-0.04em" }}>{t}</div>
);

const Chip = ({ label, color, bg, size = "sm" }) => (
  <span style={{ display: "inline-flex", alignItems: "center", padding: size === "sm" ? "2px 7px" : "3px 10px", borderRadius: 4, fontSize: size === "sm" ? 10 : 11, fontWeight: 500, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.03em", background: bg || `${color}12`, color, border: `1px solid ${color}28`, whiteSpace: "nowrap" }}>{label}</span>
);

const WBar = ({ pct, status, h = 5 }) => {
  const c = { overloaded: T.red, balanced: T.green, underloaded: T.yellow }[status] || T.green;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: h, background: T.border, borderRadius: h, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: c, borderRadius: h, transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <span className="mono" style={{ fontSize: 11, color: c, minWidth: 36, textAlign: "right", fontWeight: 600 }}>{pct}%</span>
    </div>
  );
};

const Card = ({ children, style = {}, cls = "" }) => (
  <div className={cls} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, ...style }}>{children}</div>
);

const Modal = ({ open, onClose, title, subtitle, children, w = 520 }) => {
  useEffect(() => { const h = e => e.key === "Escape" && onClose(); if (open) window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); }, [open]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.15s ease" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }} />
      <div style={{ position: "relative", width: `min(${w}px,94vw)`, maxHeight: "90vh", overflow: "auto", background: T.surface2, border: `1px solid ${T.borderMid}`, borderRadius: 16, padding: 28, boxShadow: "0 48px 120px rgba(0,0,0,0.8)", animation: "scaleIn 0.2s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: subtitle ? 4 : 22 }}>
          <h3 className="heading" style={{ fontSize: 20, color: T.bright }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.sub, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "3px 7px", borderRadius: 6, transition: "all 0.12s" }} onMouseEnter={e => { e.currentTarget.style.background = T.border; e.currentTarget.style.color = T.text; }} onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = T.sub; }}>✕</button>
        </div>
        {subtitle && <p style={{ fontSize: 13, color: T.sub, marginBottom: 20, lineHeight: 1.65 }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

const Lbl = ({ c }) => <label style={{ display: "block", fontSize: 10.5, color: T.sub, marginBottom: 6, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.09em", textTransform: "uppercase" }}>{c}</label>;
const Inp = ({ label, ...p }) => <div style={{ marginBottom: 15 }}>{label && <Lbl c={label} />}<input {...p} className="ifield" style={p.style} /></div>;
const Txa = ({ label, ...p }) => <div style={{ marginBottom: 15 }}>{label && <Lbl c={label} />}<textarea {...p} className="ifield" style={{ resize: "vertical", minHeight: 78, lineHeight: 1.6, ...p.style }} /></div>;
const Sel = ({ label, children, ...p }) => <div style={{ marginBottom: 15 }}>{label && <Lbl c={label} />}<select {...p} className="ifield" style={{ cursor: "pointer", ...p.style }}>{children}</select></div>;

const Btn = ({ children, variant = "green", size = "md", onClick, disabled, style = {} }) => {
  const sizes = { xs: "5px 11px", sm: "7px 14px", md: "10px 20px", lg: "13px 28px", xl: "15px 36px" };
  const fz = { xs: 11, sm: 12, md: 13.5, lg: 15, xl: 16 };
  const cls = { green: "btn-green", ghost: "btn-ghost", danger: "btn-danger" };
  return (
    <button onClick={onClick} disabled={disabled} className={cls[variant] || "btn-ghost"}
      style={{ padding: sizes[size], fontSize: fz[size], borderRadius: 8, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Cabinet Grotesk',sans-serif", display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap", opacity: disabled ? 0.45 : 1, transition: "all 0.15s", ...style }}>
      {children}
    </button>
  );
};

const Divider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
    <div style={{ flex: 1, height: 1, background: T.border }} />
    {label && <span className="mono" style={{ fontSize: 10, color: T.muted }}>{label}</span>}
    <div style={{ flex: 1, height: 1, background: T.border }} />
  </div>
);

// ═══════════════════════════════════════════════════════════════
//  RAZORPAY CONFIG
// ═══════════════════════════════════════════════════════════════
const RZP_KEY = process.env.NEXT_PUBLIC_RZP_KEY || "";
const RZP_LIVE = !!RZP_KEY; // Live only when key is set

// Owner backdoor — only you get instant full access
const OWNER = { name: "Rihaan", password: "pure_vessel" };

// Trial: 7 days free, then payment required
const TRIAL_DAYS = 7;
function getTrialInfo(signupDate) {
  const start = new Date(signupDate);
  const now = new Date();
  const daysUsed = Math.floor((now - start) / 86400000);
  const daysLeft = Math.max(0, TRIAL_DAYS - daysUsed);
  const expired = daysLeft === 0;
  return { daysLeft, expired, daysUsed };
}

// Razorpay checkout launcher — opens native Razorpay modal
function openRazorpay({ plan, billing, user, onSuccess }) {
  if (!RZP_LIVE || !RZP_KEY) {
    notify("💳 Payment gateway not configured. Contact support.", "error");
    return;
  }
  const launch = () => {
    const amountPaise = billing === "annual"
      ? plan.annualTotal * 100   // total annual charge in paise
      : plan.price * 100;         // monthly in paise

    const options = {
      key: RZP_KEY,
      amount: amountPaise,
      currency: "INR",
      name: "WorkloadBalance",
      description: `${plan.name} Plan — ${billing === "annual" ? "Annual" : "Monthly"}`,
      image: "https://i.imgur.com/n5tjHFD.png",
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      notes: {
        plan_id: plan.id,
        billing_cycle: billing,
      },
      theme: { color: "#64dc8c" },
      modal: {
        ondismiss: () => {},
        confirm_close: true,
        escape: true,
      },
      handler: function (response) {
        // response.razorpay_payment_id, .razorpay_order_id, .razorpay_signature
        // Persist paid status to Supabase immediately
        if (user?.id && user.id !== 0) {
          supabase.from("profiles").update({ paid: true, plan: plan.id }).eq("id", user.id).then(() => {});
        }
        onSuccess(response, plan, billing);
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (resp) {
      notify("Payment failed: " + (resp.error?.description || "Please try again"), "error");
    });
    rzp.open();
  };

  if (window.Razorpay) {
    launch();
  } else {
    const s = document.createElement("script");
    s.id = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = launch;
    document.head.appendChild(s);
  }
}

// ═══════════════════════════════════════════════════════════════
//  LANDING PAGE
// ═══════════════════════════════════════════════════════════════
const PLANS = [
  {
    id: "starter", name: "Starter", price: 499, annual: 399, annualTotal: 4788,
    color: T.blue, desc: "For small teams getting clarity on workload",
    features: ["Up to 15 employees", "3 managers", "Core analytics dashboard", "Task management", "Workload calculations", "Email support"],
  },
  {
    id: "growth", name: "Growth", price: 1499, annual: 1199, annualTotal: 14388,
    color: T.green, popular: true, desc: "Full visibility and control at scale",
    features: ["Up to 75 employees", "Unlimited managers", "Advanced analytics & trends", "Insights engine + suggestions", "CSV / PDF export", "Slack integration", "Priority support", "Custom team colours"],
  },
  {
    id: "enterprise", name: "Enterprise", price: null, annual: null, annualTotal: null,
    color: T.purple, desc: "Full customization for large organizations",
    features: ["Unlimited employees", "Custom roles & permissions", "SSO / SAML 2.0", "Dedicated success manager", "99.9% SLA", "Audit logs", "Custom integrations", "AI-powered reports (beta)"],
  },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "VP Engineering", company: "Fintech Corp", av: "SC", color: T.blue, text: "We cut burnout incidents by 43% in Q1. I can see exactly who's about to hit the wall before it happens — and actually do something about it.", stars: 5 },
  { name: "Marcus Williams", role: "Engineering Manager", company: "Scale Labs", av: "MW", color: T.purple, text: "Finally a tool built for managers, not just executives. The redistribution suggestions save me 3+ hours of spreadsheet work every single week.", stars: 5 },
  { name: "Priya Nair", role: "Head of Product", company: "Orbit SaaS", av: "PN", color: T.green, text: "Onboarded in 20 minutes. First actionable insight within the hour. Best dollar-per-impact of any tool in our stack.", stars: 5 },
  { name: "David Osei", role: "CTO", company: "BuildFast", av: "DO", color: T.yellow, text: "Game-changer for sprint planning. We now open Workload Balance before every planning meeting. It's become the source of truth for team capacity.", stars: 5 },
];

function LandingPage({ onSignup, onLogin, onDemo, onSignupWithPlan, user, onPaySuccess }) {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  const handlePlanClick = (plan) => {
    if (!plan.price) { window.location.href = "mailto:sales@workloadbalance.io?subject=Enterprise%20Enquiry"; return; }
    if (!user) {
      // User not logged in — send to signup with plan remembered
      onSignupWithPlan ? onSignupWithPlan(plan, billing) : onSignup();
      return;
    }
    // Already logged in — open Razorpay immediately
    openRazorpay({
      plan,
      billing,
      user,
      onSuccess: (resp, pl, bl) => {
        notify(`🎉 Payment successful! ${pl.name} plan activated.`, "success");
        onPaySuccess && onPaySuccess(resp, pl, bl);
      },
    });
  };

  const faqs = [
    { q: "How does the workload calculation work?", a: "We calculate Workload% = (Total Assigned Hours) ÷ (Weekly Capacity). Employees below 60% are Underloaded, 60–100% are Balanced, and above 100% are Overloaded. It's simple, transparent, and immediately actionable." },
    { q: "Can I import our existing tasks from Jira or Asana?", a: "CSV import is available on all plans. Native Jira, Linear and Asana integrations are available on Growth and Enterprise plans." },
    { q: "Is there a free trial?", a: "Yes — all plans start with a 7-day free trial, no credit card required. You'll have full access to all features in your selected plan." },
    { q: "How is data secured?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We're SOC 2 Type II compliant and undergo annual third-party security audits." },
    { q: "Can I change plans later?", a: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the end of your billing period." },
    { q: "Do you offer discounts for nonprofits or startups?", a: "Yes — nonprofits receive 40% off, and YC/accelerator-backed startups get 6 months free on Growth. Contact us to apply." },
  ];

  const stats = [["43%", "Avg reduction in burnout incidents"], ["3.2h", "Saved per manager per week"], ["12min", "Average onboarding time"], ["4.9★", "Average rating from 200+ reviews"]];

  const logos = ["Stripe", "Linear", "Notion", "Vercel", "Supabase", "Figma", "Intercom", "Loom"];

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: "'Instrument Sans',sans-serif", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, borderBottom: `1px solid ${T.border}`, background: "rgba(7,8,16,0.88)", backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <LogoMark />
            <div style={{ display: "flex", gap: 4 }}>
              {["Product", "Pricing", "Docs", "Blog"].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{ padding: "6px 12px", borderRadius: 7, fontSize: 14, color: T.sub, transition: "color 0.14s", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.sub}>{item}</a>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Btn variant="ghost" size="sm" onClick={onLogin}>Sign in</Btn>
            <Btn variant="green" size="sm" onClick={onSignup}>Start free trial →</Btn>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "90px 24px 70px", textAlign: "center" }}>
        <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 20, border: `1px solid ${T.greenBorder}`, background: T.greenDim, marginBottom: 28, fontSize: 12, color: T.green }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green, display: "inline-block", animation: "floatUp 2s ease-in-out infinite" }} />
          <span className="mono">Now with AI-ready insights engine</span>
        </div>
        <h1 className="heading fu1" style={{ fontSize: "clamp(42px,5.5vw,76px)", lineHeight: 1.06, color: T.bright, marginBottom: 24 }}>
          Know who's burning out<br />
          <span style={{ background: "linear-gradient(135deg, #64dc8c 0%, #4fa3ff 60%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>before it happens</span>
        </h1>
        <p className="fu2" style={{ fontSize: 19, color: T.mutedText, maxWidth: 580, margin: "0 auto 44px", lineHeight: 1.7 }}>
          WorkloadBalance gives engineering managers real-time visibility into team capacity — and tells you exactly how to fix it.
        </p>
        <div className="fu3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Btn variant="green" size="xl" onClick={() => { document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" }); }}>See plans & pricing →</Btn>
          <Btn variant="ghost" size="xl" onClick={onDemo}>Try live demo →</Btn>
          <Btn variant="ghost" size="xl" onClick={onLogin}>Sign in</Btn>
        </div>
        <p className="fu4" style={{ fontSize: 12, color: T.muted }}>7-day free trial · Cancel anytime · Razorpay secured · GST invoice included</p>

        {/* DASHBOARD MOCKUP */}
        <div className="fu5" style={{ marginTop: 60, border: `1px solid ${T.borderMid}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 60px 120px rgba(0,0,0,0.6)", background: T.surface }}>
          <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, background: T.surface2 }}>
            <div style={{ display: "flex", gap: 6 }}>{[T.red, T.yellow, T.green].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}</div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <span className="mono" style={{ fontSize: 11, color: T.muted }}>app.workloadbalance.io/dashboard</span>
            </div>
          </div>
          <div style={{ padding: "22px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
              {[["7","Employees",T.mutedText],["2","Overloaded",T.red],["3","Balanced",T.green],["2","Underloaded",T.yellow]].map(([v,l,c]) => (
                <div key={l} style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: "14px 16px" }}>
                  <div className="mono" style={{ fontSize: 9, color: T.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>{l}</div>
                  <div className="heading" style={{ fontSize: 26, color: c }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 16, marginBottom: 12 }}>
              <div className="mono" style={{ fontSize: 10, color: T.muted, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Employee Workload This Week</div>
              {[{n:"Alex Rivera",p:120,s:"overloaded"},{n:"Sarah Kim",p:70,s:"balanced"},{n:"Priya Patel",p:85,s:"balanced"},{n:"Marcus Johnson",p:31,s:"underloaded"},{n:"Lisa Zhang",p:50,s:"underloaded"}].map((e,i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0", borderBottom: i < 4 ? `1px solid ${T.border}30` : "none" }}>
                  <span style={{ width: 100, fontSize: 12, color: T.text }}>{e.n.split(" ")[0]}</span>
                  <div style={{ flex: 1 }}><WBar pct={e.p} status={e.s} h={4} /></div>
                  <Chip label={STATUS_CFG[e.s]?.label} color={STATUS_CFG[e.s]?.color} bg={STATUS_CFG[e.s]?.bg} />
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(255,70,70,0.06)", border: `1px solid rgba(255,70,70,0.18)`, borderRadius: 8, padding: "11px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: T.red, fontSize: 13, marginTop: 1 }}>⚠</span>
              <p style={{ fontSize: 12, color: T.mutedText, margin: 0 }}><strong style={{ color: T.text }}>Insight:</strong> Alex Rivera is overloaded by 8h. Moving "Fix CSS bugs" (6h) to Marcus Johnson, who has 22h available, would rebalance both employees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF LOGOS */}
      <div style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "20px 0", overflow: "hidden" }}>
        <p style={{ textAlign: "center", fontSize: 11, color: T.muted, marginBottom: 16, letterSpacing: "0.1em", textTransform: "uppercase" }}>Trusted by teams at</p>
        <div className="marquee-wrap">
          <div className="marquee-inner">
            {[...logos, ...logos].map((l, i) => (
              <span key={i} className="heading" style={{ fontSize: 16, color: T.muted, opacity: 0.5, marginRight: 60 }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden" }}>
          {stats.map(([v, l], i) => (
            <div key={i} style={{ padding: "36px 32px", background: i % 2 === 0 ? T.surface : T.surface2, textAlign: "center", borderRight: i < 3 ? `1px solid ${T.border}` : "none" }}>
              <div className="heading" style={{ fontSize: 44, color: T.green, marginBottom: 8 }}>{v}</div>
              <div style={{ fontSize: 14, color: T.mutedText }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="product" style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 className="heading" style={{ fontSize: 44, color: T.bright, marginBottom: 14 }}>Everything managers need</h2>
          <p style={{ fontSize: 17, color: T.mutedText, maxWidth: 500, margin: "0 auto" }}>One platform to go from chaos to clarity — no spreadsheets required.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { icon: "⚡", title: "Real-time Workload Engine", desc: "Instantly see who's at 130% and who has 20h of free capacity. Updated automatically as tasks change. No manual data entry.", color: T.green },
            { icon: "⚖️", title: "Smart Redistribution Suggestions", desc: "Our algorithm analyzes your team structure, skill sets, and deadlines to surface the exact task reassignments that fix imbalances.", color: T.blue },
            { icon: "📊", title: "Analytics & Trend Tracking", desc: "Track team health over time with weekly trend charts. Spot patterns before they become burnout — not after.", color: T.purple },
            { icon: "🔔", title: "Burnout Risk Alerts", desc: "Get notified when any employee crosses the 100% threshold. Configurable thresholds per role, team, or individual.", color: T.yellow },
            { icon: "🏗️", title: "Team Structure Management", desc: "Organize employees into teams, set individual capacities, manage skills. Admins have full org control; managers see their slice.", color: T.red },
            { icon: "🔗", title: "Integrations & Export", desc: "Sync with Jira, Linear, Asana and Slack. Export to CSV or PDF. Full REST API for custom workflows.", color: T.green },
          ].map((f, i) => (
            <Card key={i} cls="hover-card" style={{ padding: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 className="heading" style={{ fontSize: 19, color: T.bright, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: T.mutedText, lineHeight: 1.7 }}>{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "80px 24px", background: T.bgAlt }}>
        <div style={{ maxWidth: 1120, margin: "0 auto" }}>
          <h2 className="heading" style={{ fontSize: 40, color: T.bright, textAlign: "center", marginBottom: 48 }}>What teams say</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <Card key={i} style={{ padding: 24 }}>
                <div style={{ display: "flex", gap: 1, marginBottom: 14 }}>
                  {"★★★★★".split("").map((s, j) => <span key={j} style={{ color: T.yellow, fontSize: 13 }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 14, color: T.mutedText, lineHeight: 1.7, marginBottom: 18 }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Av t={t.av} size={34} color={t.color} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: T.muted }}>{t.role} · {t.company}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="heading" style={{ fontSize: 44, color: T.bright, marginBottom: 14 }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 16, color: T.mutedText, marginBottom: 28 }}>Start free. Scale when you're ready. No hidden fees.</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 0, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: billing === b ? T.green : "transparent", color: billing === b ? "#050708" : T.mutedText, transition: "all 0.15s" }}>
                {b.charAt(0).toUpperCase() + b.slice(1)} {b === "annual" && <span style={{ fontSize: 11, background: "rgba(0,0,0,0.2)", padding: "1px 6px", borderRadius: 4, marginLeft: 4 }}>−20%</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          {PLANS.map((plan, i) => {
            const displayPrice = plan.price ? (billing === "monthly" ? plan.price : plan.annual) : null;
            const savings = plan.price && billing === "annual" ? Math.round(((plan.price - plan.annual) / plan.price) * 100) : 0;
            return (
              <div key={i} className="pricing-card" style={{ padding: 28, background: plan.popular ? "linear-gradient(160deg, #0d1a15, #0f1220)" : T.surface, border: `1.5px solid ${plan.popular ? plan.color + "50" : T.border}`, borderRadius: 14, position: "relative", boxShadow: plan.popular ? `0 0 60px ${plan.color}15` : "none" }}>
                {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#050708", fontSize: 11, fontWeight: 800, padding: "3px 12px", borderRadius: 20, fontFamily: "'Cabinet Grotesk',sans-serif", letterSpacing: "0.04em" }}>MOST POPULAR</div>}
                <h3 className="heading" style={{ fontSize: 22, color: plan.color, marginBottom: 4 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: T.sub, marginBottom: 20 }}>{plan.desc}</p>

                {/* PRICE BLOCK */}
                <div style={{ marginBottom: 8 }}>
                  {displayPrice ? (
                    <div>
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                        <span style={{ fontSize: 15, color: T.mutedText, marginBottom: 10, fontWeight: 500 }}>₹</span>
                        <span className="heading" style={{ fontSize: 46, color: T.bright, lineHeight: 1 }}>{displayPrice.toLocaleString("en-IN")}</span>
                        <span style={{ fontSize: 13, color: T.muted, marginBottom: 8 }}>/mo</span>
                      </div>
                      {billing === "annual" && (
                        <div style={{ fontSize: 12, color: T.green, marginTop: 4 }}>
                          Save {savings}% · ₹{plan.annualTotal.toLocaleString("en-IN")} billed annually
                        </div>
                      )}
                      {billing === "monthly" && (
                        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                          or ₹{plan.annual.toLocaleString("en-IN")}/mo billed annually
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="heading" style={{ fontSize: 34, color: T.bright }}>Custom pricing</div>
                  )}
                </div>

                {/* PAYMENT METHODS */}
                {plan.price && (
                  <div style={{ display: "flex", gap: 5, marginBottom: 20, flexWrap: "wrap" }}>
                    {["UPI", "Cards", "Net Banking", "Wallets"].map(m => (
                      <span key={m} className="mono" style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 3, background: T.border, color: T.muted }}>{m}</span>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ color: plan.color, fontSize: 13, marginTop: 1, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 13.5, color: T.mutedText }}>{f}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanClick(plan)}
                  style={{ width: "100%", padding: "13px", borderRadius: 9, border: `1.5px solid ${plan.color}50`, background: plan.popular ? plan.color : "transparent", color: plan.popular ? "#050708" : plan.color, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif", transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = `${plan.color}15`; } e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = "transparent"; } e.currentTarget.style.transform = ""; }}>
                  {plan.price ? (
                    <><span>Pay with Razorpay</span><span style={{ fontSize: 16 }}>→</span></>
                  ) : "Contact sales →"}
                </button>

                {plan.price && (
                  <p style={{ textAlign: "center", fontSize: 11, color: T.muted, marginTop: 10 }}>
                    🔒 Secured by Razorpay · GST invoice included
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 24px 80px" }}>
        <h2 className="heading" style={{ fontSize: 40, color: T.bright, textAlign: "center", marginBottom: 48 }}>Frequently asked</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ border: `1px solid ${openFaq === i ? T.greenBorder : T.border}`, borderRadius: 10, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: "100%", padding: "18px 20px", background: T.surface, border: "none", color: T.text, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "inherit", fontSize: 15, fontWeight: 600, textAlign: "left", transition: "background 0.14s" }} onMouseEnter={e => e.currentTarget.style.background = T.surface2} onMouseLeave={e => e.currentTarget.style.background = T.surface}>
                {faq.q}
                <span style={{ color: openFaq === i ? T.green : T.muted, fontSize: 18, lineHeight: 1, flexShrink: 0, transition: "transform 0.2s, color 0.15s", transform: openFaq === i ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === i && <div style={{ padding: "0 20px 18px", background: T.surface, fontSize: 14, color: T.mutedText, lineHeight: 1.75 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: `1px solid ${T.border}`, padding: "80px 24px", background: T.bgAlt, textAlign: "center" }}>
        <h2 className="heading" style={{ fontSize: 44, color: T.bright, marginBottom: 16 }}>Start your free trial today</h2>
        <p style={{ fontSize: 17, color: T.mutedText, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>7 days free. Full access. No credit card. Cancel anytime.</p>
        <Btn variant="green" size="xl" onClick={onSignup}>Create your account →</Btn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <LogoMark />
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Security", "Status", "Blog"].map(l => <a key={l} href="#" style={{ fontSize: 13, color: T.muted, transition: "color 0.12s" }} onMouseEnter={e => e.currentTarget.style.color = T.text} onMouseLeave={e => e.currentTarget.style.color = T.muted}>{l}</a>)}
          </div>
          <span style={{ fontSize: 12, color: T.muted }}>© 2025 WorkloadBalance Inc. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

const LogoMark = ({ size = "md" }) => {
  const sz = size === "sm" ? 22 : 28;
  const fs = size === "sm" ? 13 : 16;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{ width: sz, height: sz, borderRadius: 7, background: "linear-gradient(135deg,#64dc8c,#4fa3ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: sz * 0.5, flexShrink: 0 }}>⚖</div>
      <span className="logo-text" style={{ fontSize: fs, color: T.bright }}>Workload<span style={{ color: T.green }}>Balance</span></span>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  AUTH PAGES
// ═══════════════════════════════════════════════════════════════
function AuthPage({ mode: initMode, onAuth, onLanding }) {
  const [mode, setMode] = useState(initMode || "login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin", org: "", inviteCode: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [joinExisting, setJoinExisting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (mode === "login") {
      // Owner login bypasses email check
      const isOwner = form.name.trim().toLowerCase() === OWNER.name.toLowerCase() && form.password === OWNER.password;
      if (!isOwner) {
        if (!form.email.includes("@")) e.email = "Enter a valid email";
        if (form.password.length < 6) e.password = "Minimum 6 characters";
      }
    } else {
      if (!form.email.includes("@")) e.email = "Enter a valid email";
      if (form.password.length < 6) e.password = "Minimum 6 characters";
      if (!form.name.trim()) e.name = "Name is required";
      if (!form.org.trim()) e.org = "Organization name is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);

    // Owner backdoor — instant full access, no Supabase
    const isOwner = form.name.trim().toLowerCase() === OWNER.name.toLowerCase() && form.password === OWNER.password;
    if (isOwner) {
      setLoading(false);
      onAuth({ id: 0, name: "Rihaan", email: "owner@workloadbalance.io", role: "admin", org: "WorkloadBalance", plan: "enterprise", paid: true, signupDate: "2025-01-01", avatar: "RH" });
      notify("Welcome back, Rihaan 👋", "success");
      return;
    }

    if (mode === "signup") {
      // If joining existing org, verify invite code first
      let joinOrgId = null;
      let joinOrgName = null;
      if (joinExisting && form.inviteCode.trim()) {
        const { data: org } = await supabase.from("organizations").select("id,name").eq("invite_code", form.inviteCode.trim().toUpperCase()).single();
        if (!org) { setLoading(false); setErrors({ inviteCode: "Invalid invite code — double check and try again." }); return; }
        joinOrgId = org.id;
        joinOrgName = org.name;
      }
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { name: form.name.trim(), role: form.role, org: joinOrgName || form.org.trim(), join_org_id: joinOrgId, create_org: !joinExisting } },
      });
      setLoading(false);
      if (error) { setErrors({ email: error.message }); return; }
      // If Supabase requires email confirmation, session will be null
      if (!signUpData?.session) {
        setSentEmail(form.email);
        setEmailSent(true);
      }
      // If session exists, onAuthStateChange fires SIGNED_IN and loads the user automatically
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      setLoading(false);
      if (error) {
        // Supabase returns a specific error when email is unconfirmed
        if (error.message?.toLowerCase().includes("email not confirmed")) {
          setSentEmail(form.email);
          setEmailSent(true);
          return;
        }
        setErrors({ email: "Invalid email or password." });
        return;
      }
      // App's onAuthStateChange will fire and load the user
    }
  };

  // Email verification pending screen
  if (emailSent) {
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <G />
        <div style={{ maxWidth: 440, width: "100%", textAlign: "center", animation: "fadeUp 0.35s ease" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: T.greenDim, border: `2px solid ${T.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, margin: "0 auto 24px" }}>📧</div>
          <h2 className="heading" style={{ fontSize: 26, color: T.bright, marginBottom: 10 }}>Verify your email</h2>
          <p style={{ fontSize: 14.5, color: T.mutedText, lineHeight: 1.7, marginBottom: 8 }}>
            We sent a confirmation link to <strong style={{ color: T.text }}>{sentEmail}</strong>.
          </p>
          <p style={{ fontSize: 13, color: T.sub, lineHeight: 1.65, marginBottom: 28 }}>
            Click the link in the email to activate your account and start your 7-day free trial. Check your spam folder if you don't see it within a minute.
          </p>
          <div style={{ padding: "16px 20px", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, color: T.sub, marginBottom: 24 }}>
            Already clicked the link?{" "}
            <button onClick={() => window.location.reload()} style={{ color: T.green, background: "none", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Refresh page →</button>
          </div>
          <button onClick={onLanding} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13 }}>← Back to home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      {/* LEFT */}
      <div style={{ padding: 48, display: "flex", flexDirection: "column", justifyContent: "space-between", borderRight: `1px solid ${T.border}`, background: T.surface }}>
        <button onClick={onLanding} style={{ background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}>
          <LogoMark />
        </button>
        <div>
          <div style={{ display: "flex", gap: 2, marginBottom: 20 }}>
            {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: T.yellow, fontSize: 16 }}>{s}</span>)}
          </div>
          <blockquote style={{ fontSize: 22, fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, lineHeight: 1.45, color: T.bright, marginBottom: 24 }}>
            "We went from weekly firefighting to daily clarity. Overload incidents dropped 43% in month one."
          </blockquote>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Av t="SC" size={42} color={T.blue} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Sarah Chen</div>
              <div style={{ fontSize: 12.5, color: T.sub }}>VP Engineering · Fintech Corp</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 40, flexWrap: "wrap" }}>
            {["SOC 2 Compliant", "GDPR Ready", "99.9% Uptime", "JWT Auth"].map(t => <Chip key={t} label={t} color={T.sub} bg="transparent" />)}
          </div>
        </div>
        <div style={{ fontSize: 12, color: T.muted }}>© 2025 WorkloadBalance Inc.</div>
      </div>

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48, background: T.bg }}>
        <div style={{ width: "100%", maxWidth: 400, animation: "fadeUp 0.35s ease" }}>
          <h2 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 6 }}>{mode === "login" ? "Sign in to your workspace" : "Create your account"}</h2>
          <p style={{ fontSize: 14, color: T.sub, marginBottom: 28 }}>{mode === "login" ? "Enter your credentials to continue" : "7-day free trial — no credit card required"}</p>

          {mode === "signup" && (
            <div style={{ marginBottom: 15 }}>
              <Lbl c="Full name" />
              <input className="ifield" placeholder="Jane Smith" value={form.name} onChange={set("name")} />
              {errors.name && <p style={{ color: T.red, fontSize: 11, marginTop: 4 }}>{errors.name}</p>}
            </div>
          )}
          {mode === "login" && (
            <div style={{ marginBottom: 15 }}>
              <Lbl c="Name" />
              <input className="ifield" placeholder="Your name" value={form.name} onChange={set("name")} />
            </div>
          )}
          {mode === "signup" && (
            <div style={{ marginBottom: 15 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <Lbl c={joinExisting ? "Invite Code" : "Organization name"} />
                <button onClick={() => setJoinExisting(j => !j)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: T.green, fontFamily: "inherit" }}>
                  {joinExisting ? "← Create new org" : "Have an invite code?"}
                </button>
              </div>
              {joinExisting ? (
                <>
                  <input className="ifield" placeholder="e.g. ACME-1A2B" value={form.inviteCode} onChange={set("inviteCode")} style={{ letterSpacing: "0.08em", textTransform: "uppercase" }} />
                  {errors.inviteCode && <p style={{ color: T.red, fontSize: 11, marginTop: 4 }}>{errors.inviteCode}</p>}
                </>
              ) : (
                <>
                  <input className="ifield" placeholder="Acme Corp" value={form.org} onChange={set("org")} />
                  {errors.org && <p style={{ color: T.red, fontSize: 11, marginTop: 4 }}>{errors.org}</p>}
                </>
              )}
            </div>
          )}
          <div style={{ marginBottom: 15 }}>
            <Lbl c="Work email" />
            <input className="ifield" type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} />
            {errors.email && <p style={{ color: T.red, fontSize: 11, marginTop: 4 }}>{errors.email}</p>}
          </div>
          <div style={{ marginBottom: 15 }}>
            <Lbl c="Password" />
            <input className="ifield" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set("password")} />
            {errors.password && <p style={{ color: T.red, fontSize: 11, marginTop: 4 }}>{errors.password}</p>}
          </div>
          {mode === "signup" && (
            <div style={{ marginBottom: 15 }}>
              <Lbl c="Your role" />
              <select className="ifield" value={form.role} onChange={set("role")}>
                <option value="admin">Admin — Full organization access</option>
                <option value="manager">Manager — Team management access</option>
              </select>
            </div>
          )}

          <button onClick={submit} disabled={loading} className="btn-green" style={{ width: "100%", padding: "13px", fontSize: 15, borderRadius: 9, fontFamily: "'Cabinet Grotesk',sans-serif", fontWeight: 700, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1, marginTop: 6 }}>
            {loading ? <><span style={{ width: 16, height: 16, border: "2px solid #050708", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Processing...</> : mode === "login" ? "Sign in →" : "Create account →"}
          </button>

          {mode === "login" && (
            <div style={{ textAlign: "right", marginTop: 10 }}>
              <a href="#" style={{ fontSize: 12, color: T.sub, textDecoration: "underline" }}>Forgot password?</a>
            </div>
          )}

          <Divider label="OR" />

          <div style={{ textAlign: "center", fontSize: 13.5, color: T.sub }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setMode(m => m === "login" ? "signup" : "login")} style={{ color: T.green, background: "none", border: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600 }}>
              {mode === "login" ? "Start free trial" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  APP SHELL
// ═══════════════════════════════════════════════════════════════
function AppShell({ user, onLogout, children, page, setPage, tasks, workloads, demoMode, onSignup }) {
  const over = workloads.filter(w => w.status === "overloaded").length;
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦", badge: over > 0 ? over : null, badgeColor: T.red },
    { id: "tasks", label: "Tasks", icon: "✓" },
    { id: "employees", label: "Employees", icon: "◉" },
    { id: "teams", label: "Teams", icon: "⬡" },
    { id: "analytics", label: "Analytics", icon: "⬟" },
    null,
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, overflow: "hidden" }}>
      {/* SIDEBAR */}
      <aside style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", borderRight: `1px solid ${T.border}`, background: T.surface, padding: "16px 10px" }}>
        <div style={{ padding: "2px 8px", marginBottom: 24 }}>
          <LogoMark size="sm" />
        </div>

        {/* ORG PILL */}
        <div style={{ padding: "9px 10px", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 5, background: "linear-gradient(135deg,#64dc8c,#4fa3ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🏢</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.org}</div>
            <div className="mono" style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>{user.plan} plan</div>
          </div>
        </div>

        <div className="mono" style={{ fontSize: 9, color: T.muted, padding: "0 8px", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Workspace</div>

        <nav style={{ flex: 1 }}>
          {navItems.map((item, i) => {
            if (!item) return <div key={i} style={{ height: 1, background: T.border, margin: "8px 0" }} />;
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`nav-link ${active ? "active" : ""}`}
                style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", border: "none", cursor: "pointer", fontSize: 13.5, fontFamily: "inherit", fontWeight: active ? 600 : 400, textAlign: "left", marginBottom: 2, color: active ? T.green : T.mutedText, background: active ? T.greenDim : "transparent" }}>
                <span style={{ fontSize: 14, opacity: 0.85 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && <span className="mono" style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: `${item.badgeColor}20`, color: item.badgeColor, fontWeight: 700 }}>{item.badge}</span>}
              </button>
            );
          })}
        </nav>

        {/* WORKLOAD QUICKVIEW */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${T.border}`, marginBottom: 12 }}>
          <div className="mono" style={{ fontSize: 9, color: T.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.09em" }}>Team Pulse</div>
          {workloads.slice(0, 5).map(emp => (
            <div key={emp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: T.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 100 }}>{emp.name.split(" ")[0]}</span>
              <span className="mono" style={{ fontSize: 10, color: { overloaded: T.red, balanced: T.green, underloaded: T.yellow }[emp.status], fontWeight: 700 }}>{emp.pct}%</span>
            </div>
          ))}
        </div>

        {/* USER */}
        <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 4px", marginBottom: 10 }}>
            <Av t={user.avatar} size={30} color={T.blue} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: T.muted, textTransform: "capitalize" }}>{user.role}</div>
            </div>
          </div>
          <button onClick={onLogout} className="btn-ghost" style={{ width: "100%", padding: "7px", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <span>↩</span> Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, overflow: "auto", padding: "32px 36px" }}>
        {demoMode && (
          <div style={{ background: "linear-gradient(135deg,rgba(100,220,140,0.08),rgba(79,163,255,0.08))", border: `1px solid rgba(100,220,140,0.25)`, borderRadius: 10, padding: "11px 18px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>👁️</span>
              <span style={{ fontSize: 13, color: T.text }}><strong style={{ color: T.green }}>Live Demo</strong> — read-only preview with sample data. No edits are saved.</span>
            </div>
            <Btn variant="green" size="sm" onClick={onSignup}>Start free trial →</Btn>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
function DashboardPage({ employees, tasks, teams, workloads, onNavigate }) {
  const insights = useMemo(() => generateInsights(workloads, tasks), [workloads, tasks]);
  const over = workloads.filter(e => e.status === "overloaded").length;
  const bal = workloads.filter(e => e.status === "balanced").length;
  const under = workloads.filter(e => e.status === "underloaded").length;
  const totalCapacity = employees.reduce((s, e) => s + e.capacity, 0);
  const totalAssigned = tasks.filter(t => t.status !== "done").reduce((s, t) => s + t.hours, 0);
  const orgUtil = Math.round((totalAssigned / totalCapacity) * 100);

  const chartData = workloads.map(e => ({ name: e.name.split(" ")[0], hours: e.totalHours, cap: e.capacity, pct: e.pct, status: e.status }));

  const trendData = [
    { week: "Wk 1", overloaded: 3, balanced: 2, underloaded: 2 },
    { week: "Wk 2", overloaded: 3, balanced: 3, underloaded: 1 },
    { week: "Wk 3", overloaded: 2, balanced: 3, underloaded: 2 },
    { week: "Wk 4", overloaded: 2, balanced: 3, underloaded: 2 },
    { week: "Now", overloaded: over, balanced: bal, underloaded: under },
  ];

  const ChartTip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div style={{ background: T.surface2, border: `1px solid ${T.borderMid}`, borderRadius: 9, padding: "11px 14px", fontSize: 12 }}>
        <p style={{ fontWeight: 600, marginBottom: 6, color: T.bright }}>{d?.name}</p>
        <p style={{ color: T.mutedText }}>Assigned: <strong style={{ color: T.text }}>{d?.hours}h</strong></p>
        <p style={{ color: T.mutedText }}>Capacity: <strong style={{ color: T.text }}>{d?.cap}h</strong></p>
        <p style={{ color: STATUS_CFG[d?.status]?.color, fontWeight: 700, marginTop: 4 }}>{d?.pct}% — {STATUS_CFG[d?.status]?.label}</p>
      </div>
    );
  };

  return (
    <div>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 4, letterSpacing: "-0.03em" }}>Dashboard</h1>
          <p style={{ fontSize: 13.5, color: T.sub }}>Team workload overview · Week of April 7, 2025</p>
        </div>
        <div style={{ display: "flex", align: "center", gap: 8 }}>
          <Chip label={`Org: ${orgUtil}%`} color={orgUtil > 100 ? T.red : orgUtil < 60 ? T.yellow : T.green} bg={orgUtil > 100 ? T.redDim : orgUtil < 60 ? T.yellowDim : T.greenDim} size="lg" />
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Total Employees", value: employees.length, sub: `${teams.length} teams`, icon: "👥", color: T.text },
          { label: "Overloaded", value: over, sub: "need attention", icon: "⚠️", color: T.red, trend: over > 2 ? 15 : -8 },
          { label: "Balanced", value: bal, sub: "on track", icon: "✓", color: T.green },
          { label: "Underloaded", value: under, sub: "have capacity", icon: "↓", color: T.yellow },
        ].map((s, i) => (
          <div key={i} className={`fu${i + 1}`} style={{ padding: "20px 22px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</span>
              <span style={{ fontSize: 15 }}>{s.icon}</span>
            </div>
            <div className="heading" style={{ fontSize: 34, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 14 }}>
        <Card cls="fu2" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 className="heading" style={{ fontSize: 16, color: T.bright }}>Employee Workload</h3>
            <div style={{ display: "flex", gap: 12 }}>
              {Object.entries(STATUS_CFG).map(([k, v]) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: T.sub }}>
                  <div style={{ width: 7, height: 7, borderRadius: 2, background: v.color }} />{v.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={28} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
              <Tooltip content={<ChartTip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="hours" radius={[5, 5, 0, 0]}>
                {chartData.map((e, i) => <Cell key={i} fill={STATUS_CFG[e.status]?.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card cls="fu3" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>Team Health</h3>
          {teams.map(team => {
            const tw = workloads.filter(e => e.team === team.id);
            const avg = tw.length ? Math.round(tw.reduce((s, e) => s + e.pct, 0) / tw.length) : 0;
            const st = avg > 100 ? "overloaded" : avg < 60 ? "underloaded" : "balanced";
            const oc = tw.filter(e => e.status === "overloaded").length;
            return (
              <div key={team.id} style={{ padding: "12px 0", borderBottom: `1px solid ${T.border}22` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: team.color }} />
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{team.name}</span>
                    <Chip label={`${tw.length} people`} color={T.muted} bg="transparent" />
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {oc > 0 && <Chip label={`${oc} over`} color={T.red} bg={T.redDim} />}
                    <Chip label={`${avg}%`} color={STATUS_CFG[st]?.color} bg={STATUS_CFG[st]?.bg} />
                  </div>
                </div>
                <WBar pct={avg} status={st} h={4} />
              </div>
            );
          })}
        </Card>
      </div>

      {/* TREND + INSIGHTS */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 14 }}>
        <Card cls="fu4" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>4-Week Trend</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="gOver" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.red} stopOpacity={0.15}/><stop offset="95%" stopColor={T.red} stopOpacity={0}/></linearGradient>
                <linearGradient id="gBal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.green} stopOpacity={0.15}/><stop offset="95%" stopColor={T.green} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="week" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.borderMid}`, borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="overloaded" stroke={T.red} fill="url(#gOver)" strokeWidth={2} dot={{ fill: T.red, r: 3 }} name="Overloaded" />
              <Area type="monotone" dataKey="balanced" stroke={T.green} fill="url(#gBal)" strokeWidth={2} dot={{ fill: T.green, r: 3 }} name="Balanced" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card cls="fu5" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 className="heading" style={{ fontSize: 16, color: T.bright }}>Insights</h3>
            <Chip label="LIVE" color={T.green} bg={T.greenDim} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 180, overflow: "auto" }}>
            {insights.length === 0 && <p style={{ fontSize: 13, color: T.sub }}>✓ No issues detected this week.</p>}
            {insights.slice(0, 3).map((ins, i) => {
              const cfg = { critical: { color: T.red, icon: "⚠" }, warning: { color: T.yellow, icon: "!" }, info: { color: T.blue, icon: "→" } }[ins.severity];
              return (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: `${cfg.color}08`, border: `1px solid ${cfg.color}22`, display: "flex", gap: 9 }}>
                  <span style={{ color: cfg.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
                  <p style={{ fontSize: 12, color: T.mutedText, lineHeight: 1.55, margin: 0 }}>{ins.message}</p>
                </div>
              );
            })}
            {insights.length > 3 && <button onClick={() => onNavigate("analytics")} style={{ background: "none", border: "none", color: T.green, cursor: "pointer", fontSize: 12, textAlign: "left", padding: "4px 0" }}>View all {insights.length} insights →</button>}
          </div>
        </Card>
      </div>

      {/* EMPLOYEE TABLE */}
      <Card cls="fu5" style={{ padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright }}>All Employees</h3>
          <Btn variant="ghost" size="sm" onClick={() => onNavigate("employees")}>Manage →</Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Employee", "Team", "Skills", "Assigned", "Capacity", "Workload", "Status"].map(h => (
                  <th key={h} style={{ padding: "6px 12px", textAlign: "left", fontSize: 10, color: T.muted, borderBottom: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.09em", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workloads.map(emp => {
                const team = teams.find(t => t.id === emp.team);
                const cfg = STATUS_CFG[emp.status];
                return (
                  <tr key={emp.id} style={{ borderBottom: `1px solid ${T.border}18` }}>
                    <td style={{ padding: "13px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Av t={emp.avatar} size={30} color={team?.color || T.blue} />
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{emp.name}</div>
                          <div style={{ fontSize: 11, color: T.muted }}>{emp.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 12px" }}><span style={{ fontSize: 13, color: team?.color }}>{team?.name}</span></td>
                    <td style={{ padding: "13px 12px" }}>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {emp.skills.slice(0, 2).map(s => <Chip key={s} label={s} color={T.mutedText} bg={T.border} />)}
                      </div>
                    </td>
                    <td style={{ padding: "13px 12px" }}><span className="mono" style={{ fontSize: 12 }}>{emp.totalHours}h</span></td>
                    <td style={{ padding: "13px 12px" }}><span className="mono" style={{ fontSize: 12, color: T.muted }}>{emp.capacity}h/wk</span></td>
                    <td style={{ padding: "13px 12px", minWidth: 140 }}><WBar pct={emp.pct} status={emp.status} h={4} /></td>
                    <td style={{ padding: "13px 12px" }}><Chip label={cfg.label} color={cfg.color} bg={cfg.bg} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TASKS PAGE
// ═══════════════════════════════════════════════════════════════
function TasksPage({ tasks, setTasks, employees, teams, userId, demoMode }) {
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [view, setView] = useState("kanban");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterPri, setFilterPri] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", desc: "", hours: "", priority: "medium", employeeId: "", teamId: "", due: "", status: "todo" });
  const sf = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const csvRef = useRef();
  const [csvPreview, setCsvPreview] = useState(null);

  const openAdd = () => { setEditTask(null); setForm({ title: "", desc: "", hours: "", priority: "medium", employeeId: "", teamId: "", due: "", status: "todo" }); setOpen(true); };
  const openEdit = t => { setEditTask(t); setForm({ title: t.title, desc: t.desc, hours: String(t.hours), priority: t.priority, employeeId: String(t.employeeId), teamId: String(t.teamId), due: t.due, status: t.status }); setOpen(true); };

  const save = async () => {
    if (!form.title || !form.employeeId) return;
    const emp = employees.find(e => e.id === Number(form.employeeId));
    if (userId && userId !== 0) {
      const payload = {
        user_id: userId, title: form.title, description: form.desc,
        hours: Number(form.hours), priority: form.priority, status: form.status,
        employee_id: Number(form.employeeId), team_id: Number(emp?.team || form.teamId),
        due: form.due || null,
      };
      if (editTask) {
        const { data, error } = await supabase.from("tasks").update(payload).eq("id", editTask.id).select().single();
        if (!error && data) setTasks(prev => prev.map(t => t.id === editTask.id ? mapTask(data) : t));
        notify("Task updated successfully", "success");
      } else {
        const { data, error } = await supabase.from("tasks").insert(payload).select().single();
        if (!error && data) setTasks(prev => [...prev, mapTask(data)]);
        notify("Task created", "success");
      }
    } else {
      const payload = { ...form, hours: Number(form.hours), employeeId: Number(form.employeeId), teamId: Number(emp?.team || form.teamId) };
      if (editTask) {
        setTasks(prev => prev.map(t => t.id === editTask.id ? { ...t, ...payload } : t));
        notify("Task updated successfully", "success");
      } else {
        setTasks(prev => [...prev, { id: Date.now(), ...payload, created: new Date().toISOString().slice(0, 10) }]);
        notify("Task created", "success");
      }
    }
    setOpen(false);
  };

  const del = async (id) => {
    if (userId && userId !== 0) await supabase.from("tasks").delete().eq("id", id).eq("user_id", userId);
    setTasks(prev => prev.filter(t => t.id !== id));
    notify("Task deleted", "info");
  };
  const setStatus = async (id, status) => {
    if (userId && userId !== 0) await supabase.from("tasks").update({ status }).eq("id", id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const parseTasksCsv = e => {
    const file = e.target.files[0]; if (!file) return; e.target.value = "";
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { notify("CSV has no data rows", "error"); return; }
      const hdrs = lines[0].split(",").map(h => h.replace(/"/g, "").trim().toLowerCase().replace(/\s/g, ""));
      const rows = lines.slice(1).map(line => {
        const cols = []; let cur = "", inQ = false;
        for (const c of line) { if (c === '"') inQ = !inQ; else if (c === ',' && !inQ) { cols.push(cur); cur = ""; } else cur += c; }
        cols.push(cur);
        const r = {}; hdrs.forEach((h, i) => { r[h] = (cols[i] || "").replace(/"/g, "").trim(); });
        if (!r.title) return null;
        const q = (r.employee || r.assignedto || r.name || "").toLowerCase();
        const em = q ? employees.find(e => e.name.toLowerCase().includes(q)) : null;
        return { title: r.title, desc: r.desc || "", hours: Math.abs(Number(r.hours)) || 0, priority: ["high", "medium", "low"].includes(r.priority) ? r.priority : "medium", status: ["todo", "in-progress", "done"].includes(r.status) ? r.status : "todo", due: r.due || "", employeeId: em?.id || null, teamId: em?.team || null, _emp: r.employee || r.assignedto || "", _ok: !!em };
      }).filter(Boolean);
      setCsvPreview(rows);
    };
    reader.readAsText(file);
  };
  const confirmCsvTasks = async () => {
    const valid = csvPreview.filter(r => r._ok);
    if (!valid.length) { notify("No valid rows — employee names must partially match", "error"); return; }
    if (userId && userId !== 0) {
      const { data, error } = await supabase.from("tasks").insert(
        valid.map(r => ({
          user_id: userId, title: r.title, description: r.desc, hours: r.hours,
          priority: r.priority, status: r.status, due: r.due || null,
          employee_id: r.employeeId, team_id: r.teamId,
        }))
      ).select();
      if (!error && data) setTasks(prev => [...prev, ...data.map(mapTask)]);
    } else {
      const now = Date.now();
      setTasks(prev => [...prev, ...valid.map((r, i) => ({ id: now + i, title: r.title, desc: r.desc, hours: r.hours, priority: r.priority, status: r.status, due: r.due, employeeId: r.employeeId, teamId: r.teamId, created: new Date().toISOString().slice(0, 10) }))]);
    }
    notify(`${valid.length} task${valid.length !== 1 ? "s" : ""} imported`, "success");
    setCsvPreview(null);
  };

  const filtered = tasks.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterTeam !== "all" && String(t.teamId) !== filterTeam) return false;
    if (filterPri !== "all" && t.priority !== filterPri) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cols = [
    { key: "todo", label: "To Do", color: T.sub, cnt: filtered.filter(t => t.status === "todo").length },
    { key: "in-progress", label: "In Progress", color: T.blue, cnt: filtered.filter(t => t.status === "in-progress").length },
    { key: "done", label: "Done", color: T.green, cnt: filtered.filter(t => t.status === "done").length },
  ];

  const TaskCard = ({ task }) => {
    const emp = employees.find(e => e.id === task.employeeId);
    const team = teams.find(t => t.id === task.teamId);
    const pc = PRI_CFG[task.priority];
    const overdue = new Date(task.due) < new Date() && task.status !== "done";
    return (
      <div className="task-card" style={{ padding: 14, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, borderLeft: `3px solid ${cols.find(c => c.key === task.status)?.color || T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 7 }}>
          <h4 style={{ fontSize: 13.5, fontWeight: 600, color: T.bright, lineHeight: 1.35, flex: 1 }}>{task.title}</h4>
          {!demoMode && (
            <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
              <button onClick={() => openEdit(task)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, padding: "1px 4px", borderRadius: 4, transition: "color 0.12s" }} onMouseEnter={e => e.currentTarget.style.color = T.blue} onMouseLeave={e => e.currentTarget.style.color = T.muted}>✎</button>
              <button onClick={() => del(task.id)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 14, padding: "1px 4px", borderRadius: 4, transition: "color 0.12s" }} onMouseEnter={e => e.currentTarget.style.color = T.red} onMouseLeave={e => e.currentTarget.style.color = T.muted}>✕</button>
            </div>
          )}
        </div>
        {task.desc && <p style={{ fontSize: 12, color: T.sub, lineHeight: 1.55, marginBottom: 9 }}>{task.desc}</p>}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 10 }}>
          <Chip label={`${task.hours}h`} color={T.mutedText} bg={T.border} />
          <Chip label={pc.label} color={pc.color} bg={pc.bg} />
          {task.due && <Chip label={task.due} color={overdue ? T.red : T.muted} bg={overdue ? T.redDim : "transparent"} />}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {emp ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Av t={emp.avatar} size={20} color={team?.color || T.blue} />
              <span style={{ fontSize: 11.5, color: T.sub }}>{emp.name.split(" ")[0]}</span>
            </div>
          ) : <span />}
          <select value={task.status} onChange={e => setStatus(task.id, e.target.value)} style={{ fontSize: 11, background: "transparent", border: "none", color: T.muted, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 4 }}>Tasks</h1>
          <p style={{ fontSize: 13.5, color: T.sub }}>{tasks.length} total · {tasks.filter(t => t.status === "in-progress").length} in progress · {tasks.filter(t => t.status === "done").length} done</p>
        </div>
        {!demoMode && (
          <div style={{ display: "flex", gap: 8 }}>
            <input ref={csvRef} type="file" accept=".csv" style={{ display: "none" }} onChange={parseTasksCsv} />
            <Btn variant="ghost" size="md" onClick={() => csvRef.current.click()}>↑ Import CSV</Btn>
            <Btn variant="green" size="md" onClick={openAdd}>+ New Task</Btn>
          </div>
        )}
      </div>

      {/* FILTERS */}
      <div className="fu1" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: "0 0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: 13 }}>🔍</span>
          <input className="ifield" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, width: 200 }} />
        </div>
        {[
          ["Status", ["all","todo","in-progress","done"], filterStatus, setFilterStatus],
          ["Team", ["all", ...teams.map(t => t.id)], filterTeam, setFilterTeam],
          ["Priority", ["all","high","medium","low"], filterPri, setFilterPri],
        ].map(([label, opts, val, setVal]) => (
          <select key={label} value={val} onChange={e => setVal(e.target.value)} className="ifield" style={{ width: "auto", paddingLeft: 10 }}>
            {opts.map(o => <option key={o} value={o}>{o === "all" ? `All ${label}s` : teams.find(t => t.id === o)?.name || (String(o).charAt(0).toUpperCase() + String(o).slice(1))}</option>)}
          </select>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4, background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 8, padding: 3 }}>
          {[["⊞","kanban"],["☰","list"]].map(([icon, v]) => (
            <button key={v} onClick={() => setView(v)} style={{ padding: "5px 10px", borderRadius: 6, border: "none", cursor: "pointer", background: view === v ? T.border : "transparent", color: view === v ? T.text : T.muted, transition: "all 0.12s", fontSize: 14 }}>{icon}</button>
          ))}
        </div>
      </div>

      {/* KANBAN */}
      {view === "kanban" && (
        <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {cols.map(col => (
            <div key={col.key}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "0 2px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: col.color }} />
                  <span className="mono" style={{ fontSize: 11.5, fontWeight: 600, color: col.color }}>{col.label}</span>
                </div>
                <Chip label={String(col.cnt)} color={T.muted} bg={T.border} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 120 }}>
                {filtered.filter(t => t.status === col.key).map(task => <TaskCard key={task.id} task={task} />)}
                {filtered.filter(t => t.status === col.key).length === 0 && (
                  <div style={{ padding: 24, textAlign: "center", color: T.muted, fontSize: 12, border: `1px dashed ${T.border}`, borderRadius: 10, fontFamily: "'JetBrains Mono',monospace" }}>Empty</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <Card cls="fu2" style={{ overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                {["Title","Assigned to","Team","Hours","Priority","Due","Status",""].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(task => {
                const emp = employees.find(e => e.id === task.employeeId);
                const team = teams.find(t => t.id === task.teamId);
                const pc = PRI_CFG[task.priority];
                const overdue = new Date(task.due) < new Date() && task.status !== "done";
                return (
                  <tr key={task.id} style={{ borderBottom: `1px solid ${T.border}15` }} onMouseEnter={e => e.currentTarget.style.background = T.surface2} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 13.5, fontWeight: 500 }}>{task.title}</span></td>
                    <td style={{ padding: "12px 14px" }}>
                      {emp && <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Av t={emp.avatar} size={22} color={team?.color || T.blue} /><span style={{ fontSize: 12.5 }}>{emp.name.split(" ")[0]}</span></div>}
                    </td>
                    <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 12.5, color: team?.color }}>{team?.name}</span></td>
                    <td style={{ padding: "12px 14px" }}><span className="mono" style={{ fontSize: 12 }}>{task.hours}h</span></td>
                    <td style={{ padding: "12px 14px" }}><Chip label={pc.label} color={pc.color} bg={pc.bg} /></td>
                    <td style={{ padding: "12px 14px" }}><span className="mono" style={{ fontSize: 11.5, color: overdue ? T.red : T.mutedText }}>{task.due}</span></td>
                    <td style={{ padding: "12px 14px" }}>
                      <select value={task.status} onChange={e => setStatus(task.id, e.target.value)} style={{ fontSize: 11, background: "transparent", border: "none", color: cols.find(c => c.key === task.status)?.color || T.muted, cursor: "pointer", fontFamily: "'JetBrains Mono',monospace" }}>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => openEdit(task)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 12, padding: "3px 6px" }}>✎</button>
                        <button onClick={() => del(task.id)} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13, padding: "3px 6px" }}>✕</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: T.muted }}>No tasks match your filters</div>}
        </Card>
      )}

      {/* TASK MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title={editTask ? "Edit Task" : "New Task"} subtitle="Assign tasks to team members and track their estimated workload impact.">
        <Inp label="Task Title" placeholder="e.g. Refactor authentication module" value={form.title} onChange={sf("title")} />
        <Txa label="Description" placeholder="Brief context and acceptance criteria..." value={form.desc} onChange={sf("desc")} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Inp label="Estimated Hours" type="number" placeholder="8" value={form.hours} onChange={sf("hours")} />
          <Inp label="Due Date" type="date" value={form.due} onChange={sf("due")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Sel label="Priority" value={form.priority} onChange={sf("priority")}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Sel>
          <Sel label="Status" value={form.status} onChange={sf("status")}><option value="todo">To Do</option><option value="in-progress">In Progress</option><option value="done">Done</option></Sel>
        </div>
        <Sel label="Assign To" value={form.employeeId} onChange={e => { const emp = employees.find(em => em.id === Number(e.target.value)); setForm(f => ({ ...f, employeeId: e.target.value, teamId: String(emp?.team || "") })); }}>
          <option value="">Select employee...</option>
          {employees.map(e => {
            const t = teams.find(t => t.id === e.team);
            return <option key={e.id} value={e.id}>{e.name} — {e.role} ({t?.name})</option>;
          })}
        </Sel>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
          <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn variant="green" onClick={save} disabled={!form.title || !form.employeeId}>{editTask ? "Save Changes" : "Create Task"}</Btn>
        </div>
      </Modal>

      {/* CSV IMPORT PREVIEW */}
      <Modal open={!!csvPreview} onClose={() => setCsvPreview(null)} title="Import Tasks from CSV" subtitle={`${csvPreview?.filter(r => r._ok).length || 0} valid · ${csvPreview?.filter(r => !r._ok).length || 0} skipped (unknown employee)`} w={700}>
        {csvPreview && (
          <div>
            <div style={{ maxHeight: 340, overflow: "auto", borderRadius: 8, border: `1px solid ${T.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: `1px solid ${T.border}`, background: T.surface3 }}>{["Title", "Hours", "Priority", "Status", "Assigned To", ""].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{h}</th>)}</tr></thead>
                <tbody>{csvPreview.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}15`, background: r._ok ? "transparent" : "rgba(255,70,70,0.04)" }}>
                    <td style={{ padding: "9px 12px", fontSize: 13 }}>{r.title}</td>
                    <td style={{ padding: "9px 12px" }}><span className="mono" style={{ fontSize: 12 }}>{r.hours}h</span></td>
                    <td style={{ padding: "9px 12px" }}><Chip label={r.priority} color={PRI_CFG[r.priority]?.color} bg={PRI_CFG[r.priority]?.bg} /></td>
                    <td style={{ padding: "9px 12px" }}><span className="mono" style={{ fontSize: 11, color: T.muted }}>{r.status}</span></td>
                    <td style={{ padding: "9px 12px" }}>
                      {r._ok ? <span style={{ fontSize: 12, color: T.green }}>{employees.find(e => e.id === r.employeeId)?.name}</span>
                        : <span style={{ fontSize: 12, color: T.red }}>⚠ "{r._emp}" not found</span>}
                    </td>
                    <td style={{ padding: "9px 12px", fontSize: 13, color: r._ok ? T.green : T.red }}>{r._ok ? "✓" : "✕"}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: T.bgAlt, borderRadius: 8, fontSize: 12, color: T.muted }}>
              <strong style={{ color: T.text }}>Expected columns:</strong> title, desc, hours, priority, status, due, employee<br />
              Employee name must partially match an existing employee's full name.
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setCsvPreview(null)}>Cancel</Btn>
              <Btn variant="green" onClick={confirmCsvTasks} disabled={!csvPreview.some(r => r._ok)}>Import {csvPreview.filter(r => r._ok).length} Task{csvPreview.filter(r => r._ok).length !== 1 ? "s" : ""} →</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EMPLOYEES PAGE
// ═══════════════════════════════════════════════════════════════
function EmployeesPage({ employees, setEmployees, teams, tasks, workloads, userId, demoMode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [form, setForm] = useState({ name: "", role: "", team: 1, capacity: 40, skills: "", email: "", location: "" });
  const sf = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const empCsvRef = useRef();
  const [empCsvPreview, setEmpCsvPreview] = useState(null);

  const add = async () => {
    if (!form.name) return;
    const skills = form.skills.split(",").map(s => s.trim()).filter(Boolean);
    const avatar = form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    if (userId && userId !== 0) {
      const { data, error } = await supabase.from("employees").insert({
        user_id: userId, name: form.name, role: form.role, team_id: Number(form.team),
        capacity: Number(form.capacity), skills, avatar, email: form.email,
        location: form.location, joined: new Date().toISOString().slice(0, 10),
      }).select().single();
      if (error) { notify("Failed to add employee", "error"); return; }
      setEmployees(prev => [...prev, mapEmployee(data)]);
    } else {
      setEmployees(prev => [...prev, { id: Date.now(), ...form, team: Number(form.team), capacity: Number(form.capacity), skills, avatar, joined: new Date().toISOString().slice(0, 10) }]);
    }
    setOpen(false);
    setForm({ name: "", role: "", team: 1, capacity: 40, skills: "", email: "", location: "" });
    notify("Employee added", "success");
  };

  const del = async (id) => {
    if (userId && userId !== 0) {
      await supabase.from("employees").delete().eq("id", id).eq("user_id", userId);
    }
    setEmployees(prev => prev.filter(e => e.id !== id));
    setSelected(null);
    notify("Employee removed", "info");
  };

  const parseEmpCsv = e => {
    const file = e.target.files[0]; if (!file) return; e.target.value = "";
    const reader = new FileReader();
    reader.onload = ev => {
      const lines = ev.target.result.split(/\r?\n/).filter(l => l.trim());
      if (lines.length < 2) { notify("CSV has no data rows", "error"); return; }
      const hdrs = lines[0].split(",").map(h => h.replace(/"/g, "").trim().toLowerCase().replace(/\s/g, ""));
      const rows = lines.slice(1).map(line => {
        const cols = []; let cur = "", inQ = false;
        for (const c of line) { if (c === '"') inQ = !inQ; else if (c === ',' && !inQ) { cols.push(cur); cur = ""; } else cur += c; }
        cols.push(cur);
        const r = {}; hdrs.forEach((h, i) => { r[h] = (cols[i] || "").replace(/"/g, "").trim(); });
        if (!r.name) return null;
        const teamMatch = teams.find(t => t.name.toLowerCase() === (r.team || "").toLowerCase()) || teams.find(t => String(t.id) === r.team) || teams[0];
        const skills = (r.skills || "").split(/[|;]/).map(s => s.trim()).filter(Boolean);
        const avatar = r.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
        return { name: r.name, role: r.role || "", team: teamMatch?.id || 1, teamName: teamMatch?.name || "", capacity: Math.abs(Number(r.capacity)) || 40, skills, email: r.email || "", location: r.location || "", avatar };
      }).filter(Boolean);
      setEmpCsvPreview(rows);
    };
    reader.readAsText(file);
  };
  const confirmEmpCsv = async () => {
    if (!empCsvPreview?.length) return;
    if (userId && userId !== 0) {
      const { data, error } = await supabase.from("employees").insert(
        empCsvPreview.map(r => ({
          user_id: userId, name: r.name, role: r.role, team_id: r.team,
          capacity: r.capacity, skills: r.skills, email: r.email,
          location: r.location, avatar: r.avatar, joined: new Date().toISOString().slice(0, 10),
        }))
      ).select();
      if (!error && data) setEmployees(prev => [...prev, ...data.map(mapEmployee)]);
    } else {
      const now = Date.now();
      setEmployees(prev => [...prev, ...empCsvPreview.map((r, i) => ({ id: now + i, name: r.name, role: r.role, team: r.team, capacity: r.capacity, skills: r.skills, email: r.email, location: r.location, avatar: r.avatar, joined: new Date().toISOString().slice(0, 10) }))]);
    }
    notify(`${empCsvPreview.length} employee${empCsvPreview.length !== 1 ? "s" : ""} imported`, "success");
    setEmpCsvPreview(null);
  };

  const filtered = workloads.filter(w => {
    if (teamFilter !== "all" && String(w.team) !== teamFilter) return false;
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selW = selected ? workloads.find(w => w.id === selected.id) : null;

  return (
    <div>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 4 }}>Employees</h1>
          <p style={{ fontSize: 13.5, color: T.sub }}>{employees.length} people across {teams.length} teams</p>
        </div>
        {!demoMode && (
          <div style={{ display: "flex", gap: 8 }}>
            <input ref={empCsvRef} type="file" accept=".csv" style={{ display: "none" }} onChange={parseEmpCsv} />
            <Btn variant="ghost" onClick={() => empCsvRef.current.click()}>↑ Import CSV</Btn>
            <Btn variant="green" onClick={() => setOpen(true)}>+ Add Employee</Btn>
          </div>
        )}
      </div>

      {/* FILTERS */}
      <div className="fu1" style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "0 0 auto" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.muted, fontSize: 12 }}>🔍</span>
          <input className="ifield" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 32, width: 200 }} />
        </div>
        <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)} className="ifield" style={{ width: "auto" }}>
          <option value="all">All Teams</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {Object.entries(STATUS_CFG).map(([k, v]) => {
            const cnt = workloads.filter(w => w.status === k).length;
            return <Chip key={k} label={`${cnt} ${v.label}`} color={v.color} bg={v.bg} size="lg" />;
          })}
        </div>
      </div>

      {/* GRID */}
      <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(255px,1fr))", gap: 12 }}>
        {filtered.map(emp => {
          const team = teams.find(t => t.id === emp.team);
          const cfg = STATUS_CFG[emp.status];
          const burnoutColor = { high: T.red, medium: T.yellow, low: T.green }[emp.burnoutRisk];
          return (
            <Card key={emp.id} cls="hover-card" onClick={() => setSelected(emp)} style={{ padding: 18, cursor: "pointer", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 11 }}>
                  <Av t={emp.avatar} size={38} color={team?.color || T.blue} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{emp.name}</div>
                    <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{emp.role}</div>
                    <div style={{ fontSize: 11, color: T.muted, marginTop: 1 }}>{team?.name}</div>
                  </div>
                </div>
                <Chip label={cfg.label} color={cfg.color} bg={cfg.bg} />
              </div>
              <WBar pct={emp.pct} status={emp.status} h={4} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.muted, margin: "9px 0 11px" }}>
                <span>{emp.totalHours}h assigned</span>
                <span>{emp.available}h free · {emp.capacity}h cap</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {emp.skills.slice(0, 3).map(s => <Chip key={s} label={s} color={team?.color || T.blue} bg={`${team?.color || T.blue}12`} />)}
              </div>
              {emp.burnoutRisk === "high" && (
                <div style={{ marginTop: 10, padding: "6px 10px", background: T.redDim, border: `1px solid ${T.redBorder}`, borderRadius: 6, fontSize: 11, color: T.red, display: "flex", gap: 5 }}>
                  <span>⚠</span> High burnout risk — at {emp.pct}% capacity
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* EMPLOYEE DETAIL MODAL */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""} subtitle={`${selected?.role} · ${teams.find(t => t.id === selected?.team)?.name}`} w={580}>
        {selW && (() => {
          const team = teams.find(t => t.id === selW.team);
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 0 18px", borderBottom: `1px solid ${T.border}`, marginBottom: 18 }}>
                <Av t={selW.avatar} size={52} color={team?.color || T.blue} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: T.sub }}>{selW.email}</div>
                  <div style={{ fontSize: 13, color: T.sub, marginTop: 2 }}>{selW.location}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Joined {selW.joined}</div>
                </div>
                <Chip label={STATUS_CFG[selW.status]?.label} color={STATUS_CFG[selW.status]?.color} bg={STATUS_CFG[selW.status]?.bg} size="lg" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                {[[`${selW.pct}%`,"Workload",STATUS_CFG[selW.status]?.color],[`${selW.totalHours}h`,"Assigned",T.bright],[`${selW.capacity}h`,"Capacity",T.mutedText],[`${selW.available}h`,"Available",selW.available > 10 ? T.green : T.yellow]].map(([v, l, c]) => (
                  <div key={l} style={{ padding: "12px", background: T.bgAlt, borderRadius: 8, textAlign: "center" }}>
                    <div className="heading" style={{ fontSize: 22, color: c }}>{v}</div>
                    <div className="mono" style={{ fontSize: 9.5, color: T.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</div>
                  </div>
                ))}
              </div>
              <WBar pct={selW.pct} status={selW.status} h={6} />
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 11, color: T.muted, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Skills</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {selW.skills.map(s => <Chip key={s} label={s} color={team?.color || T.blue} bg={`${team?.color || T.blue}14`} size="lg" />)}
                </div>
              </div>
              <p style={{ fontSize: 11, color: T.muted, marginBottom: 10, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Active Tasks ({selW.activeTasks.length})</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, maxHeight: 220, overflow: "auto" }}>
                {selW.activeTasks.map(task => {
                  const pc = PRI_CFG[task.priority];
                  return (
                    <div key={task.id} style={{ padding: "10px 12px", background: T.bgAlt, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `2px solid ${pc.color}` }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{task.title}</div>
                        <div className="mono" style={{ fontSize: 10.5, color: T.muted, marginTop: 3 }}>Due {task.due}</div>
                      </div>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        <Chip label={`${task.hours}h`} color={T.mutedText} bg={T.border} />
                        <Chip label={pc.label} color={pc.color} bg={pc.bg} />
                      </div>
                    </div>
                  );
                })}
                {selW.activeTasks.length === 0 && <p style={{ fontSize: 13, color: T.muted }}>No active tasks assigned.</p>}
              </div>
              <Divider />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                {!demoMode && <Btn variant="danger" size="sm" onClick={() => del(selW.id)}>Remove Employee</Btn>}
                <Btn variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Btn>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ADD MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Add Employee" subtitle="Add a team member to start tracking their workload.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Inp label="Full Name" placeholder="Jane Smith" value={form.name} onChange={sf("name")} />
          <Inp label="Job Role" placeholder="Senior Engineer" value={form.role} onChange={sf("role")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Inp label="Work Email" placeholder="jane@company.com" value={form.email} onChange={sf("email")} />
          <Inp label="Location" placeholder="San Francisco, CA" value={form.location} onChange={sf("location")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Sel label="Team" value={form.team} onChange={sf("team")}>{teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</Sel>
          <Inp label="Weekly Capacity (hours)" type="number" placeholder="40" value={form.capacity} onChange={sf("capacity")} />
        </div>
        <Inp label="Skills (comma-separated)" placeholder="React, Node.js, PostgreSQL" value={form.skills} onChange={sf("skills")} hint="Used by the insights engine for smart task matching" />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
          <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn variant="green" onClick={add} disabled={!form.name || !form.role}>Add Employee</Btn>
        </div>
      </Modal>

      {/* CSV IMPORT PREVIEW */}
      <Modal open={!!empCsvPreview} onClose={() => setEmpCsvPreview(null)} title="Import Employees from CSV" subtitle={`${empCsvPreview?.length || 0} employees ready to import`} w={680}>
        {empCsvPreview && (
          <div>
            <div style={{ maxHeight: 320, overflow: "auto", borderRadius: 8, border: `1px solid ${T.border}` }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ borderBottom: `1px solid ${T.border}`, background: T.surface3 }}>{["Name", "Role", "Team", "Capacity", "Skills"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{h}</th>)}</tr></thead>
                <tbody>{empCsvPreview.map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${T.border}15` }}>
                    <td style={{ padding: "9px 12px" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Av t={r.avatar} size={26} color={teams.find(t => t.id === r.team)?.color || T.blue} /><span style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</span></div></td>
                    <td style={{ padding: "9px 12px", fontSize: 12.5, color: T.mutedText }}>{r.role}</td>
                    <td style={{ padding: "9px 12px" }}><span style={{ fontSize: 12, color: teams.find(t => t.id === r.team)?.color || T.blue }}>{r.teamName}</span></td>
                    <td style={{ padding: "9px 12px" }}><span className="mono" style={{ fontSize: 12 }}>{r.capacity}h/wk</span></td>
                    <td style={{ padding: "9px 12px" }}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{r.skills.slice(0, 3).map(s => <Chip key={s} label={s} color={T.mutedText} bg={T.border} />)}</div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: T.bgAlt, borderRadius: 8, fontSize: 12, color: T.muted }}>
              <strong style={{ color: T.text }}>Expected columns:</strong> name, role, team, capacity, skills (pipe-separated e.g. React|Node.js), email, location
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
              <Btn variant="ghost" onClick={() => setEmpCsvPreview(null)}>Cancel</Btn>
              <Btn variant="green" onClick={confirmEmpCsv}>Import {empCsvPreview.length} Employee{empCsvPreview.length !== 1 ? "s" : ""} →</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TEAMS PAGE
// ═══════════════════════════════════════════════════════════════
function TeamsPage({ teams, setTeams, employees, workloads, userId, demoMode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", color: "#4fa3ff", emoji: "🏗️" });
  const sf = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const add = async () => {
    if (!form.name) return;
    if (userId && userId !== 0) {
      const { data, error } = await supabase.from("teams").insert({ ...form, user_id: userId }).select().single();
      if (error) { notify("Failed to create team", "error"); return; }
      setTeams(prev => [...prev, mapTeam(data)]);
    } else {
      setTeams(prev => [...prev, { id: Date.now(), ...form }]);
    }
    setOpen(false);
    setForm({ name: "", description: "", color: "#4fa3ff", emoji: "🏗️" });
    notify("Team created", "success");
  };

  const del = async (id) => {
    if (userId && userId !== 0) {
      await supabase.from("teams").delete().eq("id", id).eq("user_id", userId);
    }
    setTeams(prev => prev.filter(t => t.id !== id));
    setSelected(null);
    notify("Team removed", "info");
  };

  const COLORS_PALETTE = ["#4fa3ff","#64dc8c","#a78bfa","#ffb340","#ff4646","#06b6d4","#f97316","#ec4899"];
  const EMOJIS = ["⚙️","🎨","📣","🏗️","🔬","📈","🎯","💡","🚀","🛡️"];

  return (
    <div>
      <div className="fu" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 4 }}>Teams</h1>
          <p style={{ fontSize: 13.5, color: T.sub }}>{teams.length} teams · {employees.length} total employees</p>
        </div>
        {!demoMode && <Btn variant="green" onClick={() => setOpen(true)}>+ New Team</Btn>}
      </div>

      <div className="fu1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 14 }}>
        {teams.map(team => {
          const te = workloads.filter(w => w.team === team.id);
          const avg = te.length ? Math.round(te.reduce((s, e) => s + e.pct, 0) / te.length) : 0;
          const st = avg > 100 ? "overloaded" : avg < 60 ? "underloaded" : "balanced";
          const oc = te.filter(e => e.status === "overloaded").length;
          const cfg = STATUS_CFG[st];
          return (
            <Card key={team.id} cls="hover-card" onClick={() => setSelected(team)} style={{ padding: 22, cursor: "pointer", borderTop: `2px solid ${team.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${team.color}15`, border: `1px solid ${team.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{team.emoji}</div>
                  <div>
                    <h3 className="heading" style={{ fontSize: 18, color: T.bright }}>{team.name}</h3>
                    <div className="mono" style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{te.length} member{te.length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
                <Chip label={`${avg}% avg`} color={cfg.color} bg={cfg.bg} size="lg" />
              </div>
              <p style={{ fontSize: 13, color: T.sub, marginBottom: 14, lineHeight: 1.6 }}>{team.description}</p>
              <WBar pct={avg} status={st} h={4} />
              <div style={{ display: "flex", marginTop: 14, gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex" }}>
                  {te.slice(0, 5).map((e, i) => <div key={e.id} style={{ marginLeft: i > 0 ? -8 : 0 }}><Av t={e.avatar} size={26} color={team.color} /></div>)}
                  {te.length > 5 && <div style={{ width: 26, height: 26, borderRadius: "50%", background: T.border, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: T.muted, marginLeft: -8 }}>+{te.length - 5}</div>}
                </div>
                {oc > 0 && <Chip label={`${oc} overloaded`} color={T.red} bg={T.redDim} />}
              </div>
            </Card>
          );
        })}
      </div>

      {/* TEAM DETAIL MODAL */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""} subtitle={selected?.description} w={560}>
        {selected && (() => {
          const te = workloads.filter(w => w.team === selected.id);
          const avg = te.length ? Math.round(te.reduce((s, e) => s + e.pct, 0) / te.length) : 0;
          return (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
                {[[te.length,"Members",T.text],[`${avg}%`,"Avg Load",STATUS_CFG[avg > 100 ? "overloaded" : avg < 60 ? "underloaded" : "balanced"]?.color],[te.filter(e => e.status === "overloaded").length,"Overloaded",T.red]].map(([v, l, c]) => (
                  <div key={l} style={{ padding: "14px", background: T.bgAlt, borderRadius: 8, textAlign: "center" }}>
                    <div className="heading" style={{ fontSize: 24, color: c }}>{v}</div>
                    <div className="mono" style={{ fontSize: 10, color: T.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>{l}</div>
                  </div>
                ))}
              </div>
              <p className="mono" style={{ fontSize: 10, color: T.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Team Members</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {te.map(emp => {
                  const cfg = STATUS_CFG[emp.status];
                  return (
                    <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: T.bgAlt, borderRadius: 8 }}>
                      <Av t={emp.avatar} size={30} color={selected.color} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: T.muted }}>{emp.role}</div>
                      </div>
                      <div style={{ width: 100 }}><WBar pct={emp.pct} status={emp.status} h={3} /></div>
                      <Chip label={cfg.label} color={cfg.color} bg={cfg.bg} />
                    </div>
                  );
                })}
                {te.length === 0 && <p style={{ color: T.muted, fontSize: 13 }}>No employees in this team yet.</p>}
              </div>
              <Divider />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                {!demoMode && <Btn variant="danger" size="sm" onClick={() => del(selected.id)}>Delete Team</Btn>}
                <Btn variant="ghost" size="sm" onClick={() => setSelected(null)}>Close</Btn>
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* ADD TEAM MODAL */}
      <Modal open={open} onClose={() => setOpen(false)} title="Create Team" subtitle="Organize your employees into teams to track workload at the group level.">
        <Inp label="Team Name" placeholder="e.g. Engineering" value={form.name} onChange={sf("name")} />
        <Txa label="Description" placeholder="What does this team do?" value={form.description} onChange={sf("description")} style={{ minHeight: 64 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ marginBottom: 15 }}>
            <Lbl c="Team Color" />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORS_PALETTE.map(c => <div key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: `2.5px solid ${form.color === c ? "#fff" : "transparent"}`, transition: "border-color 0.15s", boxShadow: form.color === c ? `0 0 12px ${c}60` : "none" }} />)}
            </div>
          </div>
          <div style={{ marginBottom: 15 }}>
            <Lbl c="Team Emoji" />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EMOJIS.map(e => <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))} style={{ width: 32, height: 32, borderRadius: 7, border: `1.5px solid ${form.emoji === e ? form.color : T.border}`, background: form.emoji === e ? `${form.color}15` : "transparent", cursor: "pointer", fontSize: 16 }}>{e}</button>)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Btn variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
          <Btn variant="green" onClick={add} disabled={!form.name}>Create Team</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ANALYTICS PAGE
// ═══════════════════════════════════════════════════════════════
function AnalyticsPage({ employees, tasks, teams, workloads }) {
  const insights = useMemo(() => generateInsights(workloads, tasks), [workloads, tasks]);
  const totalCap = employees.reduce((s, e) => s + e.capacity, 0);
  const totalH = tasks.filter(t => t.status !== "done").reduce((s, t) => s + t.hours, 0);
  const orgUtil = Math.round((totalH / totalCap) * 100);
  const orgSt = orgUtil > 100 ? "overloaded" : orgUtil < 60 ? "underloaded" : "balanced";

  const pieData = [
    { name: "Overloaded", value: workloads.filter(e => e.status === "overloaded").length, fill: T.red },
    { name: "Balanced", value: workloads.filter(e => e.status === "balanced").length, fill: T.green },
    { name: "Underloaded", value: workloads.filter(e => e.status === "underloaded").length, fill: T.yellow },
  ].filter(d => d.value > 0);

  const teamData = teams.map(team => {
    const tw = workloads.filter(e => e.team === team.id);
    const ta = tw.reduce((s, e) => s + e.totalHours, 0);
    const tc = tw.reduce((s, e) => s + e.capacity, 0);
    return { name: team.name, utilization: tc > 0 ? Math.round((ta / tc) * 100) : 0, fill: team.color };
  });

  const priData = ["high","medium","low"].map(p => ({ name: p.charAt(0).toUpperCase() + p.slice(1), count: tasks.filter(t => t.priority === p).length, fill: PRI_CFG[p].color }));

  const weeklyData = [
    { week: "W1", over: 30, bal: 52, under: 18 },
    { week: "W2", over: 35, bal: 48, under: 17 },
    { week: "W3", over: 28, bal: 55, under: 17 },
    { week: "W4", over: Math.round((workloads.filter(e => e.status === "overloaded").length / workloads.length) * 100), bal: Math.round((workloads.filter(e => e.status === "balanced").length / workloads.length) * 100), under: Math.round((workloads.filter(e => e.status === "underloaded").length / workloads.length) * 100) },
  ];

  const TTip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: T.surface2, border: `1px solid ${T.borderMid}`, borderRadius: 9, padding: "11px 14px", fontSize: 12 }}>
        <p style={{ fontWeight: 600, marginBottom: 6, color: T.bright }}>{label || payload[0]?.payload?.name}</p>
        {payload.map((p, i) => <p key={i} style={{ color: p.fill || p.color, marginTop: 3 }}>{p.name}: <strong>{p.value}{p.unit || ""}</strong></p>)}
      </div>
    );
  };

  return (
    <div>
      <div className="fu" style={{ marginBottom: 28 }}>
        <h1 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 13.5, color: T.sub }}>
          Organization workload · <span style={{ color: STATUS_CFG[orgSt]?.color, fontWeight: 600 }}>{orgUtil}% overall utilization</span>
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
        {[
          { label: "Org Utilization", value: `${orgUtil}%`, color: STATUS_CFG[orgSt]?.color, sub: "assigned ÷ capacity" },
          { label: "Active Tasks", value: tasks.filter(t => t.status !== "done").length, color: T.text, sub: `${tasks.filter(t => t.status === "done").length} completed` },
          { label: "Total Hours Assigned", value: `${totalH}h`, color: T.text, sub: "this week" },
          { label: "Total Team Capacity", value: `${totalCap}h`, color: T.mutedText, sub: "per week" },
        ].map((s, i) => (
          <div key={i} className={`fu${i + 1}`} style={{ padding: "20px 22px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div className="mono" style={{ fontSize: 10, color: T.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            <div className="heading" style={{ fontSize: 30, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 14, marginBottom: 14 }}>
        <Card cls="fu2" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>Workload % by Employee</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={workloads.map(e => ({ name: e.name.split(" ")[0], pct: e.pct, status: e.status }))} barSize={26} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<TTip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="pct" radius={[5, 5, 0, 0]} name="Workload">
                {workloads.map((e, i) => <Cell key={i} fill={STATUS_CFG[e.status]?.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card cls="fu3" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: T.surface2, border: `1px solid ${T.borderMid}`, borderRadius: 8, fontSize: 12 }} />
              <Legend iconType="circle" iconSize={7} formatter={v => <span style={{ color: T.mutedText, fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
        <Card cls="fu4" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>Team Utilization</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={teamData} barSize={32} barCategoryGap="40%">
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<TTip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="utilization" radius={[5, 5, 0, 0]} name="Utilization">
                {teamData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card cls="fu4" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priData} layout="vertical" barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: T.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: T.mutedText, fontSize: 12 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={<TTip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Tasks">
                {priData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card cls="fu5" style={{ padding: 22 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 18 }}>Employee Detail</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 210, overflow: "auto" }}>
            {workloads.sort((a, b) => b.pct - a.pct).map(emp => {
              const cfg = STATUS_CFG[emp.status];
              return (
                <div key={emp.id} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0", borderBottom: `1px solid ${T.border}18` }}>
                  <Av t={emp.avatar} size={24} color={cfg.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.name}</div>
                    <WBar pct={emp.pct} status={emp.status} h={3} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* INSIGHTS ENGINE */}
      <Card cls="fu5" style={{ padding: 24, borderTop: `2px solid ${T.green}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 4 }}>Smart Redistribution Engine</h3>
            <p style={{ fontSize: 12.5, color: T.sub }}>Analyzes team capacity gaps and suggests optimal task reassignments — no AI required.</p>
          </div>
          <Chip label="LIVE · RULE-BASED · AI-READY" color={T.green} bg={T.greenDim} size="lg" />
        </div>

        {insights.length === 0 ? (
          <div style={{ padding: 18, background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 10, fontSize: 14, color: T.green, display: "flex", gap: 10 }}>
            <span>✓</span> Workload distribution looks healthy. No critical redistributions needed this week.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {insights.map((ins, i) => {
              const cfg = { critical: { color: T.red, bg: T.redDim, border: T.redBorder, icon: "⚠" }, warning: { color: T.yellow, bg: T.yellowDim, border: T.yellowBorder, icon: "!" }, info: { color: T.blue, bg: T.blueDim, border: "rgba(79,163,255,0.2)", icon: "→" } }[ins.severity];
              return (
                <div key={i} style={{ padding: "14px 16px", background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ display: "flex", gap: 10, flex: 1 }}>
                    <span style={{ color: cfg.color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>{cfg.icon}</span>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: cfg.color, marginBottom: 4 }}>{ins.title}</p>
                      <p style={{ fontSize: 13, color: T.mutedText, lineHeight: 1.6 }}>{ins.message}</p>
                    </div>
                  </div>
                  {ins.type === "reassign" && (
                    <Btn variant="ghost" size="sm" onClick={() => notify(`Suggestion applied: Moving "${ins.task}" to ${ins.to}`, "success")} style={{ flexShrink: 0 }}>Apply →</Btn>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  BILLING TAB COMPONENT (inside Settings)
// ═══════════════════════════════════════════════════════════════
function BillingTab({ user }) {
  const [billing, setBilling] = useState("monthly");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [activePlan, setActivePlan] = useState({ id: "growth", name: "Growth", price: 1499, renewsOn: "7 May 2025", cycle: "monthly" });
  const [invoices] = useState([
    { id: "INV-2025-004", date: "7 Apr 2025", amount: 6499, status: "paid", method: "UPI" },
    { id: "INV-2025-003", date: "7 Mar 2025", amount: 6499, status: "paid", method: "Visa ••4242" },
    { id: "INV-2025-002", date: "7 Feb 2025", amount: 6499, status: "paid", method: "Visa ••4242" },
    { id: "INV-2025-001", date: "7 Jan 2025", amount: 6499, status: "paid", method: "Net Banking" },
  ]);

  const handleUpgrade = (plan) => {
    openRazorpay({
      plan,
      billing,
      user,
      onSuccess: (resp, pl, bl) => {
        setActivePlan({ id: pl.id, name: pl.name, price: bl === "monthly" ? pl.price : pl.annual, renewsOn: "7 May 2026", cycle: bl });
        setShowUpgrade(false);
        notify(`✓ Upgraded to ${pl.name} plan successfully!`, "success");
      },
    });
  };

  const currentPlan = PLANS.find(p => p.id === activePlan.id);
  const planColor = currentPlan?.color || T.green;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* CURRENT PLAN CARD */}
      <Card style={{ padding: 24, border: `1.5px solid ${planColor}35`, background: `linear-gradient(135deg, ${planColor}06, ${T.surface})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <h3 className="heading" style={{ fontSize: 22, color: planColor }}>{activePlan.name} Plan</h3>
              <Chip label="ACTIVE" color={T.green} bg={T.greenDim} size="lg" />
            </div>
            <p style={{ fontSize: 13.5, color: T.mutedText }}>
              ₹{activePlan.price.toLocaleString("en-IN")}/month · Renews {activePlan.renewsOn}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="heading" style={{ fontSize: 30, color: planColor }}>₹{activePlan.price.toLocaleString("en-IN")}</div>
            <div style={{ fontSize: 11, color: T.muted }}>per month + GST</div>
          </div>
        </div>

        {/* USAGE METERS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          {[
            { label: "Employees", used: 7, max: 75, color: T.blue },
            { label: "Managers", used: 2, max: 999, color: T.purple },
            { label: "Teams", used: 3, max: 20, color: T.yellow },
          ].map(m => {
            const pct = m.max === 999 ? 10 : Math.round((m.used / m.max) * 100);
            return (
              <div key={m.label} style={{ padding: "12px 14px", background: T.bgAlt, borderRadius: 9 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: T.sub }}>{m.label}</span>
                  <span className="mono" style={{ fontSize: 11, color: m.color }}>{m.used}{m.max !== 999 ? ` / ${m.max}` : " / ∞"}</span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 4 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: m.color, borderRadius: 4, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="green" size="sm" onClick={() => setShowUpgrade(true)}>Upgrade / Change Plan</Btn>
          <Btn variant="ghost" size="sm" onClick={() => { openRazorpay({ plan: currentPlan, billing: activePlan.cycle, user, onSuccess: () => notify("Payment method updated", "success") }); }}>Update Payment Method</Btn>
          <Btn variant="danger" size="sm" onClick={() => notify("To cancel, email support@workloadbalance.io — we'll process it within 24h.", "info")}>Cancel Plan</Btn>
        </div>
      </Card>

      {/* PAYMENT METHODS */}
      <Card style={{ padding: 24 }}>
        <h3 className="heading" style={{ fontSize: 16, color: T.bright, marginBottom: 16 }}>Payment Methods</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {[
            { type: "upi", label: "UPI · yourname@upi", icon: "📱", active: true },
            { type: "card", label: "Visa ending 4242", icon: "💳", active: false },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: T.bgAlt, borderRadius: 9, border: `1px solid ${m.active ? T.greenBorder : T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <span style={{ fontSize: 13.5, fontWeight: 500 }}>{m.label}</span>
                {m.active && <Chip label="DEFAULT" color={T.green} bg={T.greenDim} />}
              </div>
              <Btn variant="ghost" size="xs" onClick={() => notify("Redirecting to Razorpay to update...", "info")}>Edit</Btn>
            </div>
          ))}
        </div>
        <Btn variant="ghost" size="sm" onClick={() => { openRazorpay({ plan: currentPlan, billing: activePlan.cycle, user, onSuccess: () => notify("New payment method added", "success") }); }}>
          + Add payment method
        </Btn>
      </Card>

      {/* INVOICE HISTORY */}
      <Card style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 className="heading" style={{ fontSize: 16, color: T.bright }}>Invoice History</h3>
          <Btn variant="ghost" size="xs" onClick={() => notify("Downloading all invoices...", "info")}>Download all</Btn>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${T.border}` }}>
              {["Invoice", "Date", "Amount", "Method", "Status", ""].map(h => (
                <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, color: T.muted, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} style={{ borderBottom: `1px solid ${T.border}15` }}>
                <td style={{ padding: "12px 10px" }}><span className="mono" style={{ fontSize: 12, color: T.mutedText }}>{inv.id}</span></td>
                <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 13 }}>{inv.date}</span></td>
                <td style={{ padding: "12px 10px" }}><span className="mono" style={{ fontSize: 13, fontWeight: 600 }}>₹{inv.amount.toLocaleString("en-IN")}</span></td>
                <td style={{ padding: "12px 10px" }}><span style={{ fontSize: 12.5, color: T.mutedText }}>{inv.method}</span></td>
                <td style={{ padding: "12px 10px" }}><Chip label={inv.status.toUpperCase()} color={inv.status === "paid" ? T.green : T.yellow} bg={inv.status === "paid" ? T.greenDim : T.yellowDim} /></td>
                <td style={{ padding: "12px 10px" }}>
                  <button onClick={() => notify(`Downloading ${inv.id}...`, "info")} style={{ background: "none", border: "none", color: T.green, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>↓ PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 16, padding: "10px 14px", background: T.bgAlt, borderRadius: 8, fontSize: 12, color: T.sub }}>
          GST invoices are auto-generated for all payments. Your GSTIN can be added in <button onClick={() => {}} style={{ background: "none", border: "none", color: T.green, cursor: "pointer", fontSize: 12 }}>Profile settings</button>.
        </div>
      </Card>

      {/* UPGRADE PLAN MODAL */}
      <Modal open={showUpgrade} onClose={() => setShowUpgrade(false)} title="Change Plan" subtitle="Switch plans anytime. Changes take effect immediately." w={680}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ display: "inline-flex", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3, gap: 2 }}>
            {["monthly","annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "7px 18px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: billing === b ? T.green : "transparent", color: billing === b ? "#050708" : T.mutedText, transition: "all 0.15s" }}>
                {b.charAt(0).toUpperCase() + b.slice(1)} {b === "annual" && <span style={{ fontSize: 10 }}>−20%</span>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {PLANS.map((plan, i) => {
            const price = plan.price ? (billing === "monthly" ? plan.price : plan.annual) : null;
            const isCurrentPlan = plan.id === activePlan.id;
            return (
              <div key={i} style={{ padding: 20, border: `1.5px solid ${isCurrentPlan ? plan.color + "60" : T.border}`, borderRadius: 12, background: isCurrentPlan ? `${plan.color}06` : T.bgAlt, position: "relative" }}>
                {isCurrentPlan && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#050708", fontSize: 9, fontWeight: 800, padding: "2px 10px", borderRadius: 10, fontFamily: "'Cabinet Grotesk',sans-serif" }}>CURRENT</div>}
                <h4 className="heading" style={{ fontSize: 17, color: plan.color, marginBottom: 6 }}>{plan.name}</h4>
                {price ? (
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 13, color: T.muted }}>₹</span>
                    <span className="heading" style={{ fontSize: 28, color: T.bright }}>{price.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 12, color: T.muted }}>/mo</span>
                  </div>
                ) : <div className="heading" style={{ fontSize: 20, color: T.bright, marginBottom: 14 }}>Custom</div>}
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 16 }}>
                  {plan.features.slice(0, 4).map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 7, fontSize: 12, color: T.mutedText }}>
                      <span style={{ color: plan.color, flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button
                  disabled={isCurrentPlan}
                  onClick={() => handleUpgrade(plan)}
                  style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${plan.color}40`, background: isCurrentPlan ? T.border : plan.popular ? plan.color : "transparent", color: isCurrentPlan ? T.muted : plan.popular ? "#050708" : plan.color, fontSize: 13, fontWeight: 700, cursor: isCurrentPlan ? "default" : "pointer", fontFamily: "'Cabinet Grotesk',sans-serif", transition: "all 0.15s", opacity: isCurrentPlan ? 0.5 : 1 }}>
                  {isCurrentPlan ? "Current plan" : plan.price ? "Switch & Pay →" : "Contact Sales →"}
                </button>
              </div>
            );
          })}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: T.muted, marginTop: 16 }}>
          🔒 All payments secured by Razorpay · GST invoice auto-generated · Cancel anytime
        </p>
      </Modal>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ORG SETTINGS TAB
// ═══════════════════════════════════════════════════════════════
function OrgSettingsTab({ user }) {
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user.orgId) { setLoading(false); return; }
    Promise.all([
      supabase.from("organizations").select("*").eq("id", user.orgId).single(),
      supabase.from("profiles").select("id,name,role,signup_date").eq("org_id", user.orgId),
    ]).then(([{ data: o }, { data: m }]) => {
      setOrg(o); setMembers(m || []); setLoading(false);
    });
  }, [user.orgId]);

  const copy = () => {
    navigator.clipboard.writeText(org?.invite_code || "").then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  if (loading) return <div style={{ color: T.muted, fontSize: 13, padding: 20 }}>Loading…</div>;
  if (!org) return (
    <Card style={{ padding: 28 }}>
      <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 10 }}>Organization</h3>
      <p style={{ fontSize: 13.5, color: T.sub }}>No organization linked to your account.</p>
    </Card>
  );

  return (
    <Card style={{ padding: 28 }}>
      <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 20 }}>Organization</h3>
      <div style={{ padding: 18, background: T.bgAlt, borderRadius: 10, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 4, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Org Name</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: T.bright }}>{org.name}</div>
      </div>
      <div style={{ padding: 18, background: T.greenDim, border: `1px solid ${T.greenBorder}`, borderRadius: 10, marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: T.green, marginBottom: 8, fontFamily: "'JetBrains Mono',monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Invite Code</div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: T.bright, letterSpacing: "0.12em" }}>{org.invite_code}</span>
          <button onClick={copy} className="btn-ghost" style={{ padding: "6px 14px", borderRadius: 7, fontSize: 12, fontFamily: "inherit", cursor: "pointer" }}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>
        <p style={{ fontSize: 12, color: T.sub, marginTop: 8 }}>Share this code with teammates — they enter it during signup to join your organization.</p>
      </div>
      <h4 className="heading" style={{ fontSize: 15, color: T.bright, marginBottom: 12 }}>Members ({members.length})</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {members.map(m => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: T.bgAlt, borderRadius: 8 }}>
            <Av t={m.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"} size={32} color={T.blue} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.name}</div>
              <div style={{ fontSize: 11.5, color: T.muted, textTransform: "capitalize" }}>{m.role || "member"}</div>
            </div>
            {org.owner_id === m.id && <Chip label="Owner" color={T.green} bg={T.greenDim} />}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS PAGE
// ═══════════════════════════════════════════════════════════════
function SettingsPage({ user, setUser }) {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ name: user.name, email: user.email, org: user.org, timezone: "America/New_York", role: user.role });
  const [notifSettings, setNotifSettings] = useState({ overload: true, underload: false, weekly: true, slack: false, email: true });
  const [thresholds, setThresholds] = useState({ overloadAt: 100, underloadAt: 60, burnoutAlert: 120 });
  const sp = k => e => setProfile(p => ({ ...p, [k]: e.target.value }));
  const st = k => e => setThresholds(t => ({ ...t, [k]: Number(e.target.value) }));

  const Toggle = ({ on, onChange }) => <button className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} />;

  const tabs = [["profile","👤","Profile"],["organization","🏢","Organization"],["notifications","🔔","Notifications"],["thresholds","⚖️","Thresholds"],["billing","💳","Billing"],["security","🔒","Security"],["api","🔑","API"]];

  return (
    <div>
      <div className="fu" style={{ marginBottom: 28 }}>
        <h1 className="heading" style={{ fontSize: 28, color: T.bright, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13.5, color: T.sub }}>Manage your workspace, account, and preferences</p>
      </div>

      <div className="fu1" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 20 }}>
        {/* SIDEBAR */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {tabs.map(([id, icon, label]) => (
            <button key={id} onClick={() => setTab(id)} className="nav-link" style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", border: "none", cursor: "pointer", fontSize: 13.5, fontFamily: "inherit", textAlign: "left", background: tab === id ? T.greenDim : "transparent", color: tab === id ? T.green : T.mutedText, fontWeight: tab === id ? 600 : 400 }}>
              <span style={{ fontSize: 15 }}>{icon}</span>{label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div>
          {tab === "profile" && (
            <Card style={{ padding: 28 }}>
              <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 20 }}>Profile Information</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, padding: 16, background: T.bgAlt, borderRadius: 10 }}>
                <Av t={user.avatar} size={56} color={T.blue} shape="square" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{profile.name}</div>
                  <div style={{ fontSize: 13, color: T.muted }}>{profile.email}</div>
                  <button style={{ marginTop: 6, fontSize: 12, color: T.green, background: "none", border: "none", cursor: "pointer" }}>Change avatar</button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Inp label="Full Name" value={profile.name} onChange={sp("name")} />
                <Inp label="Work Email" type="email" value={profile.email} onChange={sp("email")} />
                <Inp label="Organization" value={profile.org} onChange={sp("org")} />
                <Sel label="Timezone" value={profile.timezone} onChange={sp("timezone")}>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">GMT (London)</option>
                  <option value="Europe/Berlin">Central European (CET)</option>
                  <option value="Asia/Tokyo">Japan Standard (JST)</option>
                </Sel>
              </div>
              <Divider />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn variant="green" onClick={() => { setUser(u => ({ ...u, name: profile.name, email: profile.email, org: profile.org })); notify("Profile saved", "success"); }}>Save Changes</Btn>
              </div>
            </Card>
          )}

          {tab === "organization" && <OrgSettingsTab user={user} />}

          {tab === "notifications" && (
            <Card style={{ padding: 28 }}>
              <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 20 }}>Notification Preferences</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  ["overload", "Employee overload alert", "Get notified when anyone exceeds 100% capacity"],
                  ["underload", "Underutilization alert", "Get notified when someone drops below 40% capacity"],
                  ["weekly", "Weekly workload digest", "A summary report every Monday morning"],
                  ["email", "Email notifications", "Receive alerts via email"],
                  ["slack", "Slack integration", "Send alerts to your Slack workspace"],
                ].map(([key, title, desc]) => (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${T.border}` }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 3 }}>{title}</div>
                      <div style={{ fontSize: 12.5, color: T.sub }}>{desc}</div>
                    </div>
                    <Toggle on={notifSettings[key]} onChange={v => { setNotifSettings(n => ({ ...n, [key]: v })); notify(v ? "Notification enabled" : "Notification disabled", "info"); }} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "thresholds" && (
            <Card style={{ padding: 28 }}>
              <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 6 }}>Workload Thresholds</h3>
              <p style={{ fontSize: 13, color: T.sub, marginBottom: 24 }}>Customize when employees are classified as overloaded, balanced, or underloaded.</p>
              {[
                ["overloadAt", "Overload Threshold (%)", `Employees above ${thresholds.overloadAt}% are marked Overloaded`, T.red],
                ["underloadAt", "Underload Threshold (%)", `Employees below ${thresholds.underloadAt}% are marked Underloaded`, T.yellow],
                ["burnoutAlert", "Burnout Alert Threshold (%)", `Trigger high-priority burnout alert above ${thresholds.burnoutAlert}%`, T.red],
              ].map(([key, label, desc, color]) => (
                <div key={key} style={{ marginBottom: 24, padding: 18, background: T.bgAlt, borderRadius: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
                    <span className="heading" style={{ fontSize: 20, color }}>{thresholds[key]}%</span>
                  </div>
                  <input type="range" min={10} max={200} step={5} value={thresholds[key]} onChange={st(key)} style={{ width: "100%", accentColor: color }} />
                  <p style={{ fontSize: 12, color: T.sub, marginTop: 6 }}>{desc}</p>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn variant="green" onClick={() => notify("Thresholds saved", "success")}>Save Thresholds</Btn>
              </div>
            </Card>
          )}

          {tab === "billing" && (
            <BillingTab user={user} />
          )}

          {tab === "security" && (
            <Card style={{ padding: 28 }}>
              <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 20 }}>Security Settings</h3>
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Change Password</h4>
                <Inp label="Current Password" type="password" placeholder="••••••••" />
                <Inp label="New Password" type="password" placeholder="••••••••" />
                <Inp label="Confirm New Password" type="password" placeholder="••••••••" />
                <Btn variant="green" size="sm" onClick={() => notify("Password updated", "success")}>Update Password</Btn>
              </div>
              <Divider />
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Two-Factor Authentication</h4>
                <p style={{ fontSize: 13, color: T.sub, marginBottom: 14 }}>Add an extra layer of security to your account. We support authenticator apps and SMS.</p>
                <Btn variant="ghost" onClick={() => notify("2FA setup coming soon", "info")}>Enable 2FA</Btn>
              </div>
              <Divider />
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, color: T.red }}>Danger Zone</h4>
                <p style={{ fontSize: 13, color: T.sub, marginBottom: 14 }}>Once you delete your account, there is no going back. Please be certain.</p>
                <Btn variant="danger" onClick={() => notify("Please contact support to delete your account", "info")}>Delete Account</Btn>
              </div>
            </Card>
          )}

          {tab === "api" && (
            <Card style={{ padding: 28 }}>
              <h3 className="heading" style={{ fontSize: 18, color: T.bright, marginBottom: 6 }}>API Access</h3>
              <p style={{ fontSize: 13, color: T.sub, marginBottom: 24 }}>Use our REST API to integrate WorkloadBalance with your tools, scripts, and workflows.</p>
              <div style={{ padding: 14, background: T.bgAlt, borderRadius: 10, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <Lbl c="API Key" />
                  <button onClick={() => notify("API key copied to clipboard", "success")} style={{ background: "none", border: "none", color: T.green, cursor: "pointer", fontSize: 12 }}>Copy</button>
                </div>
                <div className="mono" style={{ fontSize: 12, color: T.mutedText, background: T.bg, padding: "10px 14px", borderRadius: 7, border: `1px solid ${T.border}` }}>
                  wlb_live_sk_••••••••••••••••••••••••••••••••
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Quick Start</h4>
                <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14 }}>
                  <pre className="mono" style={{ fontSize: 11.5, color: T.mutedText, whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{`# Get workload data for all employees
curl https://api.workloadbalance.io/v1/workload \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Get smart redistribution insights
curl https://api.workloadbalance.io/v1/insights \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</pre>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="green" size="sm" onClick={() => notify("API docs opened", "info")}>View full API docs →</Btn>
                <Btn variant="ghost" size="sm" onClick={() => notify("New API key generated", "success")}>Regenerate key</Btn>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PAYWALL SCREEN
// ═══════════════════════════════════════════════════════════════
function PaywallScreen({ user, onPaid, onLogout }) {
  const [billing, setBilling] = useState("monthly");
  const trial = getTrialInfo(user.signupDate);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <G />
      <div style={{ width: "100%", maxWidth: 860 }}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <LogoMark />
          <div style={{ marginTop: 28, marginBottom: 16 }}>
            {trial.expired ? (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: T.redDim, border: `1px solid ${T.redBorder}`, fontSize: 13, color: T.red, marginBottom: 16 }}>
                ⚠ Your 7-day free trial has ended
              </div>
            ) : (
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, background: T.yellowDim, border: `1px solid ${T.yellowBorder}`, fontSize: 13, color: T.yellow, marginBottom: 16 }}>
                ⏳ {trial.daysLeft} trial day{trial.daysLeft !== 1 ? "s" : ""} left
              </div>
            )}
          </div>
          <h1 className="heading" style={{ fontSize: 36, color: T.bright, marginBottom: 12 }}>
            {trial.expired ? "Subscribe to keep your workspace" : "Upgrade before your trial ends"}
          </h1>
          <p style={{ fontSize: 16, color: T.mutedText, maxWidth: 480, margin: "0 auto" }}>
            {trial.expired
              ? "Your data is safe. Subscribe to any plan to restore full access immediately."
              : `You've used ${trial.daysUsed} of your 14 free days. Lock in your plan now and never lose access.`}
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: 3, gap: 2 }}>
            {["monthly","annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: billing === b ? T.green : "transparent", color: billing === b ? "#050708" : T.mutedText, transition: "all 0.15s" }}>
                {b === "monthly" ? "Monthly" : "Annual"} {b === "annual" && <span style={{ fontSize: 10, marginLeft: 4 }}>Save 20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* PLAN CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
          {PLANS.map((plan, i) => {
            const price = plan.price ? (billing === "monthly" ? plan.price : plan.annual) : null;
            return (
              <div key={i} style={{ padding: 24, background: plan.popular ? "linear-gradient(160deg,#0d1a15,#0f1220)" : T.surface, border: `1.5px solid ${plan.popular ? plan.color + "55" : T.border}`, borderRadius: 14, position: "relative", boxShadow: plan.popular ? `0 0 50px ${plan.color}12` : "none" }}>
                {plan.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#050708", fontSize: 10, fontWeight: 800, padding: "2px 12px", borderRadius: 20, fontFamily: "'Cabinet Grotesk',sans-serif" }}>MOST POPULAR</div>}
                <h3 className="heading" style={{ fontSize: 20, color: plan.color, marginBottom: 6 }}>{plan.name}</h3>
                <p style={{ fontSize: 12.5, color: T.sub, marginBottom: 16 }}>{plan.desc}</p>
                {price ? (
                  <div style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: T.muted }}>₹</span>
                    <span className="heading" style={{ fontSize: 36, color: T.bright }}>{price.toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 12, color: T.muted }}>/mo</span>
                  </div>
                ) : <div className="heading" style={{ fontSize: 24, color: T.bright, marginBottom: 6 }}>Custom</div>}
                {billing === "annual" && plan.price && <p style={{ fontSize: 11, color: T.green, marginBottom: 14 }}>₹{plan.annualTotal.toLocaleString("en-IN")} billed annually</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {plan.features.slice(0, 5).map((f, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, fontSize: 12.5, color: T.mutedText }}>
                      <span style={{ color: plan.color, flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (!plan.price) { window.location.href = "mailto:sales@workloadbalance.io"; return; }
                    openRazorpay({ plan, billing, user, onSuccess: (resp, pl, bl) => onPaid(pl, bl) });
                  }}
                  style={{ width: "100%", padding: "12px", borderRadius: 9, border: `1.5px solid ${plan.color}50`, background: plan.popular ? plan.color : "transparent", color: plan.popular ? "#050708" : plan.color, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Cabinet Grotesk',sans-serif", transition: "all 0.15s" }}
                  onMouseEnter={e => { if (!plan.popular) e.currentTarget.style.background = `${plan.color}15`; }}
                  onMouseLeave={e => { if (!plan.popular) e.currentTarget.style.background = "transparent"; }}>
                  {plan.price ? "Subscribe & Pay with Razorpay →" : "Contact Sales →"}
                </button>
                {plan.price && <p style={{ textAlign: "center", fontSize: 10.5, color: T.muted, marginTop: 8 }}>🔒 Razorpay · UPI · Cards · Net Banking</p>}
              </div>
            );
          })}
        </div>

        {/* COMING SOON NOTICE */}
        {!RZP_LIVE && (
          <div style={{ padding: "14px 20px", background: T.yellowDim, border: `1px solid ${T.yellowBorder}`, borderRadius: 10, textAlign: "center", marginBottom: 20, fontSize: 13, color: T.yellow }}>
            🚀 <strong>Payments launching very soon.</strong> Your account is reserved and will be activated the moment we go live — no action needed.
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13 }}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | auth | app
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  const pendingPlanRef = useRef(null); // { plan, billing } — set when user clicks a plan before signing in
  _setN = setNotifs;

  const workloads = useMemo(() => computeWorkload(employees, tasks), [employees, tasks]);

  const loadUserData = useCallback(async (userId) => {
    const [{ data: teamsData }, { data: empsData }, { data: tasksData }] = await Promise.all([
      supabase.from("teams").select("*").eq("user_id", userId).order("id"),
      supabase.from("employees").select("*").eq("user_id", userId).order("id"),
      supabase.from("tasks").select("*").eq("user_id", userId).order("id"),
    ]);
    const loadedTeams = (teamsData || []).map(mapTeam);
    if (!loadedTeams.length) {
      await seedUserData(userId);
      const [{ data: t2 }, { data: e2 }, { data: k2 }] = await Promise.all([
        supabase.from("teams").select("*").eq("user_id", userId).order("id"),
        supabase.from("employees").select("*").eq("user_id", userId).order("id"),
        supabase.from("tasks").select("*").eq("user_id", userId).order("id"),
      ]);
      setTeams((t2 || []).map(mapTeam));
      setEmployees((e2 || []).map(mapEmployee));
      setTasks((k2 || []).map(mapTask));
    } else {
      setTeams(loadedTeams);
      setEmployees((empsData || []).map(mapEmployee));
      setTasks((tasksData || []).map(mapTask));
    }
  }, []);

  const loadUserProfile = useCallback(async (supaUser) => {
    let { data: profile } = await supabase.from("profiles").select("*").eq("id", supaUser.id).single();
    if (!profile) {
      const name = supaUser.user_metadata?.name || supaUser.email.split("@")[0];
      const meta = supaUser.user_metadata || {};
      let orgId = null;
      // Join existing org via invite code metadata
      if (meta.join_org_id) {
        orgId = meta.join_org_id;
      } else if (meta.create_org !== false) {
        // Create new org with random invite code
        const code = (meta.org || name).replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 4) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
        const { data: newOrg } = await supabase.from("organizations").insert({ name: meta.org || name + "'s Org", owner_id: supaUser.id, invite_code: code }).select("id").single();
        if (newOrg) orgId = newOrg.id;
      }
      await supabase.from("profiles").insert({ id: supaUser.id, name, plan: "trial", paid: false, org_id: orgId });
      profile = { id: supaUser.id, name, plan: "trial", paid: false, signup_date: new Date().toISOString(), org_id: orgId };
    }
    const name = profile.name || supaUser.user_metadata?.name || supaUser.email.split("@")[0];
    const u = {
      id: supaUser.id,
      name,
      email: supaUser.email,
      role: supaUser.user_metadata?.role || "admin",
      org: supaUser.user_metadata?.org || profile.name + "'s Org" || "",
      orgId: profile.org_id || null,
      plan: profile.plan,
      paid: profile.paid || false,
      signupDate: profile.signup_date,
      avatar: name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
    };
    setUser(u);
    await loadUserData(supaUser.id);
    setAppLoading(false);

    // If user clicked a plan before signing in, open Razorpay now
    if (pendingPlanRef.current) {
      const { plan, billing } = pendingPlanRef.current;
      pendingPlanRef.current = null;
      setScreen("app");
      // Small delay so the app renders before the modal opens
      setTimeout(() => {
        openRazorpay({
          plan, billing, user: u,
          onSuccess: (resp, pl) => {
            setUser(uu => ({ ...uu, paid: true, plan: pl.id }));
            notify("🎉 Payment successful! Welcome to WorkloadBalance.", "success");
          },
        });
      }, 400);
      return;
    }

    const trial = getTrialInfo(u.signupDate);
    if (u.paid) setScreen("app");
    else if (!trial.expired) { setScreen("app"); notify(`✓ Welcome! ${trial.daysLeft} trial days remaining.`, "info"); }
    else setScreen("paywall");
  }, [loadUserData]);

  useEffect(() => {
    let initialized = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        initialized = true;
        loadUserProfile(session.user);
      } else {
        setAppLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session) {
        // USER_UPDATED fires when email is confirmed via verification link
        if (!initialized) {
          initialized = true;
          await loadUserProfile(session.user);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null); setTeams([]); setEmployees([]); setTasks([]);
        setScreen("landing"); setPage("dashboard");
        setAppLoading(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [loadUserProfile]);

  const goAuth = (mode) => { setAuthMode(mode); setScreen("auth"); };
  const goAuthWithPlan = (plan, billing) => {
    pendingPlanRef.current = { plan, billing };
    setAuthMode("signup");
    setScreen("auth");
  };
  const goDemo = () => {
    setTeams(SEED_TEAMS); setEmployees(SEED_EMPLOYEES); setTasks(SEED_TASKS);
    setScreen("demo");
  };
  // Used only by owner backdoor path
  const onAuth = (u) => {
    const signupDate = u.signupDate || new Date().toISOString();
    const userWithTrial = { ...u, signupDate, paid: u.paid || false };
    setUser(userWithTrial);
    setTeams(SEED_TEAMS); setEmployees(SEED_EMPLOYEES); setTasks(SEED_TASKS);
    const trial = getTrialInfo(signupDate);
    if (userWithTrial.paid) setScreen("app");
    else if (!trial.expired) { setScreen("app"); notify(`✓ Welcome! You have ${trial.daysLeft} trial days remaining.`, "info"); }
    else setScreen("paywall");
  };
  const onLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setTeams([]); setEmployees([]); setTasks([]);
    setScreen("landing"); setPage("dashboard");
    notify("Signed out", "info");
  };

  if (appLoading) return (
    <div style={{ minHeight: "100vh", background: "#070810", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <G />
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid #1e2235", borderTopColor: "#64dc8c", borderRadius: "50%", animation: "spin 0.9s linear infinite", margin: "0 auto 16px" }} />
        <p style={{ color: "#5c6480", fontSize: 13 }}>Loading your workspace…</p>
      </div>
    </div>
  );

  return (
    <>
      <G />
      {screen === "landing" && <LandingPage onSignup={() => goAuth("signup")} onLogin={() => goAuth("login")} onDemo={goDemo} onSignupWithPlan={goAuthWithPlan} user={user} onPaySuccess={(resp, plan, billing) => { setUser(u => ({ ...u, paid: true, plan: plan.id })); setScreen("app"); }} />}
      {screen === "demo" && (
        <AppShell user={{ name: "Demo User", email: "", role: "admin", org: "Demo Org", plan: "growth", paid: true, avatar: "DM" }} onLogout={() => { setPage("dashboard"); setScreen("landing"); }} page={page} setPage={setPage} tasks={tasks} workloads={workloads} demoMode={true} onSignup={() => goAuth("signup")}>
          {page === "dashboard" && <DashboardPage employees={employees} tasks={tasks} teams={teams} workloads={workloads} onNavigate={setPage} />}
          {page === "tasks" && <TasksPage tasks={tasks} setTasks={setTasks} employees={employees} teams={teams} userId={null} demoMode={true} />}
          {page === "employees" && <EmployeesPage employees={employees} setEmployees={setEmployees} teams={teams} tasks={tasks} workloads={workloads} userId={null} demoMode={true} />}
          {page === "teams" && <TeamsPage teams={teams} setTeams={setTeams} employees={employees} workloads={workloads} userId={null} demoMode={true} />}
          {page === "analytics" && <AnalyticsPage employees={employees} tasks={tasks} teams={teams} workloads={workloads} />}
        </AppShell>
      )}
      {screen === "auth" && <AuthPage mode={authMode} onAuth={onAuth} onLanding={() => setScreen("landing")} />}
      {screen === "paywall" && user && (
        <PaywallScreen user={user} onPaid={(plan, billing) => { setUser(u => ({ ...u, paid: true, plan: plan.id })); setScreen("app"); notify("🎉 Payment successful! Welcome to WorkloadBalance.", "success"); }} onLogout={onLogout} />
      )}
      {screen === "app" && user && (
        <AppShell user={user} onLogout={onLogout} page={page} setPage={setPage} tasks={tasks} workloads={workloads} onUpgrade={() => setScreen("paywall")}>
          {/* TRIAL BANNER */}
          {!user.paid && (() => { const t = getTrialInfo(user.signupDate); return t.daysLeft <= 5 && (
            <div style={{ background: t.daysLeft <= 2 ? T.redDim : T.yellowDim, border: `1px solid ${t.daysLeft <= 2 ? T.redBorder : T.yellowBorder}`, borderRadius: 8, padding: "10px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: t.daysLeft <= 2 ? T.red : T.yellow }}>
                {t.daysLeft === 0 ? "⚠ Your trial has expired." : `⏳ ${t.daysLeft} trial day${t.daysLeft !== 1 ? "s" : ""} remaining.`}
              </span>
              <Btn variant="green" size="sm" onClick={() => setScreen("paywall")}>Subscribe now →</Btn>
            </div>
          ); })()}
          {page === "dashboard" && <DashboardPage employees={employees} tasks={tasks} teams={teams} workloads={workloads} onNavigate={setPage} />}
          {page === "tasks" && <TasksPage tasks={tasks} setTasks={setTasks} employees={employees} teams={teams} userId={user.id} demoMode={false} />}
          {page === "employees" && <EmployeesPage employees={employees} setEmployees={setEmployees} teams={teams} tasks={tasks} workloads={workloads} userId={user.id} demoMode={false} />}
          {page === "teams" && <TeamsPage teams={teams} setTeams={setTeams} employees={employees} workloads={workloads} userId={user.id} demoMode={false} />}
          {page === "analytics" && <AnalyticsPage employees={employees} tasks={tasks} teams={teams} workloads={workloads} />}
          {page === "settings" && <SettingsPage user={user} setUser={setUser} />}
        </AppShell>
      )}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {notifs.map(n => {
          const cfg = { success: { bg: "rgba(5,20,12,0.95)", border: "rgba(100,220,140,0.3)", icon: "✓", color: "#64dc8c" }, error: { bg: "rgba(20,5,5,0.95)", border: "rgba(255,70,70,0.3)", icon: "✕", color: "#ff4646" }, info: { bg: "rgba(5,10,20,0.95)", border: "rgba(79,163,255,0.3)", icon: "ℹ", color: "#4fa3ff" } }[n.type] || {};
          return (
            <div key={n.id} className="notif" style={{ background: cfg.bg, borderColor: cfg.border, backdropFilter: "blur(16px)" }}>
              <span style={{ color: cfg.color, fontWeight: 700, fontSize: 14 }}>{cfg.icon}</span>
              <span style={{ color: "#dde1f0", fontSize: 13 }}>{n.msg}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

