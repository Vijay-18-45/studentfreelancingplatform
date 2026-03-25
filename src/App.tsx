import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Trophy,
  Wallet,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Task, Notification, TaskCategory, Application, TaskStatus } from './types';
import { storage } from './storage';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
    outline: 'bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100'
  };
  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'indigo' }: any) => {
  const colors: any = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Main App ---

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(storage.getCurrentUser());
  const [view, setView] = useState<'landing' | 'dashboard' | 'marketplace' | 'post' | 'profile' | 'admin' | 'notifications'>('landing');
  const [tasks, setTasks] = useState<Task[]>(storage.getTasks());
  const [notifications, setNotifications] = useState<Notification[]>(storage.getNotifications());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'All'>('All');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    storage.setCurrentUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    storage.setTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.setNotifications(notifications);
  }, [notifications]);

  const handleLogin = (role: 'student_buyer' | 'student_worker' | 'admin') => {
    const users = storage.getUsers();
    const user = users.find(u => u.role === role) || users[0];
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('landing');
  };

  const addNotification = (userId: string, title: string, message: string, type: Notification['type']) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  const calculateFitScore = (task: Task, user: User) => {
    if (!user) return 0;
    let score = 0;
    // Skill match
    const skillMatch = task.description.toLowerCase().split(' ').filter(word => 
      user.skills.some(skill => skill.toLowerCase().includes(word))
    ).length;
    score += Math.min(skillMatch * 20, 60);
    
    // Category match
    if (user.skills.some(s => s.toLowerCase().includes(task.category.toLowerCase()))) {
      score += 20;
    }
    
    // Reliability
    score += (user.reliabilityScore / 100) * 20;
    
    return Math.min(Math.round(score), 100);
  };

  const enhanceDescription = async (desc: string) => {
    if (!desc) return desc;
    setIsEnhancing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Enhance this student task description to be more professional and clear for a freelancing platform. Keep it concise but detailed. Original: "${desc}"`,
      });
      setIsEnhancing(false);
      return response.text || desc;
    } catch (error) {
      console.error("AI Enhancement failed", error);
      setIsEnhancing(false);
      return desc;
    }
  };

  // --- Views ---

  const LandingView = () => (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">CampusGig</h1>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
            The Smart Way to <span className="text-indigo-600">Earn & Learn</span> on Campus.
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Connect with fellow students for tutoring, coding, design, and more. Build your portfolio while you study.
          </p>
          <div className="space-y-4">
            <Button onClick={() => handleLogin('student_worker')} className="w-full py-4 text-lg">
              Login as Student (Worker)
            </Button>
            <Button onClick={() => handleLogin('student_buyer')} variant="outline" className="w-full py-4 text-lg">
              Login as Student (Buyer)
            </Button>
            <Button onClick={() => handleLogin('admin')} variant="ghost" className="w-full text-sm">
              Admin Access
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 bg-indigo-50 p-12 flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>
          <Card className="relative z-10 p-6 w-full max-w-xs transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Task Completed</p>
                <p className="font-bold text-gray-900">Python Scripting</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-indigo-600 font-bold">₹450 Earned</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => {
    const userTasks = tasks.filter(t => t.posterId === currentUser?.id || t.workerId === currentUser?.id);
    const activeTasks = userTasks.filter(t => t.status === 'in_progress');
    const completedTasksCount = userTasks.filter(t => t.status === 'completed').length;

    return (
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {currentUser?.name}!</h2>
            <p className="text-gray-500">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex gap-4">
            <Card className="px-6 py-3 flex items-center gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Wallet className="text-indigo-600 w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Balance</p>
                <p className="text-xl font-bold text-gray-900">₹{currentUser?.points}</p>
              </div>
            </Card>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-l-4 border-indigo-600">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg"><Briefcase className="text-indigo-600 w-5 h-5" /></div>
              <Badge color="indigo">Active</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeTasks.length}</p>
            <p className="text-sm text-gray-500">Ongoing Tasks</p>
          </Card>
          <Card className="p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-green-50 rounded-lg"><CheckCircle className="text-green-600 w-5 h-5" /></div>
              <Badge color="green">Done</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedTasksCount}</p>
            <p className="text-sm text-gray-500">Completed Tasks</p>
          </Card>
          <Card className="p-6 border-l-4 border-yellow-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg"><Star className="text-yellow-600 w-5 h-5" /></div>
              <Badge color="yellow">Rating</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900">{currentUser?.rating}</p>
            <p className="text-sm text-gray-500">Average Rating</p>
          </Card>
          <Card className="p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 rounded-lg"><ShieldCheck className="text-purple-600 w-5 h-5" /></div>
              <Badge color="purple">Trust</Badge>
            </div>
            <p className="text-3xl font-bold text-gray-900">{currentUser?.reliabilityScore}%</p>
            <p className="text-sm text-gray-500">Reliability Score</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
              <Button variant="ghost" onClick={() => setView('marketplace')} className="text-sm">View Marketplace <ChevronRight className="w-4 h-4" /></Button>
            </div>
            {userTasks.length > 0 ? (
              <div className="space-y-4">
                {userTasks.slice(0, 3).map(task => (
                  <Card key={task.id} className="p-5 flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {task.status === 'completed' ? <CheckCircle /> : <Clock />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-500">{task.category} • {task.status.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{task.isSkillSwap ? 'Skill Swap' : `₹${task.budget}`}</p>
                      <p className="text-xs text-gray-400">Due {new Date(task.deadline).toLocaleDateString()}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="text-gray-300 w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">No tasks yet</h4>
                <p className="text-gray-500 mb-6">Start your journey by posting a task or browsing the marketplace.</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={() => setView('post')}>Post a Task</Button>
                  <Button variant="outline" onClick={() => setView('marketplace')}>Browse Tasks</Button>
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.posterId !== currentUser?.id && t.status === 'pending').slice(0, 3).map(task => {
                const fitScore = calculateFitScore(task, currentUser!);
                return (
                  <Card key={task.id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <Badge color={fitScore > 80 ? 'green' : 'indigo'}>{fitScore}% Match</Badge>
                      {task.isUrgent && <Badge color="red">Urgent</Badge>}
                    </div>
                    <h4 className="font-bold text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-indigo-600">{task.isSkillSwap ? 'Swap' : `₹${task.budget}`}</p>
                      <Button variant="outline" className="text-xs py-1 px-3" onClick={() => setView('marketplace')}>Details</Button>
                    </div>
                  </Card>
                );
              })}
            </div>
            
            <Card className="p-6 bg-indigo-600 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-400" />
                <h4 className="text-lg font-bold">Leaderboard</h4>
              </div>
              <p className="text-indigo-100 text-sm mb-4">You are currently in the top 15% of earners this month!</p>
              <Button variant="secondary" className="w-full text-indigo-600">View Rankings</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  const MarketplaceView = () => {
    const filteredTasks = useMemo(() => {
      return tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
        return matchesSearch && matchesCategory && t.status === 'pending';
      });
    }, [tasks, searchQuery, categoryFilter]);

    const handleApply = (taskId: string) => {
      const updatedTasks = tasks.map(t => {
        if (t.id === taskId) {
          const newApp: Application = {
            id: Math.random().toString(36).substr(2, 9),
            taskId,
            applicantId: currentUser!.id,
            message: "I'm interested in this task and have the required skills.",
            bidAmount: t.budget,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          return { ...t, applications: [...t.applications, newApp] };
        }
        return t;
      });
      setTasks(updatedTasks);
      
      const task = tasks.find(t => t.id === taskId);
      addNotification(task!.posterId, 'New Application', `${currentUser?.name} applied for "${task?.title}"`, 'new_application');
      alert('Application submitted successfully!');
    };

    return (
      <div className="space-y-8">
        <header className="space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Task Marketplace</h2>
          <p className="text-gray-500">Find the perfect gig to match your skills and schedule.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search tasks, skills, or categories..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['All', 'Tutoring', 'Coding', 'Design', 'Content', 'Writing'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as any)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => {
            const fitScore = calculateFitScore(task, currentUser!);
            const hasApplied = task.applications.some(a => a.applicantId === currentUser?.id);
            const isOwner = task.posterId === currentUser?.id;

            return (
              <Card key={task.id} className="flex flex-col h-full hover:shadow-lg transition-all border-t-4 border-indigo-600">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <Badge color="blue">{task.category}</Badge>
                    <div className="flex gap-2">
                      {task.isUrgent && <Badge color="red">Urgent</Badge>}
                      {task.isSkillSwap && <Badge color="purple">Skill Swap</Badge>}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6">{task.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">{new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">{task.applications.length} applicants</span>
                    </div>
                  </div>

                  <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Fit Score</p>
                      <p className="text-xl font-black text-indigo-700">{fitScore}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Budget</p>
                      <p className="text-xl font-black text-gray-900">{task.isSkillSwap ? 'Swap' : `₹${task.budget}`}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <Button 
                    className="flex-1" 
                    disabled={hasApplied || isOwner}
                    onClick={() => handleApply(task.id)}
                  >
                    {isOwner ? 'Your Task' : hasApplied ? 'Applied' : 'Apply Now'}
                  </Button>
                  <Button variant="secondary" className="px-3">
                    <Star className="w-5 h-5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-gray-300 w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    );
  };

  const PostTaskView = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<TaskCategory>('Tutoring');
    const [budget, setBudget] = useState(100);
    const [deadline, setDeadline] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [isSkillSwap, setIsSkillSwap] = useState(false);
    const [swapSkill, setSwapSkill] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (currentUser!.points < budget && !isSkillSwap) {
        alert('Insufficient points to post this task!');
        return;
      }

      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        category,
        budget: isSkillSwap ? 0 : budget,
        deadline,
        posterId: currentUser!.id,
        status: 'pending',
        isUrgent,
        isSkillSwap,
        swapSkill: isSkillSwap ? swapSkill : undefined,
        createdAt: new Date().toISOString(),
        applications: []
      };

      setTasks([newTask, ...tasks]);
      if (!isSkillSwap) {
        setCurrentUser({ ...currentUser!, points: currentUser!.points - budget });
      }
      setView('dashboard');
      alert('Task posted successfully!');
    };

    const handleEnhance = async () => {
      const enhanced = await enhanceDescription(description);
      setDescription(enhanced);
    };

    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <h2 className="text-3xl font-bold text-gray-900">Post a New Task</h2>
          <p className="text-gray-500">Fill in the details below to find the best student for your project.</p>
        </header>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Task Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g., Help with Calculus Homework" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                <button 
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || !description}
                  className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:text-indigo-700 disabled:opacity-50"
                >
                  {isEnhancing ? 'Enhancing...' : <><Zap className="w-3 h-3" /> AI Enhance</>}
                </button>
              </div>
              <textarea 
                required
                rows={4}
                placeholder="Describe what you need help with in detail..." 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  {['Tutoring', 'Coding', 'Design', 'Content', 'Writing', 'Other'].map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Deadline</label>
                <input 
                  type="date" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                />
                <span className="text-sm font-bold text-gray-700">Mark as Urgent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500"
                  checked={isSkillSwap}
                  onChange={(e) => setIsSkillSwap(e.target.checked)}
                />
                <span className="text-sm font-bold text-gray-700">Skill Swap Mode</span>
              </label>
            </div>

            {isSkillSwap ? (
              <div className="space-y-2 p-4 border-2 border-dashed border-purple-200 rounded-xl bg-purple-50">
                <label className="text-sm font-bold text-purple-700 uppercase tracking-wider">What skill can you offer in return?</label>
                <input 
                  type="text" 
                  placeholder="e.g., I can teach you Guitar" 
                  className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={swapSkill}
                  onChange={(e) => setSwapSkill(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget (Points)</label>
                  <span className="text-xs font-bold text-gray-500">Your Balance: ₹{currentUser?.points}</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-lg font-black text-gray-900">
                  <span>₹50</span>
                  <span className="text-indigo-600">₹{budget}</span>
                  <span>₹1000</span>
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button type="submit" className="w-full py-4 text-lg">Post Task Now</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  };

  const NotificationsView = () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-500">Stay updated with your task activity.</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto" onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>Mark all as read</Button>
      </header>

      <div className="space-y-4">
        {notifications.filter(n => n.userId === currentUser?.id).length > 0 ? (
          notifications.filter(n => n.userId === currentUser?.id).map(notif => (
            <Card key={notif.id} className={`p-5 flex gap-4 items-start ${!notif.read ? 'border-l-4 border-indigo-600 bg-indigo-50/30' : ''}`}>
              <div className={`p-2 rounded-lg ${!notif.read ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                {notif.type === 'task_assigned' ? <CheckCircle className="w-5 h-5" /> : 
                 notif.type === 'new_application' ? <PlusCircle className="w-5 h-5" /> : 
                 <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>{notif.title}</h4>
                <p className="text-sm text-gray-500 mb-2">{notif.message}</p>
                <p className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
            </Card>
          ))
        ) : (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="p-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-black">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
              <Badge color="blue">{currentUser?.role.replace('_', ' ')}</Badge>
              <Badge color="green">Verified Student</Badge>
            </div>
            <h2 className="text-4xl font-black mb-2">{currentUser?.name}</h2>
            <p className="text-indigo-100 mb-4 max-w-lg">{currentUser?.bio}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">{currentUser?.rating}</p>
                <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Rating</p>
              </div>
              <div className="text-center md:text-left border-l border-white/20 pl-6">
                <p className="text-2xl font-bold">{currentUser?.completedTasks}</p>
                <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Completed</p>
              </div>
              <div className="text-center md:text-left border-l border-white/20 pl-6">
                <p className="text-2xl font-bold">{currentUser?.reliabilityScore}%</p>
                <p className="text-xs text-indigo-200 font-bold uppercase tracking-wider">Reliability</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Skills & Expertise</h3>
          <Card className="p-6">
            <div className="flex flex-wrap gap-2">
              {currentUser?.skills.map(skill => (
                <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" /> {skill}
                </span>
              ))}
              <button className="px-3 py-1.5 border-2 border-dashed border-gray-200 text-gray-400 rounded-lg text-sm font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all">
                + Add Skill
              </button>
            </div>
          </Card>

          <h3 className="text-xl font-bold text-gray-900">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-900">Top Rated</p>
            </Card>
            <Card className="p-4 text-center">
              <Zap className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-900">Fast Learner</p>
            </Card>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Reviews</h3>
          <div className="space-y-4">
            {[1, 2].map(i => (
              <Card key={i} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold">A</div>
                    <div>
                      <h4 className="font-bold text-gray-900">Alex Kumar</h4>
                      <p className="text-xs text-gray-500">2 weeks ago</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                  </div>
                </div>
                <p className="text-gray-600">"Great work on the Python script! Very professional and delivered on time. Highly recommend for any coding tasks."</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (!currentUser) return <LandingView />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">CampusGig</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 hidden lg:flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">CampusGig</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 pt-4 lg:pt-0">
          <button 
            onClick={() => { setView('dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button 
            onClick={() => { setView('marketplace'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'marketplace' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Briefcase className="w-5 h-5" /> Marketplace
          </button>
          <button 
            onClick={() => { setView('post'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'post' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <PlusCircle className="w-5 h-5" /> Post Task
          </button>
          <button 
            onClick={() => { setView('notifications'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'notifications' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="relative">
              <Bell className="w-5 h-5" />
              {notifications.some(n => !n.read && n.userId === currentUser.id) && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </div>
            Notifications
          </button>
          <button 
            onClick={() => { setView('profile'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <UserIcon className="w-5 h-5" /> Profile
          </button>
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => { setView('admin'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${view === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <ShieldCheck className="w-5 h-5" /> Admin Panel
            </button>
          )}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 lg:h-screen lg:overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'dashboard' && <DashboardView />}
            {view === 'marketplace' && <MarketplaceView />}
            {view === 'post' && <PostTaskView />}
            {view === 'notifications' && <NotificationsView />}
            {view === 'profile' && <ProfileView />}
            {view === 'admin' && (
              <div className="space-y-8">
                <header>
                  <h2 className="text-3xl font-bold text-gray-900">Admin Control Center</h2>
                  <p className="text-gray-500">Monitor platform activity and manage users.</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Total Users</h4>
                    <p className="text-3xl font-black text-gray-900">{storage.getUsers().length}</p>
                  </Card>
                  <Card className="p-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Total Tasks</h4>
                    <p className="text-3xl font-black text-gray-900">{tasks.length}</p>
                  </Card>
                  <Card className="p-6">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Total Earnings</h4>
                    <p className="text-3xl font-black text-gray-900">₹{tasks.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.budget, 0) + 124500}</p>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button 
                    variant="danger" 
                    onClick={() => {
                      if(confirm('This will clear all your current progress and reset to the default demo data. Continue?')) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    Reset Demo Data
                  </Button>
                </div>
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">User</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Role</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {storage.getUsers().map(user => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">{user.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{user.role}</td>
                            <td className="px-6 py-4"><Badge color="green">Active</Badge></td>
                            <td className="px-6 py-4"><Button variant="ghost" className="text-xs">Manage</Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
