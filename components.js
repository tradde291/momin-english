const { useState, useEffect, createContext, useContext } = React;

// --- CONTEXTS ---
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Initialize
      const session = window.backend.getCurrentUser();
      setUser(session);
      setLoading(false);
  }, []);

  const login = async (username, password) => {
      const result = await window.backend.login(username, password);
      if (result.success) {
          setUser(result.user);
          return true;
      }
      return false;
  };

  const signup = async (username, password) => {
      const result = await window.backend.signup(username, password);
      if (result.success) {
          setUser(result.user);
          return true;
      }
      return false;
  };

  const logout = async () => {
      await window.backend.logout();
      setUser(null);
  };

  const togglePremium = async () => {
      if (!user) return;
      const updated = { ...user, isPremium: !user.isPremium };
      const result = await window.backend.updateUser(updated);
      if (result.success) {
          setUser(result.user);
      }
  };

  const toggleSavePost = async (postId) => {
      if (!user) return;
      const saved = user.savedPosts || [];
      const isSaved = saved.includes(postId);
      const newSaved = isSaved ? saved.filter(id => id !== postId) : [...saved, postId];
      const updated = { ...user, savedPosts: newSaved };
      const result = await window.backend.updateUser(updated);
      if (result.success) {
          setUser(result.user);
      }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
      <AuthContext.Provider value={{ user, login, signup, logout, togglePremium, toggleSavePost }}>
          {children}
      </AuthContext.Provider>
  );
}

const useAuth = () => useContext(AuthContext);

// --- COMPONENTS ---


function Icon({ name, className }) {
  // Simple SVG icons
  const icons = {
    menu: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    bell: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
    home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
    book: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />,
    heart: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    comment: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
    share: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
    crown: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
    bookmark: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />,
    lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  };
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name] || null}
    </svg>
  );
}

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setIsLoading(true);
      
      let success = false;
      if (isLogin) {
          success = await login(username, password);
          if (!success) setError("Invalid credentials");
      } else {
          success = await signup(username, password);
          if (!success) setError("Username already taken");
      }
      
      setIsLoading(false);
      if (success) onClose();
  };

  return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all scale-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{isLogin ? 'Welcome Back' : 'Join Momin English'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" required disabled={isLoading} />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" required disabled={isLoading} />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center">
                      {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isLogin ? 'Login' : 'Sign Up')}
                  </button>
              </form>
              <p className="mt-4 text-center text-sm text-gray-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-bold hover:underline" disabled={isLoading}>
                      {isLogin ? 'Sign Up' : 'Login'}
                  </button>
              </p>
              <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" disabled={isLoading}>✕</button>
          </div>
      </div>
  );
}

function CreatePostModal({ isOpen, onClose, onPost }) {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        
        setIsLoading(true);
        await onPost(content);
        setIsLoading(false);
        
        setContent('');
        onClose();
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create Post</h3>
              <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none min-h-[150px] resize-none"
                  placeholder="What's on your mind?"
                  disabled={isLoading}
              />
              <div className="mt-4 flex justify-end gap-3">
                  <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium disabled:opacity-50">Cancel</button>
                  <button onClick={handleSubmit} disabled={isLoading} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg font-bold flex items-center gap-2">
                      {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                      Post
                  </button>
              </div>
          </div>
      </div>
    );
}

