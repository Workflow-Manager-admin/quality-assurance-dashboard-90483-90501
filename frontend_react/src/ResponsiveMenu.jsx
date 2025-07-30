import React, { useState, useEffect, useRef } from "react";
// Import NavLink only if react-router-dom is used in your app
// import { NavLink } from "react-router-dom";

/**
 * ResponsiveMenu component for AutoQA Pro.
 * 
 * Layout:
 * - Left: ☰ button opens vertical navigation dropdown (Dashboard, Help, Settings, etc.)
 * - Center/Left: Always shows "AutoQA Pro" title text
 * - Right: User (avatar/email) button opens dropdown (shows user's email and Logout button)
 * - Far right: ☰ button shows Home, Settings dropdown
 * 
 * All dropdowns close on outside click or ESC key. 
 * Dropdowns are accessible, keyboard-navigable, and modern.
 * 
 * This file uses no external CSS frameworks—style is inline and leverages CSS variables.
 */

// TODO: Replace with real user data/props
const user = {
  email: "test.user@email.com",
  name: "Test User"
};

// Main navigation entries for left menu dropdown (can adjust for your app)
const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Test Cases", href: "/test-cases" },
  { label: "Duplicates", href: "/duplicates" },
  { label: "Jira Integration", href: "/jira" },
  { label: "Help", href: "/help" },
];

// Rightmost hamburger menu links
const HAMBURGER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Settings", href: "/settings" }
];

