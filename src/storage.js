const USERS_KEY = 'campus_gig_users';
const TASKS_KEY = 'campus_gig_tasks';
const NOTIFS_KEY = 'campus_gig_notifications';
const CURRENT_USER_KEY = 'campus_gig_current_user';

export const storage = {
  getUsers: () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  setUsers: (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  
  getTasks: () => JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'),
  setTasks: (tasks) => localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)),
  
  getNotifications: () => JSON.parse(localStorage.getItem(NOTIFS_KEY) || '[]'),
  setNotifications: (notifs) => localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs)),
  
  getCurrentUser: () => JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null'),
  setCurrentUser: (user) => localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user)),
};

// Initialize with some mock data if empty
if (storage.getUsers().length === 0) {
  const mockUsers = [
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
      name: 'David Miller',
      email: 'david@campus.edu',
      role: 'student_worker',
      skills: ['Java', 'C++', 'Algorithms', 'Data Structures'],
      bio: 'Computer Science junior. Strong background in competitive programming.',
      rating: 4.9,
      completedTasks: 5,
      points: 300,
      reliabilityScore: 100,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u7',
      name: 'Emma Wilson',
      email: 'emma@campus.edu',
      role: 'student_worker',
      skills: ['Spanish', 'Translation', 'Literature'],
      bio: 'Bilingual student offering translation and proofreading services.',
      rating: 4.6,
      completedTasks: 12,
      points: 600,
      reliabilityScore: 94,
      joinedAt: new Date().toISOString(),
    },
    {
      id: 'u8',
      name: 'Liam Brown',
      email: 'liam@campus.edu',
      role: 'student_worker',
      skills: ['Photography', 'Video Editing', 'Premiere Pro'],
      bio: 'Film student. I can help with any video or photo needs for your projects.',
      rating: 4.8,
      completedTasks: 7,
      points: 500,
      reliabilityScore: 97,
      joinedAt: new Date().toISOString(),
    }
  ];
  storage.setUsers(mockUsers);
}

