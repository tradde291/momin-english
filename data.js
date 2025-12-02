
// --- INITIAL DATA ---
window.initialPosts = [
  {
    id: 1,
    userId: 'admin',
    user: "Sakib Ahmed",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sakib",
    time: "2 hrs ago",
    content: "Physics vector math problem help needed!",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=60",
    likes: 12,
    likedBy: [],
    comments: 5,
    isPremium: false
  },
  {
      id: 99,
      userId: 'system',
      user: "Momin English Official",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System",
      time: "1 hr ago",
      content: "📢 Important Update: HSC-24 Special Suggestion (Physics 1st Paper) is now available for everyone! Check the Study Materials section.",
      likes: 999,
      likedBy: [],
      comments: 0,
      isPremium: false,
      isLocked: false
  }
];

window.newsData = [
  { id: 1, title: "HSC 24", content: "Physics 1st Paper exam postponed due to rain." },
  { id: 2, title: "Admission", content: "DU A Unit admission circular published." },
  { id: 3, title: "Update", content: "New study materials added to Momin English." },
  { id: 4, title: "Notice", content: "Server maintenance scheduled for tonight." }
];

window.questionsData = [
    {
      id: 1,
      content: "উপরের চিত্রে বৃত্তাকার পথে চলমান একটি বস্তুর A, B, C এবং D বিন্দুতে বেগ vA, vB, vC ও vD বেগের মান সমান। অর্থাৎ, |vA| = |vB| = |vC| = |vD| কিন্তু বেগের দিক ভিন্ন ভিন্ন দিকে। বেগের মান সমান হওয়া সত্ত্বেও দিক ভিন্নতার কারণে এখানে ত্বরণের সৃষ্টি হয়েছে যাকে বলা হয় কেন্দ্রমুখী ত্বরণ। এর মান, ac = v^2/r যেখানে v হচ্ছে বস্তুর বেগের মান ও r হচ্ছে ঘূর্ণনরত বস্তুর বৃত্তাকার পথের ব্যাসার্ধ।",
      image: "https://i.ibb.co/RDmnqHP/physics-q1.jpg", 
      answer: "Answer: A",
      explanation: "বেগের মান সমান হলেও দিক ভিন্ন হওয়ায় সুষম দ্রুতিতে চললেও এটি সমবেগ নয়। কেন্দ্রমুখী ত্বরণ সর্বদা কেন্দ্রের দিকে ক্রিয়া করে।",
      tags: ["Physics", "Vector", "HSC"]
    },
    {
       id: 2,
       content: "একটি বস্তু স্থির অবস্থা থেকে যাত্রা শুরু করে 4s এ 16m দূরত্ব অতিক্রম করে। 8s এ বস্তুটি কত দূরত্ব অতিক্রম করবে?",
       image: null,
       answer: "64m",
       explanation: "s ∝ t^2. So, s2/s1 = (t2/t1)^2 => s2 = 16 * (8/4)^2 = 16 * 4 = 64m.",
       tags: ["Physics", "Dynamics", "Admission"]
    }
];

// --- MOCK BACKEND SERVICE (Improved) ---
class MockBackendService {
  constructor() {
    this.latency = 600; // Simulated network latency in ms
    this.init();
  }

  init() {
    if (!localStorage.getItem('aap_users')) localStorage.setItem('aap_users', JSON.stringify([]));
    if (!localStorage.getItem('aap_posts')) localStorage.setItem('aap_posts', JSON.stringify(window.initialPosts));
    if (!localStorage.getItem('aap_comments')) localStorage.setItem('aap_comments', JSON.stringify([]));
    if (!localStorage.getItem('aap_notifs')) localStorage.setItem('aap_notifs', JSON.stringify([]));
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, this.latency));
  }

  // --- AUTHENTICATION ---

  async login(username, password) {
    await this.delay();
    const users = JSON.parse(localStorage.getItem('aap_users'));
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('aap_session', JSON.stringify(user));
        return { success: true, user };
    }
    return { success: false, error: "Invalid username or password" };
  }

  async signup(username, password) {
    await this.delay();
    const users = JSON.parse(localStorage.getItem('aap_users'));
    if (users.find(u => u.username === username)) {
        return { success: false, error: "Username already taken" };
    }
    const newUser = {
        id: Date.now().toString(),
        username,
        password,
        isPremium: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        savedPosts: []
    };
    users.push(newUser);
    localStorage.setItem('aap_users', JSON.stringify(users));
    localStorage.setItem('aap_session', JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  async logout() {
      await this.delay();
      localStorage.removeItem('aap_session');
      return { success: true };
  }

  getCurrentUser() {
      return JSON.parse(localStorage.getItem('aap_session'));
  }

  async updateUser(user) {
      await this.delay();
      const users = JSON.parse(localStorage.getItem('aap_users'));
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
          users[index] = user;
          localStorage.setItem('aap_users', JSON.stringify(users));
          
          // Update session if it's the current user
          const session = this.getCurrentUser();
          if (session && session.id === user.id) {
              localStorage.setItem('aap_session', JSON.stringify(user));
          }
          return { success: true, user };
      }
      return { success: false, error: "User not found" };
  }

  // --- POSTS ---

  async getPosts() {
    await this.delay();
    return JSON.parse(localStorage.getItem('aap_posts'));
  }

  async createPost(postData) {
    await this.delay();
    const posts = JSON.parse(localStorage.getItem('aap_posts'));
    const newPost = {
        id: Date.now(),
        ...postData,
        likes: 0,
        likedBy: [],
        comments: 0,
        time: "Just now"
    };
    posts.unshift(newPost);
    localStorage.setItem('aap_posts', JSON.stringify(posts));
    return { success: true, post: newPost };
  }

  async toggleLike(postId, userId) {
      // Optimistic UI update helper
      let posts = JSON.parse(localStorage.getItem('aap_posts'));
      let updatedPost = null;
      
      posts = posts.map(p => {
          if (p.id === postId) {
              const isLiked = p.likedBy && p.likedBy.includes(userId);
              const likedBy = isLiked ? p.likedBy.filter(id => id !== userId) : [...(p.likedBy || []), userId];
              updatedPost = { ...p, likes: likedBy.length, likedBy };
              return updatedPost;
          }
          return p;
      });
      
      localStorage.setItem('aap_posts', JSON.stringify(posts));
      // No artificial delay for likes to make it feel snappy, or small delay
      return { success: true, post: updatedPost };
  }

  // --- COMMENTS ---

  async getComments(postId) {
      await this.delay();
      const allComments = JSON.parse(localStorage.getItem('aap_comments')) || [];
      return allComments.filter(c => c.postId === postId);
  }

  async addComment(postId, userId, username, content) {
      await this.delay();
      const comments = JSON.parse(localStorage.getItem('aap_comments')) || [];
      const newComment = {
          id: Date.now(),
          postId,
          userId,
          username,
          content,
          time: "Just now"
      };
      comments.push(newComment);
      localStorage.setItem('aap_comments', JSON.stringify(comments));
      
      // Update post comment count
      let posts = JSON.parse(localStorage.getItem('aap_posts'));
      posts = posts.map(p => {
          if (p.id === postId) {
              return { ...p, comments: (p.comments || 0) + 1 };
          }
          return p;
      });
      localStorage.setItem('aap_posts', JSON.stringify(posts));

      return { success: true, comment: newComment };
  }
}

window.backend = new MockBackendService();
// Backward compatibility map (will be removed after refactoring components)
window.DB = window.backend;
