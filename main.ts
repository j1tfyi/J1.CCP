import { serve } from "https://deno.land/std@0.193.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.193.0/http/file_server.ts";
import { gzip } from "https://deno.land/x/denoflate@1.2.1/mod.ts";

/* ============================================================
   Constants
   ============================================================ */

const STATIC_CACHE_MAX_AGE = 31536000;  // 1 year (seconds)
const DYNAMIC_CACHE_MAX_AGE = 3600;     // 1 hour (seconds)

const ROOT_DIST   = "dist";                  // Root portal bundle (wormhole)
const BRIDGE_DIST = "bridge-react-app/dist"; // Bridge widget bundle

const RATE_LIMIT  = 50;        // requests per window
const RATE_WINDOW = 30000;     // 30 seconds
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

/* ============================================================
   Referral / Chain Constants (unchanged)
   ============================================================ */

const DEBRIDGE_REFERRAL_CODE  = "32422";
const JUPITER_REFERRAL_ACCOUNT = "EKtLGKfhtaJoUnoPodBesHzfaT8aJozCayv1zw8AKH3h";  // Jupiter Ultra referral account
const JUPITER_REFERRAL_LINK   = "https://jup.ag/?referrer=EKtLGKfhtaJoUnoPodBesHzfaT8aJozCayv1zw8AKH3h&feeBps=100";  // Legacy format for widget compatibility
const SOLANA_PUBLIC_KEY       = "6j8QLb8D7wEfgAMSBy7HkuduBeysVJQimLHuwjBCW4gU";
const EVM_RECIPIENT           = "0x4A671c9424a95eA56da39D6fd13928e6aFB0Eb3E";

const SUPPORTED_CHAINS = {
  EVM: [
    1, 10, 56, 100, 137, 146, 250, 388, 747, 999, 1088, 1329, 1514, 2741, 4158, 7171, 8453, 9745, 32769,
    42161, 43114, 48900, 50104, 59144, 60808, 80094, 98866, 999999, 245022934, 728126428,
  ],
  SOLANA: [7565164],
};

/* ============================================================
   Utility Functions
   ============================================================ */

function getMimeType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "html": return "text/html";
    case "css": return "text/css";
    case "js": return "application/javascript";
    case "mjs": return "application/javascript";
    case "json": return "application/json";
    case "png": return "image/png";
    case "jpg":
    case "jpeg": return "image/jpeg";
    case "svg": return "image/svg+xml";
    case "ico": return "image/x-icon";
    case "webp": return "image/webp";
    case "woff": return "font/woff";
    case "woff2": return "font/woff2";
    case "mp4": return "video/mp4";            // ✅ add
    case "mov": return "video/quicktime";      // ✅ add
    case "webm": return "video/webm";          // optional
    default: return "application/octet-stream";
  }
}

async function compressResponse(response: Response): Promise<Response> {
  const contentType = response.headers.get("Content-Type") || "";
  // gzip only “text-like” payloads; skip binaries
  if (!/^(text\/|application\/(json|javascript|xml|wasm))/.test(contentType)) {
    return response;
  }
  const body = await response.text();
  const compressed = gzip(new TextEncoder().encode(body));
  const headers = new Headers(response.headers);
  headers.set("Content-Encoding", "gzip");
  headers.delete("Content-Length");
  return new Response(compressed, { status: response.status, headers });
}

/* ============================================================
   Security / Headers
   ============================================================ */

const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.debridge.finance https://www.dextools.io;
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://app.debridge.finance https://*.debridge.finance https://www.dextools.io;
  img-src 'self' data: https:;
  font-src 'self' https:;
  frame-src 'self' https://app.debridge.finance https://www.dextools.io;
  media-src 'self';
