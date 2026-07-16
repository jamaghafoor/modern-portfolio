/**
 * content.js — All portfolio data for Abdul Ghafoor.
 * Edit content here; the components consume this structure.
 */

export const meta = {
  name: 'Abdul Ghafoor',
  title: 'Senior Software Engineer — Mobile Tech Lead',
  positioning: 'I build cross-platform mobile products and the teams that ship them — from architecture and native bridging to sprint planning, code review, and App Store deployment. 20+ production apps shipped across iOS & Android.',
  version: 'v.2026.07',
  coordinates: 'Remote · Hybrid · Onsite',
  availability: 'Open to senior IC & tech lead roles',
};

export const experience = [
  {
    id: 'gtechsources',
    period: 'APR 2023–PRESENT',
    company: 'GTechSources',
    role: 'Senior React Native Developer (Team Lead)',
    description:
      'Aligned cross-functional teams on technical requirements and project milestones, leading to a 15% reduction in scope creep. Partnered with 5+ Agile teams ensuring on-time delivery of critical mobile applications. Developed scalable backend services using Node.js, Express.js, MongoDB, and PostgreSQL. Integrated core mobile services including CI/CD pipelines, real-time chat, MapBox/Google Maps, push notifications, localization, OTA updates, and real-time voice/video calling via Agora. Leveraged AI-powered development tools (Cursor, Antigravity) to accelerate workflows and enhance productivity by up to 10x.',
    tags: ['tech-lead', 'react-native', 'agile', 'ai-tools', 'full-stack'],
  },
  {
    id: 'enigmatix',
    period: 'SEP 2021–MAR 2023',
    company: 'Enigmatix',
    role: 'React & React Native Developer',
    description:
      'Developed responsive, pixel-perfect UIs using React and React Native with smooth cross-platform performance. Integrated RESTful APIs and optimized app performance for speed, scalability, and responsiveness. Collaborated with cross-functional teams to deliver features aligned with client needs. Successfully deployed 15+ mobile applications on Google Play and Apple App Store while ensuring full compliance with platform policies and security standards.',
    tags: ['react-native', 'react', 'api-integration', 'app-store'],
  },
];

export const projects = [
  {
    id: 'ai-mobile',
    name: 'AI-Powered Mobile App',
    subtitle: 'On-device AI with offline-first architecture',
    problem:
      'Users needed intelligent, context-aware features in a mobile app that worked reliably without constant internet connectivity — a challenge for AI-dependent workflows.',
    role: 'Lead mobile engineer — designed the AI integration layer and offline-first data architecture.',
    decisions: [
      'ChatGPT API for cloud-based reasoning, Meta Llama for on-device inference',
      'Offline-first architecture with local model caching and sync queue',
      'TypeScript throughout for type-safe API contracts between AI services and UI',
    ],
    outcome: 'Shipped to iOS & Android with production-grade AI features that work seamlessly offline.',
    stack: ['React Native', 'TypeScript', 'ChatGPT API', 'Meta Llama', 'On-device ML'],
  },
  {
    id: 'social-platform',
    name: 'Real-Time Social Platform',
    subtitle: 'Live chat, voice & video calling',
    problem:
      'Building a feature-rich social experience with real-time communication — chat, voice, and video — that performs reliably at scale across both platforms.',
    role: 'Core mobile engineer — built the real-time messaging layer and Agora integration.',
    decisions: [
      'Agora SDK for low-latency voice/video calling with fallback handling',
      'Firebase Realtime Database for live chat synchronisation',
      'Redux Saga for managing complex async flows (call state machines, message queues)',
    ],
    outcome: 'Production social platform with real-time chat and video calling on iOS & Android.',
    stack: ['React Native', 'Agora', 'Firebase', 'Redux Saga', 'Node.js'],
  },
  {
    id: 'location-app',
    name: 'Location-Based Service App',
    subtitle: 'Maps-driven mobile experience',
    problem:
      'Needed a robust location-aware app with deep OS integration — universal links, push notifications, and seamless map experiences across both platforms.',
    role: 'Lead mobile engineer — owned the maps integration, deep linking, and push notification infrastructure.',
    decisions: [
      'Dual map provider support: Mapbox for custom styling, Google Maps for reliability',
      'Universal links + deep linking for seamless web-to-app transitions',
      'Node.js backend for geospatial queries and push notification orchestration',
    ],
    outcome: 'Part of 20+ apps shipped to App Store & Play Store — reliable location services at scale.',
    stack: ['React Native', 'Mapbox', 'Google Maps', 'Node.js', 'Push Notifications'],
  },
];

export const skills = {
  mobile: {
    label: 'Mobile',
    items: [
      { name: 'React Native', strength: 95 },
      { name: 'Expo', strength: 90 },
      { name: 'TypeScript', strength: 92 },
      { name: 'JavaScript', strength: 95 },
      { name: 'Native Module Bridging', strength: 80 },
      { name: 'Xcode / Android Studio', strength: 78 },
    ],
  },
  backend: {
    label: 'Backend & APIs',
    items: [
      { name: 'Node.js', strength: 85 },
      { name: 'Express.js', strength: 85 },
      { name: 'REST API', strength: 90 },
      { name: 'GraphQL', strength: 72 },
      { name: 'FastAPI', strength: 65, note: 'Python' },
    ],
  },
  data: {
    label: 'Data & Cloud',
    items: [
      { name: 'Firebase', strength: 90 },
      { name: 'MongoDB', strength: 82 },
      { name: 'PostgreSQL', strength: 78 },
      { name: 'Amazon S3', strength: 75 },
      { name: 'Vercel / Railway', strength: 80 },
    ],
  },
  ai: {
    label: 'AI & Tooling',
    items: [
      { name: 'ChatGPT API / OpenAI', strength: 85 },
      { name: 'Meta Llama', strength: 72 },
      { name: 'On-device ML', strength: 68 },
      { name: 'Cursor / Antigravity IDE', strength: 90, note: 'AI-powered dev' },
    ],
  },
  devops: {
    label: 'DevOps & Mobile Infra',
    items: [
      { name: 'CI/CD (GitHub Actions)', strength: 82 },
      { name: 'App Store Deployment', strength: 92 },
      { name: 'Push Notifications', strength: 88 },
      { name: 'Maps (Mapbox/Google)', strength: 85 },
      { name: 'Agora (Voice/Video)', strength: 78 },
    ],
  },
  leadership: {
    label: 'Leadership',
    items: [
      { name: 'Tech Lead', strength: 90 },
      { name: 'Sprint Planning', strength: 88 },
      { name: 'Code Review', strength: 92 },
      { name: 'Cross-functional Collab', strength: 90 },
    ],
  },
};

export const contact = {
  email: 'abdulghafoor1525@gmail.com',
  github: 'github.com/jamaghafoor',
  linkedin: 'linkedin.com/in/jam-abdul-ghafoor',
  resume: 'https://drive.google.com/uc?export=download&id=1iRBAV86xoRPTBUvTFAPPfF95EZIfN04h',
};
