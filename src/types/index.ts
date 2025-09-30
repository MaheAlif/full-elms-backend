import { Request } from 'express';

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'student' | 'teacher' | 'admin';
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description?: string;
  teacher_id: number;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

// Section Types
export interface Section {
  id: number;
  course_id: number;
  name: string;
  created_at: Date;
}

// Enrollment Types
export interface Enrollment {
  id: number;
  user_id: number;
  section_id: number;
  enrolled_at: Date;
}

// Material Types
export interface Material {
  id: number;
  section_id: number;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'video' | 'other';
  file_path: string;
  size?: string;
  upload_date: Date;
}

// Assignment Types
export interface Assignment {
  id: number;
  section_id: number;
  title: string;
  description?: string;
  due_date?: Date;
  total_marks?: number;
  created_at: Date;
}

// Submission Types
export interface Submission {
  id: number;
  assignment_id: number;
  student_id: number;
  file_path: string;
  submitted_at: Date;
  grade?: number;
}

// Calendar Event Types
export interface CalendarEvent {
  id: number;
  section_id: number;
  title: string;
  date: Date;
  type: 'assignment' | 'exam' | 'meeting' | 'class';
  created_at: Date;
}

// Chat Types
export interface ChatRoom {
  id: number;
  section_id: number;
  name: string;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  message: string;
  timestamp: Date;
}

// Notification Types
export interface Notification {
  id: number;
  user_id: number;
  type: 'assignment' | 'due_event' | 'reminder' | 'grade_posted';
  message: string;
  read_status: boolean;
  created_at: Date;
}

// AI Types
export interface AIUserContext {
  id: number;
  user_id: number;
  context_json: any;
  updated_at: Date;
}

export interface AIInteraction {
  id: number;
  user_id: number;
  query: string;
  response: string;
  created_at: Date;
}

// Auth Types
export interface JWTPayload {
  userId: number;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Login Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      role: 'student' | 'teacher' | 'admin';
      avatar_url?: string;
    };
    token: string;
    redirect_url: string;
  };
}

// File Upload Types
export interface FileUploadRequest {
  sectionId: number;
  title: string;
  type: 'pdf' | 'doc' | 'ppt' | 'video' | 'other';
  description?: string;
  url?: string; // for external links
}

// Chat Message Send Types
export interface ChatMessageSendRequest {
  roomId: number;
  message: string;
}

export default {};