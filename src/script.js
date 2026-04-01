import { storage } from './storage.js';

// --- State ---
let state = {
    currentUser: storage.getCurrentUser(),
    view: storage.getCurrentUser() ? 'dashboard' : 'landing',
    landingTab: 'login', // 'login' or 'signup'
    tasks: storage.getTasks(),
    notifications: storage.getNotifications(),
    searchQuery: '',
    categoryFilter: 'All',
    isSidebarOpen: false
};

// --- Helpers ---
function setState(newState) {
    state = { ...state, ...newState };
    storage.setCurrentUser(state.currentUser);
    storage.setTasks(state.tasks);
    storage.setNotifications(state.notifications);
    render();
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const role = formData.get('role');

    const users = storage.getUsers();
    // Check for hardcoded freelance creds or existing users
    const user = users.find(u => 
        (u.email === username || u.name.toLowerCase().replace(/\s/g, '') === username.toLowerCase()) && 
        (password === 'freelance' || password === 'password') // Simple mock check
    );

    if (user && user.role === role) {
        setState({ currentUser: user, view: 'dashboard' });
    } else if (username === 'freelance' && password === 'freelance') {
        const fallbackUser = users.find(u => u.role === role) || users[0];
        setState({ currentUser: fallbackUser, view: 'dashboard' });
    } else {
        alert('Invalid credentials. Please use freelance/freelance or create an account.');
    }
}

function handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    const users = storage.getUsers();
    if (users.some(u => u.email === email)) {
        alert('User with this email already exists.');
        return;
    }

    const newUser = {
        id: 'u' + (users.length + 1),
        name,
        email,
        role,
        skills: [],
        bio: `New ${role.replace('_', ' ')} on CampusGig.`,
        rating: 5.0,
        completedTasks: 0,
        points: 500,
        reliabilityScore: 100,
        joinedAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    storage.setUsers(updatedUsers);
    setState({ currentUser: newUser, view: 'dashboard' });
    alert('Account created successfully!');
}

function handleLogout() {
    setState({ currentUser: null, view: 'landing' });
}

function setView(view) {
    setState({ view, isSidebarOpen: false });
}

function addNotification(userId, title, message, type) {
    const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        userId,
        title,
        message,
        type,
        read: false,
        createdAt: new Date().toISOString()
    };
    setState({ notifications: [newNotif, ...state.notifications] });
}

function calculateFitScore(task, user) {
    if (!user) return 0;
    let score = 0;
    const skillMatch = task.description.toLowerCase().split(' ').filter(word => 
        user.skills.some(skill => skill.toLowerCase().includes(word))
    ).length;
    score += Math.min(skillMatch * 20, 60);
    if (user.skills.some(s => s.toLowerCase().includes(task.category.toLowerCase()))) {
        score += 20;
    }
    score += (user.reliabilityScore / 100) * 20;
    return Math.min(Math.round(score), 100);
}

// --- Components ---
const Icon = (name, className = 'w-5 h-5') => `<i data-lucide="${name}" class="${className}"></i>`;

const Button = (text, onClick, variant = 'primary', className = '', disabled = false) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50',
        outline: 'bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-50',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-100'
    };
    const id = `btn-${Math.random().toString(36).substr(2, 9)}`;
    window[id] = onClick;
    return `
        <button 
            onclick="window['${id}']()"
            ${disabled ? 'disabled' : ''}
            class="px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}"
        >
            ${text}
        </button>
    `;
};

const Badge = (text, color = 'indigo') => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        green: 'bg-green-50 text-green-700 border-green-100',
        red: 'bg-red-50 text-red-700 border-red-100',
        yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
    };
    return `<span class="px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}">${text}</span>`;
};

