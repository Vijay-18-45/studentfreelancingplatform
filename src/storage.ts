import { User, Task, Notification } from './types';

const USERS_KEY = 'campus_gig_users';
const TASKS_KEY = 'campus_gig_tasks';
const NOTIFS_KEY = 'campus_gig_notifications';
const CURRENT_USER_KEY = 'campus_gig_current_user';

export const storage = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getTasks: (): Task[] => JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'),
  setTasks: (tasks: Task[]) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)),
  
  getNotifications: (): Notification[] => JSON.parse(localStorage.getItem(NOTIFS_KEY) || '[]'),
  setNotifications: (notifs: Notification[]) => localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs)),
  
  getCurrentUser: (): User | null => JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'),
  setCurrentUser: (user: User | null) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)),
};

// Initialize with some mock data if empty
if (storage.getUsers().length === 0) {
  const mockUsers: User[] = [
    {
      id: 'u1',
      name: 'Vijay Joseph',
      email: 'vijay@campus.edu',
      role: 'admin',
      skills: ['React', 'Node.js', 'Python', 'System Design'],
      bio: 'Lead Developer & Admin. Here to ensure everything runs smoothly.',
      rating: 5.0,
      completedTasks: 12,
      points: 1000,
      reliabilityScore: 98,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u2',
      name: 'Sarah Chen',
      email: 'sarah@campus.edu',
      role: 'student_worker',
      skills: ['Graphic Design', 'UI/UX', 'Figma', 'Adobe Illustrator'],
      bio: 'Passionate designer looking for creative projects. I love minimalist aesthetics.',
      rating: 4.8,
      completedTasks: 8,
      points: 450,
      reliabilityScore: 95,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u3',
      name: 'Alex Kumar',
      email: 'alex@campus.edu',
      role: 'student_buyer',
      skills: ['Economics', 'Data Analysis', 'Excel'],
      bio: 'Economics major. Often need help with coding and technical assignments.',
      rating: 4.5,
      completedTasks: 0,
      points: 200,
      reliabilityScore: 100,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u4',
      name: 'Priya Sharma',
      email: 'priya@campus.edu',
      role: 'student_worker',
      skills: ['Content Writing', 'SEO', 'Blogging', 'Copywriting'],
      bio: 'Words are my weapon. I can write anything from technical blogs to creative stories.',
      rating: 4.9,
      completedTasks: 15,
      points: 800,
      reliabilityScore: 99,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u5',
      name: 'Michael Ross',
      email: 'mike@campus.edu',
      role: 'student_worker',
      skills: ['Mathematics', 'Calculus', 'Statistics', 'Tutoring'],
      bio: 'Math whiz. I can help you understand complex concepts easily.',
      rating: 4.7,
      completedTasks: 20,
      points: 1200,
      reliabilityScore: 92,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u6',
      name: 'Emily Blunt',
      email: 'emily@campus.edu',
      role: 'student_buyer',
      skills: ['Marketing', 'Social Media'],
      bio: 'Looking for talented students to help with my startup projects.',
      rating: 4.6,
      completedTasks: 2,
      points: 500,
      reliabilityScore: 100,
      joinedAt: new Date().toISOString(),
    }
  ];
  storage.setUsers(mockUsers);
}

if (storage.getTasks().length === 0) {
  const mockTasks: Task[] = [
    {
      id: 't1',
      title: 'Python Script for Data Scraping',
      description: 'Need a script to scrape product data from an e-commerce site and save it to a CSV file. Should handle pagination.',
      category: 'Coding',
      budget: 150,
      deadline: '2026-04-01',
      posterId: 'u3',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: [
        {
          id: 'a1',
          taskId: 't1',
          applicantId: 'u2',
          message: 'I have experience with BeautifulSoup and Selenium.',
          bidAmount: 150,
          status: 'pending',
          createdAt: new Date().toISOString()
        },
        {
          id: 'a2',
          taskId: 't1',
          applicantId: 'u4',
          message: 'I can do this quickly using Scrapy.',
          bidAmount: 140,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 't2',
      title: 'Logo Design for Student Club',
      description: 'Designing a minimalist logo for the Robotics club. Needs to be modern and tech-focused.',
      category: 'Design',
      budget: 0,
      deadline: '2026-03-30',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: true,
      swapSkill: 'Python Tutoring',
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't3',
      title: 'Calculus II Tutoring Session',
      description: 'Need help understanding integration by parts and differential equations for my upcoming midterm.',
      category: 'Tutoring',
      budget: 200,
      deadline: '2026-03-28',
      posterId: 'u6',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: [
        {
          id: 'a3',
          taskId: 't3',
          applicantId: 'u5',
          message: 'I am a math whiz and can help you ace your midterm!',
          bidAmount: 200,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 't4',
      title: 'Blog Post on Campus Sustainability',
      description: 'Write a 1000-word blog post about the new recycling initiatives on campus. Must be engaging.',
      category: 'Content',
      budget: 100,
      deadline: '2026-04-05',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't5',
      title: 'React Component Library Setup',
      description: 'Help me set up a basic component library using Tailwind CSS and Radix UI for a side project.',
      category: 'Coding',
      budget: 300,
      deadline: '2026-04-10',
      posterId: 'u6',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't6',
      title: 'Social Media Banner Design',
      description: 'Need banners for Facebook, Twitter, and LinkedIn for our upcoming cultural fest.',
      category: 'Design',
      budget: 80,
      deadline: '2026-03-29',
      posterId: 'u1',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't7',
      title: 'English Literature Essay Review',
      description: 'Review my 2000-word essay on Shakespearean tragedies. Focus on grammar and flow.',
      category: 'Writing',
      budget: 0,
      deadline: '2026-04-02',
      posterId: 'u2',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: true,
      swapSkill: 'Figma Basics',
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't8',
      title: 'Market Research for New App',
      description: 'Conduct a survey among students about their food ordering habits. Need at least 50 responses.',
      category: 'Other',
      budget: 120,
      deadline: '2026-04-15',
      posterId: 'u6',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't9',
      title: 'Java Data Structures Help',
      description: 'Need help implementing a balanced Binary Search Tree (AVL or Red-Black) for my assignment.',
      category: 'Coding',
      budget: 250,
      deadline: '2026-03-31',
      posterId: 'u3',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't10',
      title: 'Poster Design for Hackathon',
      description: 'Create a vibrant and attractive poster for the upcoming 24-hour hackathon.',
      category: 'Design',
      budget: 0,
      deadline: '2026-04-05',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: true,
      swapSkill: 'React Basics',
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't11',
      title: 'Spanish Translation (English to Spanish)',
      description: 'Translate a 5-page document from English to Spanish. Must be accurate and natural.',
      category: 'Writing',
      budget: 180,
      deadline: '2026-04-08',
      posterId: 'u6',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't12',
      title: 'Physics I Lab Report Help',
      description: 'Need assistance with data analysis and error calculation for my pendulum experiment lab report.',
      category: 'Tutoring',
      budget: 150,
      deadline: '2026-03-29',
      posterId: 'u3',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    }
  ];
  storage.setTasks(mockTasks);
}

if (storage.getNotifications().length === 0) {
  const mockNotifs: Notification[] = [
    {
      id: 'n1',
      userId: 'u1',
      title: 'Welcome to CampusGig!',
      message: 'Start exploring tasks and earning points today.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      userId: 'u2',
      title: 'New Task Match',
      message: 'A new Design task "Logo Design" matches your skills!',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];
  storage.setNotifications(mockNotifs);
}
