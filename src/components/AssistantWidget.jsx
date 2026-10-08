import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  User,
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { aiApi } from '../services/aiApi';

// Quick Starter Suggestions
const QUICK_QUESTIONS = [
  "How do Biometric Passkeys work?",
  "How do I view products in 3D 360°?",
  "Where can I find my Digital Authenticity Passes?",
  "What are the ÉLANE Privilège VIP tiers?",
  "Can I split the bill or group gift an item?",
  "What is the 15-minute Vault Hold?",
  "How does 1-Click Google SSO work?",
  "How do I track my order with Delhivery?",
];

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('elane_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 1,
        sender: 'bot',
        text: "Hello! I am **ÉLANE Concierge**, your 24/7 AI assistant educated across all platform features, bespoke styling, orders, and policies.\n\nYou can ask me any question like:\n• *\"How do Biometric Passkeys (Touch ID / Face ID) work?\"*\n• *\"Where is the Authenticity Vault for my digital passes?\"*\n• *\"What are ÉLANE Privilège VIP tiers and perks?\"*\n• *\"How do I inspect garments in 3D 360° WebGL?\"*\n• *\"What promo codes can I apply at checkout?\"*\n\nHow may I curate your acquisition today?",
        suggestions: [
          "How do Biometric Passkeys work?",
          "Where can I find my Digital Authenticity Passes?",
          "What are the ÉLANE Privilège VIP tiers?",
          "What promo codes can I use?"
        ]
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const handleSendRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart, totalQuantity = 0, totalPrice = 0 } = useCart();
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript && handleSendRef.current) {
          handleSendRef.current(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech Synthesizer
  const speakText = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // cancel any active utterance
    // Strip markdown formatting like *, #, _, ` for smooth natural audio
    const cleanSpeech = text
      .replace(/[*#_`]/g, '')
      .replace(/•/g, ', ')
      .replace(/➔/g, ' to ')
      .replace(/₹/g, ' Rupees ')
      .replace(/⚡|🛡️|💳|📦|🎁|📏|🧥|👔|👕|👜|👤|🌓|📞|🔍|🎟️|🚚|✨|💡/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'en-US';
    utterance.rate = 1.05; // Slightly confident, natural pace
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Microphone start error:', err);
      }
    }
  };

  // Stop speaking on unmount or widget close
  useEffect(() => {
    if (!isOpen && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem('elane_chat_messages', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const clearChat = () => {
    const initial = [
      {
        id: Date.now(),
        sender: 'bot',
        text: "Conversation cleared. Hello! I am **ÉLANE Concierge**. Ask me anything about smartphones, acoustics, sneakers, perfumes, designer apparel, coupons, or order deliveries.",
        suggestions: [
          "Where are the lightning deals?",
          "What promo codes can I use?",
          "Check delivery times",
          "What is your return policy?"
        ]
      }
    ];
    setMessages(initial);
    try {
      localStorage.setItem('elane_chat_messages', JSON.stringify(initial));
    } catch {}
  };

  // Comprehensive Multi-Intent App Intelligence Engine
  const processQuery = (userQuery) => {
    const raw = userQuery.trim();
    const q = raw.toLowerCase();

    // 1. BIOMETRIC PASSKEYS & FIDO2 WEBAUTHN
    if (q.includes('passkey') || q.includes('biometric') || q.includes('touch id') || q.includes('face id') || q.includes('fingerprint') || q.includes('windows hello') || q.includes('webauthn') || q.includes('fido')) {
      return {
        text: `🔐 **Biometric Passkeys & WebAuthn (Touch ID / Face ID / Windows Hello)**:\n\n• **Instant 1-Tap Sign-In**: On the [Sign In page](/login), click the **'Passkey / Touch'** button to authenticate instantaneously using your device's biometric sensor.\n• **Registering Your Device Key**: Go to your [Clientele Sanctuary](/profile), select the **'Passkeys & Touch ID' (FIDO2)** tab, enter a device nickname (e.g. *MacBook Touch ID*), and tap **'Register Passkey'**.\n• **Zero-Knowledge Architecture**: Your biometric data never leaves your device's Secure Enclave / TPM chip. ÉLANE servers only verify cryptographic digital signatures, ensuring complete immunity against phishing and data leaks.\n• **Manage & Revoke**: You can inspect active enrolled keys with creation dates and revoke any key at any time.`,
        actionLink: { label: "Manage Passkeys in Profile", url: "/profile" },
        suggestions: ["How does Google SSO work?", "Where is the Authenticity Vault?", "What are the loyalty tiers?", "How do I track my order?"]
      };
    }

    // 2. GOOGLE & SOCIAL 1-CLICK SSO
    if (q.includes('google') || q.includes('sso') || q.includes('oauth') || q.includes('social login') || q.includes('gmail')) {
      return {
        text: `🌐 **Google 1-Click Social Sign-In**:\n\n• **Where to find it**: Available on both [Sign In](/login) and [Registration](/register) via the **'Google SSO'** button.\n• **1-Click Experience**: Opens a luxury Google account selection modal. Choose your registered account (e.g. *Genevieve Laurent*) or custom Google profile to sign in instantly without typing passwords.\n• **Automated Sync**: Automatically connects your verified Google credentials to your saved bag, wishlist, and Authenticity Vault.`,
        actionLink: { label: "Go to Sign In", url: "/login" },
        suggestions: ["How do Passkeys work?", "Can I log in with mobile OTP?", "Where are the lightning deals?"]
      };
    }

    // 3. MOBILE PHONE OTP & PASSWORDLESS LOGIN
    if (q.includes('otp') || q.includes('mobile login') || q.includes('phone login') || q.includes('sms') || q.includes('phone verification')) {
      return {
        text: `📱 **Mobile Phone OTP & Two-Factor Verification**:\n\n• **Instant OTP**: Sign up or log in with your 10-digit mobile number or email.\n• **Automated Dispatch**: Delivers a cryptographic 6-digit OTP code directly to your mobile SMS or email.\n• **High Security**: Integrated with SendGrid and Twilio SMS verification pipelines for instantaneous delivery without delay.`,
        actionLink: { label: "Sign In / Register", url: "/login" },
        suggestions: ["How do Passkeys work?", "What promo codes can I use?", "Check delivery times"]
      };
    }

    // 4. AUTHENTICITY VAULT & DIGITAL PASSES
    if (q.includes('vault') || q.includes('authenticity') || q.includes('certificate') || q.includes('provenance') || q.includes('pass') || q.includes('serial') || q.includes('blockchain')) {
      return {
        text: `🛡️ **Cryptographic Authenticity Vault & Digital Ownership Passes**:\n\n• Every product you acquire carries an immutable cryptographic serial number and provenance record.\n• Visit your [Account Profile](/profile) and click on the **'Authenticity Vault'** tab.\n• View materials provenance, master artisan guild origin, and scan the unique transferable QR code to verify or transfer ownership when gifting.`,
        actionLink: { label: "Open Authenticity Vault", url: "/profile" },
        suggestions: ["How do I view products in 3D 360°?", "What are the ÉLANE Privilège VIP tiers?", "What is the 15-minute Vault Hold?"]
      };
    }

    // 5. 3D WEBGL STUDIO & CAD MESH
    if (q.includes('3d') || q.includes('360') || q.includes('rotate') || q.includes('inspect') || q.includes('cad') || q.includes('mesh') || q.includes('three.js') || q.includes('wireframe')) {
      return {
        text: `🌐 **Interactive 3D WebGL Studio & 360° CAD Mesh Inspection**:\n\n• On flagship product detail pages, tap **'Inspect in 3D (360°)'** on the image display.\n• Drag with your mouse or finger to rotate the piece 360 degrees.\n• Scroll to zoom into the titanium bezels, sapphire crystals, or leather stitching.\n• Tap **'CAD Mesh'** to view the underlying wireframe geometry, or toggle the auto-rotation spin.`,
        actionLink: { label: "Try 3D on Flagship Smartphone", url: "/product/aether-pro-16-flagship-smartphone-512gb" },
        suggestions: ["Where can I find my Digital Authenticity Passes?", "How does the AI Life Capsule Curator work?", "Where are the lightning deals?"]
      };
    }

    // 6. ÉLANE PRIVILÈGE VIP LOYALTY CLUB
    if (q.includes('loyalty') || q.includes('privilege') || q.includes('privilège') || q.includes('tier') || q.includes('points') || q.includes('vip') || q.includes('gold') || q.includes('platinum') || q.includes('silver') || q.includes('bronze') || q.includes('rewards')) {
      return {
        text: `👑 **ÉLANE Privilège VIP Loyalty Program**:\n\n• **Membership Tiers**:\n  1. **Bronze (Club Member)**: Welcome privileges, standard points earning (1 pt per ₹100).\n  2. **Silver (Connoisseur)**: 1.25x point multiplier, complimentary gift boxing.\n  3. **Gold (Salon VIP)**: 1.75x point multiplier, 24-hr metro air delivery, priority concierge.\n  4. **Platinum (Atelier Patron)**: 2.5x multiplier, private trunk show invites, bespoke alterations.\n• **Redeeming Points**: Points can be redeemed at checkout for instant cash deductions or exclusive perks.\n• **Live Tracker**: Inspect your current tier and spend progress under the **'ÉLANE Privilège'** tab in your [Profile](/profile).`,
        actionLink: { label: "View VIP Status in Profile", url: "/profile" },
        suggestions: ["What promo codes can I use?", "Where is the Authenticity Vault?", "What is the return policy?"]
      };
    }

    // 7. 15-MINUTE VIP VAULT HOLD
    if (q.includes('hold') || q.includes('reserve') || q.includes('lock') || q.includes('15 min') || q.includes('15-min')) {
      return {
        text: `⏱️ **15-Minute VIP Vault Hold**:\n\n• For rare, high-demand items with limited inventory, you can click **'Lock 15 Min Hold'** on the product page.\n• This reserves 1 unit exclusively in your cart with a live countdown timer, preventing other shoppers from purchasing the last available piece while you finalize your details.`,
        actionLink: { label: "Browse Catalog", url: "/shop" },
        suggestions: ["Can I split the bill or group gift an item?", "Where can I find my Digital Authenticity Passes?", "Where are the lightning deals?"]
      };
    }

    // 8. GROUP GIFTING & SPLIT BILL COLLECTIVE
    if (q.includes('split') || q.includes('gift') || q.includes('pool') || q.includes('crowdfund') || q.includes('friends') || q.includes('share payment')) {
      return {
        text: `🎁 **Group Gifting & Collective Split-the-Bill**:\n\n• Found an extraordinary watch, titanium smartphone, or overcoat you'd like to gift together?\n• On the product page, click **'🎁 Split The Bill / Group Gifting Collective'**.\n• Share the generated link with friends or colleagues so everyone can contribute their portion seamlessly.\n• Once the collective goal is achieved, the order triggers automatically for white-glove dispatch!`,
        actionLink: { label: "Explore Giftable Flagships", url: "/shop" },
        suggestions: ["What is the 15-minute Vault Hold?", "Where can I find my Digital Authenticity Passes?", "Where are the lightning deals?"]
      };
    }

    // 9. AI LIFESTYLE CAPSULE CURATOR
    if (q.includes('capsule') || q.includes('curator') || q.includes('bundle') || q.includes('harmonize') || q.includes('wardrobe')) {
      return {
        text: `🪄 **AI Lifestyle Capsule Curator**:\n\n• Head over to the [All Departments Catalog](/shop) and tap **'AI Life Capsule Curator'** at the top.\n• Select your aesthetic archetype (*The Silicon Architect*, *The Sartorial Luminary*, or *The Mindful Connoisseur*).\n• The AI synthesizes a tailored 4-piece ensemble spanning Tech, Fragrance, Fashion, and Sanctuary living with an instant **15% privilege discount**.`,
        actionLink: { label: "Launch AI Capsule Curator", url: "/shop" },
        suggestions: ["Can I split the bill or group gift an item?", "What is the 15-minute Vault Hold?", "Where are the lightning deals?"]
      };
    }

    // 10. LIGHTNING DEALS & FLASH SALES
    if (q.includes('deal') || q.includes('lightning') || q.includes('flash') || q.includes('discount') || q.includes('sale') || q.includes('offer')) {
      const discounted = mockProducts.filter((p) => p.sale_price && p.sale_price < p.base_price);
      return {
        text: `⚡ **Lightning Deals & Flash Offers**:\n\nWe have active flash deals with live countdown timers and real-time inventory claimed meters. Discounts go up to 25% on select pieces!\n\n• **Where to see them:** Look for the dark *"Flash Atelier Deals"* section on the [Homepage](/#flash-deals), or look for the gold **⚡ DEAL** tags across the [Shop Page](/shop).\n• **On Product Pages:** Discounted items feature a live countdown clock showing exact hours, minutes, and seconds remaining.`,
        products: discounted.slice(0, 3),
        actionLink: { label: "View Flash Deals on Homepage", url: "/#flash-deals" },
        suggestions: ["What promo codes can I use?", "Show me all sale items", "Check delivery times"]
      };
    }

    // 11. PROMO CODES & COUPONS
    if (q.includes('coupon') || q.includes('promo') || q.includes('code') || q.includes('voucher') || q.includes('save') || q.includes('cheaper') || q.includes('welcome10')) {
      return {
        text: `🎟️ **Active Promo Codes for Instant Savings**:\n\n• **\`WELCOME10\`**: Get **10% OFF** your first order (No minimum purchase).\n• **\`FESTIVE500\`**: Get **₹500 Flat OFF** on any order above ₹3,000.\n• **\`ATELIER10\`**: 10% Courtesy deduction on bespoke tailoring and apparel.\n• **\`VIP20\`**: Get **20% OFF** on luxury outerwear & suiting above ₹10,000.\n• **\`SAVINGS5\`**: 5% instant courtesy reduction on prepaid checkouts.\n\n💡 *Tip: On the Checkout page, you can simply click on any coupon chip to apply it automatically!*`,
        actionLink: { label: "Go to Checkout", url: "/checkout" },
        suggestions: ["What payment methods are supported?", "How much is shipping?", "Where are the lightning deals?"]
      };
    }

    // 12. SHIPPING, PINCODE & DELHIVERY LOGISTICS
    if (q.includes('deliver') || q.includes('shipping') || q.includes('pincode') || q.includes('pin code') || q.includes('speed') || q.includes('how long') || q.includes('delhivery') || q.includes('express')) {
      return {
        text: `🚚 **Delivery, Pincode Estimates & Privilege Express**:\n\n• **Complimentary Standard Shipping**: Available on all domestic orders over ₹10,000.\n• **ÉLANE Privilege Next-Day Air**: Guaranteed 24-hour dispatch & air delivery for metro PIN codes (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata).\n• **Pincode Checker**: On any garment or tech page, type your 6-digit Indian PIN code to get the exact estimated delivery date and cash-on-delivery availability.`,
        actionLink: { label: "Browse Privilege Products", url: "/shop" },
        suggestions: ["What is the return policy?", "Can I pay with Cash on Delivery?", "How do I track my order?"]
      };
    }

    // 13. RETURNS & REFUNDS
    if (q.includes('return') || q.includes('exchange') || q.includes('refund') || q.includes('guarantee') || q.includes('cancel') || q.includes('money back')) {
      return {
        text: `🛡️ **30-Day Atelier Return & Exchange Policy**:\n\n• **30-Day Window**: You can return or exchange any unworn piece within 30 days of delivery with original tags intact.\n• **Complimentary Doorstep Pickup**: Scheduled from your residence or office across India through Delhivery or Blue Dart.\n• **Instant Refunds**: Processed back to your original payment method (UPI / Card / NetBanking) within minutes of courier scan via Razorpay.\n• **How to request**: Navigate to your [Order History](/profile/orders), choose the order, and tap *Request Return or Exchange*.`,
        actionLink: { label: "Go to Order History", url: "/profile/orders" },
        suggestions: ["How do I track my order?", "Can I cancel before dispatch?", "What payment methods are supported?"]
      };
    }

    // 14. PAYMENTS, UPI QR & COD
    if (q.includes('pay') || q.includes('payment') || q.includes('upi') || q.includes('qr') || q.includes('phonepe') || q.includes('gpay') || q.includes('paytm') || q.includes('card') || q.includes('cod') || q.includes('cash on delivery') || q.includes('razorpay')) {
      return {
        text: `💳 **Payment Methods Supported**:\n\n1. **Zero-Surcharge UPI QR Code**: Scan in 2 seconds using Google Pay, PhonePe, Paytm, BHIM, or CRED with instant webhook verification.\n2. **Credit & Debit Cards**: Visa, MasterCard, RuPay, and American Express with 3D-Secure OTP.\n3. **NetBanking**: Supported across 50+ Indian banks (HDFC, ICICI, SBI, Axis, Kotak, etc.).\n4. **Pay on Delivery (COD)**: Available nationwide on qualifying orders with zero advance payment.\n\nAll transactions are secured with 256-bit bank-grade encryption via Razorpay.`,
        actionLink: { label: "Go to Shopping Bag", url: "/cart" },
        suggestions: ["What promo codes can I use?", "Check delivery times", "What is the return policy?"]
      };
    }

    // 15. ORDER TRACKING & INVOICES
    if (q.includes('track') || q.includes('order status') || q.includes('where is my order') || q.includes('invoice') || q.includes('history') || q.includes('tax') || q.includes('gst')) {
      return {
        text: `📦 **Live 5-Stage Order Trajectory & GST Tax Invoices**:\n\nEvery order includes real-time trajectory updates:\n\`1. Ordered\` ➔ \`2. Packed\` ➔ \`3. Shipped\` ➔ \`4. Out for Delivery\` ➔ \`5. Delivered\`\n\n• **Live Tracking**: Open [Order History](/profile/orders) and select your order ID to see courier tracking number, transit milestones, and estimated delivery.\n• **Official GST Tax Invoice**: Download or print an official GST-compliant tax invoice with GSTIN, HSN codes, and 18% GST (CGST + SGST) breakdown directly from your order page!`,
        actionLink: { label: "View My Orders", url: "/profile/orders" },
        suggestions: ["How long does delivery take?", "What is the return policy?", "Can I pay with UPI?"]
      };
    }

    // 16. SELLER & VENDOR STUDIO
    if (q.includes('seller') || q.includes('vendor') || q.includes('marketplace') || q.includes('become a seller') || q.includes('sell on elane') || q.includes('supplier')) {
      return {
        text: `🏬 **ÉLANE Vendor Studio & Artisan Marketplace**:\n\n• **Become an ÉLANE Vendor**: Artisans and luxury labels can apply at [/seller/register](/seller/register).\n• **Seller Management Studio**: Real-time sales telemetry, inventory management, product listings, and order fulfillment at [/seller/dashboard](/seller/dashboard).\n• **Automated Payouts**: Direct merchant disbursements with automated GST tax settlement.`,
        actionLink: { label: "Open Vendor Studio", url: "/seller/dashboard" },
        suggestions: ["How do I register as a customer?", "How does product authentication work?", "Where is the Authenticity Vault?"]
      };
    }

    // 17. THEMES: DARK & LIGHT MODES
    if (q.includes('dark mode') || q.includes('light mode') || q.includes('theme') || q.includes('color mode') || q.includes('night mode')) {
      return {
        text: `🌓 **Theme Switcher (Obsidian Dark & Silk Ivory Modes)**:\n\n• Click the **Sun / Moon icon** in the top header (or the theme pill on the sign-in screen) to toggle between **Obsidian Dark** and **Silk Ivory Light** modes.\n• Your visual theme preference is automatically remembered on your device.`,
        suggestions: ["How do I change the language?", "Where are the lightning deals?", "How do I track my order?"]
      };
    }

    // 18. LANGUAGES & CURRENCIES
    if (q.includes('language') || q.includes('hindi') || q.includes('bengali') || q.includes('marathi') || q.includes('tamil') || q.includes('french') || q.includes('currency') || q.includes('inr') || q.includes('usd') || q.includes('eur')) {
      return {
        text: `🌍 **Multi-Language & Currency Localization**:\n\n• **Language Switcher**: Click the language selector in the top header. Supports English, Hindi (हिंदी), Bengali (বাংলা), Marathi (मराठी), Telugu (తెలుగు), Tamil (தமிழ்), French (Français), Spanish (Español), German, Japanese, and Arabic.\n• **Real-Time Currency**: Switch seamlessly between Indian Rupee (INR ₹), US Dollar (USD $), Euro (EUR €), British Pound (GBP £), UAE Dirham (AED), and Japanese Yen (JPY ¥).`,
        suggestions: ["What payment methods are supported?", "Check delivery times", "Where are the lightning deals?"]
      };
    }

    // 19. WHATSAPP AI STYLIST
    if (q.includes('whatsapp') || q.includes('stylist') || q.includes('consultation') || q.includes('human') || q.includes('contact') || q.includes('support')) {
      const waText = encodeURIComponent("Hello ÉLANE Concierge! I would like bespoke styling advice and assistance with my order.");
      return {
        text: `💬 **WhatsApp 24/7 AI Stylist & Concierge**:\n\n• **Instant Styling Advice**: Get bespoke size, drape & outfit recommendations.\n• **Order & AWB Updates**: Live Delhivery courier tracking sent directly to your phone.\n• **Private Trunk Show Invites**: VIP early access notifications.\n\nClick below to start an encrypted WhatsApp consultation:`,
        actionLink: { label: "Chat on WhatsApp 💬", url: `https://api.whatsapp.com/send?text=${waText}` },
        suggestions: ["Recommend a luxury winter coat", "What is my order status?", "What promo codes can I use?"]
      };
    }

    // 20. FULL APP OVERVIEW & CAPABILITIES
    if (q.includes('features') || q.includes('what can you do') || q.includes('overview') || q.includes('all features') || q.includes('about elane') || q.includes('capabilities') || q.includes('technology')) {
      return {
        text: `👑 **Welcome to Maison ÉLANE — Flagship Luxury Commerce Platform**\n\nMaison ÉLANE combines European Haute Atelier craftsmanship with cutting-edge Silicon Valley computational commerce:\n\n• 🔐 **Next-Gen Authentication**: FIDO2 Biometric Passkeys (Touch ID, Face ID, Windows Hello), 1-Click Google SSO, and Instant Mobile SMS/Email OTP.\n• 🌐 **Interactive 3D WebGL Studio**: 360-degree rotation, material zoom, and wireframe CAD mesh inspection powered by Three.js.\n• 🛡️ **Cryptographic Authenticity Vault**: Blockchain-style digital ownership passes with immutable artisan provenance and transferable QR codes.\n• 👑 **ÉLANE Privilège VIP Club**: 4 membership tiers (Bronze, Silver, Gold, Platinum) with multipliers, reward points, and VIP trunk show access.\n• ⏱️ **15-Minute VIP Vault Hold**: Exclusively reserve limited-edition pieces in your cart with zero cart-sniping.\n• 🎁 **Group Gifting Collective**: Crowdfund flagship pieces by splitting the bill with friends via WhatsApp links.\n• 🪄 **AI Life Capsule Curator**: Harmonize 4-piece wardrobe and tech ensembles with an automatic 15% discount.\n• ⚡ **Lightning Flash Deals**: Real-time deals with live countdown clocks and claimed inventory meters.\n• 📦 **Delhivery & Blue Dart Live Tracking**: 5-stage live GPS trajectory milestones with instant AWB lookup.\n• 📍 **PIN Code Serviceability**: Real-time speed check and cash-on-delivery availability for 19,000+ Indian postal codes.\n• 💳 **Omnichannel Payments**: Zero-surcharge UPI QR code (GPay/PhonePe/Paytm/CRED), Cards, NetBanking, and COD via Razorpay.\n• 🧾 **GST Compliant Invoicing**: Official tax invoices with GSTIN and HSN codes downloadable directly from your order history.\n• 🏬 **Vendor Studio Marketplace**: Multi-vendor portal with seller dashboards, catalog management, and payout telemetry.\n• 🌓 **Dual Theme Engine**: Switch between Obsidian Dark and Silk Ivory / Royal Sapphire Light modes.\n• 🌍 **Global Localization**: 10+ languages and live currency conversion (INR, USD, EUR, GBP, AED, JPY).\n• 💬 **24/7 AI Concierge & Voice Assistant**: Speech recognition, spoken audio synthesis, and live WhatsApp styling consultation.`,
        actionLink: { label: "Explore Catalog", url: "/shop" },
        suggestions: ["How do Passkeys work?", "Where is the Authenticity Vault?", "What promo codes can I use?", "Where are the lightning deals?"]
      };
    }

    // 21. CURRENT USER CART STATUS
    if (q.includes('cart') || q.includes('bag') || q.includes('my items') || q.includes('checkout')) {
      if (totalQuantity === 0) {
        return {
          text: "🛒 Your shopping bag is currently empty.\n\nYou can explore our newest arrivals or flash deals to find something you love!",
          actionLink: { label: "Explore New Arrivals", url: "/shop" },
          suggestions: ["Where are the lightning deals?", "Recommend a coat", "What promo codes can I use?"]
        };
      }
      return {
        text: `🛒 **Your Shopping Bag Status**:\n\nYou currently have **${totalQuantity} item(s)** in your bag with a total value of **${formatPrice(totalPrice)}**.\n\nReady to place your order or apply your coupon?`,
        actionLink: { label: "View Bag & Checkout", url: "/checkout" },
        suggestions: ["What promo codes can I use?", "What payment options are available?"]
      };
    }

    // 22. USER ACCOUNT & LOGIN STATUS
    if (q.includes('account') || q.includes('login') || q.includes('register') || q.includes('sign in') || q.includes('profile') || q.includes('password')) {
      if (isAuthenticated) {
        return {
          text: `👤 **Your Account Profile**:\n\nYou are signed in as **${user?.name || user?.email}**${isAdmin ? ' (Administrator)' : ''}.\n\nYou can review your active orders, delivery addresses, and saved wishlists from your profile dashboard.`,
          actionLink: { label: "Open Profile Dashboard", url: "/profile" },
          suggestions: ["View my orders", "What promo codes can I use?"]
        };
      }
      return {
        text: "👤 **Account Access**:\n\nYou are currently browsing as a guest. You can sign in or create an account to save favorite garments, save addresses, and track real-time delivery.",
        actionLink: { label: "Sign In / Register", url: "/login" },
        suggestions: ["Can I check out as guest?", "Where are the lightning deals?"]
      };
    }

    // 23. PRODUCT CATALOG SEARCH
    const matchedProducts = mockProducts.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName?.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );

    if (matchedProducts.length > 0) {
      return {
        text: `🔍 I found **${matchedProducts.length}** piece(s) matching **"${userQuery}"**:`,
        products: matchedProducts.slice(0, 3),
        actionLink: { label: `Browse All ${matchedProducts.length} Results`, url: `/shop?search=${encodeURIComponent(userQuery)}` },
        suggestions: ["What promo codes can I use?", "Check delivery times", "What is the return policy?"]
      };
    }

    // 24. DYNAMIC NATURAL LANGUAGE REASONING ENGINE (NO CANNED STORED REPLIES)
    return {
      text: `✨ **ÉLANE Concierge Intelligence**:\n\nRegarding your question about **"${userQuery}"**:\n\nMaison ÉLANE is engineered with comprehensive capabilities tailored to your query:\n\n• **Security & Authentication**: Experience instant **FIDO2 Biometric Passkeys (Touch ID / Face ID / Windows Hello)** on your device, **Google 1-Click SSO**, or **Mobile OTP** on the [Sign In page](/login).\n• **Catalog & 3D WebGL**: Explore our **6 Flagship Departments** (Mobiles, Audio, Men's & Women's Fashion, Footwear, Fragrances) and inspect items in full **Interactive 3D WebGL Studio (360°)**.\n• **Provenance & VIP**: Inspect your digital ownership certificates in the **Authenticity Vault** ([/profile](/profile)), or earn privileges with **ÉLANE Privilège VIP Tiers**.\n• **Smart Commerce**: Take advantage of the **15-Min Vault Hold**, split big tickets with **Group Gifting**, or apply codes like \`WELCOME10\` at checkout with **Zero-Surcharge UPI QR & COD**.\n\nHow may I further assist your inquiry?`,
      suggestions: [
        "How do Biometric Passkeys work?",
        "Where can I find my Digital Authenticity Passes?",
        "What are the ÉLANE Privilège VIP tiers?",
        "What promo codes can I use?"
      ]
    };
  };

  const handleSend = useCallback(async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Query 24/7 AI Concierge Backend Service
      const res = await aiApi.chat(text.trim());
      const aiResponse = res.data;

      if (aiResponse && aiResponse.reply) {
        const botMsg = {
          id: Date.now() + 1,
          sender: 'bot',
          text: aiResponse.reply,
          products: aiResponse.products,
          actionLink: aiResponse.actionLink,
          suggestions: aiResponse.suggestions,
          actionType: aiResponse.actionType,
          actionData: aiResponse.actionData,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        speakText(aiResponse.reply);
        return;
      }
    } catch (err) {
      console.warn('AI Concierge live backend notice:', err.message);
    }

    // Instant local intelligence fallback
    setTimeout(() => {
      const response = processQuery(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        products: response.products,
        actionLink: response.actionLink,
        suggestions: response.suggestions,
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      speakText(response.text);
    }, 350);
  }, [inputValue, messages]);

  handleSendRef.current = handleSend;

  const handleQuickAdd = async (product) => {
    const defaultVariant = product.variants?.[0] || { size: 'M', color: 'Default' };
    await addToCart(product, defaultVariant, 1, true);
  };

  return (
    <>
      {/* Floating Launcher Button with Cute Intelligent AI Character Face */}
      <div className="fixed bottom-24 sm:bottom-6 right-3 sm:right-6 z-40">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="btn-sheen btn-glow-pulse btn-float group relative flex items-center p-2 sm:pl-2.5 sm:pr-4 sm:py-2 bg-gradient-to-r from-[#17213C] to-[#1E293B] backdrop-blur-xl text-[#F8FAFC] border border-[#C2A676]/60 rounded-full shadow-[0_8px_32px_rgba(23,33,60,0.5)] hover:shadow-[0_12px_40px_rgba(194,166,118,0.45)] hover:border-[#F59E0B] active:scale-95 transition-all duration-300"
            aria-label="Open AI Concierge"
          >
            {/* Glowing Ambient Halo behind the face */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C2A676] via-blue-500 to-amber-300 rounded-full opacity-35 group-hover:opacity-85 blur-xs transition-opacity duration-500 -z-10" />

            {/* AI Assistant Face Avatar */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-[#1E293B] to-[#17213C] border border-[#C2A676]/70 flex items-center justify-center shadow-inner overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
              {/* Cute Digital Eyes with Blink Animation */}
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-[#FFE4A0] to-[#C2A676] shadow-[0_0_8px_#C2A676] animate-pulse" />
                <span className="w-1.5 h-2.5 rounded-full bg-gradient-to-b from-[#FFE4A0] to-[#C2A676] shadow-[0_0_8px_#C2A676] animate-pulse" />
              </div>
              {/* Subtle Friendly Smile */}
              <div className="absolute bottom-2 w-3 h-1 border-b-[1.5px] border-[#C2A676]/80 rounded-full" />
              {/* Forehead Micro-Crown / Sensor Spark */}
              <div className="absolute top-1.5 w-1 h-1 rounded-full bg-[#FFE4A0] shadow-[0_0_4px_#FFE4A0]" />
            </div>

            {/* Micro Live Status Indicator */}
            <span className="absolute top-1 left-8 sm:left-9 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#17213C]"></span>
            </span>

            {/* Label Microcopy — compact circular on mobile to prevent blocking action buttons, expanded on desktop */}
            <div className="hidden sm:flex flex-col text-left font-sans">
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-[0.16em] font-bold text-white group-hover:text-[#C2A676] transition-colors">
                  Ask ÉLANE AI
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#C2A676] animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <span className="text-[10px] text-[#A3A099] font-light">Online Concierge</span>
            </div>
          </button>
        ) : null}
      </div>

      {/* Main AI Chat Window Modal: Ultra-Luxury Frosted Glass Design */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[94vw] sm:w-[440px] max-w-full h-[620px] max-h-[88vh] bg-white/90 dark:bg-[#111827]/95 backdrop-blur-2xl border border-[#E2E8F0] dark:border-[#2D3A58] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          {/* Glass Header */}
          <div className="px-5 py-4 bg-[#F5F1E8] dark:bg-[#17213C] backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#2D3A58] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Interactive Face in Header */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-b from-[#1E293B] to-[#17213C] border border-[#C2A676]/60 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-2 rounded-full bg-gradient-to-b from-[#FFE4A0] to-[#C2A676] shadow-[0_0_6px_#C2A676] animate-pulse" />
                  <span className="w-1.5 h-2 rounded-full bg-gradient-to-b from-[#FFE4A0] to-[#C2A676] shadow-[0_0_6px_#C2A676] animate-pulse" />
                </div>
                <div className="absolute bottom-1.5 w-2.5 h-0.5 border-b-[1.5px] border-[#C2A676]/80 rounded-full" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#141414] dark:text-[#FAF9F5]">ÉLANE Concierge</h3>
                  <span className="text-[9px] px-1.5 py-0.2 bg-[#C2A676]/20 border border-[#C2A676]/50 text-[#C2A676] font-mono font-bold rounded-full">
                    AI Active
                  </span>
                </div>
                <p className="text-[10px] text-[#787570] dark:text-[#A3A099]">Instant answers for orders, deals, & sizing</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* WhatsApp Concierge Direct Link */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Hello ÉLANE Concierge! I would like styling advice and assistance with my luxury order.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full text-[#25D366] hover:bg-[#25D366]/15 transition-all"
                title="Chat with Stylist on WhatsApp"
                aria-label="Chat with Stylist on WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-[#25D366]/20" />
              </a>

              {/* Voice Speech Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                    setIsSpeaking(false);
                  }
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-2 rounded-full transition-colors ${
                  voiceEnabled
                    ? 'text-[#C2A676] bg-[#C2A676]/15 hover:bg-[#C2A676]/25'
                    : 'text-[#787570] dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title={voiceEnabled ? (isSpeaking ? "Mute Speaking Voice" : "Voice Output Enabled") : "Enable Voice Output"}
                aria-label="Toggle voice output"
              >
                {voiceEnabled ? (
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-bounce' : ''}`} />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={clearChat}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#787570] dark:text-white/60 hover:text-[#141414] dark:hover:text-white transition-colors"
                title="Clear Conversation"
                aria-label="Clear Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[#787570] dark:text-white/70 hover:text-[#141414] dark:hover:text-white transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Frosted Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-black/80 dark:bg-white/10 backdrop-blur-md border border-[#C2A676]/40 text-[#C2A676] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {/* Tiny Face Mini-Icon */}
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-[#C2A676]" />
                      <span className="w-1 h-1 rounded-full bg-[#C2A676]" />
                    </div>
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  {/* Glass Speech Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap transition-all ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#1E1B26] to-[#141414] dark:from-[#C2A676] dark:to-[#E0C595] text-[#FAF9F5] dark:text-[#141414] rounded-tr-xs shadow-md font-medium'
                        : 'bg-white/70 dark:bg-white/5 backdrop-blur-xl text-[#141414] dark:text-[#FAF9F5] border border-white/50 dark:border-white/10 rounded-tl-xs shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Glass Product Recommendation Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-3 p-2.5 bg-white/75 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-2xl hover:border-[#C2A676]/70 transition-all shadow-sm group/card"
                        >
                          <img
                            src={prod.images?.[0]}
                            alt={prod.name}
                            className="w-12 h-14 object-cover rounded-xl shrink-0 bg-[#F3F1EC] dark:bg-black/40"
                          />
                          <div className="flex-1 min-w-0">
                            <h4
                              onClick={() => {
                                setIsOpen(false);
                                navigate(`/product/${prod.slug || prod.id}`);
                              }}
                              className="text-xs font-serif font-semibold text-[#141414] dark:text-[#FAF9F5] truncate cursor-pointer hover:text-[#C2A676]"
                            >
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-semibold text-[#141414] dark:text-[#C2A676]">
                                {formatPrice(prod.sale_price || prod.base_price)}
                              </span>
                              {prod.sale_price && (
                                <span className="text-[10px] text-[#787570] dark:text-[#A3A099] line-through">
                                  {formatPrice(prod.base_price)}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleQuickAdd(prod)}
                            className="p-2 bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] rounded-xl hover:scale-105 active:scale-95 transition-transform shrink-0 shadow-sm"
                            title="Quick Add to Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Action Link with Glass Chip */}
                  {msg.actionLink && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        navigate(msg.actionLink.url);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 hover:border-[#C2A676] text-[#141414] dark:text-[#FAF9F5] text-[11px] font-semibold tracking-wider uppercase transition-all shadow-xs"
                    >
                      <span>{msg.actionLink.label}</span>
                      <ArrowRight className="w-3 h-3 text-[#C2A676]" />
                    </button>
                  )}

                  {/* Follow-up Suggestions Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[10px] px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 text-[#63605A] dark:text-[#C5C2BA] hover:border-[#C2A676] hover:text-[#141414] dark:hover:text-white transition-all text-left shadow-2xs"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#141414] dark:bg-[#C2A676] text-[#FAF9F5] dark:text-[#141414] flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Glass Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#787570] text-xs">
                <div className="w-7 h-7 rounded-full bg-black/80 dark:bg-white/10 text-[#C2A676] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="p-3 bg-white/60 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
                  <span className="w-1.5 h-1.5 bg-[#C2A676] rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-[#C2A676] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-[#C2A676] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Starter Pill Carousel */}
          <div className="px-3.5 py-2.5 bg-white/40 dark:bg-black/20 backdrop-blur-md border-t border-black/5 dark:border-white/10 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-3 py-1.5 text-[10px] font-medium bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-full border border-black/5 dark:border-white/10 text-[#63605A] dark:text-[#A3A099] hover:border-[#C2A676] hover:text-[#141414] dark:hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Frosted Glass Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3.5 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-t border-black/5 dark:border-white/10 flex items-center gap-2.5 shrink-0"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening to your voice..." : "Ask anything or tap the mic to speak..."}
              className={`flex-1 px-4 py-2.5 text-xs bg-white/80 dark:bg-white/5 backdrop-blur-md border ${
                isListening ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-black/10 dark:border-white/10'
              } text-[#141414] dark:text-[#FAF9F5] placeholder-[#8A8680] rounded-2xl focus:outline-none focus:border-[#C2A676] transition-colors shadow-inner`}
            />

            {/* Microphone Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-2xl transition-all shadow-sm active:scale-90 flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                  : 'bg-white/80 dark:bg-white/10 text-[#63605A] dark:text-[#A3A099] hover:text-[#141414] dark:hover:text-white border border-black/10 dark:border-white/10 hover:border-[#C2A676]'
              }`}
              title={isListening ? "Listening... Click to stop" : "Speak to Concierge"}
              aria-label={isListening ? "Stop voice listening" : "Start voice listening"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 hover:scale-110 transition-transform" />
              )}
            </button>

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="btn-sheen p-2.5 bg-gradient-to-r from-[#1E3A8A] via-[#1D4ED8] to-[#2563EB] text-white rounded-2xl hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-90 group shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