if (storage.getTasks().length === 0) {
  const mockTasks = [
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
        { id: 'a1', taskId: 't1', applicantId: 'u2', message: 'I can do this!', bidAmount: 150, status: 'pending', createdAt: new Date().toISOString() }
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
      posterId: 'u3',
      status: 'in_progress',
      workerId: 'u5',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't4',
      title: 'Blog Post on Campus Sustainability',
      description: 'Write a 1000-word blog post about the new recycling initiatives on campus. Must be engaging.',
      category: 'Content',
      budget: 100,
      deadline: '2026-04-05',
      posterId: 'u3',
      status: 'completed',
      workerId: 'u4',
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
        posterId: 'u3',
        status: 'pending',
        isUrgent: false,
        isSkillSwap: false,
        createdAt: new Date().toISOString(),
        applications: []
    },
    {
      id: 't6',
      title: 'Mobile App UI Design',
      description: 'Need 5-6 screens for a food delivery app. Focus on user experience and modern look.',
      category: 'Design',
      budget: 400,
      deadline: '2026-05-01',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't7',
      title: 'Proofreading Master Thesis',
      description: 'Looking for someone to proofread my 50-page thesis for grammar and flow. Topic is Sociology.',
      category: 'Writing',
      budget: 150,
      deadline: '2026-04-30',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't8',
      title: 'Event Photography - Graduation',
      description: 'Need a photographer for a 2-hour graduation party. High-quality photos required.',
      category: 'Other',
      budget: 250,
      deadline: '2026-05-15',
      posterId: 'u1',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't9',
      title: 'Java Homework Help',
      description: 'Struggling with binary search trees. Need someone to explain the logic and help with implementation.',
      category: 'Coding',
      budget: 100,
      deadline: '2026-04-12',
      posterId: 'u3',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't10',
      title: 'Spanish to English Translation',
      description: 'Translate a 5-page document from Spanish to English. Must be accurate and formal.',
      category: 'Writing',
      budget: 80,
      deadline: '2026-04-18',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't11',
      title: 'Video Editing for YouTube Channel',
      description: 'Edit a 15-minute vlog. Add transitions, background music, and subtitles.',
      category: 'Content',
      budget: 300,
      deadline: '2026-04-22',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't12',
      title: 'Research Assistant for Survey',
      description: 'Help distribute a survey and collect 100 responses from students. Data entry included.',
      category: 'Other',
      budget: 500,
      deadline: '2026-05-10',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't13',
      title: 'Marketing Strategy for Startup',
      description: 'Help create a social media marketing plan for a new student-led startup.',
      category: 'Other',
      budget: 0,
      deadline: '2026-04-28',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: true,
      swapSkill: 'Graphic Design',
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't14',
      title: 'UI/UX Review for Project',
      description: 'Need a professional review of my final year project UI. Looking for feedback on usability and accessibility.',
      category: 'Design',
      budget: 0,
      deadline: '2026-05-05',
      posterId: 'u2',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: true,
      swapSkill: 'React Tutoring',
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't15',
      title: 'Personal Portfolio Website',
      description: 'Create a responsive one-page portfolio website using HTML, CSS, and basic JS. Should include a contact form and project gallery.',
      category: 'Coding',
      budget: 600,
      deadline: '2026-04-25',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't16',
      title: 'YouTube Thumbnail Design (Gaming)',
      description: 'Need 3 high-click-through-rate thumbnails for my gaming channel. Vibrant colors and catchy text required.',
      category: 'Design',
      budget: 120,
      deadline: '2026-04-10',
      posterId: 'u1',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't17',
      title: 'Cultural Fest Poster Design',
      description: 'Design an A3 size poster for the upcoming college cultural fest. Needs to be colorful and include all event details.',
      category: 'Design',
      budget: 200,
      deadline: '2026-04-15',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't18',
      title: 'Social Media Content Manager',
      description: 'Manage a student startup Instagram account for 2 weeks. Create 5 posts and 10 stories. Engagement focus.',
      category: 'Content',
      budget: 450,
      deadline: '2026-04-20',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't19',
      title: 'Data Entry for Research Project',
      description: 'Input 500 survey responses into an Excel spreadsheet. Accuracy is paramount. Estimated time: 4-5 hours.',
      category: 'Other',
      budget: 300,
      deadline: '2026-04-12',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't20',
      title: 'Figma UI Kit for Startup',
      description: 'Create a comprehensive UI kit in Figma including buttons, forms, and navigation elements.',
      category: 'Design',
      budget: 800,
      deadline: '2026-04-20',
      posterId: 'u3',
      status: 'in_progress',
      workerId: 'u2',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't21',
      title: 'Social Media Graphics Pack',
      description: 'Design 10 Instagram posts and 5 stories for a campus event.',
      category: 'Design',
      budget: 300,
      deadline: '2026-03-25',
      posterId: 'u1',
      status: 'completed',
      workerId: 'u2',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't22',
      title: 'Technical Documentation for API',
      description: 'Write clear and concise documentation for a RESTful API built with Node.js.',
      category: 'Writing',
      budget: 400,
      deadline: '2026-04-15',
      posterId: 'u1',
      status: 'in_progress',
      workerId: 'u4',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't23',
      title: 'Statistics Tutoring - Linear Regression',
      description: 'Help me understand the concepts of linear regression and how to implement it in R.',
      category: 'Tutoring',
      budget: 250,
      deadline: '2026-03-20',
      posterId: 'u3',
      status: 'completed',
      workerId: 'u5',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    }
  ];
  storage.setTasks(mockTasks);
} else {
  // Ensure new tasks (t15-t19) are added if missing
  const currentTasks = storage.getTasks();
  const newTasks = [
    {
      id: 't15',
      title: 'Personal Portfolio Website',
      description: 'Create a responsive one-page portfolio website using HTML, CSS, and basic JS. Should include a contact form and project gallery.',
      category: 'Coding',
      budget: 600,
      deadline: '2026-04-25',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't16',
      title: 'YouTube Thumbnail Design (Gaming)',
      description: 'Need 3 high-click-through-rate thumbnails for my gaming channel. Vibrant colors and catchy text required.',
      category: 'Design',
      budget: 120,
      deadline: '2026-04-10',
      posterId: 'u1',
      status: 'pending',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't17',
      title: 'Cultural Fest Poster Design',
      description: 'Design an A3 size poster for the upcoming college cultural fest. Needs to be colorful and include all event details.',
      category: 'Design',
      budget: 200,
      deadline: '2026-04-15',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't18',
      title: 'Social Media Content Manager',
      description: 'Manage a student startup Instagram account for 2 weeks. Create 5 posts and 10 stories. Engagement focus.',
      category: 'Content',
      budget: 450,
      deadline: '2026-04-20',
      posterId: 'u1',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't19',
      title: 'Data Entry for Research Project',
      description: 'Input 500 survey responses into an Excel spreadsheet. Accuracy is paramount. Estimated time: 4-5 hours.',
      category: 'Other',
      budget: 300,
      deadline: '2026-04-12',
      posterId: 'u3',
      status: 'pending',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't20',
      title: 'Figma UI Kit for Startup',
      description: 'Create a comprehensive UI kit in Figma including buttons, forms, and navigation elements.',
      category: 'Design',
      budget: 800,
      deadline: '2026-04-20',
      posterId: 'u3',
      status: 'in_progress',
      workerId: 'u2',
      isUrgent: true,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't21',
      title: 'Social Media Graphics Pack',
      description: 'Design 10 Instagram posts and 5 stories for a campus event.',
      category: 'Design',
      budget: 300,
      deadline: '2026-03-25',
      posterId: 'u1',
      status: 'completed',
      workerId: 'u2',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't22',
      title: 'Technical Documentation for API',
      description: 'Write clear and concise documentation for a RESTful API built with Node.js.',
      category: 'Writing',
      budget: 400,
      deadline: '2026-04-15',
      posterId: 'u1',
      status: 'in_progress',
      workerId: 'u4',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    },
    {
      id: 't23',
      title: 'Statistics Tutoring - Linear Regression',
      description: 'Help me understand the concepts of linear regression and how to implement it in R.',
      category: 'Tutoring',
      budget: 250,
      deadline: '2026-03-20',
      posterId: 'u3',
      status: 'completed',
      workerId: 'u5',
      isUrgent: false,
      isSkillSwap: false,
      createdAt: new Date().toISOString(),
      applications: []
    }
  ];

  let updated = false;
  newTasks.forEach(nt => {
    if (!currentTasks.some(ct => ct.id === nt.id)) {
      currentTasks.push(nt);
      updated = true;
    }
  });

  if (updated) {
    storage.setTasks(currentTasks);
  }
}