// --- Views ---
const LandingView = () => {
    const isLogin = state.landingTab === 'login';
    
    return `
    <div class="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-6 animate-fade-in">
        <div class="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
            <div class="md:w-1/2 p-12 flex flex-col justify-center">
                <div class="flex items-center gap-2 mb-8">
                    <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                        ${Icon('zap', 'text-white w-6 h-6')}
                    </div>
                    <h1 class="text-2xl font-bold text-gray-900 tracking-tight">CampusGig</h1>
                </div>
                
                <div class="flex gap-4 mb-8 border-b border-gray-100">
                    <button onclick="setState({ landingTab: 'login' })" class="pb-2 font-bold transition-all ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}">Login</button>
                    <button onclick="setState({ landingTab: 'signup' })" class="pb-2 font-bold transition-all ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400 hover:text-gray-600'}">Create Account</button>
                </div>

                <h2 class="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
                    ${isLogin ? 'Login to <span class="text-indigo-600">Earn & Learn</span>' : 'Join the <span class="text-indigo-600">Community</span>'}
                </h2>
                
                ${isLogin ? `
                    <form onsubmit="window.handleLogin(event)" class="space-y-4 animate-slide-up">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Username / Email</label>
                            <input name="username" type="text" required placeholder="Enter username" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                            <input name="password" type="password" required placeholder="Enter password" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Login As</label>
                            <select name="role" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all">
                                <option value="student_worker">Student (Worker)</option>
                                <option value="student_buyer">Student (Buyer)</option>
                            </select>
                        </div>
                        <div class="pt-2">
                            <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                Sign In
                            </button>
                        </div>
                    </form>
                ` : `
                    <form onsubmit="window.handleSignup(event)" class="space-y-4 animate-slide-up">
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                            <input name="name" type="text" required placeholder="John Doe" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                            <input name="email" type="email" required placeholder="john@campus.edu" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                            <input name="password" type="password" required placeholder="Create a password" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                        </div>
                        <div class="space-y-1">
                            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">I want to</label>
                            <select name="role" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all">
                                <option value="student_worker">Work & Earn</option>
                                <option value="student_buyer">Post Tasks</option>
                            </select>
                        </div>
                        <div class="pt-2">
                            <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                Create Account
                            </button>
                        </div>
                    </form>
                `}
            </div>
            <div class="md:w-1/2 bg-indigo-50 p-12 flex items-center justify-center relative overflow-hidden">
                <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full -ml-32 -mb-32 blur-3xl opacity-50"></div>
                
                <div class="relative z-10 w-full max-w-xs space-y-4">
                    <!-- Card 1: Web Design -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 transition-all duration-500 animate-float">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                ${Icon('globe', 'text-blue-600 w-5 h-5')}
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Web Design</p>
                                <p class="font-bold text-sm text-gray-900">Portfolio Website</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-indigo-600 font-bold text-sm">₹1,200 Earned</p>
                            <div class="flex gap-0.5">
                                ${[1, 2, 3, 4, 5].map(() => Icon('star', 'w-2.5 h-2.5 fill-yellow-400 text-yellow-400')).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Card 2: Thumbnail Design -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 transition-all duration-500 animate-float-alt">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                ${Icon('image', 'text-purple-600 w-5 h-5')}
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Graphic Design</p>
                                <p class="font-bold text-sm text-gray-900">YouTube Thumbnail</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-indigo-600 font-bold text-sm">₹350 Earned</p>
                            <div class="flex gap-0.5">
                                ${[1, 2, 3, 4, 5].map(() => Icon('star', 'w-2.5 h-2.5 fill-yellow-400 text-yellow-400')).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Card 3: Poster Design -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 transition-all duration-500 animate-float-subtle">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                ${Icon('layout', 'text-green-600 w-5 h-5')}
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Poster Design</p>
                                <p class="font-bold text-sm text-gray-900">Event Poster</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-indigo-600 font-bold text-sm">₹500 Earned</p>
                            <div class="flex gap-0.5">
                                ${[1, 2, 3, 4, 5].map(() => Icon('star', 'w-2.5 h-2.5 fill-yellow-400 text-yellow-400')).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Card 4: Video Editing -->
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 transition-all duration-500 animate-float-fast">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                ${Icon('video', 'text-red-600 w-5 h-5')}
                            </div>
                            <div>
                                <p class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Video Editing</p>
                                <p class="font-bold text-sm text-gray-900">YouTube Vlog</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-indigo-600 font-bold text-sm">₹800 Earned</p>
                            <div class="flex gap-0.5">
                                ${[1, 2, 3, 4, 5].map(() => Icon('star', 'w-2.5 h-2.5 fill-yellow-400 text-yellow-400')).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
};

const DashboardView = () => {
    const userTasks = state.tasks.filter(t => t.posterId === state.currentUser.id || t.workerId === state.currentUser.id);
    const activeTasks = userTasks.filter(t => t.status === 'in_progress');
    const completedTasksCount = userTasks.filter(t => t.status === 'completed').length;

    return `
        <div class="space-y-8 animate-fade-in">
            <header class="flex flex-col md:flex-row md:justify-between md:items-end gap-4 animate-slide-up">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, ${state.currentUser.name}!</h2>
                    <p class="text-gray-500">Here's what's happening with your projects today.</p>
                </div>
                <div class="flex gap-4">
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden px-6 py-3 flex items-center gap-4">
                        <div class="p-2 bg-indigo-50 rounded-lg">
                            ${Icon('wallet', 'text-indigo-600 w-5 h-5')}
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase">Balance</p>
                            <p class="text-xl font-bold text-gray-900">₹${state.currentUser.points}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 border-l-4 border-indigo-600 animate-scale-in delay-100">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2 bg-indigo-50 rounded-lg">${Icon('briefcase', 'text-indigo-600 w-5 h-5')}</div>
                        ${Badge('Active', 'indigo')}
                    </div>
                    <p class="text-3xl font-bold text-gray-900">${activeTasks.length}</p>
                    <p class="text-sm text-gray-500">Ongoing Tasks</p>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 border-l-4 border-green-500 animate-scale-in delay-200">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2 bg-green-50 rounded-lg">${Icon('check-circle', 'text-green-600 w-5 h-5')}</div>
                        ${Badge('Done', 'green')}
                    </div>
                    <p class="text-3xl font-bold text-gray-900">${completedTasksCount}</p>
                    <p class="text-sm text-gray-500">Completed Tasks</p>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 border-l-4 border-yellow-500 animate-scale-in delay-300">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2 bg-yellow-50 rounded-lg">${Icon('star', 'text-yellow-600 w-5 h-5')}</div>
                        ${Badge('Rating', 'yellow')}
                    </div>
                    <p class="text-3xl font-bold text-gray-900">${state.currentUser.rating}</p>
                    <p class="text-sm text-gray-500">Average Rating</p>
                </div>
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6 border-l-4 border-purple-500 animate-scale-in delay-300">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-2 bg-purple-50 rounded-lg">${Icon('shield-check', 'text-purple-600 w-5 h-5')}</div>
                        ${Badge('Trust', 'purple')}
                    </div>
                    <p class="text-3xl font-bold text-gray-900">${state.currentUser.reliabilityScore}%</p>
                    <p class="text-sm text-gray-500">Reliability Score</p>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-6">
                    <div class="flex justify-between items-center">
                        <h3 class="text-xl font-bold text-gray-900">Recent Activity</h3>
                        ${Button('View Marketplace ' + Icon('chevron-right', 'w-4 h-4 inline'), () => setView('marketplace'), 'ghost', 'text-sm')}
                    </div>
                    ${userTasks.length > 0 ? `
                        <div class="space-y-4">
                            ${userTasks.slice(0, 3).map(task => `
                                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl flex items-center justify-center ${task.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600'}">
                                            ${task.status === 'completed' ? Icon('check-circle') : Icon('clock')}
                                        </div>
                                        <div>
                                            <h4 class="font-bold text-gray-900">${task.title}</h4>
                                            <p class="text-sm text-gray-500">${task.category} • ${task.status.replace('_', ' ')}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="font-bold text-gray-900">${task.isSkillSwap ? 'Skill Swap' : `₹${task.budget}`}</p>
                                        <p class="text-xs text-gray-400">Due ${new Date(task.deadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-12 text-center">
                            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                ${Icon('briefcase', 'text-gray-300 w-8 h-8')}
                            </div>
                            <h4 class="text-lg font-bold text-gray-900 mb-2">No tasks yet</h4>
                            <p class="text-gray-500 mb-6">${state.currentUser.role === 'student_worker' ? 'Browse the marketplace to find your first gig!' : 'Start your journey by posting a task or browsing the marketplace.'}</p>
                            <div class="flex justify-center gap-4">
                                ${state.currentUser.role !== 'student_worker' ? Button('Post a Task', () => setView('post')) : ''}
                                ${Button('Browse Tasks', () => setView('marketplace'), 'outline')}
                            </div>
                        </div>
                    `}
                </div>

                <div class="space-y-6">
                    <h3 class="text-xl font-bold text-gray-900">Recommended for You</h3>
                    <div class="space-y-4">
                        ${state.tasks.filter(t => t.posterId !== state.currentUser.id && t.status === 'pending').slice(0, 3).map(task => {
                            const fitScore = calculateFitScore(task, state.currentUser);
                            return `
                                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 hover:shadow-md transition-shadow">
                                    <div class="flex justify-between items-start mb-3">
                                        ${Badge(`${fitScore}% Match`, fitScore > 80 ? 'green' : 'indigo')}
                                        ${task.isUrgent ? Badge('Urgent', 'red') : ''}
                                    </div>
                                    <h4 class="font-bold text-gray-900 mb-1">${task.title}</h4>
                                    <p class="text-sm text-gray-500 line-clamp-2 mb-4">${task.description}</p>
                                    <div class="flex justify-between items-center">
                                        <p class="font-bold text-indigo-600">${task.isSkillSwap ? 'Swap' : `₹${task.budget}`}</p>
                                        ${Button('Details', () => setView('marketplace'), 'outline', 'text-xs py-1 px-3')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
};

const MarketplaceView = () => {
    const filteredTasks = state.tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(state.searchQuery.toLowerCase()) || 
                             t.description.toLowerCase().includes(state.searchQuery.toLowerCase());
        const matchesCategory = state.categoryFilter === 'All' || t.category === state.categoryFilter;
        return matchesSearch && matchesCategory && t.status === 'pending';
    });

    const handleApply = (taskId) => {
        const updatedTasks = state.tasks.map(t => {
            if (t.id === taskId) {
                const newApp = {
                    id: Math.random().toString(36).substr(2, 9),
                    taskId,
                    applicantId: state.currentUser.id,
                    message: "I'm interested in this task and have the required skills.",
                    bidAmount: t.budget,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                };
                return { ...t, applications: [...t.applications, newApp] };
            }
            return t;
        });
        setState({ tasks: updatedTasks });
        const task = state.tasks.find(t => t.id === taskId);
        addNotification(task.posterId, 'New Application', `${state.currentUser.name} applied for "${task.title}"`, 'new_application');
        alert('Application submitted successfully!');
    };

    return `
        <div class="space-y-8 animate-fade-in">
            <header class="space-y-1 animate-slide-up">
                <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Task Marketplace</h2>
                <p class="text-gray-500">Find the perfect gig to match your skills and schedule.</p>
            </header>

            <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="relative flex-1 w-full">
                    ${Icon('search', 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5')}
                    <input 
                        type="text" 
                        placeholder="Search tasks, skills, or categories..." 
                        class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        value="${state.searchQuery}"
                        oninput="window.handleSearch(this.value)"
                    />
                </div>
                <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    ${['All', 'Tutoring', 'Coding', 'Design', 'Content', 'Writing'].map(cat => `
                        <button
                            onclick="window.handleCategoryFilter('${cat}')"
                            class="px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${state.categoryFilter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}"
                        >
                            ${cat}
                        </button>
                    `).join('')}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${filteredTasks.map((task, index) => {
                    const fitScore = calculateFitScore(task, state.currentUser);
                    const hasApplied = task.applications.some(a => a.applicantId === state.currentUser.id);
                    const isOwner = task.posterId === state.currentUser.id;

                    return `
                        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-all border-t-4 border-indigo-600 animate-scale-in" style="animation-delay: ${index * 50}ms">
                            <div class="p-6 flex-1">
                                <div class="flex justify-between items-start mb-4">
                                    ${Badge(task.category, 'blue')}
                                    <div class="flex gap-2">
                                        ${task.isUrgent ? Badge('Urgent', 'red') : ''}
                                        ${task.isSkillSwap ? Badge('Skill Swap', 'purple') : ''}
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">${task.title}</h3>
                                <p class="text-gray-600 text-sm line-clamp-3 mb-6">${task.description}</p>
                                
                                <div class="grid grid-cols-2 gap-4 mb-6">
                                    <div class="flex items-center gap-2 text-gray-500">
                                        ${Icon('clock', 'w-4 h-4')}
                                        <span class="text-xs font-medium">${new Date(task.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-gray-500">
                                        ${Icon('trending-up', 'w-4 h-4')}
                                        <span class="text-xs font-medium">${task.applications.length} applicants</span>
                                    </div>
                                </div>

                                <div class="bg-indigo-50 rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p class="text-xs text-indigo-600 font-bold uppercase tracking-wider">Fit Score</p>
                                        <p class="text-xl font-black text-indigo-700">${fitScore}%</p>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Budget</p>
                                        <p class="text-xl font-black text-gray-900">${task.isSkillSwap ? 'Swap' : `₹${task.budget}`}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                                ${Button(isOwner ? 'Your Task' : hasApplied ? 'Applied' : 'Apply Now', () => handleApply(task.id), 'primary', 'flex-1', hasApplied || isOwner)}
                                ${Button(Icon('star', 'w-5 h-5'), () => {}, 'secondary', 'px-3')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            ${filteredTasks.length === 0 ? `
                <div class="text-center py-20">
                    <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        ${Icon('search', 'text-gray-300 w-10 h-10')}
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">No tasks found</h3>
                    <p class="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            ` : ''}
        </div>
    `;
};

window.handleSearch = (val) => setState({ searchQuery: val });
window.handleCategoryFilter = (cat) => setState({ categoryFilter: cat });

const Sidebar = () => `
    <aside class="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 transform ${state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out">
        <div class="h-full flex flex-col p-6">
            <div class="flex items-center gap-2 mb-10">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    ${Icon('zap', 'text-white w-5 h-5')}
                </div>
                <h1 class="text-xl font-bold text-gray-900 tracking-tight">CampusGig</h1>
            </div>

            <nav class="flex-1 space-y-2">
                ${[
                    { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
                    { id: 'marketplace', label: 'Marketplace', icon: 'briefcase' },
                    { id: 'post', label: 'Post a Task', icon: 'plus-circle', role: 'student_buyer' },
                    { id: 'notifications', label: 'Notifications', icon: 'bell' },
                    { id: 'profile', label: 'My Profile', icon: 'user' }
                ].filter(item => !item.role || state.currentUser.role === item.role || state.currentUser.role === 'admin')
                .map(item => `
                    <button 
                        onclick="window.setView('${item.id}')"
                        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${state.view === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-50'}"
                    >
                        ${Icon(item.icon, state.view === item.id ? 'text-white' : 'text-gray-400')}
                        ${item.label}
                    </button>
                `).join('')}
            </nav>

            <div class="pt-6 border-t border-gray-100">
                <button 
                    onclick="window.handleLogout()"
                    class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                    ${Icon('log-out', 'text-red-400')}
                    Logout
                </button>
            </div>
        </div>
    </aside>
`;

const NotificationsView = () => {
    const userNotifs = state.notifications.filter(n => n.userId === state.currentUser.id);
    return `
        <div class="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <header class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 animate-slide-up">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h2>
                    <p class="text-gray-500">Stay updated with your task activity.</p>
                </div>
                ${Button('Mark all as read', () => {
                    const updated = state.notifications.map(n => n.userId === state.currentUser.id ? { ...n, read: true } : n);
                    setState({ notifications: updated });
                }, 'outline', 'w-full sm:w-auto')}
            </header>

            <div class="space-y-4">
                ${userNotifs.length > 0 ? userNotifs.map((notif, index) => `
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-5 flex gap-4 items-start animate-slide-up ${!notif.read ? 'border-l-4 border-indigo-600 bg-indigo-50/30' : ''}" style="animation-delay: ${index * 50}ms">
                        <div class="p-2 rounded-lg ${!notif.read ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}">
                            ${notif.type === 'task_assigned' ? Icon('check-circle') : 
                              notif.type === 'new_application' ? Icon('plus-circle') : 
                              Icon('bell')}
                        </div>
                        <div class="flex-1">
                            <h4 class="font-bold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}">${notif.title}</h4>
                            <p class="text-sm text-gray-500 mb-2">${notif.message}</p>
                            <p class="text-xs text-gray-400">${new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                        ${!notif.read ? '<div class="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>' : ''}
                    </div>
                `).join('') : `
                    <div class="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            ${Icon('bell', 'w-10 h-10 text-gray-300')}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">No notifications yet</h3>
                        <p class="text-gray-500 mb-8 max-w-xs mx-auto">Stay updated with your task activity. If you're missing demo data, try resetting.</p>
                        <div class="flex justify-center">
                            ${Button('Restore Demo Data', () => {
                                if (confirm('This will reset all data to default demo state. Continue?')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }, 'outline', 'text-indigo-600 border-indigo-200 hover:bg-indigo-50')}
                        </div>
                    </div>
                `}
            </div>
        </div>
    `;
};

const ProfileView = () => `
    <div class="max-w-4xl mx-auto space-y-8">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div class="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div class="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-4xl font-black">
                    ${state.currentUser.name.charAt(0)}
                </div>
                <div class="flex-1 text-center md:text-left">
                    <div class="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                        ${Badge(state.currentUser.role.replace('_', ' '), 'blue')}
                        ${Badge('Verified Student', 'green')}
                    </div>
                    <h2 class="text-4xl font-black mb-2">${state.currentUser.name}</h2>
                    <p class="text-indigo-100 mb-4 max-w-lg">${state.currentUser.bio}</p>
                    <div class="flex flex-wrap justify-center md:justify-start gap-6">
                        <div class="text-center md:text-left">
                            <p class="text-2xl font-bold">${state.currentUser.rating}</p>
                            <p class="text-xs text-indigo-200 font-bold uppercase tracking-wider">Rating</p>
                        </div>
                        <div class="text-center md:text-left border-l border-white/20 pl-6">
                            <p class="text-2xl font-bold">${state.currentUser.completedTasks}</p>
                            <p class="text-xs text-indigo-200 font-bold uppercase tracking-wider">Completed</p>
                        </div>
                        <div class="text-center md:text-left border-l border-white/20 pl-6">
                            <p class="text-2xl font-bold">${state.currentUser.reliabilityScore}%</p>
                            <p class="text-xs text-indigo-200 font-bold uppercase tracking-wider">Reliability</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
            <div>
                <h3 class="text-lg font-bold text-gray-900">Developer Tools</h3>
                <p class="text-sm text-gray-500">Reset the application to its initial state with fresh demo data.</p>
            </div>
            ${Button('Reset Demo Data', () => {
                if (confirm('This will clear all your local changes and reset to default demo data. Continue?')) {
                    localStorage.clear();
                    window.location.reload();
                }
            }, 'outline', 'text-red-600 border-red-200 hover:bg-red-50')}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="space-y-6">
                <h3 class="text-xl font-bold text-gray-900">Skills & Expertise</h3>
                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6">
                    <div class="flex flex-wrap gap-2">
                        ${state.currentUser.skills.map(skill => `
                            <span class="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold flex items-center gap-2">
                                ${Icon('check-circle', 'w-3 h-3 text-green-500')} ${skill}
                            </span>
                        `).join('')}
                        <button class="px-3 py-1.5 border-2 border-dashed border-gray-200 text-gray-400 rounded-lg text-sm font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all">
                            + Add Skill
                        </button>
                    </div>
                </div>

                <h3 class="text-xl font-bold text-gray-900">Achievements</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-4 text-center">
                        ${Icon('trophy', 'w-8 h-8 text-yellow-500 mx-auto mb-2')}
                        <p class="text-xs font-bold text-gray-900">Top Rated</p>
                    </div>
                    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-4 text-center">
                        ${Icon('zap', 'w-8 h-8 text-indigo-500 mx-auto mb-2')}
                        <p class="text-xs font-bold text-gray-900">Fast Learner</p>
                    </div>
                </div>
            </div>

            <div class="md:col-span-2 space-y-6">
                <h3 class="text-xl font-bold text-gray-900">Recent Reviews</h3>
                <div class="space-y-4">
                    ${[1, 2].map(i => `
                        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-6">
                            <div class="flex justify-between items-start mb-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold">A</div>
                                    <div>
                                        <h4 class="font-bold text-gray-900">Alex Kumar</h4>
                                        <p class="text-xs text-gray-500">2 weeks ago</p>
                                    </div>
                                </div>
                                <div class="flex gap-1">
                                    ${[1, 2, 3, 4, 5].map(() => Icon('star', 'w-4 h-4 fill-yellow-400 text-yellow-400')).join('')}
                                </div>
                            </div>
                            <p class="text-gray-600">"Great work on the Python script! Very professional and delivered on time. Highly recommend for any coding tasks."</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
`;

const PostTaskView = () => `
    <div class="max-w-3xl mx-auto space-y-8">
        <header>
            <h2 class="text-3xl font-bold text-gray-900">Post a New Task</h2>
            <p class="text-gray-500">Fill in the details below to find the best student for your project.</p>
        </header>

        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden p-8">
            <form id="post-task-form" onsubmit="window.handlePostTask(event)" class="space-y-6">
                <div class="space-y-2">
                    <label class="text-sm font-bold text-gray-700 uppercase tracking-wider">Task Title</label>
                    <input name="title" type="text" required placeholder="e.g., Help with Calculus Homework" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-bold text-gray-700 uppercase tracking-wider">Description</label>
                    <textarea name="description" required rows="4" placeholder="Describe what you need help with in detail..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
                        <select name="category" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                            ${['Tutoring', 'Coding', 'Design', 'Content', 'Writing', 'Other'].map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm font-bold text-gray-700 uppercase tracking-wider">Deadline</label>
                        <input name="deadline" type="date" required class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-sm font-bold text-gray-700 uppercase tracking-wider">Budget (Points)</label>
                    <input name="budget" type="number" min="50" max="1000" step="50" value="100" class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>

                <div class="pt-4">
                    <button type="submit" class="w-full py-4 text-lg bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Post Task Now</button>
                </div>
            </form>
        </div>
    </div>
`;

window.handlePostTask = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTask = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        budget: parseInt(formData.get('budget')),
        deadline: formData.get('deadline'),
        posterId: state.currentUser.id,
        status: 'pending',
        isUrgent: false,
        isSkillSwap: false,
        createdAt: new Date().toISOString(),
        applications: []
    };
    setState({ tasks: [newTask, ...state.tasks] });
    setView('dashboard');
    alert('Task posted successfully!');
};

window.handleLogin = handleLogin;
window.handleSignup = handleSignup;
window.setView = setView;
window.handleLogout = handleLogout;
window.toggleSidebar = () => setState({ isSidebarOpen: !state.isSidebarOpen });

const MainLayout = (content) => `
    <div class="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
        ${state.isSidebarOpen ? `<div onclick="window.toggleSidebar()" class="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden transition-opacity animate-fade-in"></div>` : ''}
        ${Sidebar()}
        
        <div class="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    ${Icon('zap', 'text-white w-5 h-5')}
                </div>
                <h1 class="text-xl font-bold text-gray-900 tracking-tight">CampusGig</h1>
            </div>
            <button onclick="window.toggleSidebar()" class="p-2 text-gray-500">
                ${Icon(state.isSidebarOpen ? 'x' : 'menu')}
            </button>
        </div>

        <main class="flex-1 p-6 lg:p-10 overflow-y-auto">
            <div class="max-w-6xl mx-auto">
                ${content}
            </div>
        </main>
    </div>
`;

// --- Render ---
function render() {
    const app = document.getElementById('app');
    let content = '';

    if (!state.currentUser) {
        content = LandingView();
    } else {
        let viewContent = '';
        switch (state.view) {
            case 'dashboard': viewContent = DashboardView(); break;
            case 'marketplace': viewContent = MarketplaceView(); break;
            case 'post': 
                if (state.currentUser.role === 'student_worker') {
                    setView('dashboard');
                    viewContent = DashboardView();
                } else {
                    viewContent = PostTaskView();
                }
                break;
            case 'notifications': viewContent = NotificationsView(); break;
            case 'profile': viewContent = ProfileView(); break;
            default: viewContent = DashboardView();
        }
        content = MainLayout(viewContent);
    }

    app.innerHTML = content;
    lucide.createIcons();
}

// Initial render
render();
