import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Plus, Filter, Sun, Moon, Package, AlertCircle, Zap, Trash2, X, Edit2, Check,
  Bell, BellRing, User, Clock, ChefHat, ShieldCheck, TrendingUp, Leaf, BarChart3, Sparkles,
  ArrowLeft, Settings, CheckCircle, Inbox, UserCircle, Mail, Shield, Award, Home
} from 'lucide-react';

/* ─── category emoji map ─── */
const CATEGORY_EMOJI = {
  Vegetables: '🥬', Fruits: '🍎', Dairy: '🧀', Meat: '🥩',
  Bakery: '🍞', Beverages: '☕', Snacks: '🍿', Other: '📦', All: '🍽️'
};
const CATEGORY_OPTIONS = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks', 'Other'];

export default function App() {
  /* ─── state ─── */
  const [isDark, setIsDark] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [groceries, setGroceries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'profile' | 'notifications'
  const [newItem, setNewItem] = useState({ name: '', quantity: '', category: 'Vegetables', purchaseDate: new Date().toISOString().split('T')[0] });
  const [profile, setProfile] = useState({ name: 'PantryChef User', email: '', notifyDaysBefore: 2, notificationsEnabled: true });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const pantryRef = useRef(null);
  const dashboardRef = useRef(null);

  /* ─── persistence ─── */
  useEffect(() => { const s = localStorage.getItem('pantryChef-theme'); if (s !== null) setIsDark(JSON.parse(s)); }, []);
  useEffect(() => { localStorage.setItem('pantryChef-theme', JSON.stringify(isDark)); }, [isDark]);
  useEffect(() => { const s = localStorage.getItem('pantryChef-profile'); if (s) setProfile(JSON.parse(s)); }, []);
  useEffect(() => { localStorage.setItem('pantryChef-profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { const s = localStorage.getItem('pantryChef-notifications'); if (s) setNotifications(JSON.parse(s)); }, []);
  useEffect(() => { localStorage.setItem('pantryChef-notifications', JSON.stringify(notifications)); }, [notifications]);

  useEffect(() => {
    const s = localStorage.getItem('pantryChef-groceries');
    if (s) { setGroceries(JSON.parse(s)); }
    else {
      setGroceries([
        { _id: '1', name: 'Tomato', category: 'Vegetables', quantity: 5, purchaseDate: '2026-02-08', expiryDate: '2026-02-15' },
        { _id: '2', name: 'Spinach', category: 'Vegetables', quantity: 200, purchaseDate: '2026-02-07', expiryDate: '2026-02-11' },
        { _id: '3', name: 'Milk', category: 'Dairy', quantity: 1, purchaseDate: '2026-02-06', expiryDate: '2026-02-12' },
        { _id: '4', name: 'Chicken', category: 'Meat', quantity: 500, purchaseDate: '2026-02-09', expiryDate: '2026-02-20' },
        { _id: '5', name: 'Bread', category: 'Bakery', quantity: 1, purchaseDate: '2026-02-05', expiryDate: '2026-02-10' },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { if (!loading) localStorage.setItem('pantryChef-groceries', JSON.stringify(groceries)); }, [groceries, loading]);

  /* ─── notifications generator ─── */
  useEffect(() => {
    if (loading || !profile.notificationsEnabled) return;
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const newN = [];
    groceries.forEach(item => {
      const exp = new Date(item.expiryDate); exp.setHours(0, 0, 0, 0);
      const dl = Math.ceil((exp - now) / 864e5);
      if (dl < 0 && !notifications.find(n => n.id === `expired-${item._id}`)) {
        newN.push({ id: `expired-${item._id}`, type: 'expired', title: `${item.name} has expired!`, message: `Expired ${Math.abs(dl)} day(s) ago.`, itemId: item._id, time: new Date().toISOString(), read: false });
      } else if (dl >= 0 && dl <= profile.notifyDaysBefore && !notifications.find(n => n.id === `expiring-${item._id}`)) {
        newN.push({ id: `expiring-${item._id}`, type: 'expiring', title: `${item.name} expiring soon!`, message: dl === 0 ? 'Expires today!' : `${dl} day(s) left.`, itemId: item._id, time: new Date().toISOString(), read: false });
      }
    });
    if (newN.length) setNotifications(prev => [...newN, ...prev].slice(0, 50));
  }, [groceries, loading, profile.notificationsEnabled, profile.notifyDaysBefore]);

  useEffect(() => { setUnreadCount(notifications.filter(n => !n.read).length); }, [notifications]);

  /* ─── helpers ─── */
  const getStatus = (d) => { const t = new Date(); t.setHours(0,0,0,0); const e = new Date(d); e.setHours(0,0,0,0); const dl = Math.ceil((e-t)/864e5); return dl < 0 ? 'expired' : dl <= 2 ? 'expiring' : 'fresh'; };
  const getDaysLeft = (d) => { const t = new Date(); t.setHours(0,0,0,0); const e = new Date(d); e.setHours(0,0,0,0); return Math.ceil((e-t)/864e5); };
  const estimateExpiry = (cat, date) => { const m = { Vegetables:7,Fruits:5,Dairy:10,Meat:3,Bakery:4,Beverages:30,Snacks:60,Other:14 }; const d = new Date(date); d.setDate(d.getDate()+(m[cat]||14)); return d.toISOString().split('T')[0]; };
  const getExpiryPercent = (purchase, expiry) => { const t = new Date(); t.setHours(0,0,0,0); const p = new Date(purchase); p.setHours(0,0,0,0); const e = new Date(expiry); e.setHours(0,0,0,0); const total = (e-p)/864e5; const elapsed = (t-p)/864e5; if (total <= 0) return 100; return Math.max(0, Math.min(100, (elapsed/total)*100)); };

  const addGrocery = () => { if (!newItem.name.trim() || !newItem.quantity) return; const ed = estimateExpiry(newItem.category, newItem.purchaseDate); setGroceries(prev => [...prev, { _id: Date.now().toString(), name: newItem.name.trim(), category: newItem.category, quantity: Number(newItem.quantity), purchaseDate: newItem.purchaseDate, expiryDate: ed }]); setNewItem({ name: '', quantity: '', category: 'Vegetables', purchaseDate: new Date().toISOString().split('T')[0] }); setShowAddModal(false); };
  const deleteGrocery = (id) => { setGroceries(prev => prev.filter(i => i._id !== id)); setNotifications(prev => prev.filter(n => n.itemId !== id)); };
  const startEdit = (item) => setEditingItem({ ...item });
  const saveEdit = () => { if (!editingItem.name.trim() || !editingItem.quantity) return; const ed = estimateExpiry(editingItem.category, editingItem.purchaseDate); setGroceries(prev => prev.map(i => i._id === editingItem._id ? { ...editingItem, expiryDate: ed } : i)); setEditingItem(null); };
  const scrollToPantry = () => { pantryRef.current?.scrollIntoView({ behavior: 'smooth' }); };
  const markNotifRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const clearNotifs = () => setNotifications([]);
  const timeAgo = (iso) => { const d = Date.now()-new Date(iso).getTime(); const m = Math.floor(d/60000); if (m<1) return 'Now'; if (m<60) return `${m}m`; const h = Math.floor(m/60); if (h<24) return `${h}h`; return `${Math.floor(h/24)}d`; };
  const goHome = () => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  /* ─── derived ─── */
  const filtered = groceries.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory === 'All' || i.category === selectedCategory));
  const stats = { total: groceries.length, expiring: groceries.filter(g => getStatus(g.expiryDate)==='expiring').length, expired: groceries.filter(g => getStatus(g.expiryDate)==='expired').length, fresh: groceries.filter(g => getStatus(g.expiryDate)==='fresh').length };
  const categories = ['All', ...new Set(groceries.map(g => g.category))];
  const freshPercent = stats.total > 0 ? Math.round((stats.fresh / stats.total) * 100) : 0;

  /* ─── style helpers ─── */
  const glass = isDark ? 'glass-card-dark' : 'glass-card-light';
  const inputCls = isDark ? 'bg-sky-950/30 border border-sky-800/30 text-white placeholder-sky-400/20 focus:border-sky-400 rounded-xl' : 'bg-white border border-sky-200 text-gray-900 placeholder-gray-400 focus:border-sky-500 rounded-xl';
  const labelCls = isDark ? 'text-sky-300/60 text-sm font-medium' : 'text-gray-500 text-sm font-medium';
  const sub = isDark ? 'text-sky-300/40' : 'text-gray-400';
  const statusBadge = (s) => s === 'fresh' ? (isDark ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200') : s === 'expiring' ? (isDark ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200') : (isDark ? 'bg-red-500/10 text-red-400/70 border border-red-500/15' : 'bg-red-50 text-red-500 border border-red-200');
  const statusLabel = (s) => s === 'fresh' ? 'Fresh' : s === 'expiring' ? 'Expiring' : 'Expired';
  const barColor = (s) => s === 'fresh' ? (isDark ? 'bg-emerald-400' : 'bg-emerald-500') : s === 'expiring' ? (isDark ? 'bg-amber-400' : 'bg-amber-500') : (isDark ? 'bg-red-400' : 'bg-red-500');

  /* ─── Ring SVG component ─── */
  const StatRing = ({ percent, color, size = 56 }) => {
    const r = 22; const c = 2 * Math.PI * r;
    return (
      <svg width={size} height={size} className="absolute -top-1 -right-1 opacity-30">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={isDark ? 'rgba(56,189,248,0.06)' : 'rgba(14,165,233,0.06)'} strokeWidth="3" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * percent / 100)}
          className="stat-ring" transform={`rotate(-90 ${size/2} ${size/2})`} />
      </svg>
    );
  };

  /* ─── LOADING ─── */
  if (loading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#050a10]' : 'bg-[#f8fbff]'}`}>
      <div className="text-center">
        <div className="spinner-glow mx-auto mb-5"></div>
        <p className={`${sub} text-sm`}>Loading your pantry...</p>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     ═══════════ NAVBAR (shared across all pages) ═══════════
     ═══════════════════════════════════════════════════════════════════════════ */
  const Navbar = () => (
    <nav className={`sticky top-0 z-50 animate-slide-down ${isDark ? 'glass-dark' : 'glass-light'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left */}
          <div className="flex items-center gap-6">
            {currentPage !== 'home' ? (
              <button onClick={goHome} className={`flex items-center gap-2 group ${isDark ? 'text-sky-300/60 hover:text-sky-200' : 'text-gray-500 hover:text-gray-700'}`}>
                <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                <span className="text-sm font-medium hidden sm:inline">Back</span>
              </button>
            ) : null}
            <button onClick={goHome} className="flex items-center gap-2.5 group">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition group-hover:scale-110 group-hover:shadow-lg ${isDark ? 'bg-sky-500/15 group-hover:shadow-sky-500/10' : 'bg-sky-100 group-hover:shadow-sky-200'}`}>
                <ChefHat size={18} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
              </div>
              <span className={`text-xl font-bold tracking-tight ${isDark ? 'gradient-text' : 'gradient-text-light'}`}>PantryChef</span>
            </button>
            
            {currentPage === 'home' && (
              <div className="hidden md:flex gap-1">
                <button onClick={() => dashboardRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition ${isDark ? 'text-sky-200/45 hover:text-sky-200 hover:bg-white/[0.03]' : 'text-gray-400 hover:text-gray-700 hover:bg-sky-50'}`}>
                  Dashboard
                </button>
                <button onClick={scrollToPantry}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition ${isDark ? 'text-sky-200/45 hover:text-sky-200 hover:bg-white/[0.03]' : 'text-gray-400 hover:text-gray-700 hover:bg-sky-50'}`}>
                  Pantry
                </button>
                <button onClick={() => setShowAddModal(true)}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${isDark ? 'text-sky-200/45 hover:text-sky-200 hover:bg-white/[0.03]' : 'text-gray-400 hover:text-gray-700 hover:bg-sky-50'}`}>
                  <Plus size={14} /> Add
                </button>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <button onClick={() => setCurrentPage('notifications')}
              className={`p-2.5 rounded-xl transition relative ${currentPage === 'notifications' ? (isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-600') : (isDark ? 'hover:bg-white/[0.04] text-sky-400/60 hover:text-sky-300' : 'hover:bg-sky-50 text-sky-400 hover:text-sky-600')}`}>
              {unreadCount > 0 ? <BellRing size={18} className={currentPage !== 'notifications' ? 'animate-wiggle' : ''} /> : <Bell size={18} />}
              {unreadCount > 0 && (
                <span className="absolute -top-0 -right-0 min-w-[17px] h-[17px] bg-sky-500 text-[#050a10] text-[10px] font-bold rounded-full flex items-center justify-center animate-pop-in px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile */}
            <button onClick={() => setCurrentPage('profile')}
              className={`p-2.5 rounded-xl transition ${currentPage === 'profile' ? (isDark ? 'bg-sky-500/15 text-sky-300' : 'bg-sky-100 text-sky-600') : (isDark ? 'hover:bg-white/[0.04] text-sky-400/60 hover:text-sky-300' : 'hover:bg-sky-50 text-sky-400 hover:text-sky-600')}`}>
              <User size={18} />
            </button>

            {currentPage === 'home' && (
              <button onClick={() => setShowAddModal(true)}
                className="bg-sky-500 hover:bg-sky-400 text-[#050a10] p-2.5 rounded-xl transition md:hidden btn-glow">
                <Plus size={18} />
              </button>
            )}

            <button onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl transition ${isDark ? 'hover:bg-white/[0.04] text-sky-400/60 hover:text-sky-300' : 'hover:bg-sky-50 text-sky-400 hover:text-sky-600'}`}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     ═══════════ PROFILE PAGE ═══════════
     ═══════════════════════════════════════════════════════════════════════════ */
  const ProfilePage = () => (
    <div className="min-h-[calc(100vh-4rem)] animate-slide-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className={`w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-sky-500/20 to-sky-600/10' : 'bg-gradient-to-br from-sky-100 to-sky-50'}`}>
            <span className={`text-4xl font-bold ${isDark ? 'text-sky-300' : 'text-sky-600'}`}>{(profile.name || 'G')[0].toUpperCase()}</span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{profile.name || 'Guest User'}</h1>
          <p className={`text-sm ${sub}`}>{profile.email || 'No email set'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Package, value: stats.total, label: 'Total Items', color: '#38bdf8' },
            { icon: Zap, value: stats.fresh, label: 'Fresh Items', color: '#34d399' },
            { icon: Bell, value: unreadCount, label: 'Unread Alerts', color: '#fbbf24' }
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-5 text-center animate-pop-in ${glass}`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}>
                <s.icon size={18} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className={`text-[10px] uppercase tracking-wider font-semibold mt-1 ${sub}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className={`rounded-2xl p-6 mb-6 animate-pop-in ${glass}`} style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}>
              <UserCircle size={18} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
            </div>
            <div>
              <h3 className="font-bold">Personal Information</h3>
              <p className={`text-xs ${sub}`}>Update your profile details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block mb-2 ${labelCls}`}>
                <span className="flex items-center gap-2"><User size={13} /> Display Name</span>
              </label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className={`w-full px-4 py-3 ${inputCls}`} placeholder="Your name" />
            </div>
            <div>
              <label className={`block mb-2 ${labelCls}`}>
                <span className="flex items-center gap-2"><Mail size={13} /> Email Address</span>
              </label>
              <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className={`w-full px-4 py-3 ${inputCls}`} placeholder="your@email.com" />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`rounded-2xl p-6 mb-6 animate-pop-in ${glass}`} style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}>
              <Settings size={18} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
            </div>
            <div>
              <h3 className="font-bold">Notification Settings</h3>
              <p className={`text-xs ${sub}`}>Configure your alert preferences</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Expiry Alerts</p>
                <p className={`text-xs mt-0.5 ${sub}`}>Get notified when items are about to expire</p>
              </div>
              <button onClick={() => setProfile({ ...profile, notificationsEnabled: !profile.notificationsEnabled })}
                className={`w-12 h-7 rounded-full transition-all relative ${profile.notificationsEnabled ? 'bg-sky-500 shadow-md shadow-sky-500/30' : (isDark ? 'bg-white/[0.06]' : 'bg-gray-200')}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-transform ${profile.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
              </button>
            </div>

            <div className={`pt-5 border-t ${isDark ? 'border-white/[0.04]' : 'border-sky-100'}`}>
              <label className={`block mb-3 ${labelCls}`}>Alert Days Before Expiry</label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 5, 7].map(d => (
                  <button key={d} onClick={() => setProfile({ ...profile, notifyDaysBefore: d })}
                    className={`py-3 rounded-xl text-sm font-bold transition ${profile.notifyDaysBefore === d
                      ? 'bg-sky-500 text-[#050a10] shadow-md shadow-sky-500/20'
                      : isDark ? 'bg-white/[0.03] text-sky-300/40 hover:bg-white/[0.06] hover:text-sky-200/60 border border-sky-800/8' : 'bg-white text-gray-400 hover:bg-sky-50 hover:text-sky-600 border border-sky-100/80'}`}>
                    {d} {d === 1 ? 'day' : 'days'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className={`rounded-2xl p-6 animate-pop-in ${glass}`} style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}>
              <Award size={18} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
            </div>
            <div>
              <h3 className="font-bold">Achievements</h3>
              <p className={`text-xs ${sub}`}>Your sustainability milestones</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {stats.total >= 1 && <AchievementBadge icon={<ChefHat size={13} />} label="Pantry Started" desc="Added first item" isDark={isDark} />}
            {stats.total >= 5 && <AchievementBadge icon={<Package size={13} />} label="Well Stocked" desc="5+ items tracked" isDark={isDark} />}
            {stats.total >= 10 && <AchievementBadge icon={<TrendingUp size={13} />} label="Pantry Pro" desc="10+ items tracked" isDark={isDark} />}
            {stats.expired === 0 && stats.total > 0 && <AchievementBadge icon={<Leaf size={13} />} label="Zero Waste" desc="No expired items" isDark={isDark} />}
            {profile.notificationsEnabled && <AchievementBadge icon={<BellRing size={13} />} label="Alert Pro" desc="Alerts enabled" isDark={isDark} />}
            {categories.length > 3 && <AchievementBadge icon={<BarChart3 size={13} />} label="Variety Chef" desc="3+ categories" isDark={isDark} />}
          </div>
          {stats.total === 0 && <p className={`text-sm ${sub}`}>Start adding items to unlock achievements!</p>}
        </div>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     ═══════════ NOTIFICATIONS PAGE ═══════════
     ═══════════════════════════════════════════════════════════════════════════ */
  const NotificationsPage = () => (
    <div className="min-h-[calc(100vh-4rem)] animate-slide-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isDark ? 'bg-sky-500/10' : 'bg-sky-50'}`}>
                <Bell size={22} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
              </div>
              Notifications
            </h1>
            <p className={`text-sm mt-2 ${sub}`}>Stay updated on your pantry items</p>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <button onClick={markAllRead}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${isDark ? 'bg-white/[0.03] text-sky-300/60 hover:bg-white/[0.06] hover:text-sky-200' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>
                <CheckCircle size={15} /> Mark all read
              </button>
              <button onClick={clearNotifs}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${isDark ? 'text-sky-300/30 hover:bg-white/[0.03] hover:text-sky-300/60' : 'text-gray-300 hover:bg-gray-50 hover:text-gray-500'}`}>
                <Trash2 size={15} /> Clear
              </button>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: notifications.length, color: isDark ? 'text-sky-400' : 'text-sky-600' },
            { label: 'Unread', value: unreadCount, color: isDark ? 'text-amber-400' : 'text-amber-600' },
            { label: 'Expired Alerts', value: notifications.filter(n => n.type === 'expired').length, color: isDark ? 'text-red-400' : 'text-red-500' }
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl px-5 py-4 text-center animate-pop-in ${glass}`} style={{ animationDelay: `${i * 0.06}s` }}>
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className={`text-xs font-semibold mt-1 ${sub}`}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Notification List */}
        {notifications.length === 0 ? (
          <div className={`rounded-2xl p-12 text-center animate-pop-in ${glass}`}>
            <div className={`w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center ${isDark ? 'bg-white/[0.03]' : 'bg-sky-50'}`}>
              <Inbox size={36} className={isDark ? 'text-sky-500/20' : 'text-sky-200'} />
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-sky-200/50' : 'text-gray-400'}`}>All caught up!</h3>
            <p className={`text-sm mb-6 ${sub}`}>No notifications yet. We'll alert you when items are expiring.</p>
            <button onClick={goHome}
              className="btn-ripple btn-glow bg-sky-500 hover:bg-sky-400 text-[#050a10] px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
              <Home size={15} /> Go to Dashboard
            </button>
          </div>
        ) : (
          <div className={`rounded-2xl overflow-hidden ${glass}`}>
            {notifications.map((n, idx) => (
              <div key={n.id} onClick={() => markNotifRead(n.id)}
                className={`px-5 py-4 cursor-pointer transition border-b last:border-b-0 animate-slide-in ${isDark ? 'border-white/[0.03]' : 'border-sky-100/60'} ${!n.read ? (isDark ? 'bg-sky-400/[0.03]' : 'bg-sky-50/40') : ''} ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-sky-50/50'}`}
                style={{ animationDelay: `${idx * 0.04}s` }}>
                <div className="flex gap-4 items-start">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'expired' ? (isDark ? 'bg-red-500/10' : 'bg-red-50') : (isDark ? 'bg-amber-500/10' : 'bg-amber-50')}`}>
                    <AlertCircle size={18} className={n.type === 'expired' ? (isDark ? 'text-red-400/80' : 'text-red-500') : (isDark ? 'text-amber-400' : 'text-amber-500')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`font-semibold leading-snug ${n.read ? sub : ''}`}>{n.title}</p>
                        <p className={`text-sm mt-1 ${sub}`}>{n.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 pt-1">
                        <span className={`text-xs font-medium ${sub}`}>{timeAgo(n.time)}</span>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-sky-400 notif-dot-pulse"></div>}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${n.type === 'expired' ? statusBadge('expired') : statusBadge('expiring')}`}>
                        {n.type === 'expired' ? 'Expired' : 'Expiring Soon'}
                      </span>
                      {n.read && <span className={`text-[10px] font-medium ${sub}`}>✓ Read</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Action */}
        {notifications.length > 0 && (
          <div className={`mt-6 rounded-2xl p-5 animate-pop-in ${glass}`} style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-amber-500/10' : 'bg-amber-50'}`}>
                  <Zap size={18} className={isDark ? 'text-amber-400' : 'text-amber-500'} />
                </div>
                <div>
                  <p className="font-semibold text-sm">Quick Tip</p>
                  <p className={`text-xs ${sub}`}>Check your pantry regularly to reduce food waste</p>
                </div>
              </div>
              <button onClick={goHome}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${isDark ? 'bg-white/[0.04] text-sky-300/70 hover:bg-white/[0.06]' : 'bg-sky-50 text-sky-600 hover:bg-sky-100'}`}>
                View Pantry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     ═══════════ HOME PAGE (Hero + Dashboard + Pantry) ═══════════
     ═══════════════════════════════════════════════════════════════════════════ */
  const HomePage = () => (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className={`relative overflow-hidden ${isDark ? 'bg-mesh-dark' : 'bg-mesh-light'}`}>
        <div className={`absolute inset-0 ${isDark ? 'dot-grid' : ''}`}></div>
        {isDark && <>
          <div className="glow-orb w-80 h-80 bg-sky-500/[0.06] top-[-25%] left-[8%]" style={{position:'absolute',borderRadius:'9999px',filter:'blur(80px)',pointerEvents:'none'}}></div>
          <div className="glow-orb w-96 h-96 bg-sky-600/[0.04] bottom-[-30%] right-[5%]" style={{position:'absolute',borderRadius:'9999px',filter:'blur(100px)',pointerEvents:'none'}}></div>
        </>}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="animate-hero">
            <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 ${isDark ? 'bg-sky-500/8 text-sky-400/80 border border-sky-500/12' : 'bg-sky-50 text-sky-600 border border-sky-200'}`}>
              <Sparkles size={12} /> Smart Pantry Management
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-5 tracking-tight leading-[1.1] animate-hero">
            Reduce Food Waste.
            <br />
            <span className={isDark ? 'gradient-text' : 'gradient-text-light'}>Cook Smarter.</span>
          </h2>
          <p className={`text-base md:text-lg mb-10 max-w-lg mx-auto animate-hero-delay leading-relaxed ${sub}`}>
            Track your groceries, get expiry alerts, and never waste food again.
          </p>
          <div className="flex gap-3 justify-center flex-wrap animate-hero-delay-2">
            <button onClick={() => setShowAddModal(true)}
              className="btn-ripple btn-glow bg-sky-500 hover:bg-sky-400 text-[#050a10] px-8 py-3.5 rounded-2xl font-semibold flex items-center gap-2 text-sm shadow-lg shadow-sky-500/20">
              <Plus size={18} /> Add Grocery
            </button>
            <button onClick={scrollToPantry}
              className={`px-8 py-3.5 rounded-2xl font-semibold text-sm transition ${isDark ? 'border border-sky-500/20 text-sky-300/80 hover:bg-white/[0.03] hover:border-sky-400/35' : 'border border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-400'}`}>
              View Pantry
            </button>
          </div>
          <div className={`mt-14 flex items-center justify-center gap-6 md:gap-8 animate-hero-delay-2 ${sub}`}>
            {[{ icon: Leaf, t: 'Eco Friendly' }, { icon: ShieldCheck, t: 'Privacy First' }, { icon: Zap, t: 'Instant Alerts' }].map((b, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs font-medium">
                <b.icon size={13} className={isDark ? 'text-sky-500/40' : 'text-sky-400'} /> {b.t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DASHBOARD ═══════════ */}
      <section ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Dashboard</h3>
            <p className={`text-sm mt-1 ${sub}`}>Your pantry at a glance</p>
          </div>
          <div className={`hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold ${isDark ? 'bg-emerald-500/8 text-emerald-400/70' : 'bg-emerald-50 text-emerald-600'}`}>
            <TrendingUp size={13} /> {freshPercent}% fresh
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {[
            { icon: Package, label: 'Total Items', value: stats.total, color: '#38bdf8', pct: 100 },
            { icon: AlertCircle, label: 'Expiring Soon', value: stats.expiring, color: '#fbbf24', pct: stats.total > 0 ? (stats.expiring/stats.total)*100 : 0 },
            { icon: Zap, label: 'Fresh Items', value: stats.fresh, color: '#34d399', pct: stats.total > 0 ? (stats.fresh/stats.total)*100 : 0 },
            { icon: Clock, label: 'Expired', value: stats.expired, color: '#f87171', pct: stats.total > 0 ? (stats.expired/stats.total)*100 : 0 }
          ].map((s, i) => (
            <div key={i} className={`relative rounded-2xl p-5 lg:p-6 hover-lift animate-pop-in group overflow-hidden ${glass}`}
              style={{ animationDelay: `${i * 0.08}s` }}>
              <StatRing percent={s.pct} color={s.color} />
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 animate-float ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}
                style={{ animationDelay: `${i * 0.5}s` }}>
                <s.icon size={20} style={{ color: s.color }} />
              </div>
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${sub}`}>{s.label}</p>
              <p className="text-3xl lg:text-4xl font-extrabold tracking-tight animate-count" style={{ animationDelay: `${i * 0.08 + 0.3}s` }}>{s.value}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${isDark ? 'bg-white/[0.02]' : 'bg-sky-100/50'}`}>
                <div className="h-full animate-progress rounded-full" style={{ width: `${s.pct}%`, background: s.color, opacity: 0.7, animationDelay: `${i*0.1+0.5}s` }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ PANTRY ═══════════ */}
      <section ref={pantryRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <h3 className="text-2xl font-bold tracking-tight">Your Pantry</h3>
            <p className={`text-sm mt-1 ${sub}`}>{filtered.length} {filtered.length === 1 ? 'item' : 'items'} {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}</p>
          </div>
          <button onClick={() => setShowAddModal(true)}
            className="btn-ripple btn-glow bg-sky-500 hover:bg-sky-400 text-[#050a10] px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 self-start shadow-md shadow-sky-500/15">
            <Plus size={15} /> Add Item
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="relative">
            <Search className={isDark ? 'absolute left-4 top-3 text-sky-400/25' : 'absolute left-4 top-3 text-sky-300'} size={17} />
            <input type="text" placeholder="Search groceries..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-11 pr-4 py-2.5 ${inputCls}`} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${selectedCategory === cat
                  ? 'bg-sky-500 text-[#050a10] shadow-md shadow-sky-500/20'
                  : isDark ? 'bg-white/[0.03] text-sky-300/45 hover:bg-white/[0.06] hover:text-sky-200/70 border border-sky-800/10' : 'bg-white text-gray-500 hover:bg-sky-50 hover:text-sky-600 border border-sky-100'}`}>
                <span className="text-sm">{CATEGORY_EMOJI[cat] || '📦'}</span> {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className={`rounded-2xl overflow-hidden ${glass}`}>
            <table className="w-full">
              <thead>
                <tr className={isDark ? 'bg-white/[0.02]' : 'bg-sky-50/60'}>
                  {['Item', 'Category', 'Qty', 'Freshness', 'Status', ''].map(h => (
                    <th key={h} className={`text-left px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.08em] ${isDark ? 'text-sky-400/35' : 'text-sky-500/60'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => {
                  const st = getStatus(item.expiryDate);
                  const dl = getDaysLeft(item.expiryDate);
                  const pct = getExpiryPercent(item.purchaseDate, item.expiryDate);
                  return (
                    <tr key={item._id} className={`animate-slide-in border-t group ${isDark ? 'border-white/[0.03] hover:bg-white/[0.02]' : 'border-sky-100/60 hover:bg-sky-50/30'}`}
                      style={{ animationDelay: `${i * 0.04}s` }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}>
                            {CATEGORY_EMOJI[item.category] || '📦'}
                          </div>
                          <span className="font-semibold text-sm">{item.name}</span>
                        </div>
                      </td>
                      <td className={`px-5 py-4 text-sm ${sub}`}>{item.category}</td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-semibold ${isDark ? 'text-sky-200/70' : 'text-gray-600'}`}>{item.quantity}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="w-28">
                          <div className="flex justify-between mb-1.5">
                            <span className={`text-[10px] font-semibold ${dl < 0 ? (isDark ? 'text-red-400/60' : 'text-red-400') : dl <= 2 ? (isDark ? 'text-amber-400/80' : 'text-amber-500') : (isDark ? 'text-emerald-400/60' : 'text-emerald-500')}`}>
                              {dl < 0 ? `${Math.abs(dl)}d overdue` : dl === 0 ? 'Today!' : `${dl}d left`}
                            </span>
                          </div>
                          <div className={`expiry-bar rounded-full ${isDark ? 'bg-white/[0.04]' : 'bg-sky-100'}`}>
                            <div className={`h-full rounded-full transition-all duration-1000 ${barColor(st)}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusBadge(st)}`}>{statusLabel(st)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(item)} className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-sky-500/10 text-sky-400/40 hover:text-sky-300' : 'hover:bg-sky-50 text-sky-300 hover:text-sky-600'}`}><Edit2 size={14} /></button>
                          <button onClick={() => deleteGrocery(item._id)} className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-red-500/10 text-sky-400/20 hover:text-red-400' : 'hover:bg-red-50 text-gray-300 hover:text-red-500'}`}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid gap-3">
          {filtered.map((item, i) => {
            const st = getStatus(item.expiryDate);
            const dl = getDaysLeft(item.expiryDate);
            const pct = getExpiryPercent(item.purchaseDate, item.expiryDate);
            return (
              <div key={item._id} className={`rounded-2xl p-4 animate-pop-in ${glass}`} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${isDark ? 'bg-white/[0.04]' : 'bg-sky-50'}`}>
                      {CATEGORY_EMOJI[item.category] || '📦'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[15px]">{item.name}</h4>
                      <p className={`text-xs ${sub}`}>{item.category} · Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    <button onClick={() => startEdit(item)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-sky-500/10 text-sky-400/40' : 'hover:bg-sky-50 text-sky-300'}`}><Edit2 size={14} /></button>
                    <button onClick={() => deleteGrocery(item._id)} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-red-500/10 text-sky-400/20' : 'hover:bg-red-50 text-gray-300'}`}><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${statusBadge(st)}`}>{statusLabel(st)}</span>
                  <span className={`text-[11px] font-semibold ${dl < 0 ? (isDark ? 'text-red-400/60' : 'text-red-400') : dl <= 2 ? (isDark ? 'text-amber-400' : 'text-amber-500') : sub}`}>
                    {dl < 0 ? `${Math.abs(dl)}d overdue` : dl === 0 ? 'Today' : `${dl}d left`}
                  </span>
                </div>
                <div className={`expiry-bar rounded-full ${isDark ? 'bg-white/[0.04]' : 'bg-sky-100'}`}>
                  <div className={`h-full rounded-full ${barColor(st)}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className={`text-center py-20 rounded-2xl ${glass}`}>
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-white/[0.03]' : 'bg-sky-50'}`}>
              <Package size={28} className={isDark ? 'text-sky-500/20' : 'text-sky-200'} />
            </div>
            <p className={`mb-1 font-semibold ${isDark ? 'text-sky-200/40' : 'text-gray-400'}`}>No items found</p>
            <p className={`text-sm mb-6 ${sub}`}>Start building your pantry</p>
            <button onClick={() => setShowAddModal(true)}
              className="btn-ripple btn-glow bg-sky-500 hover:bg-sky-400 text-[#050a10] px-6 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center gap-2">
              <Plus size={15} /> Add Your First Item
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className={`border-t fade-in ${isDark ? 'bg-white/[0.01] border-white/[0.04]' : 'bg-sky-50/30 border-sky-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDark ? 'bg-sky-500/8' : 'bg-sky-50'}`}>
                <ChefHat size={14} className={isDark ? 'text-sky-500/30' : 'text-sky-300'} />
              </div>
              <span className={`text-sm font-semibold ${isDark ? 'text-sky-300/30' : 'text-gray-400'}`}>PantryChef</span>
            </div>
            <p className={`text-[11px] ${sub}`}>© 2025 PantryChef · Reduce waste · Cook better · Live sustainably</p>
          </div>
        </div>
      </footer>
    </>
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     ═══════════ MAIN RENDER ═══════════
     ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-[#050a10] text-white' : 'bg-[#f8fbff] text-gray-900'}`}>
      <Navbar />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'profile' && <ProfilePage />}
      {currentPage === 'notifications' && <NotificationsPage />}

      {/* ═══════════ ADD MODAL ═══════════ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-modal-bg" onClick={() => setShowAddModal(false)}>
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl animate-modal-content ${isDark ? 'glass-card-dark' : 'glass-card-light'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-sky-500/10' : 'bg-sky-50'}`}>
                  <Plus size={18} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Add Grocery</h3>
                  <p className={`text-[11px] ${sub}`}>Track a new item</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-white/[0.04] text-sky-400/30' : 'hover:bg-sky-50 text-gray-300'}`}><X size={18} /></button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${labelCls}`}>Item Name *</label>
                <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Tomato, Milk, Rice" className={`w-full px-4 py-2.5 ${inputCls}`} autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 ${labelCls}`}>Quantity *</label>
                  <input type="number" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="e.g. 5" min="1" className={`w-full px-4 py-2.5 ${inputCls}`} />
                </div>
                <div>
                  <label className={`block mb-1.5 ${labelCls}`}>Category</label>
                  <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className={`w-full px-4 py-2.5 ${inputCls}`}>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c} className={isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}>{CATEGORY_EMOJI[c]} {c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block mb-1.5 ${labelCls}`}>Purchase Date</label>
                <input type="date" value={newItem.purchaseDate} onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
                  className={`w-full px-4 py-2.5 ${inputCls}`} />
              </div>
              <p className={`text-[11px] flex items-center gap-1.5 ${sub}`}><Sparkles size={10} /> Expiry auto-estimated by category</p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition ${isDark ? 'border border-white/[0.06] text-sky-300/40 hover:bg-white/[0.03] hover:text-sky-200/60' : 'border border-sky-200 text-gray-400 hover:bg-sky-50 hover:text-gray-600'}`}>
                  Cancel
                </button>
                <button onClick={addGrocery} disabled={!newItem.name.trim() || !newItem.quantity}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${!newItem.name.trim() || !newItem.quantity
                    ? (isDark ? 'bg-sky-500/10 text-sky-300/20 cursor-not-allowed' : 'bg-sky-50 text-sky-200 cursor-not-allowed')
                    : 'bg-sky-500 hover:bg-sky-400 text-[#050a10] btn-glow shadow-md shadow-sky-500/20'}`}>
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ EDIT MODAL ═══════════ */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-modal-bg" onClick={() => setEditingItem(null)}>
          <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl animate-modal-content ${isDark ? 'glass-card-dark' : 'glass-card-light'}`} onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-sky-500/10' : 'bg-sky-50'}`}>
                  <Edit2 size={18} className={isDark ? 'text-sky-400' : 'text-sky-600'} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Edit Item</h3>
                  <p className={`text-[11px] ${sub}`}>Update details</p>
                </div>
              </div>
              <button onClick={() => setEditingItem(null)} className={`p-2 rounded-xl transition ${isDark ? 'hover:bg-white/[0.04] text-sky-400/30' : 'hover:bg-sky-50 text-gray-300'}`}><X size={18} /></button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className={`block mb-1.5 ${labelCls}`}>Item Name</label>
                <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className={`w-full px-4 py-2.5 ${inputCls}`} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 ${labelCls}`}>Quantity</label>
                  <input type="number" value={editingItem.quantity} onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                    min="1" className={`w-full px-4 py-2.5 ${inputCls}`} />
                </div>
                <div>
                  <label className={`block mb-1.5 ${labelCls}`}>Category</label>
                  <select value={editingItem.category} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className={`w-full px-4 py-2.5 ${inputCls}`}>
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c} className={isDark ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}>{CATEGORY_EMOJI[c]} {c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block mb-1.5 ${labelCls}`}>Purchase Date</label>
                <input type="date" value={editingItem.purchaseDate?.split('T')[0] || ''} onChange={(e) => setEditingItem({ ...editingItem, purchaseDate: e.target.value })}
                  className={`w-full px-4 py-2.5 ${inputCls}`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditingItem(null)}
                  className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition ${isDark ? 'border border-white/[0.06] text-sky-300/40 hover:bg-white/[0.03] hover:text-sky-200/60' : 'border border-sky-200 text-gray-400 hover:bg-sky-50 hover:text-gray-600'}`}>
                  Cancel
                </button>
                <button onClick={saveEdit}
                  className="flex-1 bg-sky-500 hover:bg-sky-400 text-[#050a10] py-2.5 rounded-xl font-semibold text-sm btn-glow shadow-md shadow-sky-500/20 flex items-center justify-center gap-2">
                  <Check size={15} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Achievement Badge Component */
function AchievementBadge({ icon, label, desc, isDark }) {
  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition hover:scale-[1.02] cursor-default ${isDark ? 'bg-sky-500/6 border border-sky-500/8' : 'bg-sky-50 border border-sky-100'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-sky-500/10' : 'bg-sky-100'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs font-bold ${isDark ? 'text-sky-300/70' : 'text-sky-700'}`}>{label}</p>
        {desc && <p className={`text-[10px] ${isDark ? 'text-sky-400/30' : 'text-sky-400'}`}>{desc}</p>}
      </div>
    </div>
  );
}
