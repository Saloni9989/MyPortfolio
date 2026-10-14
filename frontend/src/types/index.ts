export interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  features: string[];
  githubLink: string;
  liveLink: string;
  imageUrl: string;
  bannerUrl: string;
  category: string;
  problemStatement?: string;
  architecture?: string;
  screenshots?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  _id: string;
  title: string;
  organization: string;
  issueDate: string;
  credentialLink: string;
  imageUrl: string;
  createdAt: string;
}

export interface Achievement {
  _id: string;
  title: string;
  description: string;
  category: 'dsa' | 'hackathon' | 'training' | 'academic' | 'achievement';
  date: string;
  link?: string;
  icon?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'programming' | 'tools';
  proficiency: number;
  description: string;
  color: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  category: 'education' | 'internship' | 'training' | 'certification' | 'achievement';
  icon?: string;
}

export interface Stats {
  projects: number;
  technologies: number;
  certifications: number;
  dsaProblems: number;
}

export interface AdminUser {
  token: string;
  username: string;
}
