import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiCode,
  FiFolder,
  FiAward,
  FiMail,
  FiYoutube,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiClock,
  FiActivity,
  FiArrowUpRight,
  FiZap,
  FiAlertCircle,
  FiCheckCircle,
  FiLayers,
  FiTrendingUp,
  FiShield,
} from "react-icons/fi";
import api from "../../utils/api";
import AdminLayout from "../../components/admin/AdminLayout";

// Enhanced Modern Cards Config with custom CSS Gradients & Accents
const STAT_CARDS_CONFIG = [
  {
    key: "skills",
    label: "Total Skills",
    icon: FiCode,
    to: "/admin/skills",
    accent: "#6366f1",
    glowColor: "rgba(99, 102, 241, 0.15)",
    badge: "Stack Tech",
  },
  {
    key: "projects",
    label: "Projects",
    icon: FiFolder,
    to: "/admin/projects",
    accent: "#3b82f6",
    glowColor: "rgba(59, 130, 246, 0.15)",
    badge: "Portfolio Work",
  },
  {
    key: "certificates",
    label: "Certificates",
    icon: FiAward,
    to: "/admin/certificates",
    accent: "#10b981",
    glowColor: "rgba(16, 185, 129, 0.15)",
    badge: "Verified",
  },
  {
    key: "youtube",
    label: "YouTube Videos",
    icon: FiYoutube,
    to: "/admin/youtube",
    accent: "#f43f5e",
    glowColor: "rgba(244, 63, 94, 0.15)",
    badge: "Media Stream",
  },
  {
    key: "gallery",
    label: "Gallery Shots",
    icon: FiImage,
    to: "/admin/gallery",
    accent: "#d946ef",
    glowColor: "rgba(217, 70, 239, 0.15)",
    badge: "Showcase",
  },
  {
    key: "messages",
    label: "Unread Messages",
    icon: FiMail,
    to: "/admin/messages",
    accent: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.15)",
    badge: "Inbound",
  },
];

// Sleek CSS Keyframes & Design System Injector
const customStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.dashboard-root {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0f172a;
}

@keyframes floatSmooth {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0px); }
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hero-banner {
  background: radial-gradient(135% 100% at 100% 0%, #1e1b4b 0%, #0f172a 50%, #020617 100%);
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(0,0,0,0) 70%);
  pointer-events: none;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.04);
}

.stat-card {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  background: #ffffff;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.08) !important;
  border-color: rgba(99, 102, 241, 0.3) !important;
}

.stat-card:hover .arrow-icon {
  transform: translate(3px, -3px);
  opacity: 1;
}

