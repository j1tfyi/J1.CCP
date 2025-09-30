// Coinbase Developer Platform Configuration for J1.CCP
// Using Embedded Wallet (Smart Wallet) - connects to existing Coinbase accounts
export const CDP_CONFIG = {
  projectId: import.meta.env.VITE_CDP_PROJECT_ID || "80a2acea-83de-40aa-be1e-081d47e196c8",
};

export const APP_CONFIG = {
  name: "J1.CROSS-CHAIN PORTAL",
  logoUrl: "/j1ccplogo.svg",
};

// Theme configuration for Coinbase embedded wallet to match J1.CCP branding
export const CDP_THEME = {
  "colors-bg-default": "#000000",
  "colors-bg-overlay": "rgba(0, 0, 0, 0.9)",
  "colors-bg-skeleton": "#1a1a1a",
  "colors-bg-primary": "#ff6600", // J1.CCP orange
  "colors-bg-secondary": "#1a1a1a",
  "colors-fg-default": "#ffffff",
  "colors-fg-muted": "#999999",
  "colors-fg-primary": "#ff6600",
  "colors-fg-onPrimary": "#ffffff",
  "colors-fg-onSecondary": "#ffffff",
  "colors-line-default": "rgba(255, 255, 255, 0.1)",
  "colors-line-heavy": "rgba(255, 255, 255, 0.2)",
  "colors-line-primary": "#ff6600",
  "font-family-sans": "'Inter', 'Roboto', sans-serif",
  "font-size-base": "16px",
  "borderRadius-small": "0.375rem",
  "borderRadius-medium": "0.5rem",
  "borderRadius-large": "0.75rem",
};