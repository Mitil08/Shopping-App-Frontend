import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  Sparkles,
  User,
  Zap,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  MapPin,
  Tag,
  CreditCard,
  Gift,
  HelpCircle,
  Truck,
  CheckCircle2,
  Trash2,
  Info,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  PhoneCall
} from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// Quick Starter Suggestions
const QUICK_QUESTIONS = [
  "How do I view products in 3D 360°?",
  "Where can I find my Digital Authenticity Passes?",
  "How does the AI Life Capsule Curator work?",
  "Can I split the bill or group gift an item?",
  "What is the 15-minute Vault Hold?",
  "Chat with Stylist on WhatsApp",
  "How do I track my order?",
  "Where are the lightning deals?",
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
        text: "Hello! I am **ÉLANE Concierge**, your AI assistant for anything regarding our store, products, orders, and policies.\n\nYou can ask me any question like:\n• *\"Where are today's lightning deals?\"*\n• *\"What promo codes can I apply?\"*\n• *\"How do I track my order or request a return?\"*\n• *\"Recommend a tailored suit or coat for men/women\"*\n• *\"Is delivery available to my PIN code?\"*\n\nHow can I help you today?",
        suggestions: [
          "Where are the lightning deals?",
          "What promo codes can I use?",
          "How do I track my order?",
          "What is the return policy?"
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
  const navigate = useNavigate();
  const { addToCart, totalQuantity, totalPrice } = useCart();
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
        if (transcript) {
          handleSend(transcript);
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

    // 1. GREETINGS & INTRO
    if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'help'].includes(q)) {
      return {
        text: "✨ Welcome to **ÉLANE Flagship Superstore**! I am your 24/7 AI Concierge.\n\nI can assist you with:\n• 🌐 **3D WebGL Product Inspector**: 360° rotation and wireframe materials inspection\n• 🔒 **Cryptographic Authenticity Vault**: Blockchain ledger passes & transferable digital ownership in your profile\n• 🪄 **AI Life Capsule Builder**: Generate synchronized 4-piece bundles across Tech, Perfume, Fashion & Living\n• 🎁 **Group Gifting & Split Bill**: Crowdfund flagship pieces with friends\n• ⏱️ **15-Min Vault Hold**: Lock limited stock items exclusively",
        suggestions: ["How do I view products in 3D 360°?", "Where can I find my Digital Authenticity Passes?", "How does the AI Life Capsule Curator work?", "Where are the lightning deals?"]
      };
    }

    // 1B. 3D WEBGL PRODUCT INSPECTION
    if (q.includes('3d') || q.includes('360') || q.includes('rotate') || q.includes('inspect')) {
      return {
        text: "🌐 **Interactive 3D WebGL Studio Inspector**:\n\n• On any product detail page, tap **'Inspect in 3D (360°)'** on the image display.\n• Drag with your mouse or finger to rotate the piece 360 degrees.\n• Scroll to zoom into the titanium bezels, sapphire crystals, or leather stitching.\n• Tap **'CAD Mesh'** to view the underlying wireframe geometry, or toggle the auto-rotation spin.",
        actionLink: { label: "Try 3D on Flagship Smartphone", url: "/product/aether-pro-16-flagship-smartphone-512gb" },
        suggestions: ["Where can I find my Digital Authenticity Passes?", "How does the AI Life Capsule Curator work?", "Where are the lightning deals?"]
      };
    }

    // 1C. AUTHENTICITY VAULT & DIGITAL PASSES
    if (q.includes('vault') || q.includes('authenticity') || q.includes('certificate') || q.includes('provenance') || q.includes('pass') || q.includes('serial')) {
      return {
        text: "🔒 **ÉLANE Authenticity Vault & Digital Passes**:\n\n• Every product you acquire carries an immutable cryptographic serial number and provenance record.\n• Visit your [Account Profile](/profile) and click on the **Authenticity Vault** tab.\n• View materials provenance, master artisan guild details, and scan the unique transferable QR code to verify or transfer ownership.",
        actionLink: { label: "Open Authenticity Vault", url: "/profile" },
        suggestions: ["How does the AI Life Capsule Curator work?", "How do I view products in 3D 360°?", "What is the 15-minute Vault Hold?"]
      };
    }

    // 1D. AI LIFE CAPSULE CURATOR
    if (q.includes('capsule') || q.includes('curator') || q.includes('bundle') || q.includes('harmonize')) {
      return {
        text: "🪄 **AI Lifestyle Capsule Curator**:\n\n• Head over to the [All Departments Catalog](/shop) and tap **'AI Life Capsule Curator'** at the top.\n• Select your aesthetic archetype (*The Silicon Architect*, *The Sartorial Luminary*, or *The Mindful Connoisseur*).\n• The AI synthesizes a tailored 4-piece ensemble spanning Tech, Fragrance, Fashion, and Sanctuary living with an instant **15% privilege discount**.",
        actionLink: { label: "Launch AI Capsule Curator", url: "/shop" },
        suggestions: ["Can I split the bill or group gift an item?", "What is the 15-minute Vault Hold?", "Where are the lightning deals?"]
      };
    }

    // 1E. GROUP GIFTING & SPLIT BILL
    if (q.includes('split') || q.includes('gift') || q.includes('pool') || q.includes('crowdfund') || q.includes('friends')) {
      return {
        text: "🎁 **Group Gifting & Collective Split-the-Bill**:\n\n• Found an extraordinary watch, titanium smartphone, or overcoat you'd like to gift together?\n• On the product page, click **'🎁 Split The Bill / Group Gifting Collective'**.\n• Share the generated link with friends or colleagues so everyone can contribute their portion seamlessly.",
        actionLink: { label: "Explore Giftable Flagships", url: "/shop" },
        suggestions: ["What is the 15-minute Vault Hold?", "Where can I find my Digital Authenticity Passes?", "Where are the lightning deals?"]
      };
    }

    // 1F. VAULT HOLD RESERVATION
    if (q.includes('hold') || q.includes('reserve') || q.includes('lock') || q.includes('15 min')) {
      return {
        text: "⏱️ **15-Minute VIP Vault Hold**:\n\n• For rare, high-demand items with limited inventory, you can click **'Lock 15 Min Hold'** on the product page.\n• This reserves 1 unit exclusively in your cart with a live countdown timer, preventing other shoppers from purchasing the last available piece while you finalize your details.",
        actionLink: { label: "Browse Catalog", url: "/shop" },
        suggestions: ["How do I view products in 3D 360°?", "Can I split the bill or group gift an item?", "Where are the lightning deals?"]
      };
    }

    // 2. LIGHTNING DEALS & FLASH SALES & DISCOUNTS
    if (q.includes('deal') || q.includes('lightning') || q.includes('flash') || q.includes('discount') || q.includes('sale') || q.includes('offer')) {
      const discounted = mockProducts.filter((p) => p.sale_price && p.sale_price < p.base_price);
      return {
        text: `⚡ **Lightning Deals & Flash Offers**\n\nWe have active flash deals with live countdown timers and real-time inventory claimed meters. Discounts go up to 25% on select pieces!\n\n• **Where to see them:** Look for the dark *\"Flash Atelier Deals\"* section on the [Homepage](/#flash-deals), or look for the gold **⚡ DEAL** tags across the [Shop Page](/shop).\n• **On Product Pages:** Discounted items feature a live countdown clock showing exact hours, minutes, and seconds remaining.`,
        products: discounted.slice(0, 3),
        actionLink: { label: "View Flash Deals on Homepage", url: "/#flash-deals" },
        suggestions: ["What promo codes can I use?", "Show me all sale items", "Check delivery times"]
      };
    }

    // 3. COUPONS & PROMO CODES
    if (q.includes('coupon') || q.includes('promo') || q.includes('code') || q.includes('voucher') || q.includes('save') || q.includes('cheaper')) {
      return {
        text: "🎟️ **Active Promo Codes for Instant Savings**:\n\n• **`WELCOME10`**: Get **10% OFF** your first order (No minimum purchase).\n• **`FESTIVE500`**: Get **₹500 Flat OFF** on any order above ₹3,000.\n• **`VIP20`**: Get **20% OFF** on luxury outerwear & suiting above ₹10,000.\n\n💡 *Tip: On the Checkout page, you can simply click on any coupon chip to apply it automatically!*",
        actionLink: { label: "Go to Checkout", url: "/checkout" },
        suggestions: ["What payment methods are supported?", "How much is shipping?", "Where are the lightning deals?"]
      };
    }

    // 4. SHIPPING, TRANSIT, PINCODE, PRIVILEGE NEXT-DAY
    if (q.includes('deliver') || q.includes('shipping') || q.includes('pincode') || q.includes('pin code') || q.includes('pincode check') || q.includes('speed') || q.includes('how long') || q.includes('privilege') || q.includes('express')) {
      return {
        text: "🚚 **Delivery, Pincode Estimates & Privilege Express**:\n\n• **Complimentary Standard Shipping**: Available on all domestic orders over ₹10,000.\n• **ÉLANE Privilege Next-Day Air**: Guaranteed 24-hour dispatch & air delivery for metro PIN codes (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata).\n• **Pincode Checker**: On any garment page, type your 6-digit Indian PIN code to get the exact estimated delivery date and cash-on-delivery availability.",
        actionLink: { label: "Browse Privilege Products", url: "/shop" },
        suggestions: ["What is the return policy?", "Can I pay with Cash on Delivery?", "How do I track my order?"]
      };
    }

    // 5. RETURNS, EXCHANGES & REFUND POLICY
    if (q.includes('return') || q.includes('exchange') || q.includes('refund') || q.includes('guarantee') || q.includes('cancel') || q.includes('money back')) {
      return {
        text: "🛡️ **30-Day Atelier Return & Exchange Policy**:\n\n• **30-Day Window**: You can return or exchange any unworn piece within 30 days of delivery with original tags intact.\n• **Complimentary Doorstep Pickup**: Scheduled from your residence or office across India through Blue Dart or Delhivery.\n• **Instant Refunds**: Processed back to your original payment method (UPI / Card / NetBanking) or issued as instant store credit within 24 hours of inspection.\n• **How to request**: Navigate to your [Order History](/profile/orders), choose the order, and tap *Request Return or Exchange*.",
        actionLink: { label: "Go to Order History", url: "/profile/orders" },
        suggestions: ["How do I track my order?", "Can I cancel before dispatch?", "What payment methods are supported?"]
      };
    }

    // 6. PAYMENT METHODS, UPI QR & COD
    if (q.includes('pay') || q.includes('payment') || q.includes('upi') || q.includes('qr') || q.includes('phonepe') || q.includes('gpay') || q.includes('paytm') || q.includes('card') || q.includes('cod') || q.includes('cash on delivery') || q.includes('razorpay')) {
      return {
        text: "💳 **Payment Methods Supported**:\n\n1. **Zero-Surcharge UPI QR Code**: Scan in 2 seconds using Google Pay, PhonePe, Paytm, BHIM, or CRED with instant webhook verification.\n2. **Credit & Debit Cards**: Visa, MasterCard, RuPay, and American Express.\n3. **NetBanking**: Supported across 50+ Indian banks (HDFC, ICICI, SBI, Axis, Kotak, etc.).\n4. **Pay on Delivery (COD)**: Available nationwide on qualifying orders with zero advance payment.\n\nAll transactions are secured with 256-bit bank-grade encryption.",
        actionLink: { label: "Go to Shopping Bag", url: "/cart" },
        suggestions: ["What promo codes can I use?", "Check delivery times", "What is the return policy?"]
      };
    }

    // 7. ORDER TRACKING & FULFILLMENT TRAJECTORY
    if (q.includes('track') || q.includes('order status') || q.includes('where is my order') || q.includes('invoice') || q.includes('history')) {
      return {
        text: "📦 **Live 5-Stage Order Trajectory & Invoices**:\n\nEvery order includes real-time trajectory updates:\n`1. Ordered` ➔ `2. Packed` ➔ `3. Shipped` ➔ `4. Out for Delivery` ➔ `5. Delivered`\n\n• **Live Tracking**: Open [Order History](/profile/orders) and select your order ID to see courier tracking number, transit milestones, and estimated delivery.\n• **Official GST Tax Invoice**: You can download or print an official GST-compliant tax invoice with GSTIN, HSN codes, and 18% GST (CGST + SGST) breakdown directly from your order page!",
        actionLink: { label: "View My Orders", url: "/profile/orders" },
        suggestions: ["How long does delivery take?", "What is the return policy?", "Can I pay with UPI?"]
      };
    }

    // 8. GIFT WRAPPING & CUSTOM MESSAGES
    if (q.includes('gift') || q.includes('wrap') || q.includes('packaging') || q.includes('box') || q.includes('message')) {
      return {
        text: "🎁 **Luxury Keepsake Gift Wrapping**:\n\n• **Atelier Gift Box**: Hand-crafted debossed keepsake box tied with double-faced satin ribbon (+₹250).\n• **Personalized Message**: At checkout, toggle *\"Add Luxury Gift Box & Custom Message\"* to write a 200-character custom note that will be hand-printed on luxury cotton cardstock.\n• **Price Concealment**: Commercial invoices are automatically omitted from gift shipments upon request.",
        actionLink: { label: "Proceed to Checkout", url: "/checkout" },
        suggestions: ["What promo codes can I use?", "Check delivery times"]
      };
    }

    // 9. SIZING, FIT & REVIEWS
    if (q.includes('size') || q.includes('fit') || q.includes('chart') || q.includes('measurement') || q.includes('small') || q.includes('large') || q.includes('review')) {
      return {
        text: "📏 **Sizing & Customer Fit Insights**:\n\n• **True to Size**: Our garments are tailored to European standards with a modern, relaxed drape.\n• **Customer Reviews**: Each garment page has verified customer reviews with a live **Fit Assessment** indicator (*Runs small / True to size / Runs large*).\n• **Variants Available**: Sizes XS through XL and 28 through 36 across our categories.\n• **Complimentary Size Exchange**: If the fit isn't perfect, exchanges for another size are 100% free with doorstep courier pickup.",
        actionLink: { label: "Browse Catalog", url: "/shop" },
        suggestions: ["What is the return policy?", "Recommend a tailored jacket", "Where are the lightning deals?"]
      };
    }

    // 10. PRODUCT RECOMMENDATIONS: COATS / OUTERWEAR
    if (q.includes('coat') || q.includes('outerwear') || q.includes('jacket') || q.includes('trench') || q.includes('winter') || q.includes('cashmere')) {
      const coats = mockProducts.filter((p) => p.category_id === 'cat-outerwear' || p.category_id === 'cat-knitwear');
      return {
        text: "🧥 **Top Outerwear & Knitwear Recommendations**:\n\nCrafted from 100% Grade-A Mongolian cashmere, double-faced virgin wool, and weatherproof gabardine. Here are our premier pieces:",
        products: coats.slice(0, 3),
        actionLink: { label: "Explore Outerwear Vault", url: "/shop?category=cat-outerwear" },
        suggestions: ["Are these pieces true to size?", "Check delivery to my pincode", "What promo codes can I use?"]
      };
    }

    // 11. PRODUCT RECOMMENDATIONS: SUITING & FORMAL
    if (q.includes('suit') || q.includes('tailor') || q.includes('formal') || q.includes('blazer') || q.includes('trouser') || q.includes('pant')) {
      const suits = mockProducts.filter((p) => p.category_id === 'cat-tailoring' || p.category_id === 'cat-trousers');
      return {
        text: "👔 **Tailoring & Suiting Collection**:\n\nStructured silhouettes cut from high-twist Portuguese virgin wool, crease-resistant tropical wool, and relaxed pleats. Recommended picks:",
        products: suits.slice(0, 3),
        actionLink: { label: "Browse Suiting Atelier", url: "/shop?category=cat-tailoring" },
        suggestions: ["What fabric is used?", "How do I find my size?", "Can I pay on delivery?"]
      };
    }

    // 12. PRODUCT RECOMMENDATIONS: SHIRTS & TOPS
    if (q.includes('shirt') || q.includes('top') || q.includes('t-shirt') || q.includes('poplin') || q.includes('cotton')) {
      const shirts = mockProducts.filter((p) => p.category_id === 'cat-shirts');
      return {
        text: "👕 **Shirts & Studio Tops**:\n\nCut from crisp high-thread Italian poplin and GOTS-certified organic cotton with mother-of-pearl buttons. Here are popular studio essentials:",
        products: shirts.slice(0, 3),
        actionLink: { label: "Browse Shirts & Tops", url: "/shop?category=cat-shirts" },
        suggestions: ["Is there a deal on shirts?", "Check delivery times"]
      };
    }

    // 13. PRODUCT RECOMMENDATIONS: LEATHER & ACCESSORIES
    if (q.includes('bag') || q.includes('leather') || q.includes('tote') || q.includes('accessory') || q.includes('accessories') || q.includes('wallet')) {
      const accessories = mockProducts.filter((p) => p.category_id === 'cat-accessories');
      return {
        text: "👜 **Leather Goods & Artisanal Accessories**:\n\nHandcrafted in Florence from 100% full-grain, vegetable-tanned Tuscan leather designed to develop a rich patina over time:",
        products: accessories.slice(0, 3),
        actionLink: { label: "Browse Leather Accessories", url: "/shop?category=cat-accessories" },
        suggestions: ["What is the return policy?", "Can I get this gift-wrapped?"]
      };
    }

    // 14. CURRENT USER CART STATUS
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

    // 15. USER ACCOUNT & LOGIN STATUS
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

    // 16. THEME: DARK & LIGHT MODE
    if (q.includes('dark mode') || q.includes('light mode') || q.includes('theme') || q.includes('color mode') || q.includes('night mode')) {
      return {
        text: "🌓 **Dark & Light Mode Switcher**:\n\nÉLANE features a built-in editorial theme switcher:\n• Click the **Sun / Moon icon** in the top right navbar to toggle between **Obsidian Dark** and **Editorial Light** modes.\n• Your theme preference is automatically remembered on your device.",
        suggestions: ["Where are the lightning deals?", "How do I track my order?"]
      };
    }

    // 17. WHATSAPP AI STYLIST & DISPATCH SUPPORT
    if (q.includes('whatsapp') || q.includes('chat on whatsapp') || q.includes('stylist on whatsapp') || q.includes('wa')) {
      const waText = encodeURIComponent("Hello ÉLANE Concierge! I would like styling advice and assistance with my luxury order.");
      return {
        text: "💬 **ÉLANE WhatsApp AI Stylist Concierge**:\n\nYou can chat directly with our bespoke styling team & receive dispatch updates straight to your WhatsApp!\n\n• **Instant Styling Advice**: Get bespoke size, drape & outfit recommendations.\n• **Order & AWB Updates**: Live courier tracking sent directly to your phone.\n• **Private Trunk Show Invites**: VIP early access notifications.\n\nClick below to start an encrypted WhatsApp consultation:",
        actionLink: {
          label: "Open WhatsApp Concierge 💬",
          url: `https://api.whatsapp.com/send?text=${waText}`
        },
        suggestions: ["Recommend a luxury winter coat", "What is my order status?", "What promo codes can I use?"]
      };
    }

    // 18. CONTACT & HUMAN CUSTOMER CARE
    if (q.includes('contact') || q.includes('support') || q.includes('phone') || q.includes('email') || q.includes('human') || q.includes('call') || q.includes('help desk')) {
      const waText = encodeURIComponent("Hello ÉLANE Concierge! I need assistance with my order.");
      return {
        text: "📞 **Clientele Concierge Support**:\n\n• **WhatsApp Direct**: Available 24/7 for instant styling & order inquiries\n• **Email**: concierge@elane-studio.com\n• **Hours**: Monday – Saturday, 9:00 AM – 8:00 PM IST\n• **Studio**: ÉLANE Design Studio, Mumbai & Biella\n• **Instant Assistance**: Ask me anything right here or connect via WhatsApp!",
        actionLink: { label: "Chat on WhatsApp 💬", url: `https://api.whatsapp.com/send?text=${waText}` },
        suggestions: ["Chat on WhatsApp", "What is the return policy?", "How do I track my order?"]
      };
    }

    // 18. GENERAL SEARCH MATCHING IN CATALOG
    const matchedProducts = mockProducts.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.material?.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );

    if (matchedProducts.length > 0) {
      return {
        text: `🔍 I found **${matchedProducts.length}** garment(s) related to **"${userQuery}"**:`,
        products: matchedProducts.slice(0, 3),
        actionLink: { label: `Browse All ${matchedProducts.length} Results`, url: `/shop?search=${encodeURIComponent(userQuery)}` },
        suggestions: ["What promo codes can I use?", "Check delivery times", "What is the return policy?"]
      };
    }

    // 19. INTELLIGENT COMPREHENSIVE FALLBACK
    return {
      text: `I'm happy to help with that! Here is a quick guide to what you can do on the ÉLANE app:\n\n• **Explore Flash Deals**: Visit the [Homepage](/#flash-deals) for limited-time offers with live countdown clocks.\n• **Save with Coupons**: Use code \`WELCOME10\` (10% off) or \`FESTIVE500\` (₹500 off) at checkout.\n• **Fast Dispatch**: Complimentary shipping over ₹10,000 & 24-hr metro delivery.\n• **Hassle-Free Returns**: 30-day window with complimentary doorstep pickup.\n• **Payments**: UPI QR code, Cards, NetBanking, and Cash on Delivery.\n\nCould you clarify what you'd like to know more about?`,
      suggestions: [
        "Where are the lightning deals?",
        "What promo codes can I use?",
        "What is the return policy?",
        "How do I track my order?"
      ]
    };
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Realistic responsive AI thinking time
    setTimeout(() => {
      const response = processQuery(text);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: response.text,
        products: response.products,
        actionLink: response.actionLink,
        suggestions: response.suggestions
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      speakText(response.text);
    }, 450);
  };

  const handleQuickAdd = async (product) => {
    const defaultVariant = product.variants?.[0] || { size: 'M', color: 'Default' };
    await addToCart(product, defaultVariant, 1, true);
  };

  return (
    <>
      {/* Floating Launcher Button with Cute Intelligent AI Character Face */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="btn-sheen btn-glow-pulse btn-float group relative flex items-center gap-3 pl-2.5 pr-4 py-2 bg-gradient-to-r from-[#17213C] to-[#1E293B] backdrop-blur-xl text-[#F8FAFC] border border-[#C2A676]/60 rounded-full shadow-[0_8px_32px_rgba(23,33,60,0.5)] hover:shadow-[0_12px_40px_rgba(194,166,118,0.45)] hover:border-[#F59E0B] active:scale-95 transition-all duration-300"
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
            <span className="absolute top-1 left-9 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border border-[#17213C]"></span>
            </span>

            {/* Label Microcopy */}
            <div className="flex flex-col text-left font-sans">
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
