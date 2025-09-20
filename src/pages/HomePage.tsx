import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VideoBackground } from "../components/VideoBackground";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Rocket, TrendingUp, Shield, Zap, Sparkles, Github, Globe, Coins, ShieldCheck, Lock, Network, ArrowRightLeft } from "lucide-react";

// Import network logos
import abstractLogo from '../assets/networks/abstract.png';
import arbitrumLogo from '../assets/networks/arbitrum.png';
import avalancheLogo from '../assets/networks/avalanche.png';
import baseLogo from '../assets/networks/base.png';
import berachainLogo from '../assets/networks/berachain.png';
import bnbLogo from '../assets/networks/bnb.png';
import bobLogo from '../assets/networks/bob.png';
import ethereumLogo from '../assets/networks/ethereum.png';
import flowLogo from '../assets/networks/flow.png';
import gnosisLogo from '../assets/networks/gnosis.png';
import hyperevmLogo from '../assets/networks/hyperevm.png';
import hyperliquidLogo from '../assets/networks/hyperliquid.png';
import lineaLogo from '../assets/networks/linea.png';
import mantleLogo from '../assets/networks/mantle.png';
import neonLogo from '../assets/networks/neon.png';
import optimismLogo from '../assets/networks/optimism.png';
import polygonLogo from '../assets/networks/polygon.png';
import seiLogo from '../assets/networks/sei.png';
import solanaLogo from '../assets/networks/solana.png';
import sonicLogo from '../assets/networks/sonic.png';
import sophonLogo from '../assets/networks/sophon.png';
import storyLogo from '../assets/networks/story.png';
import tronLogo from '../assets/networks/tron.png';
import zilliqqaLogo from '../assets/networks/zilliqa.png';