function Header({ onLoginClick }) {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 text-gray-600">
              <Icon name="menu" className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-xl text-gray-900 leading-tight tracking-tight">Momin English</span>
              <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Academic & Admission</span>
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="search" className="h-5 w-5 text-gray-400" />
              </div>
              <input className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all" placeholder="Search for topics, questions..." type="search" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors relative">
              <Icon name="bell" className="w-6 h-6" />
              {user && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            
            {user ? (
                <div className="flex items-center gap-3 group relative">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500 p-0.5 cursor-pointer hover:scale-105 transition-transform">
                      <div className="h-full w-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                          <img src={user.avatar} alt="User" />
                      </div>
                    </div>
                    <div className="hidden md:block text-sm">
                        <p className="font-bold text-gray-700">{user.username}</p>
                        {user.isPremium && <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">Premium</p>}
                    </div>
                    
                    {/* Dropdown */}
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 hidden group-hover:block p-2 animate-fade-in">
                        <div className="p-2 border-b border-gray-100 mb-2">
                            <p className="font-bold text-gray-900">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.isPremium ? 'Premium Member' : 'Free Member'}</p>
                        </div>
                        <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2">
                            <Icon name="logout" className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <button onClick={onLoginClick} className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-emerald-500/30">
                    Login
                </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NewsTicker() {
  return (
    <div className="bg-emerald-900 text-white py-2 overflow-hidden relative flex items-center shadow-md z-40">
      <div className="bg-red-600 px-3 py-0.5 text-xs font-bold z-10 ml-2 rounded shadow-sm whitespace-nowrap uppercase tracking-wider">
        Live Updates
      </div>
      <div className="marquee-container flex-1 ml-4">
        <div className="marquee-content text-sm font-medium flex items-center">
          {window.newsData.map((news, idx) => (
            <div key={idx} className="flex items-center mx-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-emerald-200 font-bold mr-2">[{news.title}]</span>
              <span className="text-white/90">{news.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ currentPage, onNavigate }) {
  const { user, togglePremium } = useAuth();

  const getLinkClass = (page) => {
      const base = "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-colors cursor-pointer ";
      return currentPage === page 
        ? base + "bg-emerald-50 text-emerald-700" 
        : base + "text-gray-600 hover:bg-gray-50";
  };
  
  const getIconClass = (page) => {
      return currentPage === page ? "text-emerald-500 mr-3 flex-shrink-0 h-5 w-5" : "text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-5 w-5";
  };

  return (
    <div className="hidden lg:block w-64 shrink-0 space-y-8">
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 sticky top-24">
        <nav className="space-y-1">
          <div onClick={() => onNavigate('feed')} className={getLinkClass('feed')}>
            <Icon name="home" className={getIconClass('feed')} />
            News Feed
          </div>
          <div onClick={() => onNavigate('study')} className={getLinkClass('study')}>
            <Icon name="book" className={getIconClass('study')} />
            Study Materials
          </div>
          <div onClick={() => onNavigate('saved')} className={getLinkClass('saved')}>
            <Icon name="bookmark" className={getIconClass('saved')} />
            Saved Posts
          </div>
        </nav>
        
        {/* Premium Banner */}
        {!user?.isPremium && (
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center relative overflow-hidden group cursor-pointer" onClick={user ? togglePremium : null}>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <Icon name="crown" className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h4 className="font-bold text-sm mb-1">Go Premium</h4>
                    <p className="text-xs text-gray-300 mb-3">Unlock exclusive suggestions & remove ads.</p>
                    <button className="w-full py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-xs font-bold rounded-lg shadow-lg transform group-hover:scale-105 transition-all">
                        Upgrade Now
                    </button>
                </div>
            </div>
        )}

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Popular Tags
          </h3>
          <div className="mt-2 px-1 flex flex-wrap gap-2">
            {['#HSC24', '#Admission', '#Physics', '#Math', '#Biology'].map(tag => (
              <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 hover:bg-emerald-100 hover:text-emerald-700 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedCard({ post, onLike, onSave, onComment }) {
  const { user } = useAuth();
  const isLiked = post.likedBy && user && post.likedBy.includes(user.id);
  const isSaved = user?.savedPosts?.includes(post.id);
  const isLocked = post.isPremium && (!user || !user.isPremium);
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  const handleToggleComments = async () => {
      if (!showComments) {
          setIsLoadingComments(true);
          setShowComments(true);
          const data = await window.backend.getComments(post.id);
          setComments(data);
          setIsLoadingComments(false);
      } else {
          setShowComments(false);
      }
  };

  const handleSubmitComment = async (e) => {
      e.preventDefault();
      if (!commentText.trim() || !user) return;

      setIsPostingComment(true);
      const result = await window.backend.addComment(post.id, user.id, user.username, commentText);
      
      if (result.success) {
          setComments(prev => [...prev, result.comment]);
          setCommentText('');
          if (onComment) onComment(post.id);
      }
      setIsPostingComment(false);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 ${post.isPremium ? 'ring-2 ring-yellow-400/20' : ''}`}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img className="h-10 w-10 rounded-full bg-gray-100" src={post.avatar} alt="" />
            <div>
              <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{post.user}</p>
                  {post.isPremium && <Icon name="crown" className="w-3 h-3 text-yellow-500" />}
              </div>
              <p className="text-xs text-gray-500">{post.time}</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl leading-none">...</span>
          </button>
        </div>
        
        <div className="mt-4 relative">
            {isLocked ? (
                <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Icon name="lock" className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">Premium Content</h3>
                    <p className="text-sm text-gray-500 mb-4">This content is exclusive to premium members.</p>
                    <button className="text-emerald-600 font-bold text-sm hover:underline">Upgrade to view</button>
                </div>
            ) : (
              <>
                  <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {post.content}
                  </p>
                  {post.image && (
                      <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden">
                      <img src={post.image} alt="Post content" className="w-full object-cover max-h-96" />
                      </div>
                  )}
              </>
            )}
        </div>

      </div>
      <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <div className="flex space-x-6">
          <button 
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 transition-colors group ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <Icon name="heart" className={`h-5 w-5 group-hover:scale-110 transition-transform ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{post.likes}</span>
          </button>
          <button 
              onClick={handleToggleComments}
              className={`flex items-center space-x-2 transition-colors group ${showComments ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
          >
            <Icon name="comment" className="h-5 w-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
        </div>
        <button 
          onClick={() => onSave(post.id)}
          className={`text-gray-400 hover:text-emerald-600 transition-colors ${isSaved ? 'text-emerald-600' : ''}`}
        >
          <Icon name="bookmark" className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {showComments && (
          <div className="bg-gray-50 px-5 py-4 border-t border-gray-100 animate-fade-in">
              {user ? (
                  <form onSubmit={handleSubmitComment} className="flex gap-3 mb-6">
                      <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full bg-gray-200" />
                      <div className="flex-1 relative">
                          <input 
                              type="text" 
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              placeholder="Write a comment..." 
                              className="w-full pl-4 pr-12 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                              disabled={isPostingComment}
                          />
                          <button 
                              type="submit" 
                              disabled={!commentText.trim() || isPostingComment}
                              className="absolute right-2 top-1.5 p-1 text-emerald-600 hover:bg-emerald-50 rounded-full disabled:opacity-50"
                          >
                              {isPostingComment ? (
                                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                  <Icon name="share" className="w-4 h-4 rotate-90" />
                              )}
                          </button>
                      </div>
                  </form>
              ) : (
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg text-center text-sm text-blue-800">
                      Please login to comment.
                  </div>
              )}

              {isLoadingComments ? (
                  <div className="flex justify-center py-4">
                      <div className="w-6 h-6 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin"></div>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {comments.length === 0 ? (
                          <p className="text-center text-gray-400 text-sm py-2">No comments yet. Be the first!</p>
                      ) : (
                          comments.map(comment => (
                              <div key={comment.id} className="flex gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                                      {comment.username[0].toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                      <div className="bg-white p-3 rounded-r-xl rounded-bl-xl shadow-sm border border-gray-100">
                                          <div className="flex items-center justify-between mb-1">
                                              <span className="text-xs font-bold text-gray-900">{comment.username}</span>
                                              <span className="text-[10px] text-gray-400">{comment.time}</span>
                                          </div>
                                          <p className="text-sm text-gray-700">{comment.content}</p>
                                      </div>
                                  </div>
                              </div>
                          ))
                      )}
                  </div>
              )}
          </div>
      )}
    </div>
  );
}


function RightSidebar() {
  return (
    <div className="hidden xl:block w-80 shrink-0 space-y-6">
       <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 sticky top-24">
          <h3 className="text-base font-bold text-gray-900 mb-4">Latest Notices</h3>
          <div className="space-y-4">
             {window.newsData.slice(0, 4).map((news) => (
                <div key={news.id} className="group cursor-pointer">
                   <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform"></div>
                      <div>
                         <p className="text-xs font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">{news.title}</p>
                         <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{news.content}</p>
                      </div>
                   </div>
                </div>
             ))}
          </div>
          <button className="mt-6 w-full py-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
             View All Notices
          </button>
       </div>
    </div>
  );
}

function StudyMaterials() {
  const [filters, setFilters] = useState({
    section: '',
    exam: '',
    subject: '',
    chapter: '',
    topic: '',
    showAnswer: false,
    showExplanation: false,
    search: ''
  });

  // Using global questionsData
  const questions = window.questionsData;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
             <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>সেকশন</option>
                <option>HSC</option>
                <option>Admission</option>
             </select>
             <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>ভর্তি পরীক্ষা</option>
                <option>BUET</option>
                <option>Medical</option>
                <option>Dhaka University</option>
             </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
             <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>বিষয়</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Math</option>
             </select>
             <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>অধ্যায়</option>
                <option>Vector</option>
                <option>Dynamics</option>
             </select>
             <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option>টপিক</option>
                <option>River Boat</option>
                <option>Rain Man</option>
             </select>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors">
                    <Icon name="search" className="w-4 h-4" /> মুছুন
                </button>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" 
                        checked={filters.showAnswer}
                        onChange={e => setFilters({...filters, showAnswer: e.target.checked})}
                    />
                    উত্তর
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500" 
                         checked={filters.showExplanation}
                        onChange={e => setFilters({...filters, showExplanation: e.target.checked})}
                    />
                    ব্যাখ্যা
                </label>
            </div>
            <div className="relative w-full md:w-64">
                <input 
                    type="text" 
                    placeholder="প্রশ্ন খুঁজুন" 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all focus:bg-white"
                />
                <Icon name="search" className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {questions.map(q => (
            <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed mb-4 font-serif">{q.content}</p>
                    {q.image && (
                       <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 mb-4 flex justify-center">
                          <img src={q.image} alt="Question" className="max-h-64 rounded" />
                       </div>
                    )}
                    
                    {filters.showAnswer && (
                        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-100 animate-fade-in">
                            <p className="font-bold text-green-800">{q.answer}</p>
                        </div>
                    )}
                    
                    {filters.showExplanation && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-fade-in">
                            <h4 className="font-bold text-blue-800 mb-1">ব্যাখ্যা:</h4>
                            <p className="text-blue-700">{q.explanation}</p>
                        </div>
                    )}
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex gap-2">
                    {q.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-bold text-gray-600 uppercase tracking-wider">#{tag}</span>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

function FAB({ onClick }) {
  return (
    <button onClick={onClick} className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center text-white z-50 group">
      <Icon name="plus" className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
}

function MainApp() {
  const { user, toggleSavePost } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('feed');
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
      const fetchPosts = async () => {
          setIsLoadingPosts(true);
          const data = await window.backend.getPosts();
          setPosts(data);
          setIsLoadingPosts(false);
      };
      fetchPosts();
  }, []);

  const handleLike = async (postId) => {
      if (!user) {
          setIsAuthModalOpen(true);
          return;
      }
      // Optimistic update (or wait for server)
      // Let's wait for server since we added latency to simulate it
      const result = await window.backend.toggleLike(postId, user.id);
      if (result.success) {
          setPosts(prevPosts => prevPosts.map(p => p.id === postId ? result.post : p));
      }
  };

  const handleSave = async (postId) => {
      if (!user) {
          setIsAuthModalOpen(true);
          return;
      }
      await toggleSavePost(postId);
  };

  const handleComment = (postId) => {
      setPosts(prevPosts => prevPosts.map(p => 
          p.id === postId ? { ...p, comments: p.comments + 1 } : p
      ));
  };

  const handleCreatePost = async (content) => {
      const newPostData = {
          userId: user.id,
          user: user.username,
          avatar: user.avatar,
          content: content,
          isPremium: user.isPremium
      };
      const result = await window.backend.createPost(newPostData);
      if (result.success) {
          setPosts(prev => [result.post, ...prev]);
      }
  };

  const handleFabClick = () => {
      if (!user) setIsAuthModalOpen(true);
      else setIsCreatePostOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header onLoginClick={() => setIsAuthModalOpen(true)} />
      <NewsTicker />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          
          <main className="flex-1 space-y-6">
             {currentPage === 'feed' ? (
                <>
                   <div 
                        onClick={handleFabClick}
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-4 cursor-pointer hover:border-emerald-200 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                         <img src={user ? user.avatar : "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} alt="User" />
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm text-gray-500">
                         {user ? `What's on your mind, ${user.username}?` : "Login to ask a question..."}
                      </div>
                      <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                         <Icon name="plus" className="w-5 h-5" />
                      </button>
                   </div>

                   {isLoadingPosts ? (
                       <div className="text-center py-10">
                           <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                           <p className="mt-2 text-gray-500 text-sm">Loading posts...</p>
                       </div>
                   ) : (
                       posts.map(post => (
                          <FeedCard 
                            key={post.id} 
                            post={post} 
                            onLike={handleLike}
                            onSave={handleSave}
                            onComment={handleComment}
                          />
                       ))
                   )}
                   
                   {!isLoadingPosts && (
                       <div className="text-center py-8">
                          <p className="text-sm text-gray-400">You've reached the end</p>
                       </div>
                   )}
                </>
             ) : currentPage === 'study' ? (
                <StudyMaterials />
             ) : (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="bookmark" className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Coming Soon</h3>
                    <p className="text-gray-500">Saved posts page is under construction.</p>
                </div>
             )}
          </main>

          <RightSidebar />
        </div>
      </div>
      {currentPage === 'feed' && <FAB onClick={handleFabClick} />}
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CreatePostModal isOpen={isCreatePostOpen} onClose={() => setIsCreatePostOpen(false)} onPost={handleCreatePost} />
    </div>
  );
}

function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);