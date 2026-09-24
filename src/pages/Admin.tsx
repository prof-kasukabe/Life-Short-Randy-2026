import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';
import { Shield, Lock, Mail, Key, UserCheck, AlertCircle, LogOut, CheckCircle2, Loader2, Plus, Edit2, Trash2, Settings, Code2, Sparkles, Database } from 'lucide-react';
import { itProjectsData } from '../data';

export function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [curatedSpace, setCuratedSpace] = useState<'verbal' | 'visual'>('verbal');
  const [activeTab, setActiveTab] = useState<'portfolio' | 'visual' | 'blog' | 'media' | 'bookmarks' | 'it_projects'>('it_projects');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auth & Access states
  const [isDirectAccess, setIsDirectAccess] = useState(false);
  const [adminId, setAdminId] = useState('randyeef00@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [formData, setFormData] = useState<any>({
    status: 'in_progress',
    category: 'Full-Stack',
    progressPercentage: 70
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email !== 'randyeef00@gmail.com') {
        signOut(auth);
        setUser(null);
        setAuthError('Unauthorized access. Only admin (randyeef00@gmail.com) can log in.');
      } else {
        setUser(currentUser);
      }
    });

    if (user || isDirectAccess) {
      fetchData(activeTab);
    }

    return () => unsubscribe();
  }, [activeTab, curatedSpace, user, isDirectAccess]);

  const getCollectionName = (tab: string) => {
    if (tab === 'portfolio') return curatedSpace === 'verbal' ? 'portfolios' : 'visuals';
    if (tab === 'it_projects') return 'it_projects';
    if (tab === 'blog') return 'blogs';
    if (tab === 'bookmarks') return 'bookmarks';
    return 'media';
  };

  const fetchData = async (tab: 'portfolio' | 'visual' | 'blog' | 'media' | 'bookmarks' | 'it_projects') => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, getCollectionName(tab)));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data.reverse());
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== 'randyeef00@gmail.com') {
        await signOut(auth);
        setAuthError('Unauthorized access. Only admin (randyeef00@gmail.com) can log in.');
      }
    } catch (error: any) {
      console.error("Auth popup error: ", error);
      setAuthError(error.message || 'Google Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    if (!adminId.trim() || !adminPassword.trim()) {
      setAuthError('Please fill in both ID/Email and Password.');
      setAuthLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, adminId, adminPassword);
      } else {
        await signInWithEmailAndPassword(auth, adminId, adminPassword);
      }
    } catch (error: any) {
      console.error("Auth error", error);
      setAuthError(error.message || 'Authentication failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Signout error:", e);
    }
    setUser(null);
    setIsDirectAccess(false);
  };

  const cleanDataForFirestore = (data: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (val !== undefined && val !== null) {
        cleaned[key] = val;
      }
    });
    return cleaned;
  };

  const executeDelete = async (id: string) => {
    try {
      const collectionName = getCollectionName(activeTab);
      await deleteDoc(doc(db, collectionName, id));
      setConfirmDeleteId(null);
      setFormFeedback({ type: 'success', message: 'Item berhasil dihapus!' });
      fetchData(activeTab);
    } catch (error: any) {
      console.error("Error deleting doc: ", error);
      setFormFeedback({ type: 'error', message: `Gagal menghapus: ${error.message || 'Koneksi error'}` });
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    if (activeTab === 'it_projects') {
      const editCopy = { ...item };
      if (Array.isArray(editCopy.techStack)) {
        editCopy.techStack = editCopy.techStack.join(', ');
      }
      if (Array.isArray(editCopy.features)) {
        editCopy.features = editCopy.features.join('\n');
      }
      setFormData(editCopy);
    } else {
      setFormData(item);
    }
    setFormFeedback(null);
  };

  const handleSeedITProjects = async () => {
    setLoading(true);
    setFormFeedback(null);
    try {
      for (const p of itProjectsData) {
        const { id, ...rest } = p;
        await addDoc(collection(db, 'it_projects'), {
          ...rest,
          createdAt: serverTimestamp()
        });
      }
      setFormFeedback({ type: 'success', message: 'Semua 7 contoh Proyek TI berhasil dimuat ke Firestore!' });
      fetchData('it_projects');
    } catch (e: any) {
      setFormFeedback({ type: 'error', message: `Gagal memuat: ${e.message || 'Error'}` });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormFeedback(null);

    const collectionName = getCollectionName(activeTab);
    let rawData: Record<string, any> = { ...formData };

    // Set intelligent fallbacks based on active section
    if (activeTab === 'it_projects') {
      if (!rawData.status) rawData.status = 'in_progress';
      if (!rawData.category) rawData.category = 'Full-Stack';
      if (typeof rawData.techStack === 'string') {
        rawData.techStack = rawData.techStack.split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (!Array.isArray(rawData.techStack) || rawData.techStack.length === 0) {
        rawData.techStack = ['TypeScript', 'React'];
      }
      if (typeof rawData.features === 'string') {
        rawData.features = rawData.features.split('\n').map((s: string) => s.trim()).filter(Boolean);
      }
      if (rawData.progressPercentage !== undefined && rawData.progressPercentage !== '') {
        rawData.progressPercentage = Number(rawData.progressPercentage);
      }
      if (!rawData.imageUrl) {
        rawData.imageUrl = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';
      }
    } else if (activeTab === 'portfolio' && curatedSpace === 'visual') {
      if (!rawData.date) rawData.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!rawData.mediaType) rawData.mediaType = 'video';
    } else if (activeTab === 'portfolio' && curatedSpace === 'verbal') {
      if (!rawData.category) rawData.category = 'General';
      if (!rawData.date) rawData.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!rawData.imageUrl) rawData.imageUrl = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=800&auto=format&fit=crop';
    } else if (activeTab === 'blog') {
      if (!rawData.date) rawData.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (!rawData.excerpt && rawData.content) {
        rawData.excerpt = rawData.content.slice(0, 150) + (rawData.content.length > 150 ? '...' : '');
      }
    } else if (activeTab === 'media') {
      if (!rawData.category) rawData.category = 'video';
      if (!rawData.platform) rawData.platform = rawData.url?.includes('youtu') ? 'YouTube' : 'Web';
      if (!rawData.date) rawData.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const autoThumb = getMediaThumbnail(rawData.url, rawData.thumbnailUrl);
      if (autoThumb) {
        rawData.thumbnailUrl = autoThumb;
      }
    } else if (activeTab === 'bookmarks') {
      if (!rawData.category) rawData.category = 'General';
    }

    const dataToSave = cleanDataForFirestore(rawData);

    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), dataToSave);
        setFormFeedback({ type: 'success', message: 'Item berhasil diperbarui!' });
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
        setFormFeedback({ type: 'success', message: 'Item baru berhasil ditambahkan!' });
        
        // Optimistic addition
        const newItem = { id: docRef.id, ...dataToSave, createdAt: new Date() };
        setItems(prev => [newItem, ...prev]);
      }

      setFormData({});
      setEditingId(null);
      fetchData(activeTab);
    } catch (error: any) {
      console.error("Error saving to Firestore: ", error);
      setFormFeedback({ 
        type: 'error', 
        message: `Gagal menyimpan item: ${error.message || 'Periksa koneksi database Firestore.'}` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const updated = { ...prev, [name]: value };
      if (activeTab === 'media' && name === 'url' && value) {
        if (!prev.platform && (value.includes('youtube.com') || value.includes('youtu.be'))) {
          updated.platform = 'YouTube';
        }
      }
      return updated;
    });
  };

  if (!user && !isDirectAccess) {
    return (
      <div className="pt-24 pb-32 flex flex-col items-center justify-center min-h-[65vh] px-4">
        <Helmet>
          <title>Admin Login - Randy</title>
        </Helmet>
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm text-left">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-3 border border-orange-500/20">
              <Shield size={24} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] dark:text-[#E84634] mb-1 block">Management</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#E84634] dark:text-[#E84634]">Admin Access<span className="text-[#E84634]">.</span></h1>
            <p className="text-xs sm:text-sm text-[#E84634] dark:text-[#E84634] mt-1">
              Sign in with your Google account or enter Admin ID to access your data.
            </p>
          </div>

          {authError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Primary Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-orange-600 dark:bg-zinc-100 dark:text-[#E84634] dark:hover:bg-orange-500 dark:hover:text-white text-white rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-3 border border-transparent group mb-4"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-950 px-2 text-[#E84634] font-medium">Atau ID Admin</span>
            </div>
          </div>

          <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">
                Admin ID / Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E84634]" />
                <input
                  type="text"
                  placeholder="e.g. randy955"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-[#E84634] dark:text-[#E84634] focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#E84634]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-[#E84634] dark:text-[#E84634] focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Lock size={16} />
              {authLoading ? 'Loading...' : (isRegistering ? 'Register with Email' : 'Sign In with Email')}
            </button>
          </form>

          <button 
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full mt-4 py-2.5 px-4 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[#E84634] dark:text-[#E84634] rounded-xl font-medium text-xs transition-all flex items-center justify-center gap-2 border border-zinc-200/80 dark:border-zinc-800/80"
          >
            <UserCheck size={14} className="text-orange-500" />
            <span>{isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin Dashboard - Randy</title>
      </Helmet>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E84634] dark:text-[#E84634] mb-1 block">Control Center</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E84634] dark:text-[#E84634] flex items-center gap-3">
            <Settings className="text-[#E84634]" size={32} />
            Admin Dashboard<span className="text-[#E84634]">.</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/20 px-3.5 py-2 rounded-full">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-5 h-5 rounded-full object-cover shrink-0" />
            ) : (
              <Shield size={14} className="text-orange-500 shrink-0" />
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                {user?.email || 'randyeef00@gmail.com'}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-orange-500/20 text-orange-600 dark:text-orange-300">
                Admin
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#E84634] hover:text-red-500 transition-colors ml-1"
              title="Keluar"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => { setActiveTab('it_projects'); setFormData({ status: 'in_progress', category: 'Full-Stack', progressPercentage: 70 }); setEditingId(null); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'it_projects' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:text-[#E84634] dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
          >
            <Code2 size={14} />
            <span>IT Projects</span>
          </button>
          <button 
            onClick={() => { setActiveTab('portfolio'); setFormData({}); setEditingId(null); }}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'portfolio' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:text-[#E84634] dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
          >
            Curated Works
          </button>
        <button 
          onClick={() => { setActiveTab('blog'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'blog' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:text-[#E84634] dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Reading List
        </button>
        <button 
          onClick={() => { setActiveTab('media'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'media' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:text-[#E84634] dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Watch &amp; Listen
        </button>
        <button 
          onClick={() => { setActiveTab('bookmarks'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'bookmarks' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:text-[#E84634] dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Bookmarks
        </button>
      </div>

      {activeTab === 'it_projects' && (
        <button
          type="button"
          onClick={handleSeedITProjects}
          className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border border-orange-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Muat 7 contoh proyek TI bawaan ke Firestore"
        >
          <Database size={13} />
          <span>Muat Contoh Proyek TI ke DB</span>
        </button>
      )}
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#E84634] dark:text-[#E84634] mb-4">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            
            {formFeedback && (
              <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 mb-4 ${
                formFeedback.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
              }`}>
                {formFeedback.type === 'success' ? <CheckCircle2 size={16} className="shrink-0 text-emerald-500" /> : <AlertCircle size={16} className="shrink-0 text-red-500" />}
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'portfolio' && (
                <div className="mb-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-2">Space Type</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setCuratedSpace('verbal'); setFormData({}); setEditingId(null); }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${curatedSpace === 'verbal' ? 'bg-[#E84634] text-white' : 'bg-zinc-100 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'}`}
                    >
                      Verbal
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCuratedSpace('visual'); setFormData({}); setEditingId(null); }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${curatedSpace === 'visual' ? 'bg-[#E84634] text-white' : 'bg-zinc-100 text-[#E84634] hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800'}`}
                    >
                      Visual
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title || ''} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Icon Image (Optional)</label>
                <div className="flex items-center gap-2">
                  {formData.iconUrl && (
                    <img src={formData.iconUrl} alt="Preview" className="w-8 h-8 object-contain bg-zinc-100 dark:bg-zinc-800 rounded-lg" />
                  )}
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormData({ ...formData, iconUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full text-xs text-[#E84634] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
                  />
                  {formData.iconUrl && (
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, iconUrl: '' })}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              
              {activeTab === 'it_projects' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Tagline / Ringkasan</label>
                    <input 
                      type="text" 
                      name="tagline" 
                      placeholder="e.g. Autonomous visual workflow orchestrator..."
                      value={formData.tagline || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Status Proyek</label>
                      <select
                        name="status"
                        value={formData.status || 'in_progress'}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all cursor-pointer font-medium"
                      >
                        <option value="in_progress">Sedang Dikerjakan (In Progress)</option>
                        <option value="completed">Selesai (Completed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Kategori Domain</label>
                      <select
                        name="category"
                        value={formData.category || 'Full-Stack'}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all cursor-pointer font-medium"
                      >
                        <option value="Full-Stack">Full-Stack</option>
                        <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend & API">Backend &amp; API</option>
                        <option value="DevOps & Cloud">DevOps &amp; Cloud</option>
                        <option value="Mobile App">Mobile App</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Timeline</label>
                      <input 
                        type="text" 
                        name="timeline" 
                        placeholder="e.g. Jul 2026 - Present"
                        value={formData.timeline || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Progress (%)</label>
                      <input 
                        type="number" 
                        name="progressPercentage" 
                        min="0"
                        max="100"
                        placeholder="e.g. 80"
                        value={formData.progressPercentage !== undefined ? formData.progressPercentage : 100} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Tech Stack (Pisahkan dengan koma)</label>
                    <input 
                      type="text" 
                      name="techStack" 
                      placeholder="React 19, TypeScript, Python, FastAPI, Docker"
                      value={formData.techStack || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">URL Gambar / Screenshot</label>
                    <input 
                      type="text" 
                      name="imageUrl" 
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Live Demo URL</label>
                      <input 
                        type="url" 
                        name="demoUrl" 
                        placeholder="https://app.example.com"
                        value={formData.demoUrl || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">GitHub Repo URL</label>
                      <input 
                        type="url" 
                        name="githubUrl" 
                        placeholder="https://github.com/..."
                        value={formData.githubUrl || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Deskripsi Lengkap</label>
                    <textarea 
                      name="description" 
                      rows={3}
                      placeholder="Jelaskan tujuan proyek, masalah yang diselesaikan, dan dampaknya..."
                      value={formData.description || ''} 
                      onChange={handleInputChange} 
                      required
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Ringkasan Arsitektur Sistem</label>
                    <textarea 
                      name="architectureSummary" 
                      rows={2}
                      placeholder="Contoh: Microservice architecture separating React canvas from containerized FastAPI..."
                      value={formData.architectureSummary || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Fitur Unggulan (1 per baris)</label>
                    <textarea 
                      name="features" 
                      rows={3}
                      placeholder="Drag-and-drop workflow canvas&#10;Async worker cluster Celery + Redis&#10;WebSocket live inspection"
                      value={formData.features || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-xs"
                    />
                  </div>
                </>
              )}

              {activeTab === 'portfolio' && curatedSpace === 'verbal' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Date</label>
                    <input 
                      type="text" 
                      name="date" 
                      placeholder="e.g. Oct 12, 2026"
                      value={formData.date || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Category</label>
                    <input 
                      type="text" 
                      name="category" 
                      value={formData.category || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Project Image (URL or Upload)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="url" 
                        name="imageUrl" 
                        placeholder="e.g. https://images.unsplash.com/..."
                        value={formData.imageUrl || ''} 
                        onChange={handleInputChange} 
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                      {formData.imageUrl && (
                        <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                      )}
                      <div className="flex items-center gap-2">
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, imageUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-[#E84634] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
                        />
                        {formData.imageUrl && (
                          <button 
                            type="button" 
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="text-xs font-medium text-red-500 whitespace-nowrap hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description || ''} 
                      onChange={handleInputChange} 
                      required 
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'portfolio' && curatedSpace === 'visual' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Date</label>
                    <input 
                      type="text" 
                      name="date" 
                      placeholder="e.g. Oct 12, 2026"
                      value={formData.date || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Media Type</label>
                    <select
                      name="mediaType"
                      value={formData.mediaType || 'video'}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    >
                      <option value="video">Video (MP4)</option>
                      <option value="image">Image (GIF/PNG/JPG)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Media Source (URL or Upload Base64)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="url" 
                        name="mediaUrl" 
                        placeholder="e.g. https://.../video.mp4"
                        value={formData.mediaUrl || ''} 
                        onChange={handleInputChange} 
                        required
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      />
                      {formData.mediaUrl && formData.mediaType === 'image' && (
                        <img src={formData.mediaUrl} alt="Preview" className="w-full h-32 object-cover bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
                      )}
                      {formData.mediaUrl && formData.mediaType === 'video' && (
                        <video src={formData.mediaUrl} className="w-full h-32 object-cover bg-zinc-100 dark:bg-zinc-800 rounded-xl" controls />
                      )}
                      <div className="flex items-center gap-2">
                        <input 
                          type="file"
                          accept={formData.mediaType === 'video' ? 'video/mp4,video/webm' : 'image/*'}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setFormData({ ...formData, mediaUrl: reader.result as string });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="w-full text-xs text-[#E84634] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
                        />
                        {formData.mediaUrl && (
                          <button 
                            type="button" 
                            onClick={() => setFormData({ ...formData, mediaUrl: '' })}
                            className="text-xs font-medium text-red-500 whitespace-nowrap hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description || ''} 
                      onChange={handleInputChange} 
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'blog' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Date</label>
                    <input 
                      type="text" 
                      name="date" 
                      placeholder="e.g. Oct 12, 2026"
                      value={formData.date || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Source URL (Optional)</label>
                    <input 
                      type="url" 
                      name="url" 
                      placeholder="e.g. https://example.com/article"
                      value={formData.url || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Content</label>
                    <textarea 
                      name="content" 
                      value={formData.content || ''} 
                      onChange={handleInputChange} 
                      required 
                      rows={5}
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'media' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Category</label>
                    <select 
                      name="category" 
                      value={formData.category || 'video'} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    >
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Platform</label>
                    <input 
                      type="text" 
                      name="platform" 
                      placeholder="e.g. YouTube, Spotify"
                      value={formData.platform || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Date</label>
                    <input 
                      type="text" 
                      name="date" 
                      placeholder="e.g. Oct 12, 2026"
                      value={formData.date || ''} 
                      onChange={handleInputChange} 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Media Link (URL)</label>
                    <input 
                      type="url" 
                      name="url" 
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={formData.url || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                    {getMediaThumbnail(formData.url, formData.thumbnailUrl) && (
                      <div className="mt-2.5 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl flex items-center gap-3">
                        <img 
                          src={getMediaThumbnail(formData.url, formData.thumbnailUrl)!} 
                          alt="Thumbnail preview" 
                          className="w-20 aspect-video object-cover rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0" 
                        />
                        <div className="text-xs text-[#E84634] dark:text-[#E84634]">
                          <span className="font-semibold text-orange-600 dark:text-orange-400 block mb-0.5">Thumbnail Auto-Detected</span>
                          <span>Will be displayed subtly on the Media page</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Thumbnail Image (Optional Override / Upload)</label>
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({ ...formData, thumbnailUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-[#E84634] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
                      />
                      {formData.thumbnailUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#E84634]">Custom image set</span>
                          <button 
                            type="button" 
                            onClick={() => setFormData({ ...formData, thumbnailUrl: '' })}
                            className="text-xs font-medium text-red-500 hover:underline"
                          >
                            Remove custom image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Description (Optional)</label>
                    <textarea 
                      name="description" 
                      value={formData.description || ''} 
                      onChange={handleInputChange} 
                      rows={3}
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                    />
                  </div>
                </>
              )}

              {activeTab === 'bookmarks' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">Category</label>
                    <input 
                      type="text" 
                      name="category" 
                      placeholder="e.g. AI, Tech & Engineering"
                      value={formData.category || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#E84634] dark:text-[#E84634] mb-1.5">URL</label>
                    <input 
                      type="url" 
                      name="url" 
                      placeholder="e.g. https://example.com/..."
                      value={formData.url || ''} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{editingId ? 'Updating...' : 'Adding...'}</span>
                    </>
                  ) : (
                    <>
                      {editingId ? <Edit2 size={16} /> : <Plus size={16} />}
                      <span>{editingId ? 'Update Item' : 'Add Item'}</span>
                    </>
                  )}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({}); setFormFeedback(null); }} 
                    className="px-4 py-2.5 bg-zinc-100 text-[#E84634] dark:bg-zinc-800 dark:text-[#E84634] rounded-xl font-semibold text-sm transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center py-12 text-orange-500">
              <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12 text-[#E84634] dark:text-[#E84634] bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl">
                  No items found in this section.
                </div>
              ) : (
                items.map((item) => {
                  const mediaThumb = activeTab === 'media' ? getMediaThumbnail(item.url, item.thumbnailUrl) : null;
                  return (
                    <div key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl hover:border-orange-500/40 transition-all shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.iconUrl && (
                          <img src={item.iconUrl} alt="" className="w-8 h-8 object-contain rounded-lg bg-zinc-100 dark:bg-zinc-900 p-1 shrink-0" />
                        )}
                        {mediaThumb && (
                          <img src={mediaThumb} alt="" className="w-14 aspect-video object-cover rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <h3 className="font-bold text-base text-[#E84634] dark:text-[#E84634] truncate">{item.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-[#E84634] dark:text-[#E84634] mt-0.5 flex-wrap">
                            {activeTab === 'it_projects' && (
                              <>
                                <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                                  item.status === 'in_progress' 
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30' 
                                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                                }`}>
                                  {item.status === 'in_progress' ? `Sedang Dikerjakan (${item.progressPercentage ?? 50}%)` : 'Selesai'}
                                </span>
                                {item.timeline && <span className="font-mono text-[11px] opacity-75">{item.timeline}</span>}
                              </>
                            )}
                            {item.category && <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md font-semibold capitalize">{item.category}</span>}
                            {item.platform && <span className="font-medium text-[#E84634] dark:text-[#E84634]">{item.platform}</span>}
                            {item.date && <span>&middot; {item.date}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 shrink-0 ml-3">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-[#E84634] dark:text-[#E84634] rounded-lg text-xs font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        {confirmDeleteId === item.id ? (
                          <div className="flex items-center space-x-1.5 bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                            <span className="text-xs text-red-600 dark:text-red-400 font-semibold">Delete?</span>
                            <button 
                              onClick={() => executeDelete(item.id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Yes
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-[#E84634] dark:text-[#E84634] rounded text-xs font-semibold transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-semibold transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
