export interface User {
  id: number;
  name: string;
  email: string;
  preferred_job_role: string;
  created_at?: string;
}

export interface JobRole {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export interface Question {
  id: number;
  question_text: string;
  difficulty: string;
}

export interface InterviewSession {
  id: number;
  user_id: number;
  job_role_id: number;
  job_role_title?: string;
  job_role_icon?: string;
  interview_type: string;
  difficulty: string;
  total_questions: number;
  score: number;
  status: 'in_progress' | 'completed';
  created_at: string;
}

export interface InterviewAnswerFeedback {
  id: number;
  session_id: number;
  question_id: number;
  user_answer: string;
  question_text: string;
  sample_answer: string;
  score: number;
  strengths: string | string[];
  missing_concepts: string | string[];
  suggestions: string | string[];
  sample_improved_answer: string;
}

export interface DashboardStats {
  totalInterviewsCompleted: number;
  averageScore: number;
  questionsAttempted: number;
  recentHistory: InterviewSession[];
  scoreTrend: Array<{ created_at: string; score: number; interview_type: string }>;
}