if (storage.getNotifications().length < 10) {
  const existingNotifs = storage.getNotifications();
  const mockNotifs = [
    {
      id: 'n1',
      userId: 'u1',
      title: 'Welcome to CampusGig!',
      message: 'Start exploring tasks and earning points today.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'n2',
      userId: 'u3',
      title: 'Task Completed',
      message: 'Your task "Blog Post on Campus Sustainability" has been completed by Priya Sharma.',
      type: 'task_completed',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'n3',
      userId: 'u1',
      title: 'New Application',
      message: 'Sarah Chen applied for your task "Logo Design for Student Club".',
      type: 'new_application',
      read: false,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'n4',
      userId: 'u2',
      title: 'Task Assigned',
      message: 'You have been assigned to "Python Script for Data Scraping".',
      type: 'task_assigned',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'n5',
      userId: 'u4',
      title: 'Payment Received',
      message: 'You earned ₹100 for completing "Blog Post on Campus Sustainability".',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'n6',
      userId: 'u5',
      title: 'New Task Match',
      message: 'A new Tutoring task "Calculus II Tutoring Session" matches your skills!',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: 'n7',
      userId: 'u1',
      title: 'Task Update',
      message: 'Your task "Web Development for Portfolio" has been updated.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'n8',
      userId: 'u1',
      title: 'Skill Swap Request',
      message: 'Anil Kumar wants to swap "React Tutoring" for your "Logo Design" task.',
      type: 'new_application',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'n9',
      userId: 'u1',
      title: 'Payment Confirmed',
      message: '₹500 has been credited to your account for "Python Script for Data Scraping".',
      type: 'system',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'n10',
      userId: 'u2',
      title: 'Deadline Approaching',
      message: 'The deadline for "Python Script for Data Scraping" is in 24 hours.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 'n11',
      userId: 'u3',
      title: 'New Review',
      message: 'Priya Sharma left you a 5-star review for "Blog Post on Campus Sustainability".',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 14400000).toISOString()
    },
    {
      id: 'n12',
      userId: 'u1',
      title: 'Marketplace Alert',
      message: '3 new tasks matching your "Design" skill were posted today.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 21600000).toISOString()
    },
    {
      id: 'n13',
      userId: 'u1',
      title: 'Community Milestone',
      message: 'CampusGig just reached 500 active students! Thanks for being part of it.',
      type: 'system',
      read: true,
      createdAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'n14',
      userId: 'u3',
      title: 'Application Received',
      message: 'Emma Wilson applied for your task "Proofreading Master Thesis".',
      type: 'new_application',
      read: false,
      createdAt: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'n15',
      userId: 'u3',
      title: 'Budget Tip',
      message: 'Tasks with a budget over ₹200 get 50% more applicants on average.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 43200000).toISOString()
    },
    {
      id: 'n16',
      userId: 'u3',
      title: 'Profile View',
      message: 'Your profile was viewed by 5 potential workers today.',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 21600000).toISOString()
    },
    {
      id: 'n17',
      userId: 'u3',
      title: 'New Message',
      message: 'David Miller sent you a message about "Java Homework Help".',
      type: 'system',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ];
  
  // Merge only if ID doesn't exist to avoid duplicates
  const merged = [...existingNotifs];
  mockNotifs.forEach(mn => {
    if (!merged.some(en => en.id === mn.id)) {
      merged.push(mn);
    }
  });
  
  storage.setNotifications(merged);
}