// Extend window for deBridge SDK
declare global {
  interface Window {
    deBridge?: any;
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  // Lazy load deBridge widget when scrolled into view
  useEffect(() => {
    let hasLoaded = false;

    const loadWidget = async () => {
      if (hasLoaded) return;
      hasLoaded = true;

      try {
        // Preconnect to deBridge for faster loading
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://app.debridge.finance';
        document.head.appendChild(link);

        const response = await fetch('/widget-config');
        const config = await response.json();

        // Load the script
        if (!window.deBridge) {
          const script = document.createElement('script');
          script.src = 'https://app.debridge.finance/assets/scripts/widget.js';
          script.async = true;
          script.defer = true;
          script.onload = () => {
            setTimeout(() => {
              if (window.deBridge && widgetContainerRef.current) {
                window.deBridge.widget(config);
              }
            }, 100);
          };
          document.body.appendChild(script);
        } else if (widgetContainerRef.current) {
          window.deBridge.widget(config);
        }
      } catch (err) {
        console.error('Failed to load widget config:', err);
      }
    };

    // Use Intersection Observer to load widget only when near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadWidget();
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    // Observe the widget container
    const checkAndObserve = () => {
      if (widgetContainerRef.current) {
        observer.observe(widgetContainerRef.current);
      } else {
        setTimeout(checkAndObserve, 100);
      }
    };

    checkAndObserve();

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Video - Priority Load */}
      <VideoBackground
        src="/stringtitle"
        className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-70"
        preload="auto"
        priority={true}
      />

      {/* Header */}
      <header className="sticky-header fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/60">
        <div className="w-full px-2 sm:px-4 md:container md:mx-auto">
          <nav
            className="flex items-center justify-between h-16"
          >
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-1 sm:gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <span className="text-lg sm:text-2xl font-bold gradient-text">J1.CCP</span>
            </a>

            <div
              className="flex items-center gap-1 sm:gap-2 md:gap-4"
            >
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                style={{ pointerEvents: "auto" }}
                asChild
              >
                <a href="#key-features" style={{ pointerEvents: "auto" }}>
                  Features
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                style={{ pointerEvents: "auto" }}
                asChild
              >
                <a href="#portal-widget" style={{ pointerEvents: "auto" }}>
                  Portal
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                style={{ pointerEvents: "auto" }}
                asChild
              >
                <a
                  href="https://j1tfyi.gitbook.io/docs/utilities-and-future-plan/j1.crosschain-portal"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ pointerEvents: "auto" }}
                >
                  Docs
                </a>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                style={{ pointerEvents: "auto" }}
                asChild
              >
                <a
                  href="https://github.com/j1tfyi/ccp"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ pointerEvents: "auto" }}
                >
                  <Github className="w-4 h-4" />
                </a>
              </Button>
              <Button
                variant="pump"
                size="sm"
                className="px-2 sm:px-4 text-xs sm:text-sm"
                style={{ pointerEvents: "auto" }}
                asChild
              >
                <a
                  href="https://t.me/j1tfyi"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ pointerEvents: "auto" }}
                >
                  <span className="hidden sm:inline">Join Community</span>
                  <span className="sm:hidden">Join</span>
                </a>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-16">
      {/* Hero Section */}
        <section className="pt-8 md:pt-0 pb-12 px-2 relative">
          <div className="container mx-auto text-center relative">
            <div className="relative z-10">
              <div className="w-full mt-0 md:-mt-48">
                <img
                  src="/titlepage.png"
                  alt="J1.CrossChain Portal"
                  className="w-full h-auto max-w-none"
                />
              </div>
              <div className="-mt-16 md:-mt-56">
                <p className="text-xl sm:text-2xl md:text-4xl text-foreground/80 mb-4 max-w-5xl mx-auto">
                  One Portal. Infinite Possibilities. Zero Risk.
                </p>
                <p className="text-lg sm:text-xl md:text-3xl text-foreground/70 mb-5 max-w-3xl mx-auto">
                  Instant. Secure. Borderless.
                </p>
                <p className="text-base sm:text-lg md:text-2xl text-foreground/70 mb-6 max-w-2xl mx-auto">
                  Cross-Chain Swap in Seconds
                </p>
              </div>
            </div>

            <div
              className="flex gap-4 justify-center mb-12 mt-4 relative z-20"
            >
              <Button
                variant="pump"
                size="xl"
                className="gap-2 border-2 border-black text-black relative"
                style={{ textShadow: "none", WebkitTextStroke: "none", pointerEvents: 'auto' }}
                asChild
              >
                <Link to="/portal" className="text-black" style={{ pointerEvents: 'auto' }}>
                  <Rocket className="w-5 h-5 text-black" />
                  <span className="inline-block">Launch J1.CCP</span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 bg-card-gradient backdrop-blur-sm border-border/40">
                <div className="text-3xl font-bold text-primary mb-2">24+</div>
                <p className="text-foreground/70">Blockchain Networks</p>
              </Card>
              <Card className="p-6 bg-card-gradient backdrop-blur-sm border-border/40">
                <div className="text-3xl font-bold text-primary mb-2">Zero</div>
                <p className="text-foreground/70">Slippage Risk</p>
              </Card>
              <Card className="p-6 bg-card-gradient backdrop-blur-sm border-border/40">
                <div className="text-3xl font-bold text-primary mb-2">30+</div>
                <p className="text-foreground/70">Wallets Supported</p>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 px-4 bg-background/80 backdrop-blur-md relative overflow-hidden"
        >
          <VideoBackground
            src="/374800567564894209"
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30"
            preload="metadata"
            lazyLoad={true}
          />
          <div className="container mx-auto relative z-10">
            <h2 className="text-4xl font-bold text-center mb-12">
              How <span className="gradient-text">J1.CCP</span> Works in 1 Click
            </h2>

            {/* Three-Stage Process */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-primary mb-4">+</div>
                <h3 className="text-xl font-semibold mb-3">Start Your Swap</h3>
                <p className="text-foreground/70 text-sm">
                  Enter the token you want to send, the token you want to receive, and the destination wallet address. 
                  Your tokens are locked on the source chain via DLN smart contract.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-primary mb-4">^</div>
                <h3 className="text-xl font-semibold mb-3">Instant Fulfillment</h3>
                <p className="text-foreground/70 text-sm">
                  Independent solvers compete to fulfill your order, delivering the requested tokens directly to your 
                  wallet on the destination chain — instantly and securely.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <div className="text-3xl font-bold text-primary mb-4">$</div>
                <h3 className="text-xl font-semibold mb-3">Verified Settlement</h3>
                <p className="text-foreground/70 text-sm">
                  A secure cross-chain confirmation finalizes the swap. Your original tokens are released to the solver, 
                  completing the transaction with atomic, risk-free settlement.
                </p>
              </Card>
            </div>

            {/* Key Features Grid */}
            <h3 id="key-features" className="text-2xl font-bold text-center mb-8 scroll-mt-20">
              Key <span className="gradient-text">Features</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <Zap className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Swap, No Charge</h3>
                <p className="text-foreground/70 text-sm">
                  Cross-chain swaps finalize in seconds with solver-based fulfillment and atomic security.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trustless by Design</h3>
                <p className="text-foreground/70 text-sm">
                  No wrapped tokens or intermediaries. All transfers are native and verified on-chain.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Multi-Chain Reach</h3>
                <p className="text-foreground/70 text-sm">
                  Swap seamlessly across 24+ EVM and non-EVM blockchains including Ethereum, Solana, Base, Tron, and many more.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <Sparkles className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Instant Off-Chain Fulfillment</h3>
                <p className="text-foreground/70 text-sm">
                  Instead of locking funds in pools, J1.CCP uses an off-chain network of validators and market makers 
                  to fulfill trades instantly
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Zero Slippage Pricing</h3>
                <p className="text-foreground/70 text-sm">
                  Deterministic execution guarantees rates with no volatility or arbitrage risk.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Validator-Secured</h3>
                <p className="text-foreground/70 text-sm">
                  Transactions are validated by deBridge’s decentralized network of elected validators.
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Wraps. No Custody.</h3>
                <p className="text-foreground/70 text-sm">
                  Unlike most bridges, J1.CCP never relies on wrapped tokens or custodial intermediaries. 
                </p>
              </Card>

              <Card className="p-6 bg-card-gradient hover:scale-105 transition-transform">
                <Network className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">DeFi’s Internet of Liquidity</h3>
                <p className="text-foreground/70 text-sm">
                  Built on deBridge DLN, J1.CCP taps into deep liquidity pools with validator-backed 
                  security and guaranteed rates 
                </p>
              </Card>

             </div>
          </div>
        </section>

        {/* DeBridge Portal Section - Direct Widget Implementation */}
        <section id="bridge" className="py-24 bg-background relative scroll-mt-20">
          {/* Space Background Video */}
          <VideoBackground
            src="/spaceHD"
            fallbackSrc="/space"
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20"
            preload="metadata"
          />

          <div className="w-full px-8 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  J1.CROSS-CHAIN <span className="gradient-text">PORTAL</span>
                </h2>
                <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                  One Portal. Infinite Possibilities. Zero Risk.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                <Card className="p-6 bg-card-gradient border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-8 h-8 text-primary" />
                    <h3 className="text-lg font-semibold">Instant Transfers</h3>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Lightning-fast cross-chain transactions with zero slippage and minimal fees
                  </p>
                </Card>

                <Card className="p-6 bg-card-gradient border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="w-8 h-8 text-accent" />
                    <h3 className="text-lg font-semibold">24+ Networks</h3>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Connect across EVM and non-EVM chains including Solana, Ethereum, and more
                  </p>
                </Card>

                <Card className="p-6 bg-card-gradient border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <h3 className="text-lg font-semibold">Secure & Trusted</h3>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Built on deBridge infrastructure with 25+ security audits
                  </p>
                </Card>
              </div>

            {/* Widget Container - Same as Portal Page */}
            <div id="portal-widget" className="scroll-mt-20">
              <div className="w-full bg-background/50 p-1 rounded-lg border border-border/40 relative min-h-[600px]">
                <div id="debridgeWidget" ref={widgetContainerRef}></div>

                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Built on the deBridge Liquidity Network Protocol</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Experience seamless cross-chain bridging with guaranteed rates and native asset preservation
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-center">
              <p className="text-foreground/60 mb-4">
                Need help? Check our documentation or join our community
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" size="sm" asChild>
                  <a href="https://j1tfyi.gitbook.io/docs/utilities-and-future-plan/j1.crosschain-portal" target="_blank" rel="noopener noreferrer">
                    GitBook
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="https://t.me/j1tfyi" target="_blank" rel="noopener noreferrer">
                    Join Telegram
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Supported Networks Section */}
      <section
        id="supported-networks"
        className="py-24 px-4 bg-background/80 backdrop-blur-md relative overflow-hidden"
      >
        <VideoBackground
          src="/374800567564894209"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-30"
          preload="metadata"
          lazyLoad={true}
        />
        <div className="container mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-center mb-12">
            Supported <span className="gradient-text">Networks</span>
          </h2>

          {/* Network cards grid; adjust md/lg columns as desired */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Abstract */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={abstractLogo} alt="Abstract logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Abstract</h3>
            </Card>
            {/* Arbitrum */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={arbitrumLogo} alt="Arbitrum logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Arbitrum</h3>
            </Card>
            {/* Avalanche */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={avalancheLogo} alt="Avalanche logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Avalanche</h3>
            </Card>
            {/* Base */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={baseLogo} alt="Base logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Base</h3>
            </Card>
            {/* Berachain */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={berachainLogo} alt="Berachain logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Berachain</h3>
            </Card>
            {/* BNB Chain */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={bnbLogo} alt="BNB Chain logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">BNB Chain</h3>
            </Card>
            {/* BOB */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={bobLogo} alt="BOB logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">BOB</h3>
            </Card>
            {/* Ethereum */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={ethereumLogo} alt="Ethereum logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Ethereum</h3>
            </Card>
            {/* Flow */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={flowLogo} alt="Flow logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Flow</h3>
            </Card>
            {/* Gnosis */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={gnosisLogo} alt="Gnosis logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Gnosis</h3>
            </Card>
            {/* HyperEVM */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={hyperevmLogo} alt="HyperEVM logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">HyperEVM</h3>
            </Card>
            {/* Hyperliquid */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={hyperliquidLogo} alt="Hyperliquid logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Hyperliquid</h3>
            </Card>
            {/* Linea */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={lineaLogo} alt="Linea logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Linea</h3>
            </Card>
            {/* Mantle */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={mantleLogo} alt="Mantle logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Mantle</h3>
            </Card>
            {/* Neon */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={neonLogo} alt="Neon logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Neon</h3>
            </Card>
            {/* Optimism */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={optimismLogo} alt="Optimism logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Optimism</h3>
            </Card>
            {/* Polygon */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={polygonLogo} alt="Polygon logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Polygon</h3>
            </Card>
            {/* Sei */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={seiLogo} alt="Sei logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Sei</h3>
            </Card>
            {/* Solana */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={solanaLogo} alt="Solana logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Solana</h3>
            </Card>
            {/* Sonic */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={sonicLogo} alt="Sonic logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Sonic</h3>
            </Card>
            {/* Sophon */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={sophonLogo} alt="Sophon logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Sophon</h3>
            </Card>
            {/* Story */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={storyLogo} alt="Story logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Story</h3>
            </Card>
            {/* Tron */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={tronLogo} alt="Tron logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Tron</h3>
            </Card>
            {/* Zilliqa */}
            <Card className="p-6 flex flex-col items-center bg-black/80 backdrop-blur-sm border border-white/10 hover:scale-105 transition-transform hover:bg-black/90">
              <img src={zilliqqaLogo} alt="Zilliqa logo" className="w-12 h-12 mb-4" />
              <h3 className="text-xl font-semibold text-white">Zilliqa</h3>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-background to-primary/10 relative overflow-hidden">
        <VideoBackground
          src="/374800567564894209"
          className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20"
          preload="metadata"
          lazyLoad={true}
        />
        <div className="w-full px-4 sm:px-6 md:container md:mx-auto text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Experience the{" "}
            <span className="gradient-text block sm:inline">J1.CROSS-CHAIN PORTAL</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-foreground/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join thousands of users already leveraging J1.CCP to swap assets seamlessly across 24+ blockchains with instant, secure, and risk-free cross-chain transfers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button variant="pump" size="lg" className="w-full sm:w-auto" asChild>
              <a href="https://j1t.fyi" target="_blank" rel="noopener noreferrer">
                <span className="hidden sm:inline">Official Sponsor J1T.FYI</span>
                <span className="sm:hidden">J1T.FYI</span>
              </a>
            </Button>
            <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
              <a href="https://x.com/j1tfyi" target="_blank" rel="noopener noreferrer">
                Follow on X
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 backdrop-blur-md bg-background/60 py-6 sm:py-8">
        <div className="w-full px-4 sm:px-6 md:container md:mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="text-base sm:text-lg font-semibold">J1.CCP</span>
            </div>

            <p className="text-xs sm:text-sm text-foreground/60 text-center">
              © 2024 J1.CCP - All Rights Reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="https://j1tfyi.gitbook.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                GitBook
              </a>
              <a
                href="https://github.com/j1tfyi/ccp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://github.com/debridge-finance/debridge-security"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Security Audits
              </a>
              <Link
                to="/terms"
                className="text-sm text-foreground/60 hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
