import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { J1ComboLogo } from "../components/J1ComboLogo";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky-header fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <J1ComboLogo className="h-14 sm:h-16" />
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/portal" className="text-sm hover:text-primary transition-colors">
                Portal
              </Link>
            </nav>
            <Button variant="hero" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Terms Content */}
      <main className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">J1.CROSS-CHAIN PORTAL TERMS OF SERVICE</h1>

        <p className="text-lg mb-8"><strong>Last Updated: September 18, 2025</strong></p>

        <p className="mb-6">
          These terms of service (these "<strong>Terms</strong>") are between you (also referred to herein as "<strong>user</strong>", "<strong>you</strong>" and "<strong>your</strong>") and J1T.FYI Operations ("<strong>J1.CCP</strong>", "<strong>J1.CROSS-CHAIN PORTAL</strong>", "<strong>we</strong>", "<strong>us</strong>" and "<strong>our</strong>"). These Terms govern your use of the services provided by J1.CROSS-CHAIN PORTAL described below (the "<strong>Services</strong>"). By accessing the Services made available on https://ccp.j1t.fyi/ (the "<strong>Portal</strong>") you agree that you have read, understand, and accept all of the terms of service contained in these Terms.
        </p>

        <p className="mb-8">
          We may make changes to these Terms from time to time. If we do this, we will post the revised Terms on the Portal and will indicate at the top of this page the date the Terms were last revised. You understand and agree that your continued use of the Service or the Portal after we have made any such changes constitutes your acceptance of the new Terms.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">1. INTRODUCTION</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">1.1. Eligibility</h3>
        <p className="mb-6">
          To be eligible to use the Portal you must be at least eighteen (18) years of age or older. The Portal, interface and Services (as defined below) are strictly NOT offered to persons or entities who reside in, are citizens of, are incorporated in, or have a registered office in any Restricted Territory, as defined below (any such person or entity from a Restricted Territory shall be a "<strong>Restricted Person</strong>"). If you are a Restricted Person, then do not attempt to access or use the Portal. Use of a virtual private network (e.g., a VPN) or other means by Restricted Persons to access or use the Portal, interface or Services is prohibited.
        </p>

        <p className="mb-8">
          For the purpose of these Terms, <strong>Restricted Territory</strong> shall mean the United States of America, the People's Republic of China, Myanmar (Burma), Cote D'Ivoire (Ivory Coast), Cuba, Crimea and Sevastopol, Democratic Republic of Congo, Iran, Iraq, Libya, Mali, Nicaragua, Democratic People's Republic of Korea (North Korea), Somalia, Sudan, Syria, Yemen, Zimbabwe, or any other state, country or region that is subject to sanctions enforced by the United States, the United Kingdom or the European Union.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">1.2. Terms of Service</h3>
        <p className="mb-8">
          We reserve the right to disable access to the Portal interface at any time in the event of any breach of the Terms, including without limitation, if we, in our sole discretion, believe that you, at any time, fail to satisfy the eligibility requirements set forth in the Terms. Further, we reserve the right to limit or restrict access to the Portal interface by any person or entity, or within any geographic area or legal jurisdiction, at any time and at our sole discretion. We will not be liable to you for any losses or damages you may suffer as a result of or in connection with the Portal interface being inaccessible to you at any time or for any reason.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">1.3. Interface</h3>
        <p className="mb-8">
          The interface hosted on the Portal provides a visual representation of the available Services and enables access to the J1.CROSS-CHAIN PORTAL protocol, which is built on the deBridge Liquidity Network (DLN) infrastructure. In order to utilize the interface on the Portal, you are required to link/connect your digital wallet on supported bridge extensions or via a digital wallet service (such as MetaMask, Phantom, or other supported wallets) which allows you to purchase, store, and engage in transactions relating to digital assets. You are solely responsible for adhering to all laws and regulations applicable to you and your use or access to the Portal and interface thereon. Your use of the Portal is prohibited by and otherwise violates or facilitates the violation of any applicable laws or regulations, or contributes to or facilitates any illegal activity. We make no representations or warranties that the information, products, or services provided through the Portal are appropriate for access or use in other jurisdictions. We reserve the right to limit the availability of our Portal to any person, geographic area, or jurisdiction, at any time and at our sole and absolute discretion.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">1.4. Access</h3>
        <p className="mb-8">
          You agree and understand that you are not allowed to enter any restricted area of any computer or network of J1.CCP under any circumstances, or perform any functions that are not authorized by these Terms.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">2. THE SERVICE</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.1. J1.CROSS-CHAIN PORTAL Protocol</h3>
        <p className="mb-6">
          J1.CROSS-CHAIN PORTAL (J1.CCP) is a cross-chain bridging interface built on the deBridge Liquidity Network (DLN) protocol, operating across 24+ supported blockchain networks (including but not limited to Ethereum, Solana, Binance Smart Chain, Polygon, Arbitrum, Optimism, Base, Tron, and others), utilizing the DLN smart contracts which enable users to perform instant, zero-slippage cross-chain swaps with native asset preservation. The protocol operates through a three-stage atomic swap mechanism: (1) Order Creation - where tokens are locked on the source chain, (2) Solver Fulfillment - where independent solvers deliver the requested tokens on the destination chain, and (3) Cross-Chain Confirmation - where the original tokens are released to the solver upon verification. All swaps are executed at deterministic prices without wrapped tokens or custodial intermediaries.
        </p>

        <p className="mb-8">
          The infrastructure utilizes the deBridge validator network, where elected validators are responsible for the validation of all cross-chain transactions. The protocol ensures atomic security through smart contract verification, with all transfers being native and verified on-chain without the creation of synthetic or wrapped assets.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.2. Non-custodial Nature of Smart Contracts</h3>
        <p className="mb-8">
          When you access certain features of the Services, the user interface will allow you to access non-custodial smart contracts to perform a variety of transactions. In particular, you confirm that all actions and functions performed via the J1.CCP smart contracts are irrevocable. However, you remain in full control of your original assets, which are not held or controlled in any way by J1.CCP. J1.CCP does not collect or hold your keys or information - accordingly, if you lose control over these assets, J1.CCP cannot access your original assets; recover keys, passwords, or other information; reset passwords; or reverse transactions. You are solely responsible for the safety of your digital assets and your use of the Services, including without limitation for storing, backing up, and maintaining the confidentiality of your private keys, passwords, and information, and for the security of any transactions you perform using the Portal. You expressly relieve and release J1.CCP from any and all liability and/or loss arising from your use of the Services.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.3. J1T Token Integration</h3>
        <p className="mb-8">
          The J1.CROSS-CHAIN PORTAL integrates with the J1T ecosystem token. The J1T token serves as a utility token within the broader J1T.FYI ecosystem. All fees collected through the Portal contribute to the J1T ecosystem development and liquidity provision. The use of J1T tokens in conjunction with the Portal services may provide certain benefits or fee reductions as determined by the protocol governance.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.4. Service Fees</h3>
        <p className="mb-6">
          The protocol charges a service fee for each transfer performed through J1.CROSS-CHAIN PORTAL. The fee structure consists of:
        </p>

        <p className="mb-4">
          (a) <strong>Network Fee</strong> – A fixed amount in the base asset of the source blockchain to cover validator and solver costs for transaction execution on the destination chain.
        </p>

        <p className="mb-6">
          (b) <strong>Service Fee</strong> – A percentage fee (typically 0.1% or as displayed in the interface) of the bridged amount. All collected fees contribute to the J1T ecosystem treasury and liquidity provisions.
        </p>

        <p className="mb-8">
          Prior to executing any transaction, the Portal will display an estimate of all applicable fees. Your acceptance of these Terms constitutes acceptance of our fee structure. We reserve the right to adjust fees based on network conditions and market dynamics. Any changes to fees will be reflected in the Portal interface. You agree that by using J1.CCP following any fee adjustments, you accept the new fee structure.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.5. Not an Offering of Banking, Trust, Custodial, Escrow, Securities or Commodities</h3>
        <p className="mb-8">
          You understand and affirm that J1.CROSS-CHAIN PORTAL is a non-custodial provider of technical smart-contract bridging services which allow users to manage their own digital asset transfers across blockchains. The content of the Portal and the Services do not constitute any banking business, trust business, custodial business, escrow business, any offer to buy or sell, or a solicitation of an offer to buy or sell investments, securities, partnership interests, commodities or any other financial instruments in any jurisdiction. The content of the Portal and the Services also do not constitute, and may not be used for or in connection with, an offer or solicitation by anyone in any state or jurisdiction in which such an offer or solicitation is not authorized or permitted, or to any person to whom it is unlawful to make such offer or solicitation.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.6. No Advice</h3>
        <p className="mb-8">
          J1.CCP makes no representation or warranty, express or implied, to the extent not prohibited by applicable law, regarding the advisability of participating in digital assets on any blockchain, any financial products, securities, funds, commodity interests, partnership interests or other investments or funding or purchasing loans. J1.CCP is merely a technology service provider allowing you to perform cross-chain transfers of your own digital assets and does not offer fiduciary services, and is not your agent, trustee, advisor or fiduciary.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">2.7. Taxes</h3>
        <p className="mb-8">
          It is your sole responsibility to determine whether, and to what extent, any taxes apply to any transactions performed through the Services, and to withhold, collect, report and remit the correct amount of tax to the appropriate tax authorities.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">3. RISK FACTORS</h2>

        <p className="mb-8">
          You acknowledge and agree that the Services are currently operational but subject to various risks with utilizing the Services. In the worst scenario, this could lead to the loss of all or part of your digital assets associated with the Services. <strong>IF YOU DECIDE TO UTILIZE THE SERVICES YOU EXPRESSLY ACKNOWLEDGE, ACCEPT AND ASSUME THE BELOW RISKS AND AGREE NOT TO HOLD J1.CCP OR ANY OF THEIR RELATED PARTIES RESPONSIBLE FOR THE FOLLOWING RISKS:</strong>
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.1. Third-party Risk</h3>
        <p className="mb-8">
          The Services rely in whole or in part on third-party software including the deBridge DLN protocol and the continued development and support of third parties. There is no assurance or guarantee that those third parties will maintain their support of their software, which might have a material adverse effect on the Services. Protocol failures, validator issues, or solver liquidity constraints could result in transaction delays or failures.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.2. No Insurance</h3>
        <p className="mb-8">
          Digital assets are not legal tender, are not backed by any government, and are not subject to Deposit Insurance Scheme or protections under any banking or securities laws. J1.CCP is not a bank and does not offer fiduciary services, nor does it offer any security broking services.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.3. Technical Risk</h3>
        <p className="mb-8">
          The underlying DLN protocol and smart contracts are complex systems. While extensively audited, the software could have bugs or security vulnerabilities. Further, the software is continuously evolving and may undergo significant changes over time.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.4. Blockchain Risk</h3>
        <p className="mb-8">
          The underlying smart contracts run on various supported blockchain networks. Accordingly, upgrades to blockchain networks, hard forks, reorganizations, or changes in consensus mechanisms may have unintended, adverse effects on the smart contracts, including the J1.CCP services.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.5. Information Security Risk</h3>
        <p className="mb-8">
          Digital assets and use of the Services may be subject to expropriation and/or theft. Hackers or other malicious groups may attempt to interfere with the Services in various ways, including but not limited to, malware attacks, denial of service attacks, consensus-based attacks, Sybil attacks, smurfing and spoofing. Furthermore, there may be bugs or weaknesses in the underlying software that could negatively affect the Services or result in the loss of user assets.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.6. Regulatory Risks</h3>
        <p className="mb-8">
          The regulatory status of digital assets and distributed ledger technology is unclear or unsettled in many jurisdictions. Regulatory actions could negatively impact J1.CCP in various ways, and thus the Services may not be available in certain areas.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.7. Taxation Risk</h3>
        <p className="mb-8">
          The tax characterization of digital assets and cross-chain transfers is uncertain. You must seek your own tax advice in connection with the Services provided by J1.CCP, which may result in adverse tax consequences.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">3.8. Additional Conditions of Usage</h3>
        <p className="mb-6">Your usage of the Portal and Services is subject to the following additional conditions:</p>

        <p className="mb-4">(a) <strong>Unlawful Activity</strong>: You agree not to engage in any activity that violates any law, statute, ordinance, regulation, or sanctions program, including but not limited to OFAC sanctions.</p>

        <p className="mb-4">(b) <strong>Abusive Activity</strong>: You agree not to engage in any activity that poses a threat to J1.CCP or the Portal, including distributing harmful code or unauthorized access attempts.</p>

        <p className="mb-4">(c) <strong>Inappropriate Behavior</strong>: You agree not to interfere with other users' access to or use of the Services.</p>

        <p className="mb-4">(d) <strong>Fraud</strong>: You agree not to engage in any activity which operates to defraud J1.CCP, other users, or any other person.</p>

        <p className="mb-8">(e) <strong>Gambling</strong>: You agree not to utilize the Services to engage in any lottery, bidding fee auctions, contests, sweepstakes, or other games of chance.</p>

        <h2 className="text-3xl font-bold mt-12 mb-6">4. WEBSITE AVAILABILITY AND ACCURACY</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">4.1. Access and Availability</h3>
        <p className="mb-8">
          Access to the Services may become degraded or unavailable during times of significant volatility or volume. This could result in the inability to interact with the protocol for periods of time. Although we strive to provide excellent service, we do not guarantee that the Portal or Services will be available without interruption.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">4.2. Portal Accuracy</h3>
        <p className="mb-8">
          Although we intend to provide accurate and timely information on the Portal, the Portal may not always be entirely accurate, complete or current and may include technical inaccuracies or typographical errors. Information may be changed or updated from time to time without notice. You should verify all information before relying on it, and all decisions based on information contained on the Portal are your sole responsibility.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">5. CONSENT TO ELECTRONIC DISCLOSURES AND SIGNATURES</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">5.1. General</h3>
        <p className="mb-8">
          Because J1.CCP operates only online, it is necessary for you to consent to transact business with us electronically. By agreeing to these Terms, you agree to receive electronically all documents, communications, notices, contracts, and agreements arising from or relating to your use of the Portal and Service.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">5.2. Communications</h3>
        <p className="mb-8">
          By accepting these Terms, you expressly consent to be contacted by us, our agents, representatives, affiliates, or anyone calling on our behalf for any and all purposes, at any email address you provide. Communications from J1.CCP will be provided electronically through the Portal or via email.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">5.3. Scope of Consent</h3>
        <p className="mb-8">
          Your consent to receive disclosures and transact business electronically applies to any transactions to which such disclosures relate. Your consent will remain in effect for so long as you are a user.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">5.4. Withdrawing Consent</h3>
        <p className="mb-8">
          You may withdraw your consent to receive agreements or disclosures electronically by contacting us at support@j1t.fyi. However, once you have withdrawn consent you will not be able to access the Services.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">6. INTELLECTUAL PROPERTY</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">6.1. Open Source Components</h3>
        <p className="mb-8">
          The underlying deBridge DLN protocol smart contracts are subject to their respective licenses. J1.CCP interface and additional components are proprietary to J1T.FYI Operations.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">6.2. Limited License</h3>
        <p className="mb-8">
          All content on the Portal, including but not limited to designs, text, graphics, pictures, video, information, software, and other files (the "<strong>Content</strong>"), are the proprietary property of J1.CCP with all rights reserved. No Content may be modified, copied, distributed, framed, reproduced, republished, downloaded, displayed, posted, transmitted, or sold in any form or by any means without J1.CCP's prior written permission. You are granted a limited license to access and use the Portal solely for your use in connection with the Services.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">6.3. Trademarks</h3>
        <p className="mb-8">
          J1.CCP, J1.CROSS-CHAIN PORTAL, J1T.FYI and associated graphics, logos, and service names are trademarks of J1T.FYI Operations. These trademarks may not be used without prior written permission.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">7. DATA PROTECTION AND SECURITY</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">7.1. Loss or Compromise</h3>
        <p className="mb-8">
          Any loss or compromise of your electronic device or security details may result in unauthorized access to your digital assets by third parties and the loss or theft of such assets.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">7.2. Shared Access</h3>
        <p className="mb-8">
          You should never allow remote access or share your computer screen with someone else when accessing the J1.CCP protocol. J1.CCP will never ask you for your private keys, passwords, or seed phrases.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">7.3. Personal Data</h3>
        <p className="mb-8">
          We may process personal data in relation to you in accordance with our Privacy Policy available at https://ccp.j1t.fyi/privacy.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">7.4. Safety and Security</h3>
        <p className="mb-8">
          J1.CCP is not liable for any damage or interruptions caused by computer viruses, phishing, spoofing or other attacks. We advise using reputable security software.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">8. USER FEEDBACK, QUERIES, COMPLAINTS, DISPUTES</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.1. Contact J1.CCP</h3>
        <p className="mb-8">
          If you have feedback or questions, please contact us at support@j1t.fyi. When contacting us, please provide your transaction details and any relevant information.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.2. Dispute Resolution</h3>

        <p className="mb-6">
          <strong>PLEASE READ THIS SECTION CAREFULLY AS IT AFFECTS YOUR LEGAL RIGHTS.</strong>
        </p>

        <p className="mb-6">
          Each party waives all rights to have disputes arising from these Terms resolved in court and agrees to binding arbitration. Disputes shall be resolved solely through individual arbitration, not class arbitration or class actions.
        </p>

        <p className="mb-6">
          Any Dispute arising out of these Terms shall be resolved by arbitration administered in accordance with applicable arbitration rules. The place of arbitration shall be determined by mutual agreement. The language of arbitration shall be English.
        </p>

        <p className="mb-8">
          Each party will notify the other party in writing of any Dispute within thirty (30) days. Notice to J1.CCP shall be sent to support@j1t.fyi. If the parties cannot resolve the Dispute within thirty (30) days, either party may commence arbitration proceedings.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.3. Disclaimers</h3>
        <p className="mb-8">
          THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTY, EITHER EXPRESS OR IMPLIED. J1.CCP DISCLAIMS ALL WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT OR TITLE.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.4. Availability</h3>
        <p className="mb-8">
          The Portal and Services may be temporarily unavailable for maintenance or other reasons. J1.CCP assumes no responsibility for any interruption, delay, or technical issues.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.5. Limitation on Liability</h3>
        <p className="mb-8">
          <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, J1.CCP SHALL NOT BE LIABLE FOR ANY INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR DATA. J1.CCP'S TOTAL LIABILITY SHALL NOT EXCEED $1,000 OR THE FEES PAID BY YOU, WHICHEVER IS GREATER.</strong>
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.6. Governing Law</h3>
        <p className="mb-8">
          These Terms shall be governed by the laws of the Republic of Panama, without regard to conflict of law principles.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">8.7. Indemnity</h3>
        <p className="mb-8">
          You agree to indemnify and hold J1.CCP, its affiliates, and their respective directors, officers, employees and agents harmless from any claims, losses, or damages arising from your use of the Services or breach of these Terms.
        </p>

        <h2 className="text-3xl font-bold mt-12 mb-6">9. GENERAL PROVISIONS</h2>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.1. Amendments</h3>
        <p className="mb-8">
          We may amend these Terms by posting revised Terms on the Portal. Continued use of the Services constitutes acceptance of the revised Terms.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.2. Force Majeure</h3>
        <p className="mb-8">
          J1.CCP shall not be liable for delays or failures resulting from causes beyond our reasonable control.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.3. Links to Third-Party Sites</h3>
        <p className="mb-8">
          The Portal may contain links to third-party websites. We are not responsible for third-party content and you access such sites at your own risk.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.4. Assignment</h3>
        <p className="mb-8">
          You may not transfer your rights under these Terms. We may assign our rights without restriction.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.5. No Waiver</h3>
        <p className="mb-8">
          Failure to enforce any provision shall not constitute a waiver of that provision.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.6. Relationship of Parties</h3>
        <p className="mb-8">
          Nothing in these Terms creates a partnership, employment, joint venture, or agency relationship between you and J1.CCP.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.7. Notices</h3>
        <p className="mb-8">
          To contact us under these Terms, email support@j1t.fyi.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.8. Entire Agreement</h3>
        <p className="mb-8">
          These Terms and our Privacy Policy constitute the entire agreement between you and J1.CCP regarding the Services.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.9. Severability</h3>
        <p className="mb-8">
          If any provision is invalid or unenforceable, the remaining provisions shall continue in effect.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.10. Survival</h3>
        <p className="mb-8">
          Provisions relating to intellectual property, disclaimers, limitation of liability, indemnity, and dispute resolution shall survive termination.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">9.11. English Language</h3>
        <p className="mb-8">
          These Terms are provided in English. In case of any translation, the English version shall prevail.
        </p>

        <hr className="my-12 border-border/40" />

        <p className="text-lg font-semibold mb-4">
          <strong>By using the J1.CROSS-CHAIN PORTAL, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</strong>
        </p>

        <p className="text-xl font-bold text-primary">
          J1.CCP - One Portal. Infinite Possibilities. Zero Risk.
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 backdrop-blur-md bg-background/60 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-foreground/60">
              © 2024 J1.CCP - All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}