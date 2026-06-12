import type { SiteContent } from '@/types';

/**
 * ──────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH
 *  Everything personal lives here. Edit this file to update the whole site.
 *  All values are sourced from Yash's résumé, LinkedIn and GitHub.
 * ──────────────────────────────────────────────────────────────────────────
 */
export const content: SiteContent = {
  profile: {
    name: 'Yash Pahwa',
    title: 'Full-Stack & AI/ML Engineer',
    tagline:
      'I build full-stack web apps and machine-learning systems — from real-time multiplayer platforms to clinical-grade diagnostic models.',
    roles: ['Full-Stack Developer', 'ML Engineer', 'AI Automation', 'CS @ Thapar'],
    location: 'Patiala, India', // edit if you prefer a different base location
    githubUsername: 'YashPahwa67',
    social: {
      github: 'https://github.com/YashPahwa67',
      linkedin: 'https://www.linkedin.com/in/yash-pahwa-1980m/',
      email: 'yashpahwa.work@gmail.com',
      resume: '/resume.pdf', // drop your PDF at public/resume.pdf
    },
    // ── HERO AVATAR ────────────────────────────────────────────────────────
    // Priority: `image` (2D living portrait) → `url` (3D .glb) → shader orb.
    //
    // `image`: save your portrait to public/avatar.png. The hero renders it as a
    //   floating, cursor-parallax "living portrait" (a transparent-background PNG
    //   looks best, but the circular crop you have works too).
    // `url`:   optionally a Ready Player Me .glb for a true 3D head-tracking avatar
    //   (see README "Add your 3D avatar"). Only used when `image` is empty.
    avatar: {
      image: '/avatar.jpg',
      url: '',
      scale: 3.1,
      position: [0, -3.2, 0],
    },
  },

  about: {
    paragraphs: [
      'I’m a Computer Science undergrad at Thapar Institute of Engineering and Technology, most at home at the intersection of product engineering and machine learning. I ship full-stack apps with real auth, real-time data and real users — and I train models that have to be right, not just look impressive on a slide.',
      'Right now I’m a Full-Stack Developer Intern at Xebia, building an internship-management platform with an AI chatbot for query resolution and scalable services deployed on Azure. My other work spans a Monkeytype-style typing platform with Socket.io multiplayer racing, computer-vision pipelines that screen ultrasound and leaf-disease images at up to 95% accuracy, and production n8n automations I shipped during my internship at Es Magico.',
      'What ties it together is the craft underneath: typed code, accessible UI, and architecture that still reads cleanly when someone opens dev tools. To me that’s part of the build, not an afterthought.',
    ],
    highlights: [
      { label: 'GPA', value: '8.33' },
      { label: 'Best model accuracy', value: '95%' },
      { label: 'Shipped projects', value: '5+' },
      { label: 'Internships', value: '2' },
    ],
  },

  /* High-level capabilities — what I actually do, grounded in real projects/roles. */
  capabilities: [
    {
      title: 'Full-Stack Engineering',
      blurb:
        'Typed React front-ends on Node/Express APIs — real auth, real-time data and real users, not toy demos.',
      items: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Socket.io'],
    },
    {
      title: 'Gen-AI & Automation',
      blurb:
        'Wiring LLMs and APIs into production workflows — AI chatbots and n8n pipelines that run unattended.',
      items: ['n8n', 'AI Chatbots', 'REST APIs', 'Azure'],
    },
    {
      title: 'ML & Computer Vision',
      blurb:
        'From feature engineering to CNNs — diagnostic models that have to be right, validated with cross-validation.',
      items: ['scikit-learn', 'TensorFlow', 'OpenCV', 'CNNs'],
    },
    {
      title: 'Prompt Engineering',
      blurb:
        'Designing reliable LLM prompts and rapid prototypes — turning fuzzy asks into shippable features.',
      items: ['LLM Workflows', 'Rapid Prototyping'],
    },
    {
      title: 'Test Automation',
      blurb:
        'End-to-end UI and flow testing with Selenium — validating core user journeys so features ship with confidence.',
      items: ['Selenium', 'E2E Testing', 'CI Validation'],
    },
  ],

  /* Grouped so the Skills section reads as a system, not a word cloud. */
  skills: [
    {
      category: 'Languages',
      blurb: 'Comfortable across systems, web and data.',
      skills: ['TypeScript', 'JavaScript', 'Python', 'C++', 'C', 'Java', 'SQL', 'R'],
    },
    {
      category: 'Frontend',
      blurb: 'Typed, animated, accessible interfaces.',
      skills: ['React', 'Tailwind CSS', 'Framer Motion', 'HTML', 'CSS'],
    },
    {
      category: 'Backend',
      blurb: 'APIs, auth and real-time data.',
      skills: ['Node.js', 'Express.js', 'MongoDB', 'MySQL', 'JWT', 'Socket.io', 'Redis'],
    },
    {
      category: 'ML & Data',
      blurb: 'Predictive modelling to deep learning.',
      skills: [
        'Machine Learning',
        'Predictive Modelling',
        'CNNs',
        'Computer Vision',
        'scikit-learn',
        'TensorFlow',
        'Keras',
        'OpenCV',
        'Pandas',
        'NumPy',
        'Matplotlib',
      ],
    },
    {
      category: 'CS Fundamentals',
      blurb: 'The theory the work rests on.',
      skills: [
        'Data Structures & Algorithms',
        'OOP',
        'DBMS',
        'Operating Systems',
        'Artificial Intelligence',
        'Test Automation',
      ],
    },
    {
      category: 'Tools & Automation',
      blurb: 'How the work actually ships.',
      skills: ['Git', 'GitHub', 'n8n', 'Selenium', 'Arduino UNO', 'Linux', 'Vercel', 'Render', 'VS Code', 'Cursor'],
    },
  ],

  /*
   * Curated, human-written project copy (richer than the bare GitHub metadata).
   * Repo URLs are the REAL repositories; `liveUrl` only set where a deploy exists.
   * The "Latest from GitHub" strip is generated live from the API at runtime.
   */
  projects: [
    {
      title: 'Internship Management Platform',
      description:
        'End-to-end internship lifecycle app with role-based dashboards (student, HR, mentor, admin), a drag-and-drop Kanban candidate pipeline, real-time SSE notifications, Redis-backed JWT auth with refresh-token rotation, OTP email verification, Cloudinary uploads, certificate PDF generation, ratings/reviews, Google OAuth and an admin audit trail.',
      tech: ['React 18', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Redis', 'JWT'],
      repoUrl: 'https://github.com/YashPahwa67/internship-platform',
      liveUrl: 'https://internship-platform-eight.vercel.app/',
      image: '/projects/internship-platform.jpg',
      featured: true,
      domain: 'Full-Stack',
    },
    {
      title: 'Typeify',
      description:
        'A Monkeytype-style typing platform with solo tests and real-time multiplayer races. JWT auth, MongoDB score persistence, live WPM/accuracy tracking, and Socket.io room-based racing with synchronized prompts and leaderboards. Core user journeys are validated with end-to-end Selenium flows.',
      tech: ['React', 'Node.js', 'Express', 'MongoDB', 'Socket.io', 'JWT', 'Selenium'],
      repoUrl: 'https://github.com/YashPahwa67/Typeify',
      liveUrl: 'https://typeify-one.vercel.app/',
      image: '/projects/typeify.jpg',
      featured: true,
      domain: 'Full-Stack',
    },
    {
      title: 'PCOS Detection from Ultrasound',
      description:
        'Automated diagnostic tool that detects ovarian cysts across 1,900+ ultrasound images. CLAHE contrast enhancement and contour detection localise cysts; GLCM texture features plus shape metrics feed a Random Forest classifier built for efficient clinical screening.',
      tech: ['Python', 'OpenCV', 'scikit-learn', 'scikit-image', 'Random Forest', 'NumPy'],
      repoUrl: 'https://github.com/YashPahwa67/pcod-management',
      image: '/projects/pcos.jpg',
      imageFit: 'contain',
      imageBg: 'white',
      featured: true,
      domain: 'Computer Vision',
    },
    {
      title: 'Leaf Disease Detection',
      description:
        'Deep-learning image classifier for plant leaf diseases using DenseNet121 and ResNet CNN architectures. Reaching 95% accuracy on blight, rust and mildew after careful dataset collection and preprocessing.',
      tech: ['Python', 'TensorFlow', 'Keras', 'OpenCV', 'NumPy', 'Pandas'],
      repoUrl: 'https://github.com/YashPahwa67/Leaf_Disease_Detection',
      image: '/projects/leaf-disease.jpg',
      featured: true,
      domain: 'Machine Learning',
    },
    {
      title: 'SelfTuned Chatbot',
      description:
        'A conversational chatbot built in Python that tunes its own responses — experimenting with self-improving dialogue: collecting interactions, refining the model, and iterating on response quality inside a reproducible Jupyter workflow.',
      tech: ['Python', 'NLP', 'Jupyter', 'scikit-learn'],
      repoUrl: 'https://github.com/YashPahwa67/SelfTuned-Chatbot',
      featured: true,
      domain: 'Machine Learning',
    },
  ],

  experience: [
    {
      role: 'Full Stack Developer Intern',
      company: 'Xebia',
      period: 'Jun 2026 – Present',
      highlights: [
        'Developed a full-stack internship management system with secure user management and an AI-powered chatbot for query resolution.',
        'Built REST APIs, automated application workflows, and deployed scalable services on Azure.',
        'Gained hands-on experience in cloud deployment, debugging, and delivering production-ready full-stack features.',
      ],
      stack: ['MERN Stack', 'Azure', 'Cloud', 'DevOps', 'REST APIs'],
    },
    {
      role: 'AI Software Developer Intern',
      company: 'Es Magico',
      period: 'Jul 2025 – Sep 2025',
      highlights: [
        'Built and maintained automated workflows in n8n to connect APIs and streamline internal processes.',
        'Supported AI-powered features and debugged data pipelines end to end.',
        'Deployed production-ready, low-code/no-code integrations.',
      ],
      stack: ['n8n', 'Workflow Automation', 'REST APIs', 'AI Automation'],
    },
  ],

  education: [
    {
      degree: 'B.E. — Computer Science & Engineering',
      institution: 'Thapar Institute of Engineering and Technology, Patiala',
      score: '8.33 GPA',
      period: '2024 – Present',
    },
    {
      degree: 'Diploma — Computer Science & Engineering',
      institution: 'Thapar Polytechnic College, Patiala',
      score: '78.64%',
      period: '2021 – 2024',
    },
  ],
};
