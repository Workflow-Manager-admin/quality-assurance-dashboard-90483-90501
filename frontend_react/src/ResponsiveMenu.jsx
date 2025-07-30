import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";

/**
 * A responsive menu bar with identical dropdown styling/logic for both the left ☰ (Dashboard/Help)
 * and right ☰ (User/Account-style) menus. This ensures consistency in dropdown appearance, zIndex, etc.
 */
export default function ResponsiveMenu() {
  // State for showing/hiding left and right dropdowns
  const [showLeftDropdown, setShowLeftDropdown] = useState(false);
  const [showRightDropdown, setShowRightDropdown] = useState(false);

  // Refs for detecting clicks outside
  const leftDropdownRef = useRef(null);
  const rightDropdownRef = useRef(null);

  // Handle click outside for closing dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (leftDropdownRef.current && !leftDropdownRef.current.contains(event.target)) {
        setShowLeftDropdown(false);
      }
      if (rightDropdownRef.current && !rightDropdownRef.current.contains(event.target)) {
        setShowRightDropdown(false);
      }
    }
    if (showLeftDropdown || showRightDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLeftDropdown, showRightDropdown]);

  // Shared dropdown menu style (matches both left and right sides)
  const dropdownStyle = {
    position: "absolute",
    top: "44px",
    minWidth: "180px",
    right: undefined,
    left: undefined,
    background: "var(--bg-secondary, #fff)",
    color: "var(--text-primary, #222)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12), 0 1.5px 6px rgba(0,0,0,0.06)",
    borderRadius: "12px",
    zIndex: 9999,
    padding: "8px 0",
    border: "1px solid var(--border-color, #eee)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  // Menu entries for left side (can customize per requirements)
  const leftMenuEntries = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/help", label: "Help" }
  ];

  // Menu entries for right side (example/user profile menu)
  const rightMenuEntries = [
    { to: "/profile", label: "Profile" },
    { to: "/settings", label: "Settings" },
    { to: "/logout", label: "Logout" }
  ];

  return (
    <nav
      className="responsive-navbar"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "44px",
        width: "100%",
        background: "var(--bg-secondary, #fff)",
        borderBottom: "1px solid var(--border-color, #eee)",
        position: "relative"
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Left Dropdown Button (☰) */}
        <div ref={leftDropdownRef} style={{ position: "relative" }}>
          <button
            aria-label="Open left menu"
            style={{
              fontSize: "22px",
              background: "none",
              border: "none",
              color: "var(--text-primary, #222)",
              cursor: "pointer",
              padding: "8px 10px"
            }}
            onClick={() => setShowLeftDropdown(v => !v)}
          >☰</button>
          {showLeftDropdown &&
            <div style={{ ...dropdownStyle, left: 0, right: "auto" }}>
              {leftMenuEntries.map((entry, idx) => (
                <NavLink
                  key={entry.to}
                  to={entry.to}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: "inherit",
                    padding: "10px 16px",
                    fontWeight: 500,
                    background: isActive ? "var(--bg-primary, #f5f5f5)" : "none",
                    borderRadius: "8px",
                    transition: "background 0.18s",
                    display: "block"
                  })}
                  onClick={() => setShowLeftDropdown(false)}
                >
                  {entry.label}
                </NavLink>
              ))}
            </div>
          }
        </div>
        <span style={{
          fontWeight: 700,
          fontSize: "1.1rem",
          marginLeft: "12px"
        }}>QA Dashboard</span>
      </div>

      {/* (Optional) Center header, logo, or title */}
      <div style={{ flex: 1, textAlign: "center" }}>
        {/* Could place logo or application name */}
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Right Dropdown (Hamburger) */}
        <div ref={rightDropdownRef} style={{ position: "relative" }}>
          <button
            aria-label="Open menu"
            style={{
              fontSize: "22px",
              background: "none",
              border: "none",
              color: "var(--text-primary, #222)",
              cursor: "pointer",
              padding: "8px 10px"
            }}
            onClick={() => setShowRightDropdown(v => !v)}
          >☰</button>
          {showRightDropdown &&
            <div style={{ ...dropdownStyle, right: 0, left: "auto" }}>
              {rightMenuEntries.map((entry, idx) => (
                <NavLink
                  key={entry.to}
                  to={entry.to}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: "inherit",
                    padding: "10px 16px",
                    fontWeight: 500,
                    background: isActive ? "var(--bg-primary, #f5f5f5)" : "none",
                    borderRadius: "8px",
                    transition: "background 0.18s",
                    display: "block"
                  })}
                  onClick={() => setShowRightDropdown(false)}
                >
                  {entry.label}
                </NavLink>
              ))}
            </div>
          }
        </div>
      </div>
    </nav>
  );
}
