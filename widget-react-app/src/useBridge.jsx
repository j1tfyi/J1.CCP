// useBridge.jsx
import { useEffect, useState } from "react";

// For Vite environment variables:
// e.g. VITE_SCRIPT_URL="https://app.debridge.finance/assets/scripts/widget.js"
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;

const loadScript = (src, callback) => {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;
  script.onload = () => callback(null, script);
  script.onerror = () => callback(new Error(`Failed to load script: ${src}`));
  document.body.appendChild(script);
};

export const useBridgeHook = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [configData, setConfigData] = useState(null);

  // 1) Load the external deBridge script (once on mount)
  useEffect(() => {
    loadScript(SCRIPT_URL, (error) => {
      if (error) {
        console.error("Script load error:", error);
        return;
      }
      setScriptLoaded(true);
    });
  }, []);

  // 2) Fetch the config from our Deno backend (/widget-config)
  useEffect(() => {
    fetch("/widget-config")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch widget config: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setConfigData(data))
      .catch((err) => console.error(err));
  }, []);

  // 3) Once both scriptLoaded & configData are ready, init the widget & add header
  useEffect(() => {
    if (scriptLoaded && configData && window.deBridge?.widget) {
      // Optionally modify config before initializing the widget
      // For example, if the user picks Solana, add Jupiter referral:
      const finalConfig = { ...configData };

      // UNCOMMENTED logic: if chain is Solana (7565164), add referral
      if (finalConfig.inputChain === 7565164) {
        // e.g. you might store the Jupiter referral pubkey in the config
        // or you might hardcode it here
        if (configData.jupiterRefPubkey) {
          finalConfig.referral = configData.jupiterRefPubkey;
        }
      }

      // Initialize the deBridge widget with final config
      window.deBridge.widget(finalConfig);

      // Create custom header with "Home" button
      const header = document.createElement("div");
      header.id = "customHeader";
      header.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #474646;
        height: 80px;
        border-bottom: 0px solid #474646;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      `;

      header.innerHTML = `
        <button id="homeButton" style="
          width: 580px;
          height: 40px;
          font-size: 16px;
          font-family: Audiowide, sans-serif;
          color: white;
          background: #800304;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background 0.3s ease, transform 0.2s ease;
        ">
          Home
        </button>
      `;

      const root = document.getElementById("root");
      if (root) {
        root.insertBefore(header, root.firstChild);
      }

      const homeButton = document.getElementById("homeButton");
      homeButton.addEventListener("click", () => {
        window.location.href = "https://j1t.fyi/";
      });

      // Hover effect
      homeButton.addEventListener("mouseover", () => {
        homeButton.style.background = "#9b0404";
        homeButton.style.transform = "scale(1.05)";
      });
      homeButton.addEventListener("mouseout", () => {
        homeButton.style.background = "#800304";
        homeButton.style.transform = "scale(1)";
      });
    }
  }, [scriptLoaded, configData]);

  return null; // This hook sets up the widget (and header) behind the scenes
};