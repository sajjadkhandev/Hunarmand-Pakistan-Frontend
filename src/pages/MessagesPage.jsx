import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  User,
  Phone,
  Search,
  Check,
  CheckCheck,
  Clock,
  Briefcase,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Plus,
  RotateCcw,
  Sparkles,
  Calendar,
  ShieldCheck,
  Volume2,
  VolumeX,
  Zap,
  Star,
  MapPin,
  Filter,
  Users,
  Menu,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchMyConversations,
  fetchMessages,
  sendMessage as apiSendMessage,
  markMessagesAsRead,
  getSocket,
} from '../services/chatService';
import { fallbackWorkers } from '../data/fallbackWorkers';

// Audio chime using Web Audio API for message alert
const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  } catch (e) {
    // Audio restricted or uninitialized, fail silently
  }
};

// Intelligent context-aware auto reply generator tailored to the specific technician
const generateWorkerReply = (text, worker) => {
  const lower = (text || '').toLowerCase().trim();
  const workerName = worker?.name || 'Ustad Ji';
  const workerCity = worker?.city || 'Aapke ilaqay';
  const skill = worker?.skillTitle || 'Hunar';
  const price = worker?.startingPrice || 500;
  const phone = worker?.phone || '0300-1234567';

  // 1. Greetings
  if (/\b(salam|slaam|aoa|hi|hello|hey|kese|kaise|kya hal|hal chal|kheriyat)\b/.test(lower)) {
    const greetings = [
      `Walaikum Assalam Janab! Main ${workerName} (${skill}) bol raha hoon. Hunarmand Pakistan par rabta karne ka shukriya! Batayein kis kaam mein madad darkaar hai?`,
      `Walaikum Assalam bhai! Kheriyat se hain? Main ${workerCity} mein bilkul available hoon aapka kaam dekhne ke liye. Masla tafseel se bataiye?`,
      `Assalam-o-Alaikum Janab! Alhamdulillah. Farmayein, konsi service chahiye aapko?`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  // 2. Pricing / Charges / Rates / Cost
  if (/\b(rate|rates|charge|charges|pese|pesay|rupay|rupees|kitna|kitnay|cost|price|fee|fees|kharcha|paisa|budget)\b/.test(lower)) {
    return `Janab hamari starting visit & checking fee Rs. ${price} hai. Mukammal kaam dekh kar bilkul munasib aur genuine rate tay ho jaye ga. Kaam ki mukammal tasalli aur guarantee hogi!`;
  }

  // 3. Plumbing / Water / Sanitary / Tank / Leakage
  if (/\b(plumb|leak|leaking|pipe|pani|tank|tanki|motor|nal|tap|washroom|bathroom|geyser|drain|gutter)\b/.test(lower)) {
    return `Ji bilkul! Main sanitary aur pipeline leakage theek karne ke mukammal spares aur tools sath le kar aonga. Masla kitna shaded hai aur abhi pani leak ho raha hai?`;
  }

  // 4. Electrician / AC / Wiring / Short Circuit
  if (/\b(bijli|electric|ac|air condition|fan|pankha|board|switch|wire|wiring|breaker|short|circuit|socket|meter|light)\b/.test(lower)) {
    return `Ji main electrical board, wiring aur breaker faults theek karne ka mukammal samaan aur digital tester sath laonga. Short circuit se hifazat zaroori hai, main jald az jald check kar leta hoon.`;
  }

  // 5. Carpentry / Furniture / Wood / Door Locks
  if (/\b(lakri|carpenter|wood|door|darwaza|lock|kundi|almari|table|chair|bed|hinge|qabza)\b/.test(lower)) {
    return `Ji darwazay ki setting, lock fitting aur lakri ki marammat ka samaan mere paas mojood hai. Main visit kar ke tasalli se check kar loon ga.`;
  }

  // 6. Timing / Availability / Schedule
  if (/\b(kal|subah|sham|shaam|waqt|time|aaj|aj|today|tomorrow|kab|jaldi|urgent|ab|abhi|hour|ghanta)\b/.test(lower)) {
    return `Ji bilkul, main kal subah 10:30 bajay ya dophar 2:00 bajay ba-asaani pohanch sakta hoon. Aap batayein kon sa waqt aapke liye sab se munasib rahe ga?`;
  }

  // 7. Address / Location
  if (/\b(address|pata|kahan|area|location|gali|ghar|street|road|sector|block|mohalla)\b/.test(lower)) {
    return `Ji theek hai, main ne location note kar li hai (${workerCity}). Aate waqt main aapke mobile number par rabta kar ke pohanch jaon ga.`;
  }

  // 8. Deal / Confirmation / OK / Done
  if (/\b(theek|thek|ok|done|confirm|a jao|aa jao|book|deal|pakka|final|shukriya|thanks)\b/.test(lower)) {
    return `Bohat shukriya Janab! Deal confirm hai. Aap chahein to 'Request Service' par click kar ke booking record kar lein, ya main kal direct waqt par pohanch jaoonga Insha'Allah.`;
  }

  // 9. Phone / Contact Number
  if (/\b(number|phone|call|mobile|rabta|contact)\b/.test(lower)) {
    return `Ji mera phone number profile par mojood hai (${phone}). Aap kisi bhi waqt direct call bhi kar sakte hain.`;
  }

  // 10. Default craftsman response
  const defaultReplies = [
    `Ji bilkul janab, main samajh gaya hoon. Main apni complete tool kit ke sath visit kar ke tasalli bakhsh tareeqay se ${skill} ka kaam mukammal kar doonga. Kya kal ka time final samjhein?`,
    `Theek hai janab, main yeh kaam ba-asaani kar doonga. Hunarmand Pakistan par hamara 10+ saal ka tajurba hai, befikar rahein. Aap apna qareebi landmark share kar dein.`,
    `Ji behtar! Main ${workerCity} mein inspection ke liye time par pohanch jaoonga. Insha'Allah kaam behtareen hoga aur koi masla nahi rahe ga.`,
  ];
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
};

// Builder function that converts ALL fallbackWorkers into full conversation threads
const buildAllWorkerConversations = (currentUserId, currentUserName) => {
  return fallbackWorkers.map((w, index) => {
    const workerUserId = w.userId?._id || `user-${w._id}`;
    const workerName = w.userId?.name || w.name || 'Skilled Artisan';
    const workerPhone = w.userId?.phone || w.phone || '0300-1234567';
    const workerImage =
      w.userId?.profileImage ||
      w.profileImage ||
      'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80';
    const catName = w.category?.name || 'Technician';
    const catSlug = w.category?.slug || 'other';
    const catIcon = w.category?.icon || '🛠️';

    // Contextual starter last message based on trade
    let lastMsg = 'Assalam-o-Alaikum! Main aapki kya madad kar sakta hoon?';
    if (catSlug.includes('electric') || catName.includes('Electric')) {
      lastMsg = 'Ji bilkul, main house wiring aur breaker inspection ke liye available hoon.';
    } else if (catSlug.includes('plumb') || catName.includes('Plumb')) {
      lastMsg = 'Pipe fitting, leakage aur sanitary ka samaan main sath le kar aonga.';
    } else if (catSlug.includes('ac') || catName.includes('AC')) {
      lastMsg = 'AC general service, gas charging aur installation ke liye time tay karein.';
    } else if (catSlug.includes('carpent') || catName.includes('Carpent')) {
      lastMsg = 'Darwazay ke lock, almari aur furniture repairs tasalli se ho jayein ge.';
    } else if (catSlug.includes('solar') || catName.includes('Solar')) {
      lastMsg = 'Solar inverter aur panels fitting ke mukammal tools tayyar hain.';
    } else if (catSlug.includes('paint') || catName.includes('Paint')) {
      lastMsg = 'Wall putty, weather-sheet aur polish ka behtareen kaam hoga.';
    } else if (catSlug.includes('mechanic') || catName.includes('Mechanic')) {
      lastMsg = 'Engine tuning aur brake suspension check karne aa sakta hoon.';
    } else if (catSlug.includes('appliance') || catName.includes('Appliance')) {
      lastMsg = 'Washing machine, microwave aur fridge spares mojood hain.';
    } else if (catSlug.includes('mason') || catName.includes('Mason')) {
      lastMsg = 'Tile fixing, plaster aur renovation ka tajurba-kar kaam hoga.';
    } else if (catSlug.includes('clean') || catName.includes('Clean')) {
      lastMsg = 'Deep home cleaning aur water tank washing service available hai.';
    }

    const minutesAgo = (index % 15) * 6 + 2;
    const msgTime = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();

    return {
      _id: `conv-worker-${w._id}`,
      workerProfileId: w._id,
      categorySlug: catSlug,
      categoryName: catName,
      categoryIcon: catIcon,
      participants: [
        {
          _id: currentUserId || 'my-id',
          name: currentUserName || 'Customer',
          role: 'customer',
        },
        {
          _id: workerUserId,
          name: workerName,
          role: 'worker',
          phone: workerPhone,
          city: w.city,
          area: w.area,
          skillTitle: w.skillTitle || `${catName} Specialist`,
          category: w.category,
          profileImage: workerImage,
          averageRating: w.averageRating || 5.0,
          startingPrice: w.startingPrice || 600,
          availability: w.availability || 'available',
        },
      ],
      lastMessage: lastMsg,
      lastMessageAt: msgTime,
    };
  });
};

const CATEGORY_TABS = [
  { slug: 'all', name: 'All', icon: '👥' },
  { slug: 'electrician', name: 'Electrician', icon: '⚡' },
  { slug: 'plumber', name: 'Plumber', icon: '🔧' },
  { slug: 'ac-technician', name: 'AC Tech', icon: '❄️' },
  { slug: 'carpenter', name: 'Carpenter', icon: '🪚' },
  { slug: 'solar-technician', name: 'Solar', icon: '☀️' },
  { slug: 'painter', name: 'Painter', icon: '🎨' },
  { slug: 'mechanic', name: 'Mechanic', icon: '🔩' },
  { slug: 'appliance-repair', name: 'Appliance', icon: '📱' },
  { slug: 'mason-construction', name: 'Mason', icon: '🏗️' },
  { slug: 'cleaner', name: 'Cleaner', icon: '🧹' },
];

const SUGGESTED_CHIPS = [
  'Assalam-o-Alaikum! Kya aap kal visit kar sakte hain?',
  'Kaam dekhne ke checking aur visit charges kitne hain?',
  'Mujhe urgent kaam theek karwana hai.',
  'Location share kar raha hoon, time confirm karein.',
  'Deal done! Kal subah 10 bajay confirmed hai.',
];

const MessagesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialConversationId = searchParams.get('conversationId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  // Responsive Layout States to ensure sidebar never disappears on width changes
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'

  // 4-Minute Live Consultation Session State
  const [sessionSeconds, setSessionSeconds] = useState(240); // 4 minutes = 240 seconds
  const [sessionActive, setSessionActive] = useState(true);
  const [timeAddedAlert, setTimeAddedAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const replyTimerRef = useRef(null);
  const typingStateTimerRef = useRef(null);

  // Helper to get the other participant in conversation
  const getOtherParticipant = (conv) => {
    if (!conv?.participants) return null;
    return (
      conv.participants.find((p) => p._id !== (user?._id || 'my-id')) ||
      conv.participants[0]
    );
  };

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, otherUserTyping]);

  // Load ALL skilled worker conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      setLoadingConversations(true);
      try {
        const allWorkersConvs = buildAllWorkerConversations(user?._id, user?.name);

        let dbConvs = [];
        try {
          const res = await fetchMyConversations();
          if (res?.conversations && res.conversations.length > 0) {
            dbConvs = res.conversations;
          }
        } catch (e) {
          // Backend optional
        }

        const combined = [...dbConvs];
        allWorkersConvs.forEach((workerConv) => {
          const alreadyExists = combined.some((c) => {
            const o1 = getOtherParticipant(c);
            const o2 = getOtherParticipant(workerConv);
            return (
              c._id === workerConv._id ||
              (o1 && o2 && o1.name === o2.name && o1.city === o2.city)
            );
          });
          if (!alreadyExists) {
            combined.push(workerConv);
          }
        });

        setConversations(combined);

        // Check if user came from a specific worker's profile with state
        const targetWorker = location.state?.targetWorker;
        if (targetWorker) {
          const found = combined.find((c) => {
            const other = getOtherParticipant(c);
            return (
              other?._id === targetWorker._id ||
              other?._id === targetWorker.userId?._id ||
              other?.name?.toLowerCase() === targetWorker.name?.toLowerCase() ||
              c.workerProfileId === targetWorker._id
            );
          });

          if (found) {
            setActiveConversation(found);
            setMobileView('chat');
          } else {
            const customConv = {
              _id: `conv-custom-${Date.now()}`,
              participants: [
                {
                  _id: user?._id || 'my-id',
                  name: user?.name || 'Customer',
                  role: 'customer',
                },
                {
                  _id: targetWorker._id || targetWorker.userId?._id || 'worker-temp-id',
                  name: targetWorker.name || targetWorker.userId?.name || 'Technician',
                  role: 'worker',
                  phone: targetWorker.phone || targetWorker.userId?.phone || '0300-1234567',
                  city: targetWorker.city || 'Karachi',
                  skillTitle: targetWorker.skillTitle || 'Skilled Technician',
                  profileImage:
                    targetWorker.profileImage ||
                    targetWorker.userId?.profileImage ||
                    'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
                  startingPrice: targetWorker.startingPrice || 600,
                  averageRating: 5.0,
                },
              ],
              lastMessage: 'Assalam-o-Alaikum! Main aapki kya madad kar sakta hoon?',
              lastMessageAt: new Date().toISOString(),
            };
            setConversations([customConv, ...combined]);
            setActiveConversation(customConv);
            setMobileView('chat');
          }
        } else if (initialConversationId) {
          const found = combined.find((c) => c._id === initialConversationId);
          setActiveConversation(found || combined[0]);
          setMobileView('chat');
        } else {
          setActiveConversation(combined[0]);
          // On desktop, keep both panels visible
          // On mobile screens (<768px), keep 'list' so user sees workers list first
          if (window.innerWidth >= 768) {
            setMobileView('chat');
          }
        }
      } catch (err) {
        console.warn('Could not load conversations:', err.message);
        const fallbackList = buildAllWorkerConversations(user?._id, user?.name);
        setConversations(fallbackList);
        setActiveConversation(fallbackList[0]);
      } finally {
        setLoadingConversations(false);
      }
    };

    loadConversations();
  }, [initialConversationId, user?._id, location.state]);

  // Load messages whenever activeConversation changes
  useEffect(() => {
    if (!activeConversation) return;

    setSessionSeconds(240);
    setSessionActive(true);
    setOtherUserTyping(false);

    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        if (!activeConversation._id.startsWith('conv-worker-') && !activeConversation._id.startsWith('conv-custom')) {
          const res = await fetchMessages(activeConversation._id);
          if (res?.messages && res.messages.length > 0) {
            setMessages(res.messages);
            return;
          }
        }

        const otherUser = getOtherParticipant(activeConversation);
        const initialThread = [
          {
            _id: `m-init-1-${activeConversation._id}`,
            senderId: {
              _id: otherUser?._id,
              name: otherUser?.name,
              profileImage: otherUser?.profileImage,
              role: 'worker',
            },
            text: `Assalam-o-Alaikum! Hunarmand Pakistan par rabta karne ka shukriya. Main ${otherUser?.name || 'Technician'} (${otherUser?.skillTitle || 'Worker'}) bol raha hoon. Main aapki kis kaam mein madad kar sakta hoon?`,
            createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
            isRead: true,
          },
        ];

        setMessages(initialThread);
      } catch (err) {
        console.warn('Could not load messages:', err.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();

    if (!activeConversation._id.startsWith('conv-worker-') && !activeConversation._id.startsWith('conv-custom')) {
      markMessagesAsRead(activeConversation._id).catch(() => {});
    }
  }, [activeConversation?._id]);

  // Real-Time 4-Minute Session Countdown Timer
  useEffect(() => {
    if (!sessionActive || sessionSeconds <= 0) return;

    const timer = setInterval(() => {
      setSessionSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setSessionActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive, sessionSeconds]);

  // Socket.IO real-time event listener
  useEffect(() => {
    const socket = getSocket();

    if (user?._id) {
      socket.emit('join_user', user._id);
    }

    if (activeConversation?._id) {
      socket.emit('join_conversation', activeConversation._id);
    }

    const handleReceiveMessage = (incomingMsg) => {
      if (incomingMsg.conversationId === activeConversation?._id) {
        setMessages((prev) => [...prev, incomingMsg]);
        if (soundEnabled) playNotificationChime();
      }

      setConversations((prev) =>
        prev.map((c) =>
          c._id === incomingMsg.conversationId
            ? {
                ...c,
                lastMessage: incomingMsg.text,
                lastMessageAt: incomingMsg.createdAt || new Date().toISOString(),
              }
            : c
        )
      );
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      if (activeConversation?._id) {
        socket.emit('leave_conversation', activeConversation._id);
      }
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [activeConversation?._id, user?._id, soundEnabled]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
      if (typingStateTimerRef.current) clearTimeout(typingStateTimerRef.current);
    };
  }, []);

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleExtendTime = () => {
    setSessionSeconds((prev) => prev + 120);
    setSessionActive(true);
    setTimeAddedAlert(true);
    setTimeout(() => setTimeAddedAlert(false), 2500);
  };

  const handleRestartSession = () => {
    setSessionSeconds(240);
    setSessionActive(true);
    setTimeAddedAlert(true);
    setTimeout(() => setTimeAddedAlert(false), 2500);
  };

  const triggerArtisanAutoReply = (userText, currentConv) => {
    const worker = getOtherParticipant(currentConv);

    if (replyTimerRef.current) clearTimeout(replyTimerRef.current);
    if (typingStateTimerRef.current) clearTimeout(typingStateTimerRef.current);

    typingStateTimerRef.current = setTimeout(() => {
      setOtherUserTyping(true);
    }, 700);

    replyTimerRef.current = setTimeout(() => {
      setOtherUserTyping(false);
      const replyContent = generateWorkerReply(userText, worker);

      const workerReplyMsg = {
        _id: `reply-${Date.now()}`,
        conversationId: currentConv._id,
        senderId: {
          _id: worker?._id || 'worker-reply-id',
          name: worker?.name || 'Technician',
          profileImage: worker?.profileImage,
          role: 'worker',
        },
        text: replyContent,
        createdAt: new Date().toISOString(),
        isRead: true,
      };

      setMessages((prev) => [...prev, workerReplyMsg]);

      setConversations((prev) =>
        prev.map((c) =>
          c._id === currentConv._id
            ? {
                ...c,
                lastMessage: replyContent,
                lastMessageAt: new Date().toISOString(),
              }
            : c
        )
      );

      if (soundEnabled) {
        playNotificationChime();
      }
    }, 2100);
  };

  const handleSendMessage = async (e, directText = null) => {
    if (e) e.preventDefault();
    const textToSend = (directText !== null ? directText : newMessageText).trim();
    if (!textToSend || !activeConversation || sending) return;

    setNewMessageText('');
    setSending(true);

    const tempMsg = {
      _id: `usr-${Date.now()}`,
      conversationId: activeConversation._id,
      senderId: {
        _id: user?._id || 'my-id',
        name: user?.name || 'Customer',
        role: user?.role || 'customer',
      },
      text: textToSend,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setMessages((prev) => [...prev, tempMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c._id === activeConversation._id
          ? {
              ...c,
              lastMessage: textToSend,
              lastMessageAt: new Date().toISOString(),
            }
          : c
      )
    );

    if (!activeConversation._id.startsWith('conv-worker-') && !activeConversation._id.startsWith('conv-custom')) {
      apiSendMessage(activeConversation._id, textToSend).catch((err) => {
        console.warn('Backend chat sync failed, staying local:', err.message);
      });
    }

    setSending(false);
    triggerArtisanAutoReply(textToSend, activeConversation);
  };

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    const matchesSearch =
      !searchTerm ||
      other?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      other?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      other?.skillTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.categoryName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategoryTab === 'all' ||
      c.categorySlug?.toLowerCase() === selectedCategoryTab.toLowerCase() ||
      c.categoryName?.toLowerCase().includes(selectedCategoryTab.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const activeOtherUser = activeConversation ? getOtherParticipant(activeConversation) : null;
  const timerPercentage = Math.max(0, Math.min(100, (sessionSeconds / 240) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner Explaining the 4-Minute Interactive Consultation */}
      <div className="mb-5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-4 sm:p-5 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20">
            <Zap className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
              <span>Hunarmand Pakistan Live Consultation & Direct Chat</span>
              <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {conversations.length} Workers Active
              </span>
            </h1>
            <p className="text-xs text-emerald-100/90 max-w-2xl mt-0.5">
              Tamam {conversations.length} skilled workers dastyab hain (Electrician, Plumber, AC, Carpenter, Solar, Painter, etc.). Kisi bhi worker ko message bhaijein — 4-minute live session timer chalay ga aur worker foran live reply kare ga!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-white/10 cursor-pointer"
            title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-300" /> : <VolumeX className="w-3.5 h-3.5 text-red-300" />}
            <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER: Guaranteed Side-by-Side on Desktop and Seamless Toggle on Mobile */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden h-[780px] flex flex-row relative">
        {/* LEFT PANE: ALL SKILLED WORKERS CONVERSATION LIST */}
        <div
          className={`
            ${sidebarOpen ? 'md:flex' : 'md:hidden'}
            ${mobileView === 'list' ? 'flex' : 'hidden'}
            w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 flex-col bg-slate-50 transition-all duration-200
          `}
        >
          {/* Header & Controls */}
          <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white space-y-2.5 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <span>Skilled Workers ({conversations.length})</span>
              </h2>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2 py-0.5 rounded-full">
                {filteredConversations.length} Shown
              </span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Worker, skill ya shehar search karein..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>

            {/* Category Filter Horizontal Scroll Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 pb-0.5">
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedCategoryTab === tab.slug;
                return (
                  <button
                    key={tab.slug}
                    onClick={() => setSelectedCategoryTab(tab.slug)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition whitespace-nowrap cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* All Workers Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                <span>Tamam workers load ho rahe hain...</span>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <p className="text-xs text-slate-500">Koi worker nahi mila.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategoryTab('all');
                  }}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Tamam {conversations.length} workers dekhein →
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = activeConversation?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => {
                      setActiveConversation(conv);
                      setMobileView('chat');
                    }}
                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/90 border-l-4 border-emerald-700'
                        : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          other?.profileImage ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                        }
                        alt={other?.name}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" title="Online abhi" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                          <span>{other?.name || 'Worker'}</span>
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
                        <span className="font-bold text-emerald-800 bg-emerald-100/70 px-1.5 py-0.2 rounded truncate max-w-[150px]">
                          {other?.skillTitle || conv.categoryName}
                        </span>
                        {other?.city && <span className="flex-shrink-0">• {other?.city}</span>}
                      </div>

                      <p className="text-xs text-slate-500 truncate font-normal">
                        {conv.lastMessage || 'New conversation'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: ACTIVE CHAT THREAD */}
        {activeConversation && activeOtherUser ? (
          <div
            className={`
              ${mobileView === 'chat' ? 'flex' : 'hidden'}
              md:flex flex-1 min-w-0 flex-col bg-slate-50/50 relative
            `}
          >
            {/* Active Chat Header */}
            <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 shadow-xs flex flex-col gap-2.5 flex-shrink-0">
              <div className="flex items-center justify-between">
                {/* Worker Avatar & Navigation Buttons */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Mobile Back Button to Worker List */}
                  <button
                    type="button"
                    onClick={() => setMobileView('list')}
                    className="md:hidden p-2 -ml-1 text-slate-700 hover:text-emerald-800 hover:bg-slate-100 rounded-xl transition flex items-center gap-1 cursor-pointer flex-shrink-0"
                    title="Workers list par wapis jayein"
                  >
                    <ChevronLeft className="w-5 h-5 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-800">Workers</span>
                  </button>

                  {/* Desktop Toggle Sidebar Button */}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="hidden md:flex p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition items-center gap-1 cursor-pointer flex-shrink-0"
                    title={sidebarOpen ? "Hide Workers Sidebar" : "Show Workers Sidebar"}
                  >
                    <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`} />
                    <span className="text-xs font-medium text-slate-600">
                      {sidebarOpen ? 'Hide' : 'Workers'}
                    </span>
                  </button>

                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        activeOtherUser?.profileImage ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={activeOtherUser?.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                    <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute -bottom-0.5 -right-0.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
                        {activeOtherUser?.name}
                      </h3>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" title="Verified Worker" />
                      {activeOtherUser?.startingPrice && (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex-shrink-0">
                          Rs. {activeOtherUser.startingPrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                      <span className="text-emerald-700 font-bold capitalize flex-shrink-0">
                        ● Online
                      </span>
                      {activeOtherUser?.skillTitle && (
                        <span className="hidden sm:inline font-medium truncate">• {activeOtherUser.skillTitle}</span>
                      )}
                      {activeOtherUser?.city && (
                        <span className="truncate">• {activeOtherUser?.city}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* TIMER & ACTION CONTROLS */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                  {/* Live 4-Minute Consultation Countdown Pill */}
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                      sessionSeconds === 0
                        ? 'bg-red-50 text-red-700 border-red-300'
                        : sessionSeconds <= 60
                        ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <Clock
                      className={`w-3.5 h-3.5 ${
                        sessionSeconds === 0
                          ? 'text-red-600'
                          : sessionSeconds <= 60
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    />
                    <span className="font-mono text-xs sm:text-sm tracking-wider">
                      {formatTimer(sessionSeconds)}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-semibold opacity-80">
                      {sessionSeconds === 0 ? 'Session Ended' : 'Left'}
                    </span>
                  </div>

                  {/* +2 Min Extend Button */}
                  <button
                    onClick={handleExtendTime}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-emerald-100 border border-slate-300 hover:border-emerald-300 text-slate-800 hover:text-emerald-900 font-bold rounded-xl text-xs transition flex items-center gap-1 cursor-pointer"
                    title="Guftagu ka waqt 2 minute barhayein"
                  >
                    <Plus className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">+2 Min</span>
                  </button>

                  {/* Restart Session Button */}
                  <button
                    onClick={handleRestartSession}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                    title="Naya 4-minute consultation session shuru karein"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  {/* Call Direct */}
                  {activeOtherUser?.phone && (
                    <a
                      href={`tel:${activeOtherUser?.phone}`}
                      className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition"
                      title={`Call direct: ${activeOtherUser?.phone}`}
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}

                  {/* View Profile */}
                  {activeOtherUser?._id && (
                    <Link
                      to={`/workers/${activeConversation.workerProfileId || activeOtherUser?._id}`}
                      className="hidden sm:inline-block px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition shadow-sm"
                    >
                      Hire Worker
                    </Link>
                  )}
                </div>
              </div>

              {/* Consultation Session Time Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    sessionSeconds === 0
                      ? 'bg-red-500'
                      : sessionSeconds <= 60
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${timerPercentage}%` }}
                />
              </div>

              {/* Alert notification if time was added */}
              {timeAddedAlert && (
                <div className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-lg text-center animate-fadeIn">
                  ✓ Consultation waqt mein +2 minute mazeed shamil kar diye gaye hain!
                </div>
              )}
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-xs text-slate-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>Message history load ho rahi hai...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                  <MessageSquare className="w-10 h-10 text-slate-300" />
                  <h4 className="text-sm font-bold text-slate-700">Abhi tak koi paighaam nahi</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Neeche diye gaye chips par click karein ya apna paighaam likh kar send karein.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe =
                    msg.senderId?._id === (user?._id || 'my-id') ||
                    msg.senderId === (user?._id || 'my-id');

                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-emerald-700 text-white rounded-br-xs shadow-emerald-700/10'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/90'
                        }`}
                      >
                        {!isMe && (
                          <div className="text-[10px] font-extrabold text-emerald-800 mb-0.5 flex items-center gap-1">
                            <span>{msg.senderId?.name || activeOtherUser?.name}</span>
                            <span className="text-[9px] font-normal text-slate-400">• {activeOtherUser?.skillTitle || 'Technician'}</span>
                          </div>
                        )}
                        <p className="font-medium whitespace-pre-wrap">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                        <span>
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMe && (
                          <CheckCheck
                            className={`w-3.5 h-3.5 ${
                              msg.isRead ? 'text-emerald-600' : 'text-slate-400'
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Realistic Typing Indicator */}
              {otherUserTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-2xl border border-slate-200 shadow-xs w-fit animate-fadeIn">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="font-medium italic text-[11px]">
                    {activeOtherUser?.name} likh rahe hain...
                  </span>
                </div>
              )}

              {/* Consultation Session Expired Notice Card */}
              {sessionSeconds === 0 && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center space-y-3 my-4 shadow-sm animate-fadeIn">
                  <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span>⏱️ 4-Minute Consultation Session Ka Waqt Mukammal Ho Chuka Hai</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed max-w-md mx-auto">
                    Aapka 4 minute ka live guftagu waqt mukammal ho gaya hai. Mazeed baat karne ke liye <strong>+2 Min Barhayein</strong> ya direct hiring karein.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={handleExtendTime}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+2 Min Barhayein</span>
                    </button>
                    <button
                      onClick={handleRestartSession}
                      className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Naya Session Shuru Karein</span>
                    </button>
                    {activeOtherUser?.phone && (
                      <a
                        href={`tel:${activeOtherUser?.phone}`}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Direct Call Karein</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestion Chips */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Quick Ask:
              </span>
              {SUGGESTED_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(null, chip)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition cursor-pointer flex-shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => handleSendMessage(e)}
              className="p-3.5 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-3 flex-shrink-0"
            >
              <input
                type="text"
                placeholder="Apna paighaam likhein (e.g. Kal subah visit kar sakte hain?)..."
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-emerald-700 font-medium"
              />

              <button
                type="submit"
                disabled={!newMessageText.trim() || sending}
                className="p-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-2xl transition shadow-md shadow-emerald-700/20 cursor-pointer flex items-center justify-center flex-shrink-0"
                title="Paighaam bhaijein"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        ) : (
          <div
            className={`
              ${mobileView === 'chat' ? 'flex' : 'hidden'}
              md:flex flex-1 min-w-0 flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3
            `}
          >
            <MessageSquare className="w-12 h-12 text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">Koi Worker Muntakhib Nahi</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              Bayen janib se kisi bhi skilled worker par click karein aur 4 minute ka live consultation shuru karein.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
