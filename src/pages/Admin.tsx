import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { getMediaThumbnail } from '../lib/media';

export function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'blog' | 'media' | 'bookmarks'>('portfolio');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<any>({});

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(activeTab);
      }
    });
    return () => unsubscribe();
  }, [activeTab]);

  const getCollectionName = (tab: string) => {
    if (tab === 'portfolio') return 'portfolios';
    if (tab === 'blog') return 'blogs';
    if (tab === 'bookmarks') return 'bookmarks';
    return 'media';
  };

  const fetchData = async (tab: 'portfolio' | 'blog' | 'media' | 'bookmarks') => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, getCollectionName(tab)));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // simple sort by createdAt desc if possible, but let's just reverse for now
      setItems(data.reverse());
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const executeDelete = async (id: string) => {
    try {
      const collectionName = getCollectionName(activeTab);
      await deleteDoc(doc(db, collectionName, id));
      setConfirmDeleteId(null);
      fetchData(activeTab);
    } catch (error) {
      console.error("Error deleting doc: ", error);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionName = getCollectionName(activeTab);
    
    let dataToSave = { ...formData };
    if (activeTab === 'media') {
      if (!dataToSave.category) {
        dataToSave.category = 'video';
      }
      const autoThumb = getMediaThumbnail(dataToSave.url, dataToSave.thumbnailUrl);
      if (autoThumb) {
        dataToSave.thumbnailUrl = autoThumb;
      }
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), dataToSave);
      } else {
        await addDoc(collection(db, collectionName), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
      }
      setFormData({});
      setEditingId(null);
      fetchData(activeTab);
    } catch (error) {
      console.error("Error saving: ", error);
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

  if (!user) {
    return (
      <div className="pt-24 pb-32 flex flex-col items-center justify-center min-h-[55vh]">
        <Helmet>
          <title>Admin Login - Randy</title>
        </Helmet>
        <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-2 block">Management</span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">Admin Panel<span className="text-orange-500">.</span></h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">Sign in with your Google account to manage portfolio, blogs, and media content.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-orange-500/25 flex items-center justify-center gap-2"
          >
            Sign in with Google
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
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 mb-1 block">Control Center</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Admin Dashboard<span className="text-orange-500">.</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 hidden sm:inline">{user.email}</span>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
        <button 
          onClick={() => { setActiveTab('portfolio'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'portfolio' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Curated Works
        </button>
        <button 
          onClick={() => { setActiveTab('blog'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'blog' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Reading List
        </button>
        <button 
          onClick={() => { setActiveTab('media'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'media' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Watch &amp; Listen
        </button>
        <button 
          onClick={() => { setActiveTab('bookmarks'); setFormData({}); setEditingId(null); }}
          className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${activeTab === 'bookmarks' ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20' : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800/60'}`}
        >
          Bookmarks
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Title</label>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Icon Image (Optional)</label>
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
                    className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
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
              
              {activeTab === 'portfolio' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Date</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Category</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Image (Upload)</label>
                    <div className="flex flex-col gap-2">
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
                          className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Description</label>
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

              {activeTab === 'blog' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Date</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Source URL (Optional)</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Content</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Category</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Platform</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Date</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Media Link (URL)</label>
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
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                          <span className="font-semibold text-orange-600 dark:text-orange-400 block mb-0.5">Thumbnail Auto-Detected</span>
                          <span>Will be displayed subtly on the Media page</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Thumbnail Image (Optional Override / Upload)</label>
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
                        className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-500/10 file:text-orange-600 dark:file:text-orange-400 hover:file:bg-orange-500/20"
                      />
                      {formData.thumbnailUrl && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-zinc-500">Custom image set</span>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Description (Optional)</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">Category</label>
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">URL</label>
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
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-orange-500/25"
                >
                  {editingId ? 'Update Item' : 'Add Item'}
                </button>
                {editingId && (
                  <button 
                    type="button" 
                    onClick={() => { setEditingId(null); setFormData({}); }} 
                    className="px-4 py-2.5 bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded-xl font-semibold text-sm transition-all hover:bg-zinc-200 dark:hover:bg-zinc-700"
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
                <div className="text-center py-12 text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl">
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
                          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 truncate">{item.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex-wrap">
                            {item.category && <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-md font-semibold capitalize">{item.category}</span>}
                            {item.platform && <span className="font-medium text-zinc-600 dark:text-zinc-300">{item.platform}</span>}
                            {item.date && <span>&middot; {item.date}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 shrink-0 ml-3">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-semibold transition-colors"
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
                              className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded text-xs font-semibold transition-colors"
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