export default function ResponsiveMenu() {
  // Show menu only if mobile (window width < 800)
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 800 : false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 800);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Dropdown visibility state
  const [dropdown, setDropdown] = useState({
    left: false,
    user: false,
    right: false
  });

  // Refs to detect outside click/esc close for dropdowns
  const leftRef = useRef();
  const userRef = useRef();
  const rightRef = useRef();

  // Handle ALL dropdown close on outside click or Escape key
  useEffect(() => {
    function handleClick(e) {
      if (
        (!leftRef.current || !leftRef.current.contains(e.target)) &&
        (!userRef.current || !userRef.current.contains(e.target)) &&
        (!rightRef.current || !rightRef.current.contains(e.target))
      ) {
        setDropdown({ left: false, user: false, right: false });
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") {
        setDropdown({ left: false, user: false, right: false });
      }
    }
    if (dropdown.left || dropdown.user || dropdown.right) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdown]);

  // Helper dropdown container style (shared)
  const getDropdownStyle = side => ({
    position: "absolute",
    top: 44,
    [side]: 0,
    minWidth: side === "left" ? 200 : 150,
    background: "var(--bg-secondary, #fff)",
    color: "var(--text-primary, #1a1a1a)",
    boxShadow:
      "0 8px 24px rgba(0,0,0,0.12), 0 1.5px 6px rgba(0,0,0,0.06)",
    borderRadius: 12,
    zIndex: 1100,
    padding: "8px 0",
    border: "1px solid var(--border-color, #e9ecef)",
    display: "flex",
    flexDirection: "column",
    gap: 2
  });

  // Modern icon button style
  const iconBtnStyle = {
    fontSize: 26,
    background: "none",
    border: "none",
    color: "var(--text-primary, #1a1a1a)",
    cursor: "pointer",
    padding: "7px 12px",
    borderRadius: 7,
    transition: "background 0.15s"
  };

  // Only render on mobile (window width < 800)
  if (!isMobile) {
    return null;
  }

  // ----- RENDER -----
  return (
    <nav
      className="responsive-navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 14px",
        height: 44,
        width: "100%",
        background: "var(--bg-secondary, #fff)",
        borderBottom: "1px solid var(--border-color, #e9ecef)",
        position: "relative",
        zIndex: 1000
      }}
    >
      {/* LEFT: Navigation Hamburger */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Hamburger Button with dropdown for nav links */}
        <div ref={leftRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-haspopup="true"
            aria-expanded={dropdown.left}
            style={iconBtnStyle}
            onClick={e => {
              e.stopPropagation();
              setDropdown(d => ({
                left: !d.left,
                user: false,
                right: false
              }));
            }}
            tabIndex={0}
          >
            <span aria-hidden>☰</span>
          </button>
          {dropdown.left && (
            <div
              style={getDropdownStyle("left")}
              role="menu"
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              {NAV_LINKS.map(nav => (
                <a
                  key={nav.href}
                  href={nav.href}
                  tabIndex={0}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "12px 18px",
                    fontWeight: 500,
                    fontSize: 16,
                    borderRadius: 8,
                    display: "block",
                    margin: "1px 4px",
                    transition: "background 0.17s"
                  }}
                  onClick={() => setDropdown({ left: false, user: false, right: false })}
                  onKeyPress={e => {
                    if (e.key === "Enter") setDropdown({ left: false, user: false, right: false });
                  }}
                  role="menuitem"
                >
                  {nav.label}
                </a>
              ))}
            </div>
          )}
        </div>
        {/* App Title */}
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.18rem",
            marginLeft: 14,
            userSelect: "none",
            letterSpacing: "0.03em"
          }}
        >
          AutoQA Pro
        </span>
      </div>
      {/* ----- SPACER for centralization ----- */}
      <div style={{ flexGrow: 1 }} />
      {/* RIGHT: User dropdown and hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* User (avatar/email/etc) dropdown */}
        <div ref={userRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Open user menu"
            style={{
              ...iconBtnStyle,
              padding: "6px 15px",
              fontWeight: 600,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 7
            }}
            onClick={e => {
              e.stopPropagation();
              setDropdown(d => ({
                left: false,
                user: !d.user,
                right: false
              }));
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                background: "var(--kavia-orange, #E87A41)",
                borderRadius: "50%",
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 15
              }}
            >
              {/* Show first letter of email/name */}
              {(user.email || user.name || "?")[0].toUpperCase()}
            </span>
          </button>
          {dropdown.user && (
            <div
              style={getDropdownStyle("right")}
              role="menu"
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              <div
                style={{
                  padding: "10px 18px 6px 18px",
                  fontSize: 15,
                  color: "var(--text-secondary, #5f5f5f)",
                  wordBreak: "break-all"
                }}
              >
                {user.email}
              </div>
              <hr style={{ margin: "8px 0", borderColor: "#ececec" }} />
              <button
                type="button"
                style={{
                  background: "var(--button-bg, #007bff)",
                  color: "var(--button-text, #fff)",
                  border: "none",
                  borderRadius: 7,
                  padding: "7px 14px",
                  fontWeight: 600,
                  fontSize: 15,
                  margin: "0 14px 7px 14px",
                  cursor: "pointer",
                  transition: "background 0.17s"
                }}
                onClick={() => {
                  setDropdown({ left: false, user: false, right: false });
                  // TODO: Replace with your logout function handler!
                  window.location.href = "/logout";
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
        {/* Far-right Hamburger */}
        <div ref={rightRef} style={{ position: "relative" }}>
          <button
            type="button"
            aria-label="Open options menu"
            style={iconBtnStyle}
            onClick={e => {
              e.stopPropagation();
              setDropdown(d => ({
                left: false,
                user: false,
                right: !d.right
              }));
            }}
            tabIndex={0}
          >
            <span aria-hidden>☰</span>
          </button>
          {dropdown.right && (
            <div
              style={getDropdownStyle("right")}
              role="menu"
              tabIndex={-1}
              onClick={e => e.stopPropagation()}
            >
              {HAMBURGER_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  tabIndex={0}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    padding: "12px 18px",
                    fontWeight: 500,
                    fontSize: 15,
                    borderRadius: 8,
                    display: "block",
                    margin: "1px 4px",
                    transition: "background 0.15s"
                  }}
                  onClick={() => setDropdown({ left: false, user: false, right: false })}
                  onKeyPress={e => {
                    if (e.key === "Enter") setDropdown({ left: false, user: false, right: false });
                  }}
                  role="menuitem"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
