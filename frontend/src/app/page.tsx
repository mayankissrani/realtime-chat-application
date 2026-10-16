'use client';
import { useState, useEffect, FormEvent, useRef, ChangeEvent } from 'react';
import io from 'socket.io-client';
import { Send, Hash, User, Moon, Sun, Plus, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { UserButton, useUser, SignInButton } from "@clerk/nextjs";

let socket: any;

interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  sender: 'me' | 'other';
  senderName?: string;
  senderImage?: string;
  channelId: string;
}

interface Channel {
  id: string;
  name: string;
}

export default function ThreadlyChat() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Channels State
  const [channels, setChannels] = useState<Channel[]>([
    { id: 'general', name: 'General' },
    { id: 'random', name: 'Random' }
  ]);
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');

  useEffect(() => {
    socket = io('http://localhost:5000');
    
    socket.emit('join_channel', activeChannel);
    
    socket.on('receive_message', (data: Message) => {
      setMessages((prev) => [...prev, { ...data, sender: 'other' }]);
    });

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const switchChannel = (channelId: string) => {
    if (channelId === activeChannel) return;
    socket.emit('leave_channel', activeChannel);
    setActiveChannel(channelId);
    socket.emit('join_channel', channelId);
  };

  const handleCreateChannel = (e: FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    
    const newChannelId = newChannelName.toLowerCase().replace(/\s+/g, '-');
    setChannels(prev => [...prev, { id: newChannelId, name: newChannelName }]);
    setNewChannelName('');
    setIsCreatingChannel(false);
    switchChannel(newChannelId);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isSignedIn) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        const newMsg: Message = {
          id: crypto.randomUUID(),
          imageUrl: data.url,
          sender: 'me',
          senderName: user?.fullName || user?.firstName || 'Anonymous',
          senderImage: user?.imageUrl,
          channelId: activeChannel
        };

        setMessages((prev) => [...prev, newMsg]);
        socket.emit('send_message', newMsg);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isSignedIn) return;

    const newMsg: Message = { 
      id: crypto.randomUUID(), 
      text: input, 
      sender: 'me',
      senderName: user?.fullName || user?.firstName || 'Anonymous',
      senderImage: user?.imageUrl,
      channelId: activeChannel
    };
    
    setMessages((prev) => [...prev, newMsg]);
    socket.emit('send_message', newMsg);
    setInput('');
  };

  const currentChannelName = channels.find(c => c.id === activeChannel)?.name || 'Unknown Channel';
  const activeChannelMessages = messages.filter(m => m.channelId === activeChannel);

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf9f6] dark:bg-zinc-950 font-sans selection:bg-brand-200 dark:selection:bg-brand-800 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-72 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-r border-brand-100 dark:border-zinc-800/50 flex flex-col shadow-sm z-10 transition-colors duration-300">
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-serif tracking-tight text-brand-800 dark:text-brand-300">Threadly.</h1>
          <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          <div className="flex items-center justify-between mb-3 px-2">
            <p className="text-xs font-semibold text-brand-400 dark:text-zinc-500 uppercase tracking-wider">Channels</p>
            <button 
              onClick={() => setIsCreatingChannel(true)}
              className="p-1 rounded-md hover:bg-brand-100 dark:hover:bg-zinc-800 text-brand-500 dark:text-zinc-400 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          
          {isCreatingChannel && (
            <form onSubmit={handleCreateChannel} className="mb-4 px-2 relative animate-in fade-in zoom-in duration-200">
              <input
                autoFocus
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="Channel name..."
                className="w-full px-3 py-2 text-sm bg-white dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-zinc-800 dark:text-zinc-200"
              />
              <button type="button" onClick={() => setIsCreatingChannel(false)} className="absolute right-4 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X size={14} />
              </button>
            </form>
          )}
          
          <div className="space-y-1">
            {channels.map(channel => (
              <div 
                key={channel.id}
                onClick={() => switchChannel(channel.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all shadow-sm ${
                  activeChannel === channel.id 
                    ? 'bg-brand-50 dark:bg-zinc-800/80 border-brand-200 dark:border-zinc-700 text-brand-900 dark:text-zinc-100' 
                    : 'bg-transparent border-transparent hover:bg-brand-50/50 dark:hover:bg-zinc-800/40 text-zinc-600 dark:text-zinc-400 hover:text-brand-800 dark:hover:text-zinc-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  activeChannel === channel.id 
                    ? 'bg-brand-200 dark:bg-zinc-700 text-brand-700 dark:text-zinc-200' 
                    : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500'
                }`}>
                  <Hash size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium">{channel.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-brand-100 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-3 p-2">
            {!isLoaded ? (
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
            ) : isSignedIn ? (
              <>
                <UserButton afterSignOutUrl="/" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[100px]">
                  {user.firstName || 'User'}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-500 dark:text-zinc-300">
                    <User size={16} />
                 </div>
                 <SignInButton mode="modal">
                   <button className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline">Sign In</button>
                 </SignInButton>
              </div>
            )}
          </div>
          
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-brand-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-transparent">
        {/* Header */}
        <header className="px-8 py-6 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-b border-brand-100 dark:border-zinc-800/50 sticky top-0 z-10 flex items-center justify-between transition-colors duration-300">
          <div>
            <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
              <Hash size={18} className="text-brand-500" />
              {currentChannelName}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Real-time discussion space</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
          {!isSignedIn ? (
            <div className="h-full flex flex-col items-center justify-center text-brand-400 dark:text-zinc-600 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-zinc-800 flex items-center justify-center rotate-3 transition-colors">
                   <User size={32} className="text-brand-500 dark:text-zinc-500" />
                </div>
                <p className="text-sm font-medium">Please sign in to view and send messages.</p>
            </div>
          ) : activeChannelMessages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-brand-400 dark:text-zinc-600 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-brand-100 dark:bg-zinc-800 flex items-center justify-center rotate-3 transition-colors">
                   <Hash size={32} className="text-brand-500 dark:text-zinc-500" />
                </div>
                <p className="text-sm font-medium">It's quiet in #{currentChannelName}... send a message to start!</p>
             </div>
          ) : (
            activeChannelMessages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in duration-300`}>
                {msg.sender === 'other' && msg.senderImage && (
                  <img src={msg.senderImage} alt={msg.senderName} className="w-8 h-8 rounded-full mt-1 object-cover shadow-sm" />
                )}
                {msg.sender === 'other' && !msg.senderImage && (
                   <div className="w-8 h-8 rounded-full mt-1 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-500">
                     {msg.senderName?.charAt(0).toUpperCase() || '?'}
                   </div>
                )}
                <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  {msg.sender === 'other' && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 mb-1 ml-1">{msg.senderName}</span>
                  )}
                  <div
                    className={`max-w-md shadow-sm text-sm overflow-hidden ${
                      msg.imageUrl ? 'p-1 rounded-2xl bg-white dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700' : 
                      msg.sender === 'me'
                        ? 'px-5 py-3.5 bg-brand-600 dark:bg-brand-700 text-white rounded-3xl rounded-tr-sm'
                        : 'px-5 py-3.5 bg-white dark:bg-zinc-800 border border-brand-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-3xl rounded-tl-sm'
                    } transition-colors`}
                  >
                    {msg.imageUrl ? (
                      <img src={msg.imageUrl} alt="Shared upload" className="rounded-xl max-h-64 object-cover w-full" />
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-t border-brand-100 dark:border-zinc-800/50 transition-colors duration-300">
          <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto relative items-center">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            
            <button
              type="button"
              disabled={!isSignedIn || isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 flex items-center justify-center bg-white dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-full hover:bg-brand-50 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-all shadow-sm disabled:opacity-50"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin text-brand-500" /> : <ImageIcon size={18} />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isSignedIn ? `Message #${currentChannelName}...` : "Sign in to chat..."}
              disabled={!isSignedIn}
              className="flex-1 px-6 py-4 bg-white dark:bg-zinc-800 border border-brand-200 dark:border-zinc-700 rounded-full focus:outline-none focus:ring-4 focus:ring-brand-100/50 dark:focus:ring-brand-900/30 transition-all text-sm shadow-sm placeholder:text-zinc-400 dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            
            <button
              type="submit"
              disabled={!input.trim() || !isSignedIn}
              className="w-14 h-14 flex items-center justify-center bg-brand-600 dark:bg-brand-700 hover:bg-brand-700 dark:hover:bg-brand-600 disabled:bg-brand-300 dark:disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white rounded-full transition-all shadow-md shadow-brand-200 dark:shadow-none active:scale-95"
            >
              <Send size={18} className="ml-1" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