`.replace(/\s{2,}/g, " ");

const baseSecurityHeaders: HeadersInit = {
  "Content-Security-Policy": csp,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "DENY",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

function withSecurity(h: HeadersInit = {}): Headers {
  const out = new Headers(baseSecurityHeaders);
  for (const [k, v] of Object.entries(h)) out.set(k, v as string);
  return out;
}

/* ============================================================
   Rate Limiting
   ============================================================ */

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const rec = rateLimitStore.get(ip);
  if (!rec) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (now - rec.timestamp > RATE_WINDOW) {
    rateLimitStore.set(ip, { count: 1, timestamp: now });
    return true;
  }
  if (rec.count >= RATE_LIMIT) return false;
  rec.count += 1;
  return true;
}

/* ============================================================
   Edge Cache (Deno Deploy)
   ============================================================ */

const edgeCache = (globalThis as any).caches?.default as Cache | undefined;

async function cacheGet(req: Request): Promise<Response | undefined> {
  if (!edgeCache) return undefined;
  try {
    return await edgeCache.match(req);
  } catch {
    return undefined;
  }
}

async function cachePut(req: Request, res: Response): Promise<void> {
  if (!edgeCache) return;
  try {
    await edgeCache.put(req, res);
  } catch {
    // ignore caching failures
  }
}

/* ============================================================
   Widget Helpers / Config
   ============================================================ */

function getAffiliateFeeRecipient(inputChain: number): string {
  if (SUPPORTED_CHAINS.SOLANA.includes(inputChain)) return SOLANA_PUBLIC_KEY;
  if (SUPPORTED_CHAINS.EVM.includes(inputChain)) return EVM_RECIPIENT;
  throw new Error(`Unsupported chain ID: ${inputChain}`);
}

function getReferralKey(inputChain: number): string {
  if (SUPPORTED_CHAINS.SOLANA.includes(inputChain)) return JUPITER_REFERRAL_ACCOUNT;
  if (SUPPORTED_CHAINS.EVM.includes(inputChain)) return DEBRIDGE_REFERRAL_CODE;
  throw new Error(`Unsupported chain ID: ${inputChain}`);
}

const WIDGET_CONFIG = {
  v: "1",
  element: "debridgeWidget",
  title: "",
  description: "J1.CROSS-CHAIN PORTAL",
  width: "100%",
  height: "850",
  inputChain: 1,
  outputChain: 7565164,
  inputCurrency: "",
  outputCurrency: "HAqD46mR4LgY3aJiMZSabfefZoysG3Uuj6wn2ZKYE14v",
  address: "",
  showSwapTransfer: true,
  amount: "",
  outputAmount: "",
  isAmountFromNotModifiable: false,
  isAmountToNotModifiable: false,
  lang: "en",
  mode: "deswap",
  isEnableCalldata: false,
  styles:
    'eyJhcHBCYWNrZ3JvdW5kIjogInJnYmEoMCwwLDAsMCkiLCAiYXBwQmciOiAidHJhbnNwYXJlbnQiLCAibW9kYWxCZyI6ICJyZ2JhKDcxLDc1LDg0LDAuOTUpIiwgImNoYXJ0QmciOiAicmdiYSg3MSw3NSw4NCwwLjkpIiwgImJvcmRlclJhZGl1cyI6IDMwLCAiYm9yZGVyQ29sb3IiOiAicmdiYSgyNTUsMjU1LDI1NSwwLjIpIiwgImZvcm1Db250cm9sQmciOiAicmdiYSg3MSw3NSw4NCwwLjgpIiwgImNvbnRyb2xCb3JkZXIiOiAicmdiYSgyNTUsMjU1LDI1NSwwLjMpIiwgInByaW1hcnkiOiAiI2ZmZmZmZiIsICJzZWNvbmRhcnkiOiAiIzQ3NGI1NCIsICJzdWNjZXNzIjogIiMwMDY0MDciLCAiZXJyb3IiOiAiI2NkMDEwMSIsICJ3YXJuaW5nIjogIiNlNGU3MDMiLCAiZm9udEZhbWlseSI6ICJBdWRpb3dpZGUiLCAicHJpbWFyeUJ0bkJnIjogIiNmZjc3MDAiLCAicHJpbWFyeUJ0bkJnSG92ZXIiOiAiIzlmNGEwMCIsICJzZWNvbmRhcnlCdG5CZyI6ICIjYjE4NjBmIiwgInNlY29uZGFyeUJ0bkJnSG92ZXIiOiAiI2ZkYzExOSIsICJzZWNvbmRhcnlCdG5PdXRsaW5lIjogIiMwMDAwMDAiLCAiY2hhaW5CdG5QYWRkaW5nIjogIjEyIiwgImRlc2NyaXB0aW9uRm9udFNpemUiOiAiMjIiLCAiZm9ybUJnIjogInRyYW5zcGFyZW50IiwgImlucHV0QmciOiAicmdiYSg3MSw3NSw4NCwwLjYpIiwgIndpZGdldEJnIjogInRyYW5zcGFyZW50IiwgImNvbnRhaW5lckJnIjogInRyYW5zcGFyZW50IiwgImZvcm1QYWRkaW5nIjogeyJ0b3AiOiAyMCwgInJpZ2h0IjogMTUsICJib3R0b20iOiAyMCwgImxlZnQiOiAxNX0sICJmb3JtR3JvdXBQYWRkaW5nIjogeyJ0b3AiOiAyNSwgInJpZ2h0IjogMTIsICJib3R0b20iOiAyNSwgImxlZnQiOiAxMn0sICJmb3JtSGVhZEJ0blNpemUiOiAiMzUiLCAicHJpbWFyeUJ0blRleHQiOiAiIzAwMDAwMCIsICJzZWNvbmRhcnlCdG5UZXh0IjogIiMwMDAwMDAifQ==',
  modalBg: "rgba(71,75,84,0.95)",
  chartBg: "rgba(71,75,84,0.9)",
  borderColor: "#ffffff",
  tooltipBg: "#161b26",
  formControlBg: "rgba(71,75,84,0.8)",
  controlBorder: "#1F242F",
  primary: "#ffffff",
  secondary: "#474b54",
  success: "#006407",
  error: "#cd0101",
  warning: "#e4e703",
  fontColor: "#E6EDE4",
  fontFamily: "'Audiowide', Inter, sans-serif",
  descriptionFontSize: "35",
  theme: "dark",
  isHideLogo: true,
  logo: "",
  r: getReferralKey(1),
  affiliateFeeRecipient: getAffiliateFeeRecipient(1),
  affiliateFeePercent: "1",
  jupiterRefLink: JUPITER_REFERRAL_LINK,
  jupiterRefAccount: JUPITER_REFERRAL_ACCOUNT,  // Ultra API uses account, not pubkey
  supportedChains: JSON.stringify({
      inputChains: {
        2741: ["all"],      // Abstract
        42161: ["all"],     // Arbitrum
        43114: ["all"],     // Avalanche (C-Chain)
        8453: ["all"],      // Base
        80094: ["all"],     // Berachain
        56: ["all"],        // Binance Smart Chain (BSC)
        7141: ["all"],      // Bitrock
        60808: ["all"],     // BOB
        1088: ["all"],      // Crossfi
        388: ["all"],       // Cronos zkEVM
        1: ["all"],         // Ethereum
        250: ["all"],       // Fantom
        747: ["all"],       // Flow
        100: ["all"],       // Gnosis
        999: ["all"],       // HyperEVM
        999999: ["all"],    // Hyperliquid
        59144: ["all"],     // Linea
        5000: ["all"],      // Mantle
        1088: ["all"],      // Metis
        245022934: ["all"], // Neon
        10: ["all"],        // Optimism
        9745: ["all"],      // Plasma
        98866: ["all"],     // Plume
        137: ["all"],       // Polygon
        1329: ["all"],      // Sei
        7565164: ["all"],   // Solana
        146: ["all"],       // Sonic
        50104: ["all"],     // Sophon
        1514: ["all"],      // Story
        728126428: ["all"], // Tron
        32769: ["all"],     // Zilliqa
        48900: ["all"],     // Zircuit
      },
      outputChains: {
        2741: ["all"],      // Abstract
        42161: ["all"],     // Arbitrum
        43114: ["all"],     // Avalanche (C-Chain)
        8453: ["all"],      // Base
        80094: ["all"],     // Berachain
        56: ["all"],        // Binance Smart Chain (BSC)
        7141: ["all"],      // Bitrock
        60808: ["all"],     // BOB
        1088: ["all"],      // Crossfi
        388: ["all"],       // Cronos zkEVM
        1: ["all"],         // Ethereum
        250: ["all"],       // Fantom
        747: ["all"],       // Flow
        100: ["all"],       // Gnosis
        999: ["all"],       // HyperEVM
        999999: ["all"],    // Hyperliquid
        59144: ["all"],     // Linea
        5000: ["all"],      // Mantle
        1088: ["all"],      // Metis
        245022934: ["all"], // Neon
        10: ["all"],        // Optimism
        9745: ["all"],      // Plasma
        98866: ["all"],     // Plume
        137: ["all"],       // Polygon
        1329: ["all"],      // Sei
        7565164: ["all"],   // Solana
        146: ["all"],       // Sonic
        50104: ["all"],     // Sophon
        1514: ["all"],      // Story
        728126428: ["all"], // Tron
        32769: ["all"],     // Zilliqa
        48900: ["all"],     // Zircuit
      },
    }),
  };
/* ============================================================
   Main HTTP Server
   ============================================================ */

serve(async (req) => {
  const startTime = performance.now();
  const url = new URL(req.url);
  const acceptsGzip = req.headers.get("accept-encoding")?.includes("gzip") ?? false;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // ---- CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: withSecurity({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
      }),
    });
  }

  // ---- Health check
  if (url.pathname === "/healthz") {
    return new Response(JSON.stringify({ ok: true, ts: Date.now() }), {
      headers: withSecurity({
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      }),
    });
  }

  // ---- Rate limiting (global)
  if (!rateLimitOk(ip)) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: withSecurity({ "Retry-After": `${Math.ceil(RATE_WINDOW / 1000)}` }),
    });
  }

  console.log(`➡️  ${req.method} ${url.pathname}  ip=${ip}`);

  try {
    /* --------------------------------------------------------
       Custom JSON Endpoints
       -------------------------------------------------------- */

    // Widget config API
    if (url.pathname === "/widget-config") {
      try {
        let response = new Response(JSON.stringify(WIDGET_CONFIG), {
          headers: withSecurity({
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${DYNAMIC_CACHE_MAX_AGE}`,
            "X-Content-Type-Options": "nosniff",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          }),
        });
        if (acceptsGzip) response = await compressResponse(response);
        return response;
      } catch (configError) {
        console.error("Widget config error:", configError);
        return new Response(JSON.stringify({ error: "Failed to generate widget config" }), {
          status: 500,
          headers: withSecurity({
            "Content-Type": "application/json",
            "Cache-Control": "no-store",
          }),
        });
      }
    }

    // Inline web manifest
    if (url.pathname === "/site.webmanifest") {
      try {
        const manifest = JSON.stringify({
          name: "J1.CrossChain Portal",
          short_name: "J1.Portal",
          description: "1.portal, any.token, ∞.possibilities",
          start_url: "/",
          id: "/",
          display: "standalone",
          background_color: "#000000",
          theme_color: "#000000",
          icons: [
            { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
          ],
          screenshots: [
            { src: "/screenshot-mobile.png", sizes: "390x844", type: "image/png" },
            { src: "/screenshot-desktop.png", sizes: "1920x1080", type: "image/png", form_factor: "wide" },
          ],
          orientation: "portrait",
          prefer_related_applications: false,
        });

        return new Response(manifest, {
          headers: withSecurity({
            "Content-Type": "application/manifest+json",
            "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE}`,
            "Access-Control-Allow-Origin": "*",
          }),
        });
      } catch (error) {
        console.error("Error serving manifest:", error);
        return new Response("Manifest Error", {
          status: 500,
          headers: withSecurity({ "Content-Type": "text/plain", "Cache-Control": "no-store" }),
        });
      }
    }

    // Service Worker delivery
    if (url.pathname === "/service-worker.js") {
      try {
        const file = await Deno.readTextFile("service-worker.js");
        return new Response(file, {
          headers: withSecurity({
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store",
          }),
        });
      } catch (error) {
        console.error("Error serving service-worker.js:", error);
        return new Response("Server Error", {
          status: 500,
          headers: withSecurity({ "Content-Type": "text/plain", "Cache-Control": "no-store" }),
        });
      }
    }

    /* --------------------------------------------------------
       PWA Asset Routes (icons, splash, favicons)
       -------------------------------------------------------- */
    if (
      url.pathname.startsWith("/android-chrome") ||
      url.pathname.startsWith("/manifest-icon") ||
      url.pathname.startsWith("/apple-touch-icon") ||
      url.pathname.startsWith("/screenshot") ||
      url.pathname.startsWith("/favicon") ||
      url.pathname === "/apple-touch-icon-precomposed.png"  // legacy alias
    ) {
      try {
        // Prefer ROOT_DIST/public first, then ROOT_DIST root, then raw public, then BRIDGE_DIST/public
        const tryPaths = [
          `${ROOT_DIST}/public${url.pathname}`,
          `${ROOT_DIST}${url.pathname}`,
          `public${url.pathname}`,
          `${BRIDGE_DIST}/public${url.pathname}`,
        ];

        // Special alias: precomposed → apple-touch-icon.png fallback
        if (url.pathname === "/apple-touch-icon-precomposed.png") {
          tryPaths.unshift(`${ROOT_DIST}/public/apple-touch-icon.png`);
          tryPaths.unshift(`${ROOT_DIST}/apple-touch-icon.png`);
        }

        let file: Uint8Array | null = null;
        let filePath = "";

        for (const p of tryPaths) {
          try {
            file = await Deno.readFile(p);
            filePath = p;
            break;
          } catch {}
        }

        if (!file) throw new Error("not found");

        const contentType = getMimeType(filePath);
        return new Response(file, {
          headers: withSecurity({
            "Content-Type": contentType,
            "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE}`,
          }),
        });
      } catch {
        return new Response("Asset not found", {
          status: 404,
          headers: withSecurity({ "Content-Type": "text/plain", "Cache-Control": "no-store" }),
        });
      }
    }

    /* --------------------------------------------------------
       Immutable Hashed Assets (root & bridge)
       -------------------------------------------------------- */
    // ---------------------- Immutable hashed assets ----------------------
    if (url.pathname.startsWith("/assets/") || url.pathname.startsWith("/bridge/assets/")) {
      const isBridge = url.pathname.startsWith("/bridge/");
      const fsRoot = isBridge ? BRIDGE_DIST : ROOT_DIST;
      const relPath = url.pathname.replace(isBridge ? "/bridge" : "", "");
      try {
        const key = new Request(req.url, req);
        const cached = await cacheGet(key);
        if (cached) return cached;

        const filePath = `${fsRoot}${relPath}`;
        const file = await Deno.readFile(filePath);
        const contentType = getMimeType(filePath);

        const res = new Response(file, {
          headers: withSecurity({
            "Content-Type": contentType,
            "Cache-Control": `public, max-age=${STATIC_CACHE_MAX_AGE}, immutable`,
          }),
        });
        await cachePut(key, res.clone());
        return res;
      } catch {
        // 🔁 Fallback: serve the latest SPA shell so the browser picks up new filenames
        try {
          const indexHtml = await Deno.readTextFile(`${isBridge ? BRIDGE_DIST : ROOT_DIST}/index.html`);
          return new Response(indexHtml, {
            status: 200,
            headers: withSecurity({
              "Content-Type": "text/html",
              "Cache-Control": "no-store", // force refresh
            }),
          });
        } catch {
          return new Response("Not Found", { status: 404, headers: withSecurity() });
        }
      }
    }

    /* --------------------------------------------------------
       Bridge App ( /bridge/* ) — verbose inline serveDir + SPA
       -------------------------------------------------------- */
    if (url.pathname.startsWith("/bridge")) {
      const fsRoot = BRIDGE_DIST;

      try {
        const res = await serveDir(req, {
          fsRoot,
          showDirListing: false,
          quiet: true,
        });

        if (res.status === 404) {
          // SPA fallback -> bridge index.html
          const indexHtml = await Deno.readTextFile(`${fsRoot}/index.html`);
          let sres = new Response(indexHtml, {
            status: 200,
            headers: withSecurity({
              "Content-Type": "text/html",
              // SPA shell should be short-cached to allow quick HTML updates
              "Cache-Control": "public, max-age=60",
            }),
          });
          if (acceptsGzip) sres = await compressResponse(sres);
          return sres;
        }

        // For HTML files, force short cache; add security headers to all
        const isHtml = res.headers.get("content-type")?.includes("text/html");
        const h = new Headers(res.headers);
        if (isHtml) {
          h.set("Cache-Control", "public, max-age=60");
        }
        for (const [k, v] of Object.entries(baseSecurityHeaders)) {
          h.set(k, v as string);
        }
        return new Response(res.body, { status: res.status, headers: h });
      } catch (e) {
        console.error("Bridge serve error:", e);
        // Hard fallback -> index.html
        try {
          const indexHtml = await Deno.readTextFile(`${fsRoot}/index.html`);
          let sres = new Response(indexHtml, {
            status: 200,
            headers: withSecurity({
              "Content-Type": "text/html",
              "Cache-Control": "public, max-age=60",
            }),
          });
          if (acceptsGzip) sres = await compressResponse(sres);
          return sres;
        } catch {
          return new Response("Bridge index not found", {
            status: 500,
            headers: withSecurity({ "Content-Type": "text/plain" }),
          });
        }
      }
    }

    /* --------------------------------------------------------
       Root Portal ( / ) — verbose inline serveDir + SPA
       -------------------------------------------------------- */
    {
      const fsRoot = ROOT_DIST;
      try {
        const res = await serveDir(req, {
          fsRoot,
          showDirListing: false,
          quiet: true,
        });

        if (res.status === 404) {
          // SPA fallback -> root index.html
          const indexHtml = await Deno.readTextFile(`${fsRoot}/index.html`);
          let sres = new Response(indexHtml, {
            status: 200,
            headers: withSecurity({
              "Content-Type": "text/html",
              "Cache-Control": "public, max-age=60",
            }),
          });
          if (acceptsGzip) sres = await compressResponse(sres);
          return sres;
        }

        const isHtml = res.headers.get("content-type")?.includes("text/html");
        const h = new Headers(res.headers);
        if (isHtml) {
          h.set("Cache-Control", "public, max-age=60");
        }
        for (const [k, v] of Object.entries(baseSecurityHeaders)) {
          h.set(k, v as string);
        }
        return new Response(res.body, { status: res.status, headers: h });
      } catch (e) {
        console.error("Root serve error:", e);
        // Hard fallback -> index.html
        try {
          const indexHtml = await Deno.readTextFile(`${fsRoot}/index.html`);
          let sres = new Response(indexHtml, {
            status: 200,
            headers: withSecurity({
              "Content-Type": "text/html",
              "Cache-Control": "public, max-age=60",
            }),
          });
          if (acceptsGzip) sres = await compressResponse(sres);
          return sres;
        } catch {
          return new Response("Index not found", {
            status: 500,
            headers: withSecurity({ "Content-Type": "text/plain" }),
          });
        }
      }
    }

  } catch (error) {
    console.error("Unhandled error:", error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: withSecurity({ "Content-Type": "text/plain", "Cache-Control": "no-store" }),
    });
  } finally {
    const dt = (performance.now() - startTime).toFixed(1);
    console.log(`✅ Handled ${url.pathname} in ${dt}ms`);
  }
}, { port: 8000 });