.quick-btn {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.quick-btn:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.06);
}
`;

export default function AdminDashboard() {
  const [data, setData] = useState({
    skills: [],
    projects: [],
    certificates: [],
    youtube: [],
    gallery: [],
    messages: [],
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [apiErrors, setApiErrors] = useState({});

  // Real Data Engine Fetcher
  const loadDashboardData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    const errors = {};

    try {
      const [skillsRes, projectsRes, certificatesRes, youtubeRes, galleryRes, messagesRes] =
        await Promise.allSettled([
          api.get("/skills"),
          api.get("/projects"),
          api.get("/certificates"),
          api.get("/youtube"),
          api.get("/gallery"),
          api.get("/messages"),
        ]);

      const extractData = (res, key) => {
        if (res.status === "fulfilled") {
          const resData = res.value?.data;
          if (Array.isArray(resData)) return resData;
          if (resData && Array.isArray(resData.data)) return resData.data;
          if (resData && Array.isArray(resData.pinned)) return resData.pinned;
          return [];
        } else {
          errors[key] = true;
          return [];
        }
      };

      setData({
        skills: extractData(skillsRes, "skills"),
        projects: extractData(projectsRes, "projects"),
        certificates: extractData(certificatesRes, "certificates"),
        youtube: extractData(youtubeRes, "youtube"),
        gallery: extractData(galleryRes, "gallery"),
        messages: extractData(messagesRes, "messages"),
      });

      setApiErrors(errors);
      setLastFetchTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch (e) {
      console.error("Dashboard Sync Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Real Database Analytics Derived State
  const counts = useMemo(() => {
    const unreadMsgCount = data.messages.filter((m) => !m.read && !m.isRead).length;

    return {
      skills: data.skills.length,
      projects: data.projects.length,
      certificates: data.certificates.length,
      youtube: data.youtube.length,
      gallery: data.gallery.length,
      messages: unreadMsgCount,
    };
  }, [data]);

  const unreadMessagesList = useMemo(() => {
    return data.messages.filter((m) => !m.read && !m.isRead).slice(0, 4);
  }, [data.messages]);

  const skillCategories = useMemo(() => {
    const categoriesMap = {};
    data.skills.forEach((skill) => {
      const cat = skill.category || skill.type || "Core Tech";
      categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
    });
    return Object.entries(categoriesMap);
  }, [data.skills]);

  const projectStats = useMemo(() => {
    const total = data.projects.length;
    if (total === 0) return { completed: 0, featured: 0 };

    const completed = data.projects.filter(
      (p) => p.status === "completed" || p.isCompleted || p.completed === true
    ).length;

    const featured = data.projects.filter(
      (p) => p.featured || p.isFeatured || p.pinned
    ).length;

    return { completed, featured };
  }, [data.projects]);

  const totalAssets = useMemo(() => {
    return (
      data.skills.length +
      data.projects.length +
      data.certificates.length +
      data.youtube.length +
      data.gallery.length
    );
  }, [data]);

  return (
    <AdminLayout title="Dashboard Overview">
      <style>{customStyles}</style>

      <div className="dashboard-root">
        {/* Top Dark Hero Banner */}
        <div
          className="hero-banner"
          style={{
            borderRadius: "24px",
            padding: "36px 40px",
            color: "#fff",
            marginBottom: "36px",
            boxShadow: "0 20px 40px -15px rgba(15, 23, 42, 0.4)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px",
          }}
        >
          <div style={{ zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
              <span
                style={{
                  background: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  padding: "5px 14px",
                  borderRadius: "30px",
                  fontSize: "12px",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  border: "1px solid rgba(165, 180, 252, 0.2)",
                  letterSpacing: "0.5px",
                }}
              >
                <FiShield size={14} /> ADMIN ENGINE LIVE
              </span>
              {lastFetchTime && (
                <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "5px" }}>
                  <FiClock size={13} /> Synced {lastFetchTime}
                </span>
              )}
            </div>

            <h1 style={{ margin: 0, fontSize: "32px", fontWeight: "800", letterSpacing: "-1px" }}>
              Welcome back, Master! ✨
            </h1>
            <p style={{ margin: "8px 0 0", color: "#94a3b8", fontSize: "15px", maxWidth: "560px", lineHeight: "1.6" }}>
              Real-time synchronization active across all database collections. Keep your portfolio fresh and engaging.
            </p>
          </div>

          <div style={{ zIndex: 1, display: "flex", gap: "14px" }}>
            <button
              onClick={() => loadDashboardData(true)}
              disabled={refreshing || loading}
              className="quick-btn"
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                padding: "12px 22px",
                borderRadius: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
              }}
            >
              <FiRefreshCw
                size={16}
                style={{ animation: refreshing ? "spinSlow 1s linear infinite" : "none" }}
              />
              {refreshing ? "Syncing DB..." : "Refresh Status"}
            </button>
          </div>
        </div>

        {/* Primary Stat Grid */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2
            style={{
              fontSize: "19px",
              fontWeight: "800",
              color: "#0f172a",
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              letterSpacing: "-0.3px",
            }}
          >
            <FiActivity color="#6366f1" size={20} /> Metrics & Collection Analytics
          </h2>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
            {totalAssets} Assets Configured
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "22px",
            marginBottom: "38px",
          }}
        >
          {STAT_CARDS_CONFIG.map(({ key, label, icon: Icon, to, accent, glowColor, badge }) => {
            const countValue = counts[key] || 0;
            const hasError = apiErrors[key];

            return (
              <Link key={key} to={to} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  className="stat-card"
                  style={{
                    borderRadius: "20px",
                    padding: "24px",
                    border: hasError ? "1px solid #fca5a5" : "1px solid #f1f5f9",
                    boxShadow: "0 4px 20px -5px rgba(0, 0, 0, 0.03)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "18px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "16px",
                        background: glowColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: accent,
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <span
                      style={{
                        background: "#f8fafc",
                        color: "#64748b",
                        fontSize: "11px",
                        fontWeight: "700",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      {badge}
                    </span>
                  </div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#0f172a",
                        letterSpacing: "-1.5px",
                      }}
                    >
                      {loading ? "..." : countValue}
                    </h3>
                  </div>

                  <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "15px", color: "#334155" }}>
                    {label}
                  </p>

                  <div
                    style={{
                      marginTop: "18px",
                      paddingTop: "14px",
                      borderTop: "1px solid #f8fafc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "13px",
                      color: accent,
                      fontWeight: "700",
                    }}
                  >
                    <span>Manage Collection</span>
                    <FiArrowUpRight
                      size={16}
                      className="arrow-icon"
                      style={{ transition: "all 0.2s ease", opacity: 0.8 }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Middle Section: Distribution & Content Summary */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
            marginBottom: "38px",
          }}
        >
          {/* Skill Distribution Bar Chart */}
          <div
            className="glass-card"
            style={{
              borderRadius: "22px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>
                  🧠 Skill Categories Breakdown
                </h3>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>
                  Real-time tech stack division from DB
                </p>
              </div>
            </div>

            {loading ? (
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Analyzing technology stats...</p>
            ) : skillCategories.length === 0 ? (
              <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>No skills aggregated yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {skillCategories.map(([catName, count]) => {
                  const percentage = Math.round((count / data.skills.length) * 100) || 0;
                  return (
                    <div key={catName}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", color: "#334155", marginBottom: "6px" }}>
                        <span>{catName}</span>
                        <span style={{ color: "#6366f1" }}>{count} items ({percentage}%)</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${percentage}%`,
                            background: "linear-gradient(90deg, #6366f1 0%, #a5b4fc 100%)",
                            borderRadius: "10px",
                            transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Project Highlights Card */}
          <div
            className="glass-card"
            style={{
              borderRadius: "22px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>
                🚀 Work Highlights
              </h3>
              <p style={{ margin: "0 0 22px", fontSize: "13px", color: "#64748b" }}>
                Status summary of published portfolio projects
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Featured Projects</span>
                  <p style={{ margin: "6px 0 0", fontSize: "26px", fontWeight: "800", color: "#3b82f6" }}>
                    {loading ? "..." : projectStats.featured}
                  </p>
                </div>

                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Completed Work</span>
                  <p style={{ margin: "6px 0 0", fontSize: "26px", fontWeight: "800", color: "#10b981" }}>
                    {loading ? "..." : projectStats.completed}
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "20px",
                background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                border: "1px solid #a7f3d0",
                padding: "14px 18px",
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "13px", color: "#065f46", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                <FiTrendingUp size={18} color="#059669" /> Content Status
              </span>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#047857" }}>
                Healthy & Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Real Messages & Quick Shortcuts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Inbox Preview */}
          <div
            className="glass-card"
            style={{
              borderRadius: "22px",
              padding: "28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "10px" }}>
                <FiMail color="#f59e0b" size={20} /> Unread Inquiries ({unreadMessagesList.length})
              </h3>
              <Link to="/admin/messages" style={{ fontSize: "13px", color: "#6366f1", textDecoration: "none", fontWeight: "700" }}>
                View Inbox
              </Link>
            </div>

            {loading ? (
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>Reading messages...</p>
            ) : unreadMessagesList.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "32px 20px",
                  background: "#f8fafc",
                  borderRadius: "16px",
                  color: "#64748b",
                }}
              >
                <FiCheckCircle size={32} color="#10b981" style={{ marginBottom: "8px" }} />
                <p style={{ margin: 0, fontWeight: "700", fontSize: "14px", color: "#1e293b" }}>All Inbox Caught Up!</p>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#94a3b8" }}>
                  No pending messages requiring immediate action.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {unreadMessagesList.map((msg, index) => {
                  const senderName = msg.name || msg.sender || msg.email || "Anonymous Sender";
                  const messageSnippet = msg.message || msg.content || msg.subject || "Inquiry submission.";

                  return (
                    <div
                      key={msg._id || msg.id || index}
                      style={{
                        padding: "14px 16px",
                        borderRadius: "14px",
                        background: "#fffbeb",
                        border: "1px solid #fef3c7",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ overflow: "hidden", paddingRight: "12px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#78350f" }}>
                          {senderName}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#b45309",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "240px",
                            marginTop: "2px",
                          }}
                        >
                          {messageSnippet}
                        </div>
                      </div>
                      <Link
                        to="/admin/messages"
                        style={{
                          background: "#f59e0b",
                          color: "#fff",
                          textDecoration: "none",
                          padding: "6px 14px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: "700",
                          flexShrink: 0,
                        }}
                      >
                        Reply
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div
            className="glass-card"
            style={{
              borderRadius: "22px",
              padding: "28px",
            }}
          >
            <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>
              ⚡ Quick Creation Shortcuts
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: "13px", color: "#64748b" }}>
              Fast-track entry points to create new assets
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "New Skill", to: "/admin/skills", icon: FiCode, color: "#6366f1" },
                { label: "New Project", to: "/admin/projects", icon: FiFolder, color: "#3b82f6" },
                { label: "New Certificate", to: "/admin/certificates", icon: FiAward, color: "#10b981" },
                { label: "New Gallery Shot", to: "/admin/gallery", icon: FiImage, color: "#d946ef" },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.to}
                  className="quick-btn"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "14px",
                    borderRadius: "14px",
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    color: "#334155",
                    fontWeight: "700",
                    fontSize: "13px",
                  }}
                >
                  <action.icon size={18} color={action.color} />
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}