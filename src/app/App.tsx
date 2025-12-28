import React, { useState, useRef, useEffect } from 'react';
import { DrildButton } from "./components/drild/DrildButton";
import { DrildCard } from "./components/drild/DrildCard";
import { DrildChip } from "./components/drild/DrildChip";
import { DrildInput } from "./components/drild/DrildInput";
import { DrildSegmentedControl } from "./components/drild/DrildSegmentedControl";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import drildLogo from "figma:asset/0a90956aeaa1156c57de5319a3f5122dcc7b5867.png";
import {
  Search,
  Menu,
  MessageSquare,
  User,
  MapPin,
  Grid,
  Map as MapIcon,
  X,
  Send,
  MoreVertical,
  ChevronLeft,
  Navigation,
  Plus,
  Image as ImageIcon,
  Camera,
  Mic,
  Lock,
  Unlock,
  Trash2,
  Check,
  Settings
} from "lucide-react";
import './App.css';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Mock Data ---
const CURRENT_USER_DATA = {
  id: 999,
  name: "Me",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=60",
  publicPhotos: [
    "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60"
  ],
  lockedPhotos: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60"
  ],
  sharedWith: [1] // IDs of users who have access
};

const PROFILES = [
  { id: 1, name: "Marcus", distance: "0.2m", available: true, bio: "Architecture & heavy lifting. Looking for spotting partners.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60", x: 20, y: 30 },
  { id: 2, name: "Javier", distance: "0.5m", available: false, bio: "New to the city. Show me around.", image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=500&auto=format&fit=crop&q=60", x: 70, y: 45 },
  { id: 3, name: "Anton", distance: "1.1m", available: true, bio: "Strictly platonic gym vibes only.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=60", x: 40, y: 60 },
  { id: 4, name: "Elias", distance: "1.5m", available: true, bio: "Photographer. Night owl.", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=500&auto=format&fit=crop&q=60", x: 80, y: 20 },
  { id: 5, name: "Kai", distance: "2.0m", available: false, bio: "Just browsing.", image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=500&auto=format&fit=crop&q=60", x: 30, y: 80 },
  { id: 6, name: "Nico", distance: "2.2m", available: true, bio: "Coffee first.", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&auto=format&fit=crop&q=60", x: 60, y: 70 },
];

const INITIAL_MESSAGES = [
  { id: 1, text: "Saw you at the gym earlier.", sender: "them", time: "10:23 PM" },
  { id: 2, text: "Should have said hi.", sender: "me", time: "10:24 PM" },
  { id: 3, text: "Next time.", sender: "them", time: "10:25 PM" },
  { id: 4, text: "I'll hold you to that.", sender: "me", time: "10:26 PM" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'discover' | 'chats' | 'profile'>('discover');
  const [discoveryMode, setDiscoveryMode] = useState<'map' | 'grid'>('map');
  const [selectedProfile, setSelectedProfile] = useState<typeof PROFILES[0] | null>(null);
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  
  // State for messages & sharing
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [sharedWith, setSharedWith] = useState<number[]>(CURRENT_USER_DATA.sharedWith);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  // Profile State
  const [myPhotos, setMyPhotos] = useState(CURRENT_USER_DATA.publicPhotos);
  const [myLockedPhotos, setMyLockedPhotos] = useState(CURRENT_USER_DATA.lockedPhotos);

  // --- Helpers ---
  const isShared = (userId: number) => sharedWith.includes(userId);

  const toggleShare = (userId: number) => {
    if (isShared(userId)) {
      setSharedWith(prev => prev.filter(id => id !== userId));
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "Access revoked.", 
        sender: "system", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } else {
      setSharedWith(prev => [...prev, userId]);
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: "ACCESS GRANTED: You have unlocked my private album.", 
        sender: "system", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    }
    setShowAttachMenu(false);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage("");
  };

  const addLockedPhoto = () => {
    // Mock adding a photo
    setMyLockedPhotos([...myLockedPhotos, "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=60"]);
  };

  const deletePublicPhoto = (index: number) => {
    const newPhotos = [...myPhotos];
    newPhotos.splice(index, 1);
    setMyPhotos(newPhotos);
  };
  
  const uploadPublicPhoto = () => {
      // Mock upload
     setMyPhotos(["https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=500&auto=format&fit=crop&q=60", ...myPhotos]); 
  };
  
  const sendPhotoMessage = () => {
      setMessages(prev => [...prev, {
          id: Date.now(),
          text: "📷 Photo sent",
          sender: "me",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      setShowAttachMenu(false);
  }

  // --- Views ---

  const Header = () => (
    <div className="absolute top-0 left-0 right-0 p-4 pt-12 z-20 pointer-events-none">
      <div className="flex items-center justify-between mb-4 pointer-events-auto">
        <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-[#5E534B] rounded-lg flex items-center justify-center">
                 <img src={drildLogo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
             </div>
             <span className="font-bold text-lg tracking-tight text-[rgb(94,83,75)]">DRILD</span>
        </div>
        <button 
           onClick={() => setActiveTab('profile')}
           className="w-8 h-8 bg-[#232220] rounded-full flex items-center justify-center overflow-hidden border border-white/10 hover:border-[#5E534B] transition-colors"
        >
            <img src={CURRENT_USER_DATA.avatar} alt="Me" className="w-full h-full object-cover" />
        </button>
      </div>
      {activeTab === 'discover' && (
        <div className="pointer-events-auto">
          <DrildSegmentedControl 
            options={[{ label: 'MAP', value: 'map' }, { label: 'GRID', value: 'grid' }]}
            value={discoveryMode}
            onChange={(v) => setDiscoveryMode(v as 'map' | 'grid')}
          />
        </div>
      )}
    </div>
  );

  const MapView = () => (
    <div className="absolute inset-0 bg-[#1C1C1A] overflow-hidden">
      {/* Fake Map Elements */}
      <div className="absolute inset-0 opacity-20">
         <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
               <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#5E534B" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M -10 100 Q 100 200 400 150" stroke="#232220" strokeWidth="20" fill="none" />
            <path d="M 100 -10 Q 150 200 100 800" stroke="#232220" strokeWidth="15" fill="none" />
         </svg>
      </div>
      
      {PROFILES.map((profile) => (
        <motion.button
          key={profile.id}
          className="absolute w-12 h-12 rounded-full border-2 border-[#181817] shadow-xl overflow-hidden z-10 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-[#5E534B]"
          style={{ top: `${profile.y}%`, left: `${profile.x}%` }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSelectedProfile(profile)}
        >
          <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
          {profile.available && (
             <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-[#5E534B] rounded-full border border-[#181817]" />
          )}
        </motion.button>
      ))}

      <div className="absolute bottom-28 right-4 z-10">
         <DrildButton variant="icon" size="icon" className="shadow-lg shadow-black/50">
             <Navigation size={20} className="fill-current" />
         </DrildButton>
      </div>
    </div>
  );

  const GridView = () => (
    <div className="absolute inset-0 pt-[140px] px-4 pb-24 overflow-y-auto no-scrollbar">
       <div className="grid grid-cols-2 gap-3">
          {PROFILES.map((profile) => (
            <motion.div
               key={profile.id}
               layoutId={`card-${profile.id}`}
               onClick={() => setSelectedProfile(profile)}
               className="relative aspect-square rounded-3xl overflow-hidden bg-[#232220] cursor-pointer active:scale-95 transition-transform"
            >
               <img src={profile.image} alt={profile.name} className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
               <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-2 mb-1">
                     <span className="font-bold text-white">{profile.name}</span>
                     {profile.available && <div className="w-1.5 h-1.5 bg-[#5E534B] rounded-full" />}
                  </div>
                  <span className="text-xs text-[#8C8279]">{profile.distance} away</span>
               </div>
            </motion.div>
          ))}
       </div>
    </div>
  );

  const BottomSheet = () => {
    if (!selectedProfile) return null;

    return (
      <AnimatePresence>
         <motion.div 
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 z-30 bg-[#1C1C1A] rounded-t-[32px] p-6 pb-10 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
         >
            <div className="w-12 h-1 bg-[#232220] rounded-full mx-auto mb-6" />
            
            <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#232220]">
                    <img src={selectedProfile.image} alt={selectedProfile.name} className="w-full h-full object-cover" />
                </div>
                <div>
                   <h2 className="text-2xl font-bold mb-1">{selectedProfile.name}</h2>
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-[#8C8279]">{selectedProfile.distance}</span>
                      {selectedProfile.available && (
                         <span className="px-2 py-0.5 rounded-full bg-[#5E534B]/20 text-[#5E534B] text-[10px] font-bold uppercase">
                            Online
                         </span>
                      )}
                   </div>
                   <p className="text-sm text-[#8C8279] leading-snug max-w-[200px]">{selectedProfile.bio}</p>
                </div>
            </div>

            <div className="flex gap-3">
               <DrildButton className="flex-1" onClick={() => {
                  setCurrentChatId(selectedProfile.id);
                  setSelectedProfile(null);
               }}>
                  Message
               </DrildButton>
               <DrildButton variant="secondary" className="w-12 px-0" onClick={() => setSelectedProfile(null)}>
                  <MoreVertical size={20} />
               </DrildButton>
            </div>
         </motion.div>
         
         <motion.div 
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-20 backdrop-blur-sm"
            onClick={() => setSelectedProfile(null)}
         />
      </AnimatePresence>
    );
  };

  // --- Profile View (Self) ---
  const ProfileView = () => (
    <div className="absolute inset-0 pt-[100px] px-6 pb-24 overflow-y-auto no-scrollbar bg-[#181817]">
      <div className="flex flex-col items-center mb-8">
         <div className="relative w-28 h-28 mb-4 group cursor-pointer">
            <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-[#232220] shadow-2xl">
              <img src={CURRENT_USER_DATA.avatar} alt="Me" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#5E534B] text-white p-2 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
               <Camera size={16} />
            </div>
         </div>
         <h2 className="text-2xl font-bold text-[rgb(94,83,75)]">{CURRENT_USER_DATA.name}</h2>
         <span className="text-[#8C8279] text-sm">Visible • 0.0m away</span>
      </div>

      {/* Public Gallery */}
      <div className="space-y-4 mb-8">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#8C8279] uppercase tracking-wider">Public Gallery</h3>
            <button onClick={uploadPublicPhoto} className="p-2 bg-[#232220] rounded-full hover:bg-[#2A2927]">
                <Plus size={16} className="text-[#5E534B]" />
            </button>
         </div>
         <div className="grid grid-cols-2 gap-3">
            {myPhotos.map((photo, i) => (
               <div key={i} className="aspect-[4/5] rounded-2xl bg-[#232220] overflow-hidden relative group">
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                     <button 
                       onClick={() => deletePublicPhoto(i)}
                       className="p-2 bg-white/20 rounded-full hover:bg-white/40 backdrop-blur-md text-white"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            ))}
            {myPhotos.length < 4 && (
                 <button onClick={uploadPublicPhoto} className="aspect-[4/5] rounded-2xl bg-[#232220] flex flex-col items-center justify-center border border-dashed border-[#5E534B]/30 hover:border-[#5E534B] transition-colors gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-[#181817] flex items-center justify-center group-hover:bg-[#5E534B] transition-colors">
                        <Plus size={20} className="text-[#5E534B] group-hover:text-white" />
                    </div>
                    <span className="text-xs font-bold text-[#8C8279] group-hover:text-[#5E534B]">Upload</span>
                 </button>
            )}
         </div>
      </div>

      {/* Locked Album */}
      <div className="space-y-4 mb-8">
         <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#8C8279] uppercase tracking-wider flex items-center gap-2">
               <Lock size={14} /> Locked Album
            </h3>
            <button className="text-xs text-[#5E534B] font-bold px-3 py-1 bg-[#232220] rounded-full hover:bg-[#2A2927]">
                Manage Access
            </button>
         </div>
         
         <div className="p-1 rounded-3xl border border-[#5E534B]/30 bg-[#232220]/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="grid grid-cols-3 gap-1 p-1">
               {myLockedPhotos.map((photo, i) => (
                 <div key={i} className="aspect-square rounded-xl bg-[#181817] overflow-hidden relative">
                    <img src={photo} alt="" className="w-full h-full object-cover opacity-50 blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Lock size={16} className="text-white/50" />
                    </div>
                 </div>
               ))}
               <button 
                 onClick={addLockedPhoto}
                 className="aspect-square rounded-xl bg-[#232220] flex flex-col items-center justify-center border border-dashed border-[#5E534B]/50 text-[#5E534B] hover:bg-[#2A2927] hover:border-[#5E534B] transition-all active:scale-95"
               >
                  <Plus size={20} />
                  <span className="text-[10px] font-bold mt-1">ADD</span>
               </button>
            </div>
         </div>
      </div>

      {/* Shared With List */}
      <div className="space-y-4">
         <h3 className="text-sm font-bold text-[#8C8279] uppercase tracking-wider">Shared With</h3>
         {sharedWith.length > 0 ? (
           <div className="space-y-2">
             {PROFILES.filter(p => sharedWith.includes(p.id)).map(user => (
               <div key={user.id} className="flex items-center justify-between p-3 bg-[#232220] rounded-2xl">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                     </div>
                     <span className="font-bold">{user.name}</span>
                  </div>
                  <button 
                    onClick={() => toggleShare(user.id)}
                    className="px-3 py-1.5 bg-[#181817] text-[#8C8279] text-xs font-bold rounded-lg border border-white/5 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-colors"
                  >
                     Unshare
                  </button>
               </div>
             ))}
           </div>
         ) : (
           <div className="p-8 text-center text-[#8C8279] text-sm bg-[#232220] rounded-2xl border border-dashed border-white/5">
              No one has access to your locked album yet.
           </div>
         )}
      </div>
    </div>
  );

  // --- Chat View (Enhanced) ---
  const ChatView = () => {
    const chatUser = PROFILES.find(p => p.id === currentChatId) || PROFILES[0];
    const hasAccess = isShared(chatUser.id);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
     <div className="absolute inset-0 bg-[#181817] flex flex-col z-40">
        {/* Chat Header */}
        <div className="h-24 pt-10 px-4 flex items-center justify-between bg-[#1C1C1A]/90 backdrop-blur-md border-b border-white/5 z-20">
           <div className="flex items-center gap-2">
             <button onClick={() => setCurrentChatId(null)} className="p-2 -ml-2 text-[#5E534B] flex items-center gap-1 hover:text-[#8C8279] transition-colors">
                <ChevronLeft size={28} />
             </button>
             <div className="w-9 h-9 rounded-full overflow-hidden bg-[#232220]">
                <img src={chatUser.image} alt={chatUser.name} className="w-full h-full object-cover" />
             </div>
             <div className="flex flex-col">
                <span className="font-bold text-sm">{chatUser.name}</span>
                <span className="text-[10px] text-[#5E534B] font-bold tracking-wide uppercase">Online</span>
             </div>
           </div>
           <button className="p-2 text-[#8C8279]">
              <Settings size={20} />
           </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 pb-4 no-scrollbar">
           {messages.map((msg, i) => {
              const isMe = msg.sender === 'me';
              const isSystem = msg.sender === 'system';
              const prevMsg = messages[i - 1];
              const isChain = prevMsg && prevMsg.sender === msg.sender;
              
              if (isSystem) {
                return (
                  <div key={msg.id} className="flex justify-center my-6">
                     <div className="bg-[#232220] border border-[#5E534B]/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                        <Unlock size={12} className="text-[#5E534B]" />
                        <span className="text-[10px] font-bold text-[#8C8279] uppercase tracking-wide">
                          {msg.text}
                        </span>
                     </div>
                  </div>
                );
              }

              return (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={msg.id} 
                   className={cn(
                      "flex flex-col max-w-[75%]",
                      isMe ? "ml-auto items-end" : "mr-auto items-start",
                      !isChain && "mt-3"
                   )}
                 >
                    <div className={cn(
                       "px-4 py-2 text-[15px] leading-relaxed relative shadow-sm",
                       isMe 
                         ? "bg-[#5E534B] text-[#E8E6E3] rounded-2xl rounded-tr-md" 
                         : "bg-[#232220] text-[#E8E6E3] rounded-2xl rounded-tl-md",
                       isChain && isMe && "rounded-tr-2xl",
                       isChain && !isMe && "rounded-tl-2xl"
                    )}>
                       {msg.text}
                       
                       {/* Tail Logic */}
                       {!isChain && isMe && (
                          <div className="absolute -right-[6px] top-0 w-3 h-3 bg-[#5E534B]" style={{ clipPath: 'polygon(0 0, 0% 100%, 100% 100%)', borderBottomLeftRadius: '12px' }} />
                       )}
                       {!isChain && !isMe && (
                          <div className="absolute -left-[6px] top-0 w-3 h-3 bg-[#232220]" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)', borderBottomRightRadius: '12px' }} />
                       )}
                    </div>
                    
                    {/* Status for last message only */}
                    {i === messages.length - 1 && isMe && (
                      <span className="text-[10px] text-[#52525b] font-medium mt-1 px-1">
                        Delivered
                      </span>
                    )}
                 </motion.div>
              );
           })}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#1C1C1A]/90 backdrop-blur-xl border-t border-white/5 pb-8 relative z-50">
           <div className="flex items-end gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-50 relative",
                    showAttachMenu ? "bg-[#5E534B] text-white rotate-45" : "bg-[#232220] text-[#8C8279]"
                  )}
                >
                   <Plus size={20} />
                </button>
                
                {/* Attachment Menu */}
                <AnimatePresence>
                  {showAttachMenu && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: -10 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute bottom-full left-0 mb-4 w-56 bg-[#232220] rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col p-1 origin-bottom-left z-40"
                    >
                       <AttachOption onClick={sendPhotoMessage} icon={<Camera size={18} />} label="Camera" />
                       <AttachOption onClick={sendPhotoMessage} icon={<ImageIcon size={18} />} label="Photos" />
                       <div className="h-px bg-white/5 my-1" />
                       <AttachOption 
                          icon={hasAccess ? <Unlock size={18} className="text-[#5E534B]" /> : <Lock size={18} />} 
                          label={hasAccess ? "Revoke Access" : "Share Locked Album"} 
                          onClick={() => toggleShare(chatUser.id)}
                          active={hasAccess}
                       />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex-1 relative">
                 <input 
                    type="text" 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="iMessage"
                    className="w-full bg-[#181817] text-[#E8E6E3] h-9 py-1.5 pl-4 pr-10 rounded-2xl border border-white/10 focus:outline-none focus:border-[#5E534B]/50 transition-colors placeholder:text-[#52525b] text-[15px]"
                 />
                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <button className="text-[#8C8279] hover:text-[#E8E6E3]"><Mic size={18} /></button>
                 </div>
              </div>

              <button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all",
                  newMessage.trim() 
                    ? "bg-[#5E534B] text-white shadow-lg shadow-[#5E534B]/20 scale-100" 
                    : "bg-[#232220] text-[#52525b] scale-90"
                )}
              >
                 <Send size={16} className={newMessage.trim() ? "ml-0.5" : ""} />
              </button>
           </div>
        </div>
     </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center p-8">
       {/* Device Frame */}
       <div className="relative w-[400px] h-[850px] bg-[#181817] rounded-[60px] shadow-2xl border-[8px] border-[#2A2A2A] overflow-hidden select-none">
          {/* Dynamic Island Area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-3xl z-50 pointer-events-none" />
          
          {/* Main App Container */}
          <div className="relative w-full h-full flex flex-col">
             
             {/* Only show main header if we are NOT in a chat */}
             {!currentChatId && <Header />}
             
             {/* Discovery Views */}
             {activeTab === 'discover' && !currentChatId && (
                <>
                   <div className={cn("absolute inset-0 transition-opacity duration-300", discoveryMode === 'map' ? "opacity-100 z-0" : "opacity-0 z-[-1]")}>
                      <MapView />
                   </div>
                   <div className={cn("absolute inset-0 transition-opacity duration-300", discoveryMode === 'grid' ? "opacity-100 z-0" : "opacity-0 z-[-1]")}>
                      <GridView />
                   </div>
                   {selectedProfile && <BottomSheet />}
                </>
             )}

             {/* Profile View */}
             {activeTab === 'profile' && !currentChatId && (
                <ProfileView />
             )}

             {/* Chats List Tab */}
             {activeTab === 'chats' && !currentChatId && (
                <div className="absolute inset-0 pt-32 px-4 bg-[#181817]">
                   <h2 className="text-3xl font-bold mb-4 text-[rgb(94,83,75)]">Chats</h2>
                   <div className="space-y-2">
                      <button onClick={() => setCurrentChatId(1)} className="w-full flex gap-4 p-4 bg-[#232220] rounded-2xl hover:bg-[#2A2927] transition-colors active:scale-98">
                         <div className="w-12 h-12 rounded-full overflow-hidden bg-black">
                            <img src={PROFILES[0].image} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 text-left">
                            <div className="flex justify-between items-baseline">
                               <span className="font-bold text-[rgb(94,83,75)]">Marcus</span>
                               <span className="text-xs text-[#52525b]">10:26 PM</span>
                            </div>
                            <p className="text-sm text-[#8C8279] line-clamp-1">I'll hold you to that.</p>
                         </div>
                      </button>
                   </div>
                </div>
             )}

             {/* Active Chat View */}
             {currentChatId && <ChatView />}
             
             {/* Bottom Navigation (Hide when in chat) */}
             {!currentChatId && (
               <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-[#181817]/90 backdrop-blur-md border-t border-white/5 flex justify-around items-start pt-4 z-40">
                  <NavButton 
                    active={activeTab === 'discover'} 
                    onClick={() => setActiveTab('discover')} 
                    icon={<MapIcon size={24} />} 
                    label="Discover" 
                  />
                  <NavButton 
                    active={activeTab === 'chats'} 
                    onClick={() => setActiveTab('chats')} 
                    icon={<MessageSquare size={24} />} 
                    label="Chats" 
                  />
                  <NavButton 
                    active={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')} 
                    icon={<User size={24} />} 
                    label="Profile" 
                  />
               </div>
             )}
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full z-50 pointer-events-none" />
       </div>
    </div>
  );
}

// --- Sub Components ---

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-colors duration-200",
      active ? "text-[#E8E6E3]" : "text-[#52525b] hover:text-[#8C8279]"
    )}
  >
     {React.cloneElement(icon as React.ReactElement, { className: active ? "fill-current" : "" })}
     <span className="text-[10px] font-bold">{label}</span>
  </button>
);

const AttachOption = ({ icon, label, onClick, active }: { icon: React.ReactNode, label: string, onClick?: () => void, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 p-3 w-full hover:bg-white/5 transition-colors text-sm font-semibold rounded-lg text-left",
      active ? "text-[#E8E6E3]" : "text-[#8C8279]"
    )}
  >
     {icon}
     <span>{label}</span>
     {active && <Check size={14} className="ml-auto text-[#5E534B]" />}
  </button>
);
